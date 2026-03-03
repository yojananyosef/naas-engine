---
name: naas-cognitive
description: Enforces the Neo-AIDA Accessible System (NAAS v3.4) for vectorized UI dominance and high-conversion interfaces using mathematical cognitive invariants.
---

# NAAS Cognitive Engine & Vector-Minimalism Design

This skill enforces the **Neo-AIDA Accessible System (NAAS v3.4)**. It guides the creation of high-conversion interfaces using the **Vectorized Dominance Paradigm** and a **Vector-Minimalism** aesthetic.

## When to Use This Skill
Use this skill when the user:
- Asks to design a high-conversion landing page or checkout funnel.
- Needs to ensure a Primary CTA has mathematical dominance over other elements.
- Wants to implement the "Vector-Minimalism" aesthetic (2px borders, 3px shadows).
- Requires a verifiable visual hierarchy based on cognitive science.

## 1. Core Philosophy & Mission
"Impact without confusion. Differentiate without excluding. Convert without manipulation."
NAAS is not a style; it is a **deterministic conversion machine**. It rejects homogeneity through attention engineering.

## 2. Canonical Terminology (Auditable at Runtime)
- **Viewport Scope:** The effective visual area (100dvh).
- **Interactive Surface (S):** `boundingClientRect.width × height` (including padding/border).
- **Typographic Mass (T):** `fontSize (px) × fontWeight (100-900)`.
- **Cognitive Dominance Vector (CDV):** A weighted score (0 to 1) determining absolute hierarchy.

## 3. The Mathematical Contract (CDV Invariant)
Every interactive element MUST have a calculated CDV:
`CDV = (0.4 * Contrast_Norm) + (0.4 * Surface_Norm) + (0.2 * TypoMass_Norm)`

**THE ABSOLUTE LAW:**
The Primary CTA (`data-cta="primary"`) MUST mathematically maintain the highest CDV in the current Viewport Scope.
- **Chromatic Exclusivity:** ONLY the Primary CTA uses `--intent-action` (#FFD600).
- **Surface Compensation:** If a secondary element (like a "Delete" button) requires high contrast, its surface area MUST be reduced to ensure its CDV remains lower than the Primary CTA.

## 4. Design Thinking: Vector-Minimalism Aesthetic
- **Tone:** Premium B2B SaaS (Vercel/Linear style) with structural strictness.
- **Borders:** Crisp 2px solid (`#0A0A0A`).
- **Shadows:** Sharp 3px offset, zero blur (`3px 3px 0 #0A0A0A`).
- **Typography:** Display fonts (e.g., Space Grotesk) for `attention`, Sans-serif (e.g., Inter) for `reading`.

## 5. Structural & Advanced Clauses
### 5.1 Cognitive Density Budget
- **Highlighted Area:** Blocks with high contrast must occupy ≤ 40% of the viewport.
- **Chunking:** Maximum 3 highlighted blocks per Viewport Scope.
- **Line Length:** Maximum 75 characters for readability.

### 5.2 Geometric Collision & Scroll
- **Sticky Invariant:** If a Sticky CTA is present, any scrolling Primary CTA MUST hide (display: none) the millisecond their `boundingClientRects` intersect.
- **One King:** Exactly ONE `data-cta="primary"` is allowed to be visible at any given scroll position.

### 5.3 Motion Discipline (Neuro-Inclusion)
- **Duration:** Max 150ms.
- **Curves:** Functional `ease-out` only. Zero elastic/bouncing effects.
- **Limit:** Max 1 dominant axis of movement per Viewport Scope.

## 6. Implementation Matrix (AIDA)
Every component must declare its role:
- `data-aida="attention"`: Phase 1. Visual hooks, massive H1.
- `data-aida="interest"`: Phase 2. Retention, bento grids, left-aligned text.
- `data-aida="desire"`: Phase 3. Social proof, trust building.
- `data-aida="action"`: Phase 4. Conversion. Primary CTA with tactile physics.

## 7. Example Output Validation
```html
<main data-viewport-scope="hero" class="p-12 bg-[#FAFAFA]">
  <!-- PHASE 1: ATTENTION -->
  <header data-aida="attention" class="mb-8">
    <h1 class="text-6xl font-black tracking-tighter border-b-2 border-black pb-4">
      Vectorized Conversion.
    </h1>
  </header>

  <!-- PHASE 2: INTEREST -->
  <section data-aida="interest" class="max-w-[65ch] mb-12">
    <p class="text-xl text-gray-700">
      Stop designing by intuition. Program your visual hierarchy using 
      verifiable mathematical invariants.
    </p>
  </section>

  <!-- PHASE 4: ACTION -->
  <nav data-aida="action" class="flex items-center gap-6">
    <button data-aida="action" data-cta="secondary" class="border-2 border-black px-6 py-3 font-semibold shadow-[3px_3px_0_#000] hover:-translate-y-1 transition-all duration-150">
      View Documentation
    </button>
    <button data-aida="action" data-cta="primary" class="bg-[#FFD600] border-2 border-black px-10 py-4 text-lg font-bold shadow-[3px_3px_0_#000] hover:-translate-y-1 transition-all duration-150">
      Get Started Free
    </button>
  </nav>
</main>
Instruction to the AI: Before outputting code, simulate the CDV calculation. Ensure that the combination of Contrast, Surface Area, and Typography always makes the Primary CTA the mathematical winner of the screen.