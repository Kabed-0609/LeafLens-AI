import React from "react";
import "./ProjectInfo.css";

const imageGuidelines = [
  {
    title: "Clear and focused",
    text: "Keep the leaf sharp and clearly visible. Avoid blurry photographs.",
  },
  {
    title: "Good lighting",
    text: "Use natural or even lighting. Avoid very dark images, glare, and harsh shadows.",
  },
  {
    title: "Leaf clearly visible",
    text: "Photograph a leaf closely enough to see its surface and any relevant symptoms.",
  },
  {
    title: "Simple background",
    text: "Avoid clutter, obstructions, and several overlapping leaves where possible.",
  },
  {
    title: "Supported plant and condition",
    text: "Use a crop and condition covered by the model's 38 supported classes.",
  },
];

const limitations = [
  {
    title: "Limited categories",
    text: "The model predicts among 38 predefined plant-condition classes across 14 crop categories. It does not cover every plant or disease.",
  },
  {
    title: "Image quality matters",
    text: "Poor lighting, blur, unusual angles, and complex backgrounds can affect prediction quality.",
  },
  {
    title: "Unsupported inputs",
    text: "Unrelated objects, such as shoes, people, or animals, may still receive a class prediction. Such predictions may be meaningless.",
  },
  {
    title: "Confidence is not certainty",
    text: "A high confidence score does not guarantee that the predicted class is correct.",
  },
  {
    title: "Not a professional diagnosis",
    text: "Use predictions as preliminary information. Consult an agricultural expert or local Krishi Vigyan Kendra (KVK) for confirmation and appropriate advice.",
  },
];

export default function ProjectInfo() {
  return (
    <section className="project-info" id="project-info">
      <header className="project-info-heading">
        <span className="project-info-eyebrow">
          ABOUT THE MODEL
        </span>

        <h2>Using LeafLens AI Responsibly</h2>

        <p>
          Learn which images are suitable for classification and
          understand the model's limitations before using a prediction.
        </p>
      </header>

      <div className="project-info-grid">
        <article className="project-info-card">
          <h3>Recommended Input Images</h3>

          <p>
            The example below shows the preferred photo quality
            and framing. It is a healthy grape leaf, not a disease example.
          </p>

          <figure className="project-example-image">
            <img
              src="/healthy-grape-plant.jpg"
              alt="A healthy grape leaf in natural daylight on a grapevine"
              loading="lazy"
            />

            <figcaption>
              <strong>Example input:</strong> a focused, well-lit
              grape leaf. This demonstrates image framing and quality;
              it does not guarantee a particular prediction.
            </figcaption>
          </figure>

          <ol className="project-guidelines">
            {imageGuidelines.map((item, index) => (
              <li key={item.title}>
                <span className="project-guideline-number">
                  {index + 1}
                </span>

                <div>
                  <strong>{item.title}</strong>
                  <p>{item.text}</p>
                </div>
              </li>
            ))}
          </ol>
        </article>

        <article className="project-info-card project-limitations-card">
          <h3>Model Limitations</h3>

          <p>
            LeafLens AI is a machine-learning classifier with a
            defined scope. Keep the following limitations in mind.
          </p>

          <ol className="project-limitations-list">
            {limitations.map((item, index) => (
              <li key={item.title}>
                <span className="project-limitation-number">
                  {index + 1}
                </span>

                <div>
                  <strong>{item.title}</strong>
                  <p>{item.text}</p>
                </div>
              </li>
            ))}
          </ol>

          <div className="project-info-notice">
            If a prediction looks incorrect or the image is unclear,
            retake the photograph and seek expert advice when necessary.
            Do not select a treatment based only on an AI prediction.
          </div>
        </article>
      </div>
    </section>
  );
}