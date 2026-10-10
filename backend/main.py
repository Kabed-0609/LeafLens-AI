from pathlib import Path
import base64
import io
import json
import logging
import threading
import warnings

import numpy as np
import torch
import torch.nn as nn

from PIL import (
    Image,
    ImageFilter,
    ImageOps,
    UnidentifiedImageError,
)

from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from starlette.concurrency import run_in_threadpool

from torchvision import models, transforms

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

BASE_DIR = Path(__file__).resolve().parent
ARTIFACT_DIR = BASE_DIR.parent / "artifacts"

MODEL_PATH = ARTIFACT_DIR / "plant_disease_model.pth"
CONFIG_PATH = ARTIFACT_DIR / "model_config.json"

MAX_UPLOAD_SIZE = 10 * 1024 * 1024
MAX_IMAGE_PIXELS = 25_000_000
CONFIDENCE_THRESHOLD = 0.50

Image.MAX_IMAGE_PIXELS = MAX_IMAGE_PIXELS


# Load the settings saved with the trained model.

if not MODEL_PATH.is_file():
    raise FileNotFoundError(f"Model file not found: {MODEL_PATH}")

if not CONFIG_PATH.is_file():
    raise FileNotFoundError(f"Model configuration not found: {CONFIG_PATH}")

with open(CONFIG_PATH, "r", encoding="utf-8") as file:
    config = json.load(file)

MODEL_NAME = config["model_name"]
CLASS_NAMES = config["class_names"]
IMAGE_SIZE = config["image_size"]
MEAN = config["mean"]
STD = config["std"]

if len(CLASS_NAMES) != 38:
    logger.warning(
        "Expected 38 classes, but configuration contains %d.",
        len(CLASS_NAMES),
    )


# Rebuild the architecture and load the trained weights.

if MODEL_NAME == "EfficientNet-B0":
    model = models.efficientnet_b0(weights=None)

    model.classifier[1] = nn.Linear(
        model.classifier[1].in_features,
        len(CLASS_NAMES),
    )

    gradcam_layer = model.features[-1]

elif MODEL_NAME == "ResNet-50":
    model = models.resnet50(weights=None)

    model.fc = nn.Linear(
        model.fc.in_features,
        len(CLASS_NAMES),
    )

    gradcam_layer = model.layer4[-1]

else:
    raise ValueError(f"Unsupported model: {MODEL_NAME}")

checkpoint = torch.load(
    MODEL_PATH,
    map_location="cpu",
    weights_only=False,
)

model.load_state_dict(checkpoint["model_state_dict"])
model.eval()


# Use the same evaluation preprocessing as in the notebook.

transform = transforms.Compose(
    [
        transforms.Resize(256),
        transforms.CenterCrop(IMAGE_SIZE),
        transforms.ToTensor(),
        transforms.Normalize(MEAN, STD),
    ]
)


# Grad-CAM hooks capture activations and gradients from a model layer.

activations = None
gradients = None
model_lock = threading.Lock()


def save_activations(module, inputs, output):
    global activations
    activations = output.detach()


def save_gradients(module, grad_input, grad_output):
    global gradients
    gradients = grad_output[0].detach()


forward_handle = gradcam_layer.register_forward_hook(save_activations)

backward_handle = gradcam_layer.register_full_backward_hook(save_gradients)


def generate_gradcam(image_tensor, class_index):
    global activations, gradients

    # The caller must hold model_lock while using these shared hooks.
    activations = None
    gradients = None

    model.zero_grad(set_to_none=True)

    output = model(image_tensor)
    score = output[0, class_index]
    score.backward()

    if activations is None or gradients is None:
        raise RuntimeError("Grad-CAM could not capture model features.")

    weights = gradients.mean(
        dim=(2, 3),
        keepdim=True,
    )

    cam = (weights * activations).sum(
        dim=1,
        keepdim=True,
    )

    cam = torch.relu(cam).squeeze().cpu().numpy()
    cam -= cam.min()

    if cam.max() > 0:
        cam /= cam.max()

    return cam


