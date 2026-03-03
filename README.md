# NAAS Engine v3.4.0

![MIT License](https://img.shields.io/badge/license-MIT-blue.svg)
![Version](https://img.shields.io/badge/version-3.4.0-yellow.svg)
![Aesthetic](https://img.shields.io/badge/aesthetic-Vector--Minimalism-black.svg)

**NAAS (Neuro-Adaptive Attention System)** is a high-performance runtime engine that enforces cognitive dominance invariants in conversion-critical interfaces.

It transforms subjective visual hierarchy into a **measurable mathematical property** using the Cognitive Dominance Vector (CDV).

---

## 📋 Contents

- [Core Concept: The CDV](#core-concept-the-cdv)
- [Installation & Usage](#installation--usage)
- [AI-Native Integration](#ai-native-integration)
- [Testing & Research](#testing--research)
- [Structure](#structure)
- [Demo Scenarios](#demo-scenarios)
- [License](#license)

---

## 🚀 Core Concept: The CDV

Each actionable element is evaluated in real-time:

```text
CDV = w1·Contrast + w2·Surface + w3·Typography
```

### The Absolute Invariant

The primary CTA must maintain the highest CDV within the viewport:

**CDV_primary > max(CDV_others) + δ**

---

## 🛠️ Installation & Usage

```bash
npm install
```

```js
import { NAASEngine } from './naas-engine.js';

const engine = new NAASEngine({
  weights: [0.4, 0.4, 0.2], // Contrast, Surface, Typography
  deltaThreshold: 0.05
});
engine.start();
```
---

## 🧠 AI-Native Integration (skills.sh)

This repository includes a SKILL.md file. It allows AI agents (Cursor, Claude, Devin) to:

- Understand the AIDA structural roles.
- Implement the Vector-Minimalism aesthetic automatically.
- Respect the mathematical invariants during code generation.

---

## 🧪 Testing & Research

- **Unit Tests**: `npm test` (Verifies math and WCAG logic).
- **E2E Tests**: `npm run test:e2e` (Verifies runtime invariant holds).
- **Experimental Plan**: See experiment-plan.md for weight calibration.

---

## 📂 Structure

```text
naas-engine/              # project root
├─ demo/                  # interactive demos
│  ├─ basic-violation.html
│  ├─ passing-case.html
│  └─ competing-ctas.html
├─ scripts/               # utilities
│  └─ sample-size.js
├─ naas-engine.js         # core library
├─ naas-worker.js         # contrast calculation worker
├─ naas.spec.js           # end‑to‑end tests
├─ package.json
├─ README.md
└─ LICENSE
```
/demo: Standard, Competing CTAs, and Passing Case scenarios.  
/scripts: Statistical utilities for A/B testing (sample-size.js).  
naas-engine.js: Core observer and evaluator.  
naas-worker.js: Off-main-thread contrast computation.

---

## Demo Scenarios

The demo/ folder now contains three independent examples:

- basic-violation.html → two equal CTAs (invariant fails)
- passing-case.html → proper dominance hierarchy (invariant holds)
- competing-ctas.html → dominance drift detection

Each page exercises a different facet of the algorithm.

### 🔗 Live GitHub Pages Demos

You can also explore the scenarios on GitHub Pages:

- [Basic violation demo](https://yojananyosef.github.io/naas-engine/demo/basic-violation.html)
- [Passing case demo](https://yojananyosef.github.io/naas-engine/demo/passing-case.html)
- [Competing CTAs demo](https://yojananyosef.github.io/naas-engine/demo/competing-ctas.html)

These URLs are useful for testing the engine in a live environment without cloning the repo.

---

## License

Released under the [MIT License](LICENSE).
