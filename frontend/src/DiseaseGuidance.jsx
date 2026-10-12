import React from "react";
import "./DiseaseGuidance.css";

// Static educational guidance, selected using the predicted crop and condition.
// These are not prescriptions. Confirm management advice with local experts.
const DISEASE_GUIDANCE = [
  {
    crop: ["apple"],
    match: ["scab"],
    title: "Apple scab",
    overview: "A fungal disease that can affect apple leaves and fruit.",
    steps: [
      "Remove fallen leaves and visibly affected plant material where appropriate to reduce sources of infection.",
      "Prune appropriately to improve canopy airflow and help foliage dry after rain.",
      "Use resistant varieties where suitable and follow locally recommended preventive management during disease-risk periods.",
    ],
    precaution: "Confirm the diagnosis before using a fungicide. Follow local agricultural advice and the product label.",
  },
  {
    crop: ["apple"],
    match: ["black rot"],
    title: "Apple black rot",
    overview: "Black rot management often includes orchard sanitation and removal of infected woody material.",
    steps: [
      "Remove mummified fruit and fallen infected material where practical.",
      "Prune out confirmed cankers or dead wood according to orchard guidance, and clean tools between affected plants.",
      "Maintain an open canopy and monitor the orchard for returning symptoms.",
    ],
    precaution: "Apple and grape black rot are different crop-disease combinations; use guidance specific to apple.",
  },
  {
    crop: ["apple"],
    match: ["cedar apple rust", "cedar rust"],
    title: "Cedar apple rust",
    overview: "Management depends on the apple cultivar and local disease pressure; the pathogen has an alternate-host stage on certain junipers.",
    steps: [
      "Choose resistant apple cultivars where available and suitable.",
      "Monitor new growth and document recurring symptoms across seasons.",
      "Ask a local horticulture expert whether locally timed preventive measures are warranted.",
    ],
    precaution: "Do not remove nearby landscape trees solely from an AI result; confirm the disease and seek local advice first.",
  },
  {
    crop: ["cherry"],
    match: ["powdery mildew"],
    title: "Cherry powdery mildew",
    overview: "Powdery mildew management focuses on limiting disease-favourable canopy conditions and protecting susceptible growth.",
    steps: [
      "Prune appropriately to improve light penetration and airflow.",
      "Avoid excessive nitrogen fertilisation that encourages overly dense growth.",
      "Use resistant varieties where suitable and monitor new growth.",
    ],
    precaution: "Obtain crop-specific advice before selecting a fungicide, especially for edible fruit.",
  },
  {
    crop: ["corn", "maize"],
    match: ["cercospora leaf spot", "gray leaf spot", "grey leaf spot"],
    title: "Corn — Gray leaf spot",
    overview: "Integrated management can reduce disease pressure in susceptible maize crops.",
    steps: [
      "Use resistant or tolerant hybrids where suitable.",
      "Rotate crops and manage infected crop residue according to local agronomic recommendations.",
      "Scout lower and upper leaves as the crop develops.",
    ],
    precaution: "Disease risk and fungicide decisions depend on the hybrid, crop stage, weather, and local advice.",
  },
  {
    crop: ["corn", "maize"],
    match: ["common rust"],
    title: "Corn — Common rust",
    overview: "Common rust management relies mainly on crop monitoring and appropriate hybrid selection.",
    steps: [
      "Select resistant or tolerant hybrids where suitable.",
      "Inspect leaves regularly for developing rust pustules, particularly during favourable weather.",
      "Ask a local agronomist to assess whether disease severity justifies intervention.",
    ],
    precaution: "Do not apply a fungicide based only on this prediction; use local crop-stage and disease-severity guidance.",
  },
  {
    crop: ["corn", "maize"],
    match: ["northern leaf blight"],
    title: "Corn — Northern leaf blight",
    overview: "Management combines resistant hybrids, crop monitoring and practices that reduce disease carry-over.",
    steps: [
      "Use resistant hybrids where available.",
      "Rotate crops and manage infected residue using local agronomic guidance.",
      "Monitor symptoms and assess the extent of infection through the crop canopy.",
    ],
    precaution: "Recommended measures vary by region and hybrid; consult a local crop adviser before treatment.",
  },
  {
    crop: ["grape", "grapevine"],
    match: ["black rot"],
    title: "Grape black rot",
    overview: "Grape black rot can affect leaves, shoots and berries. Infected or mummified fruit can be a source of further infection.",
    steps: [
      "Remove and dispose of mummified berries and infected plant material where appropriate.",
      "Prune and train vines to improve canopy airflow and allow foliage to dry more quickly.",
      "Follow a locally recommended preventive disease-management programme during susceptible growth stages.",
    ],
    precaution: "A leaf image alone cannot establish the full vineyard disease status. Consult a local grape-production adviser for crop-stage-specific measures.",
    source: {
      label: "University of Minnesota Extension: grape black rot",
      url: "https://blog-fruit-vegetable-ipm.extension.umn.edu/2026/06/black-rot-on-grapes-guignardia-bidwellii.html",
    },
  },
  {
    crop: ["grape", "grapevine"],
    match: ["esca", "black measles"],
    title: "Grape — Esca (Black measles)",
    overview: "Esca is associated with grapevine trunk disease and can have symptoms that resemble other problems.",
    steps: [
      "Have the vine and trunk symptoms assessed by a viticulture or plant-health expert.",
      "Remove dead or severely affected wood only in accordance with local vineyard guidance.",
      "Use sound pruning and tool-sanitation practices to reduce opportunities for further trunk infection.",
    ],
    precaution: "Do not promise a cure from a leaf-level prediction; grapevine trunk diseases require specialist assessment.",
  },
  {
    crop: ["grape", "grapevine"],
    match: ["leaf blight", "isariopsis", "isariopsis leaf spot"],
    title: "Grape — Leaf blight (Isariopsis leaf spot)",
    overview: "Leaf-spot symptoms should be assessed alongside vineyard conditions and other possible causes of leaf damage.",
    steps: [
      "Remove affected fallen leaves where appropriate and maintain vineyard sanitation.",
      "Manage canopy density to support airflow and faster drying.",
      "Track symptom progression and seek crop-specific advice if spotting spreads.",
    ],
    precaution: "Different grape leaf diseases can look similar. Confirm the cause before applying a disease-specific treatment.",
  },
  {
    crop: ["orange", "citrus"],
    match: ["huanglongbing", "citrus greening"],
    title: "Citrus — Huanglongbing (Citrus greening)",
    overview: "Citrus greening is a serious systemic disease; reliable diagnosis and local plant-health guidance are important.",
    steps: [
      "Use certified healthy planting material when establishing citrus plants.",
      "Monitor for the disease and its insect vector under local agricultural guidance.",
      "Contact a state horticulture department, KVK or citrus specialist promptly if the disease is suspected.",
    ],
    precaution: "There is no simple curative treatment for an infected tree. Removal and vector-management decisions must follow local expert or regulatory advice.",
  },
  {
    crop: ["peach"],
    match: ["bacterial spot"],
    title: "Peach — Bacterial spot",
    overview: "Bacterial spot management focuses on healthy planting material, suitable cultivars and reducing spread in the orchard.",
    steps: [
      "Use healthy nursery stock and resistant or less-susceptible cultivars where available.",
      "Avoid unnecessary handling or pruning while foliage is wet, and maintain appropriate orchard sanitation.",
      "Seek local stone-fruit guidance if symptoms increase or fruit is affected.",
    ],
    precaution: "Bacterial spot can resemble other diseases or environmental injury; confirm the diagnosis before treatment.",
  },
  {
    crop: ["bell pepper", "pepper", "capsicum"],
    match: ["bacterial spot"],
    title: "Bell pepper — Bacterial spot",
    overview: "Bacterial spot can spread through infected planting material and splash or contact under favourable conditions.",
    steps: [
      "Start with healthy seed or transplants and follow seed-health recommendations.",
      "Rotate away from affected host crops where practical and remove infected crop debris.",
      "Avoid overhead irrigation when possible and do not work among plants while they are wet.",
    ],
    precaution: "Confirm bacterial spot before choosing a control measure; follow locally approved crop guidance.",
  },
  {
    crop: ["potato"],
    match: ["early blight"],
    title: "Potato — Early blight",
    overview: "Integrated management includes healthy seed, sanitation and practices that support crop vigour.",
    steps: [
      "Use healthy seed tubers and rotate crops where practical.",
      "Manage volunteer potato plants and infected crop residue.",
      "Maintain balanced crop nutrition and monitor older leaves for disease progression.",
    ],
    precaution: "Consult local potato-production guidance before using any fungicide.",
  },
  {
    crop: ["potato"],
    match: ["late blight"],
    title: "Potato — Late blight",
    overview: "Late blight can spread rapidly in favourable weather and may cause severe losses, so timely action is important.",
    steps: [
      "Use healthy seed tubers and resistant cultivars where suitable.",
      "Remove volunteer potatoes and manage cull piles or other sources of infection.",
      "Scout frequently and contact a local KVK or crop adviser promptly if symptoms are suspected.",
    ],
    precaution: "Use only locally recommended, currently registered products and label directions. Do not rely on the AI result alone.",
    source: {
      label: "ICAR: Integrated disease management of potato late blight",
      url: "https://epubs.icar.org.in/index.php/IndFarm/article/view/48821",
    },
  },
  {
    crop: ["squash"],
    match: ["powdery mildew"],
    title: "Squash — Powdery mildew",
    overview: "Powdery mildew management combines crop selection, canopy management and regular monitoring.",
    steps: [
      "Grow resistant or tolerant varieties where available.",
      "Provide suitable plant spacing and airflow; avoid excessive nitrogen that creates dense growth.",
      "Monitor leaves and seek local cucurbit guidance if symptoms become widespread.",
    ],
    precaution: "Use crop-appropriate recommendations; products approved for one crop may not be approved for another.",
  },
  {
    crop: ["strawberry"],
    match: ["leaf scorch"],
    title: "Strawberry — Leaf scorch",
    overview: "Strawberry leaf scorch can reduce healthy leaf area and should be distinguished from other leaf spots or stress symptoms.",
    steps: [
      "Use healthy transplants and remove old or affected plant debris when appropriate.",
      "Maintain appropriate plant spacing and avoid prolonged leaf wetness.",
      "Consult local strawberry-growing guidance if symptoms recur or spread.",
    ],
    precaution: "Confirm the cause before applying a disease-specific treatment; scorch-like symptoms can have more than one cause.",
  },
  {
    crop: ["tomato"],
    match: ["bacterial spot"],
    title: "Tomato — Bacterial spot",
    overview: "Bacterial spot management focuses on healthy planting material and limiting spread between plants.",
    steps: [
      "Use healthy seeds or transplants and follow seed-health recommendations.",
      "Rotate crops where practical, remove infected crop debris, and clean tools.",
      "Avoid overhead irrigation where possible and avoid handling plants while wet.",
    ],
    precaution: "Bacterial and fungal leaf spots can look alike. Confirm the cause and follow local agricultural recommendations.",
    source: {
      label: "Penn State Extension: tomato diseases and disorders",
      url: "https://extension.psu.edu/tomato-diseases-and-disorders-in-the-home-garden",
    },
  },
  {
    crop: ["tomato"],
    match: ["early blight"],
    title: "Tomato — Early blight",
    overview: "Early blight management includes sanitation, crop rotation and reducing soil or water splash onto foliage.",
    steps: [
      "Remove badly affected lower leaves where appropriate and dispose of infected debris.",
      "Rotate crops, manage volunteer tomato plants and use mulch to reduce soil splash.",
      "Space plants appropriately and avoid wetting foliage during irrigation.",
    ],
    precaution: "Follow local tomato-disease advice before selecting a fungicide or other control measure.",
    source: {
      label: "ICAR: Managing early blight disease in tomato",
      url: "https://epubs.icar.org.in/index.php/IndHort/article/view/84679",
    },
  },
  {
    crop: ["tomato"],
    match: ["late blight"],
    title: "Tomato — Late blight",
    overview: "Late blight can develop rapidly and affect multiple parts of the plant; suspected outbreaks warrant prompt attention.",
    steps: [
      "Seek local crop advice promptly and monitor nearby tomato and potato plants.",
      "Avoid prolonged leaf wetness and improve spacing or airflow where practical.",
      "Handle and dispose of infected plant material according to local disease-management advice.",
    ],
    precaution: "Do not delay professional advice if the disease is spreading quickly. Any pesticide use must follow current local recommendations and product labels.",
    source: {
      label: "Penn State Extension: tomato and potato late blight",
      url: "https://extension.psu.edu/tomato-potato-late-blight-in-the-home-garden",
    },
  },
  {
    crop: ["tomato"],
    match: ["leaf mold", "leaf mould"],
    title: "Tomato — Leaf mold",
    overview: "Leaf mold is often associated with high humidity and poor air movement, particularly in protected cultivation.",
    steps: [
      "Improve ventilation and reduce humidity where tomatoes are grown under cover.",
      "Provide spacing and pruning appropriate to the crop system so foliage dries more quickly.",
      "Use resistant varieties where available and remove affected debris.",
    ],
    precaution: "Confirm the disease and follow local protected-cultivation recommendations.",
  },
  {
    crop: ["tomato"],
    match: ["septoria leaf spot", "septoria"],
    title: "Tomato — Septoria leaf spot",
    overview: "Septoria leaf spot often starts on lower leaves and can spread in wet conditions.",
    steps: [
      "Remove heavily affected leaves where appropriate and clear infected crop debris.",
      "Rotate crops and use mulch to reduce soil splash onto leaves.",
      "Water at soil level where possible and provide sufficient plant spacing.",
    ],
    precaution: "Leaf spots can resemble other diseases. Confirm the cause and consult a local crop adviser.",
    source: {
      label: "Penn State Extension: tomato diseases and disorders",
      url: "https://extension.psu.edu/tomato-diseases-and-disorders-in-the-home-garden",
    },
  },
  {
    crop: ["tomato"],
    match: ["spider mite", "two spotted spider mite", "two spotted spider mites"],
    title: "Tomato — Spider mites",
    overview: "Spider mites are pests rather than an infectious disease; integrated pest management is preferred.",
    steps: [
      "Inspect the undersides of leaves for mites, eggs, webbing and stippling.",
      "Reduce plant water stress and manage dusty conditions where feasible.",
      "Protect beneficial predatory mites and other natural enemies; seek pest-specific advice if populations rise.",
    ],
    precaution: "Do not use an arbitrary insecticide: some products can harm beneficial organisms and worsen mite outbreaks.",
  },
  {
    crop: ["tomato"],
    match: ["target spot"],
    title: "Tomato — Target spot",
    overview: "Target spot symptoms may overlap with other foliar diseases, so management should start with confirmation.",
    steps: [
      "Remove infected plant debris where appropriate and maintain good canopy airflow.",
      "Avoid prolonged leaf wetness and use suitable plant spacing.",
      "Monitor the spread of symptoms and consult local tomato disease guidance.",
    ],
    precaution: "A visual prediction is not a confirmed diagnosis; use a plant-health expert if symptoms are spreading.",
  },
  {
    crop: ["tomato"],
    match: [
      "yellow leaf curl virus",
      "tomato yellow leaf curl",
      "tomato yellow leaf curl virus",
    ],
    title: "Tomato — Yellow leaf curl virus",
    overview: "Tomato yellow leaf curl is viral; prevention and management of whitefly vectors are central to reducing spread.",
    steps: [
      "Use resistant varieties and healthy transplants when available.",
      "Monitor for whiteflies and follow locally recommended integrated vector-management practices.",
      "Ask an agricultural expert how to handle suspected infected plants and nearby crops.",
    ],
    precaution: "There is no simple curative treatment for an infected plant. Do not apply pesticides without crop-specific advice.",
  },
  {
    crop: ["tomato"],
    match: ["tomato mosaic virus", "mosaic virus"],
    title: "Tomato — Mosaic virus",
    overview: "Viral mosaic symptoms can be confused with other causes; clean planting material and hygiene are important.",
    steps: [
      "Use trusted seed or transplants and resistant varieties where available.",
      "Clean tools and hands between plants and avoid handling plants unnecessarily when wet.",
      "Seek confirmation and local advice on whether affected plants should be removed.",
    ],
    precaution: "There is no curative spray for a virus-infected plant. Confirm the diagnosis before removing plants or taking other major action.",
  },
];

