import { useEffect, useRef, useState } from "react";
import {
  AlertCircle,
  ArrowRight,
  Check,
  FileImage,
  Leaf,
  LoaderCircle,
  RotateCcw,
  ShieldCheck,
  Sparkles,
  Upload,
} from "lucide-react";
import ProjectInfo from "./ProjectInfo";
import DiseaseGuidance from "./DiseaseGuidance";

const API_URL =
  import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

const ALLOWED_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/jpg",
];

const SUPPORTED_PLANTS = [
  {
    name: "Apple",
    conditions: [
      "Apple scab",
      "Black rot",
      "Cedar apple rust",
      "Healthy",
    ],
  },
  { name: "Blueberry", conditions: ["Healthy"] },
  {
    name: "Cherry",
    conditions: ["Powdery mildew", "Healthy"],
  },
  {
    name: "Corn (maize)",
    conditions: [
      "Cercospora leaf spot / Gray leaf spot",
      "Common rust",
      "Northern leaf blight",
      "Healthy",
    ],
  },
  {
    name: "Grape",
    conditions: [
      "Black rot",
      "Esca (Black measles)",
      "Leaf blight (Isariopsis leaf spot)",
      "Healthy",
    ],
  },
  {
    name: "Orange",
    conditions: ["Huanglongbing (Citrus greening)"],
  },
  {
    name: "Peach",
    conditions: ["Bacterial spot", "Healthy"],
  },
  {
    name: "Bell pepper",
    conditions: ["Bacterial spot", "Healthy"],
  },
  {
    name: "Potato",
    conditions: ["Early blight", "Late blight", "Healthy"],
  },
  { name: "Raspberry", conditions: ["Healthy"] },
  { name: "Soybean", conditions: ["Healthy"] },
  { name: "Squash", conditions: ["Powdery mildew"] },
  {
    name: "Strawberry",
    conditions: ["Leaf scorch", "Healthy"],
  },
  {
    name: "Tomato",
    conditions: [
      "Bacterial spot",
      "Early blight",
      "Late blight",
      "Leaf mold",
      "Septoria leaf spot",
      "Spider mites (two-spotted spider mite)",
      "Target spot",
      "Tomato yellow leaf curl virus",
      "Tomato mosaic virus",
      "Healthy",
    ],
  },
];

function formatConfidence(value) {
  return `${(value * 100).toFixed(2)}%`;
}

