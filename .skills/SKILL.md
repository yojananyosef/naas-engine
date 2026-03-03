# NAAS Cognitive Engine & Vector-Minimalism Design

$ npx skills add https://github.com/yojananyosef/naas-engine --skill naas-cognitive

This skill enforces the **Neo-AIDA Accessible System (NAAS v3.4)**. It guides the creation of high-conversion interfaces using the **Vectorized Dominance Paradigm** and a **Vector-Minimalism** aesthetic.

## 1. Visual Contract (Vector-Minimalism)
- **Tone:** Premium, B2B SaaS, hyper-functional.
- **Borders & Shadows:** Use crisp 2px solid borders (`var(--border-main)`) and sharp 3px offset shadows (`var(--shadow-hard)`). NO blurry drop-shadows.
- **Shapes:** Rounded corners (`8px`). Pure sharp corners are banned.

## 2. Mathematical Contract (CDV)
Every interactive element has a Cognitive Dominance Vector (CDV) score (0 to 1):
`CDV = (0.4 * Contrast) + (0.4 * Surface) + (0.2 * TypoMass)`

**INVARIANT 01:** `COUNT([data-cta="primary"] visible) <= 1`
**INVARIANT 02:** `CDV(primary) > MAX(CDV(others)) + deltaThreshold`

## 3. DOM Contract (Semantic HTML)
Tag the DOM using `data-aida` structural roles:
- `data-aida="attention"`: Huge headers (Phase 1).
- `data-aida="interest"`: Value propositions (Phase 2).
- `data-aida="desire"`: Social proof (Phase 3).
- `data-aida="action"`: Buttons and links (Phase 4).

### Button Constraints:
- Primary CTA: `<button data-aida="action" data-cta="primary">`
- Secondary CTA: `<button data-aida="action" data-cta="secondary">`
- **Ghost Buttons are BANNED.** Secondary buttons must have a solid border.