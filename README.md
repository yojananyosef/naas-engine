# NAAS Engine

![MIT License](https://img.shields.io/badge/license-MIT-blue.svg)
![Version](https://img.shields.io/badge/version-0.1.0-orange.svg)

**Status:** Experimental Research Release

NAAS (Neuro-Adaptive Attention System) is a runtime engine that enforces a
cognitive dominance invariant in conversion-focused interfaces.

It transforms visual hierarchy into a measurable and verifiable mathematical
property.

---

## 📋 Contents

- [Core Concept](#core-concept)
- [Invariant Definition](#invariant-definition)
- [Why?](#why)
- [Installation](#installation)
- [Usage](#usage)
- [Runtime Output](#runtime-output)
- [Repo Structure](#repo-structure)
- [Demo Scenarios](#demo-scenarios)
- [Testing & Reproducibility](#testing--reproducibility)
- [Intended Scope](#intended-scope)
- [License](#license)

---

## Core Concept

Each actionable element is evaluated through a **Cognitive Dominance Vector (CDV)**:

```text
CDV = w1·Contrast + w2·Surface + w3·Typography

Where:

Contrast → WCAG contrast ratio (1–21)
Surface  → Rendered pixel area
Typography → fontSize × fontWeight
```

### Invariant Definition

The primary CTA must maintain the highest CDV within the current viewport.

Formally:

```
CDV_primary > max(CDV_others) + δ
```

Where **δ** is a configurable dominance threshold (see `deltaThreshold`).

---

## Why?

Design systems enforce visual consistency. NAAS enforces cognitive hierarchy
consistency.

This prevents:

- Competing CTAs
- Accidental dominance shifts
- Hierarchy drift during layout changes
- Accessibility regressions
- Conversion‑critical ambiguity

---

## Installation

```bash
npm install
```

Import the engine:

```js
import { NAASEngine } from './naas-engine.js';

const engine = new NAASEngine();
engine.start();
```

---

## Usage

Annotate actionable elements:

```html
<button data-aida="action" data-cta="primary">
  Start Free Trial
</button>
```

Configuration options:

```js
new NAASEngine({
  weights: [0.4, 0.4, 0.2],
  deltaThreshold: 0.05,
  useWorker: true
});
```

---

## Runtime Output

The engine exposes a global evaluation object:

```js
window.__NAAS_EVAL__
```

Example result:

```json
{
  "primary": 0.82,
  "maxOther": 0.61,
  "margin": 0.21,
  "invariantHolds": true
}
```

---

## Repo Structure

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

---

## Demo Scenarios

The `demo/` folder now contains three independent examples:

- `basic-violation.html` → two equal CTAs (invariant fails)
- `passing-case.html` → proper dominance hierarchy (invariant holds)
- `competing-ctas.html` → dominance drift detection

Each page exercises a different facet of the algorithm.

### 🔗 Live GitHub Pages Demos

You can also explore the scenarios on GitHub Pages:

- [Basic violation demo](https://yojananyosef.github.io/naas-engine/demo/basic-violation.html)
- [Passing case demo](https://yojananyosef.github.io/naas-engine/demo/passing-case.html)
- [Competing CTAs demo](https://yojananyosef.github.io/naas-engine/demo/competing-ctas.html)

These URLs are useful for testing the engine in a live environment without cloning the repo.

---

## Testing & Reproducibility

```bash
npm install
npm test
```

E2E tests use Playwright; unit tests (and future additions) verify:

- WCAG contrast computation
- Typography normalization
- CDV weighted calculation
- Invariant threshold logic

Pure mathematical utilities are exported so any third party can deterministically
reproduce results. The invariant is therefore testable outside of browser context
—critical for research credibility.

---

## Intended Scope

| Diseñado para                 | No destinado a                      |
|------------------------------|-------------------------------------|
| Landing pages                | Dashboards de contenido pesado      |
| Checkout funnels             | Sistemas de datos exploratorios     |
| SaaS onboarding flows        | Experiencias editoriales largas     |
| Conversion‑critical interfaces |                                     |

---

## License

Released under the [MIT License](LICENSE).