function App() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [dragging, setDragging] = useState(false);

  const fileInputRef = useRef(null);

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const handleFile = (file) => {
    if (!file) return;

    if (!ALLOWED_TYPES.includes(file.type)) {
      setError("Please upload a JPEG, PNG, or WebP image.");
      return;
    }

    setError("");
    setResult(null);
    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleFileChange = (event) => {
    handleFile(event.target.files?.[0]);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setDragging(false);
    handleFile(event.dataTransfer.files?.[0]);
  };

  const handlePredict = async () => {
    if (!selectedFile) {
      setError("Please select a plant image first.");
      return;
    }

    setLoading(true);
    setError("");
    setResult(null);

    try {
      const formData = new FormData();
      formData.append("file", selectedFile);

      const response = await fetch(`${API_URL}/predict`, {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.detail || "Unable to analyze the image."
        );
      }

      setResult(data);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to connect to the prediction service."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setSelectedFile(null);
    setPreviewUrl("");
    setResult(null);
    setError("");
    setDragging(false);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="app-shell">
      <header className="topbar">
        <div className="brand">
          <img
            src="/leaflens-logo.svg"
            alt="LeafLens AI logo"
            className="brand-logo"
          />

          <div className="brand-copy">
            <h1>LeafLens AI</h1>
            <span>Plant Disease Detection</span>
          </div>
        </div>

        <div className="ai-badge">
          <Sparkles size={15} />
          AI-Powered Analysis
        </div>
      </header>

      <main className="page-content">
        <section className="hero">
          <div className="hero-kicker">
            <Leaf size={15} />
            Intelligent Plant Health Analysis
          </div>

          <h2>
            Detect plant diseases
            <br />
            <span>from a single leaf image.</span>
          </h2>

          <p>
            Upload a clear image of a plant leaf and let our deep
            learning model analyze its visual features, identify
            the predicted condition, and explain the prediction
            with Grad-CAM.
          </p>

          <div className="hero-points">
            <div>
              <Check size={15} />
              38 plant-condition classes
            </div>
            <div>
              <Check size={15} />
              AI-powered analysis
            </div>
            <div>
              <Check size={15} />
              Visual explanation
            </div>
          </div>
        </section>

        <section className="main-card">
          {!selectedFile && (
            <div
              className={`upload-zone ${
                dragging ? "dragging" : ""
              }`}
              role="button"
              tabIndex={0}
              aria-label="Choose a plant leaf image to upload"
              onDragOver={(event) => {
                event.preventDefault();
                setDragging(true);
              }}
              onDragLeave={() => setDragging(false)}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              onKeyDown={(event) => {
                if (
                  event.key === "Enter" ||
                  event.key === " "
                ) {
                  event.preventDefault();
                  fileInputRef.current?.click();
                }
              }}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={handleFileChange}
                onClick={(event) => event.stopPropagation()}
                hidden
              />

              <div className="upload-icon">
                <Upload size={29} />
              </div>

              <h3>Upload a leaf image</h3>

              <p>
                Drag and drop your image here, or{" "}
                <span>browse files</span>
              </p>

              <div className="upload-meta">
                <div>
                  <FileImage size={14} />
                  JPEG / PNG / WebP
                </div>
                <div>
                  <ShieldCheck size={14} />
                  Secure processing
                </div>
              </div>
            </div>
          )}

          {selectedFile && (
            <div className="analysis-area">
              <div className="image-panel">
                <div className="section-heading">
                  <div>
                    <span className="eyebrow">INPUT IMAGE</span>
                    <h3>Selected leaf</h3>
                  </div>

                  <button
                    type="button"
                    className="secondary-button"
                    onClick={handleReset}
                    disabled={loading}
                  >
                    <RotateCcw size={15} />
                    Change
                  </button>
                </div>

                <div className="preview-card">
                  <img
                    src={previewUrl}
                    alt="Selected plant leaf"
                  />
                </div>

                <div className="file-row">
                  <FileImage size={15} />
                  <span title={selectedFile.name}>
                    {selectedFile.name}
                  </span>
                  <Check size={15} />
                </div>
              </div>

              {!result && (
                <div className="analysis-panel">
                  <div className="analysis-panel-top">
                    <div className="analysis-symbol">
                      <Sparkles size={22} />
                    </div>

                    <div>
                      <span className="eyebrow">
                        READY TO ANALYZE
                      </span>
                      <h3>Analyze your leaf</h3>
                    </div>
                  </div>

                  <p>
                    The trained EfficientNet model will analyze
                    the uploaded leaf image and return the
                    predicted plant condition.
                  </p>

                  <div className="feature-list">
                    <div>
                      <Check size={16} />
                      Disease classification
                    </div>
                    <div>
                      <Check size={16} />
                      Confidence score
                    </div>
                    <div>
                      <Check size={16} />
                      Grad-CAM explanation
                    </div>
                  </div>

                  <button
                    type="button"
                    className="primary-button analyze-button"
                    onClick={handlePredict}
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <LoaderCircle
                          size={19}
                          className="spin"
                        />
                        Analyzing leaf...
                      </>
                    ) : (
                      <>
                        Analyze Leaf
                        <ArrowRight size={18} />
                      </>
                    )}
                  </button>

                  {loading && (
                    <div className="loading-note">
                      <LoaderCircle
                        size={14}
                        className="spin"
                      />
                      Running AI inference. This may take a few
                      moments.
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {error && (
            <div className="error-box" role="alert">
              <AlertCircle size={18} />
              <div>
                <strong>Unable to analyze image</strong>
                <p>{error}</p>
              </div>
            </div>
          )}
        </section>

        {result && (
          <section className="result-card">
            {result.status === "uncertain" ? (
              <div className="uncertain-result">
                <div className="uncertain-icon">
                  <AlertCircle size={26} />
                </div>

                <span className="eyebrow">
                  ANALYSIS INCONCLUSIVE
                </span>

                <h3>
                  Unable to confidently identify this image
                </h3>

                <p>
                  The model's confidence was{" "}
                  <strong>
                    {formatConfidence(result.confidence)}
                  </strong>
                  . Please upload a clear image of a plant leaf
                  for a more reliable prediction. This check does
                  not guarantee that every unsupported image
                  will be detected.
                </p>

                <button
                  type="button"
                  className="primary-button reset-button"
                  onClick={handleReset}
                >
                  <RotateCcw size={17} />
                  Try another image
                </button>
              </div>
            ) : (
              <>
                <div className="result-top">
                  <div>
                    <span className="eyebrow">
                      ANALYSIS COMPLETE
                    </span>
                    <h3>Plant health prediction</h3>
                  </div>

                  <div className="confidence-badge">
                    <Check size={15} />
                    {formatConfidence(result.confidence)}{" "}
                    confidence
                  </div>
                </div>

                <div className="prediction-card">
                  <div className="prediction-icon">
                    <Leaf size={25} />
                  </div>

                  <div className="prediction-text">
                    <span>Predicted condition</span>
                    <h4>{result.display_name}</h4>
                  </div>
                </div>

                <div className="result-grid">
                  <div className="result-image-panel">
                    <div className="result-label">
                      <span className="eyebrow">ORIGINAL</span>
                      <strong>Uploaded image</strong>
                    </div>

                    <div className="result-image-card">
                      <img
                        src={previewUrl}
                        alt="Uploaded plant leaf"
                      />
                    </div>
                  </div>

                  <div className="result-image-panel">
                    <div className="result-label">
                      <span className="eyebrow">
                        MODEL EXPLANATION
                      </span>
                      <strong>Grad-CAM visualization</strong>
                    </div>

                    <div className="result-image-card gradcam-image">
                      <img
                        src={result.gradcam}
                        alt="Grad-CAM explanation highlighting image regions"
                      />
                    </div>
                  </div>
                </div>

                <div className="explanation-box">
                  <Sparkles size={18} />
                  <p>
                    The highlighted regions represent areas that
                    contributed most strongly to the model's
                    selected prediction. Grad-CAM provides a
                    visual explanation of the model's decision;
                    it is not a ground-truth disease segmentation
                    mask.
                  </p>
                </div>

                {/* Recommendations selected by predicted class */}
                <DiseaseGuidance
                  displayName={result.display_name}
                />

                <button
                  type="button"
                  className="primary-button reset-button"
                  onClick={handleReset}
                >
                  <RotateCcw size={17} />
                  Analyze another image
                </button>
              </>
            )}
          </section>
        )}

        <section
          className="supported-section"
          aria-labelledby="supported-title"
        >
          <div className="supported-section-header">
            <span className="eyebrow">MODEL COVERAGE</span>

            <h3 id="supported-title">
              Supported Plants &amp; Conditions
            </h3>

            <p className="supported-description">
              LeafLens AI is trained to recognize the
              plant-condition classes listed below. Choose a
              clear leaf image from one of these plant types for
              the most relevant result.
            </p>
          </div>

          <div className="supported-grid">
            {SUPPORTED_PLANTS.map((plant) => (
              <article
                className="supported-plant-card"
                key={plant.name}
              >
                <div className="supported-plant-heading">
                  <h4 className="supported-plant-name">
                    {plant.name}
                  </h4>

                  <span className="supported-plant-count">
                    {plant.conditions.length}{" "}
                    {plant.conditions.length === 1
                      ? "class"
                      : "classes"}
                  </span>
                </div>

                <div className="supported-condition-list">
                  {plant.conditions.map((condition) => (
                    <span
                      className="supported-condition"
                      key={condition}
                    >
                      {condition}
                    </span>
                  ))}
                </div>
              </article>
            ))}
          </div>

          <div className="supported-note">
            <AlertCircle size={17} />
            <span>
              The model can predict only the conditions listed
              here. Raspberry and Soybean have healthy-leaf
              examples only in this dataset. Images of other
              plants or conditions may be misclassified, so
              treat the result as a model prediction rather
              than a confirmed diagnosis.
            </span>
          </div>
        </section>

        {!result && (
          <section className="workflow-section">
            <div className="workflow-heading">
              <span className="eyebrow">SIMPLE WORKFLOW</span>
              <h3>From image to insight</h3>
            </div>

            <div className="workflow-grid">
              <div className="workflow-card">
                <div className="workflow-number">01</div>
                <div className="workflow-icon">
                  <Upload size={19} />
                </div>
                <h4>Upload</h4>
                <p>Choose a clear image of a plant leaf.</p>
              </div>

              <div className="workflow-line" />

              <div className="workflow-card">
                <div className="workflow-number">02</div>
                <div className="workflow-icon">
                  <Sparkles size={19} />
                </div>
                <h4>Analyze</h4>
                <p>
                  EfficientNet-B0 analyzes the leaf's visual
                  features.
                </p>
              </div>

              <div className="workflow-line" />

              <div className="workflow-card">
                <div className="workflow-number">03</div>
                <div className="workflow-icon">
                  <ShieldCheck size={19} />
                </div>
                <h4>Understand</h4>
                <p>
                  View the prediction, confidence, and Grad-CAM
                  explanation.
                </p>
              </div>
            </div>
          </section>
        )}

        <ProjectInfo />
      </main>

      <footer className="footer">
        <div className="footer-brand">
          <img src="/leaflens-logo.svg" alt="" />
          <span>LeafLens AI</span>
        </div>

        <span>
          Deep Learning • EfficientNet-B0 • Grad-CAM
        </span>
      </footer>
    </div>
  );
}

export default App;