# LeafLens AI

LeafLens AI is a deep-learning-based plant disease detection web application developed as an MTech major project.

The application allows users to upload an image of a plant leaf and receive a predicted plant health condition from a trained EfficientNet-B0 model. The system also provides a confidence score and a Grad-CAM visualization to give a visual explanation of the model's prediction.

## Features

- Plant leaf image upload
- 38-class plant disease and healthy-condition classification
- EfficientNet-B0 deep learning model
- Confidence score
- Grad-CAM visual explanation
- JPEG, PNG and WebP support
- Upload validation and size protection
- Responsive interface for desktop, tablet and mobile devices

## System Architecture

```text
User
  |
  v
React Frontend
  |
  | HTTP API
  v
FastAPI Backend
  |
  v
Image Preprocessing
  |
  v
EfficientNet-B0
  |
  +--------------------+
  |                    |
  v                    v
Prediction          Grad-CAM
  |                    |
  +----------+---------+
             |
             v
     Frontend Result