def create_gradcam_overlay(original_image, cam):
    cam_image = (
        Image.fromarray(np.uint8(cam * 255))
        .resize(
            (IMAGE_SIZE, IMAGE_SIZE),
            Image.Resampling.BICUBIC,
        )
        .filter(ImageFilter.GaussianBlur(radius=2))
    )

    cam_array = (
        np.asarray(
            cam_image,
            dtype=np.float32,
        )
        / 255.0
    )

    # Map the normalized heatmap values to blue, cyan, yellow and red.
    stops = np.array(
        [
            [0.0, 0, 0, 255],
            [0.25, 0, 255, 255],
            [0.5, 255, 255, 0],
            [0.75, 255, 165, 0],
            [1.0, 255, 0, 0],
        ],
        dtype=np.float32,
    )

    values = stops[:, 0]
    colors = stops[:, 1:]

    colored = np.zeros(
        (*cam_array.shape, 3),
        dtype=np.float32,
    )

    for channel in range(3):
        colored[:, :, channel] = np.interp(
            cam_array,
            values,
            colors[:, channel],
        )

    heatmap = Image.fromarray(
        np.uint8(colored),
        mode="RGB",
    )

    original = original_image.resize((IMAGE_SIZE, IMAGE_SIZE))

    overlay = Image.blend(
        original,
        heatmap,
        alpha=0.45,
    )

    buffer = io.BytesIO()
    overlay.save(buffer, format="PNG")

    encoded = base64.b64encode(buffer.getvalue()).decode("utf-8")

    return f"data:image/png;base64,{encoded}"


def analyze_image(image):
    input_tensor = transform(image).unsqueeze(0)

    # Keep prediction and Grad-CAM together because they share model hooks.
    with model_lock:
        with torch.no_grad():
            output = model(input_tensor)

            probabilities = torch.softmax(
                output,
                dim=1,
            )

            predicted_index = int(probabilities.argmax(dim=1).item())

            confidence = float(probabilities[0, predicted_index].item())

        # A low score is inconclusive; it does not prove the image
        # is unrelated to plants.
        if confidence < CONFIDENCE_THRESHOLD:
            return {
                "status": "uncertain",
                "predicted_class": None,
                "display_name": "Unable to confidently identify this image",
                "confidence": confidence,
                "gradcam": None,
                "message": "Please upload a clear image of a plant leaf.",
            }

        predicted_class = CLASS_NAMES[predicted_index]

        cam = generate_gradcam(
            input_tensor,
            predicted_index,
        )

    gradcam_image = create_gradcam_overlay(image, cam)

    display_name = predicted_class.replace(
        "___",
        " - ",
    ).replace(
        "_",
        " ",
    )

    return {
        "status": "success",
        "predicted_class": predicted_class,
        "display_name": display_name,
        "confidence": confidence,
        "gradcam": gradcam_image,
    }


app = FastAPI(
    title="LeafLens AI API",
    version="1.0.0",
)

# The wildcard origin is for local development.
# Restrict this to the deployed frontend URL before going live.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
def health_check():
    return {
        "status": "ok",
        "model": MODEL_NAME,
        "classes": len(CLASS_NAMES),
    }


@app.post("/predict")
async def predict(file: UploadFile = File(...)):
    allowed_types = {
        "image/jpeg",
        "image/png",
        "image/webp",
    }

    try:
        if file.content_type not in allowed_types:
            raise HTTPException(
                status_code=400,
                detail="Please upload a JPEG, PNG, or WebP image.",
            )

        # Read at most 1 byte beyond the limit to detect oversized files.
        image_bytes = await file.read(MAX_UPLOAD_SIZE + 1)

        if len(image_bytes) > MAX_UPLOAD_SIZE:
            raise HTTPException(
                status_code=413,
                detail="Image is too large. Maximum allowed size is 10 MB.",
            )

        # Check that the file is a readable image and keep its orientation.
        try:
            with warnings.catch_warnings():
                warnings.simplefilter(
                    "error",
                    Image.DecompressionBombWarning,
                )

                with Image.open(io.BytesIO(image_bytes)) as opened_image:
                    opened_image.verify()

                with Image.open(io.BytesIO(image_bytes)) as opened_image:
                    width, height = opened_image.size

                    if width * height > MAX_IMAGE_PIXELS:
                        raise HTTPException(
                            status_code=413,
                            detail=(
                                "Image dimensions are too large. "
                                "Please upload a smaller image."
                            ),
                        )

                    image = ImageOps.exif_transpose(opened_image).convert("RGB")

        except HTTPException:
            raise

        except (
            UnidentifiedImageError,
            Image.DecompressionBombError,
            Image.DecompressionBombWarning,
            OSError,
            ValueError,
        ):
            raise HTTPException(
                status_code=400,
                detail="The uploaded file is not a valid, supported image.",
            )

        # Run the model outside the asynchronous event loop.
        return await run_in_threadpool(analyze_image, image)

    except HTTPException:
        raise

    except Exception:
        logger.exception("Image prediction failed.")
        raise HTTPException(
            status_code=500,
            detail="The prediction service could not analyze this image.",
        )

    finally:
        await file.close()