function normalize(value) {
  return String(value ?? "")
    .toLowerCase()
    .replace(/[_/().–—-]+/g, " ")
    .replace(/[^a-z0-9 ]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function findGuidance(displayName) {
  const label = normalize(displayName);

  if (!label) return null;

  return (
    DISEASE_GUIDANCE.find((item) => {
      const cropMatches = item.crop.some((crop) =>
        label.includes(normalize(crop))
      );

      const conditionMatches = item.match.some((condition) =>
        label.includes(normalize(condition))
      );

      return cropMatches && conditionMatches;
    }) || null
  );
}

export default function DiseaseGuidance({ displayName }) {
  const normalizedLabel = normalize(displayName);
  const isHealthy = /\bhealthy\b/.test(normalizedLabel);
  const item = findGuidance(displayName);

  if (isHealthy) {
    return (
      <section
        className="disease-guidance disease-guidance-healthy"
        aria-live="polite"
      >
        <h3>Plant-health guidance</h3>
        <p>
          The model predicted a healthy class. This is a model
          prediction, not a guarantee that the plant is free of disease.
          Continue routine plant monitoring and seek expert advice if
          symptoms are visible.
        </p>
      </section>
    );
  }

  if (!item) {
    return (
      <section className="disease-guidance" aria-live="polite">
        <h3>Management guidance</h3>
        <p>
          No reviewed disease-specific guidance is available for this
          output label. Please confirm the result with a local Krishi
          Vigyan Kendra (KVK), state agricultural university, or
          plant-health professional before choosing a treatment.
        </p>
      </section>
    );
  }

  return (
    <section className="disease-guidance" aria-live="polite">
      <div className="disease-guidance-heading">
        <div>
          <span className="disease-guidance-eyebrow">
            DISEASE-SPECIFIC INFORMATION
          </span>
          <h3>{item.title}: management guidance</h3>
        </div>

        <span className="guidance-tag">
          Educational guidance
        </span>
      </div>

      <p className="disease-guidance-overview">
        {item.overview}
      </p>

      <div className="disease-guidance-table-wrap">
        <table className="disease-guidance-table">
          <thead>
            <tr>
              <th scope="col">Focus</th>
              <th scope="col">Recommended practices</th>
            </tr>
          </thead>

          <tbody>
            {item.steps.map((step, index) => (
              <tr key={step}>
                <td data-label="Focus">
                  Practice {index + 1}
                </td>
                <td data-label="Recommended practices">
                  {step}
                </td>
              </tr>
            ))}

            <tr>
              <td data-label="Focus">Precaution</td>
              <td data-label="Recommended practices">
                {item.precaution}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {item.source && (
        <p className="disease-guidance-source">
          Reference:{" "}
          <a
            href={item.source.url}
            target="_blank"
            rel="noopener noreferrer"
          >
            {item.source.label} ↗
          </a>
        </p>
      )}

      <p className="disease-guidance-disclaimer">
        These are general management practices, not a confirmed
        diagnosis or a prescription. The appropriate response depends
        on crop, variety, growth stage and local conditions. Confirm
        disease-specific advice with ICAR, your state agricultural
        university or a local KVK. Follow current product labels and
        local regulations for any pesticide.
      </p>
    </section>
  );
}