# NAAS Engine

![MIT License](https://img.shields.io/badge/license-MIT-blue.svg)

NAAS (Neuro-Adaptive Attention System) is a runtime engine that enforces a cognitive dominance invariant in conversion-focused interfaces.

It transforms visual hierarchy into a measurable and verifiable mathematical property.

## 📋 Contents

- [Core Concept](#core-concept)
- [Why?](#why)
- [Installation](#installation)
- [Markup Convention](#markup-convention)
- [Worker Support](#worker-support)
- [Runtime Output](#runtime-output)
- [Demo](#demo)
- [Intended Scope](#intended-scope)
- [License](#license)

---

## Core Concept

Each actionable element is evaluated through a **Cognitive Dominance Vector (CDV)**:

```text
CDV = w1·Contrast + w2·Surface + w3·Typography
```

> **Invariant:** the primary CTA must maintain the highest CDV within the current viewport.

---

## Why?

Design systems enforce style consistency. NAAS enforces cognitive hierarchy consistency.

This prevents:

- Competing CTAs
- Accidental dominance shifts
- Hierarchy drift during layout changes
- Accessibility regressions

---

## Installation

Include the engine in your bundle:

```js
import { NAASEngine } from './naas-engine.js';

const engine = new NAASEngine();
engine.start();
```

---

## Markup Convention

Use data attributes to annotate CTAs:

```html
<button data-aida="action" data-cta="primary">
  Start Free Trial
</button>
```

---

## Worker Support

By default, NAAS uses a Web Worker to calculate WCAG contrast off the main thread.

Disable it if you prefer:

```js
new NAASEngine({ useWorker: false });
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

## Demo

Open `demo/index.html` in your browser or deploy directly via GitHub Pages.

---

## Intended Scope

| Diseñado para                 | No destinado a                      |
|------------------------------|-------------------------------------|
| Landing pages                | Dashboards de contenido pesado      |
| Checkout funnels             | Sistemas de datos exploratorios     |
| SaaS onboarding flows        | Experiencias editoriales largas     |
| Conversion-critical interfaces |                                   |

---

## License

This project is released under the [MIT License](LICENSE).
