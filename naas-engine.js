// naas-engine.js

export class NAASEngine {
    constructor({
        weights = [0.4, 0.4, 0.2],
        selector = '[data-aida="action"]',
        primarySelector = '[data-cta="primary"]',
        debounceMS = 120,
        useWorker = true,
        deltaThreshold = 0.05,
        onEvaluate = null
    } = {}) {
        this.weights = weights;
        this.selector = selector;
        this.primarySelector = primarySelector;
        this.debounceMS = debounceMS;
        this.useWorker = useWorker;
        this.deltaThreshold = deltaThreshold;
        this.onEvaluate = onEvaluate;

        this.visibleActions = new Set();
        this.timer = null;
        this.observer = null;

        this.worker = null;
        this.workerCallbacks = new Map();

        if (this.useWorker && typeof Worker !== "undefined") {
            this.worker = new Worker(
                new URL('./naas-worker.js', import.meta.url),
                { type: 'module' }
            );

            this.worker.onmessage = e => {
                const { id, contrast } = e.data;
                if (this.workerCallbacks.has(id)) {
                    this.workerCallbacks.get(id)(contrast);
                    this.workerCallbacks.delete(id);
                }
            };
        }
    }

    start() {
        const actions = document.querySelectorAll(this.selector);

        this.observer = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.visibleActions.add(entry.target);
                } else {
                    this.visibleActions.delete(entry.target);
                }
            });

            this.debouncedEvaluate();
        });

        actions.forEach(el => this.observer.observe(el));
    }

    stop() {
        if (this.observer) this.observer.disconnect();
    }

    debouncedEvaluate() {
        clearTimeout(this.timer);
        this.timer = setTimeout(() => this.evaluate(), this.debounceMS);
    }

    async evaluate() {
        const elements = Array.from(this.visibleActions);
        if (!elements.length) return;

        const metrics = await Promise.all(
            elements.map(el => this.computeMetrics(el))
        );

        const maxS = Math.max(...metrics.map(m => m.S)) || 1;
        const maxT = Math.max(...metrics.map(m => m.T)) || 1;

        metrics.forEach(m => {
            m.S_norm = m.S / maxS;
            m.T_norm = m.T / maxT;
            m.C_norm = m.C / 21;
            m.CDV = this.computeCDV(m);
        });

        const primaryElements = metrics.filter(m =>
            m.el.matches(this.primarySelector)
        );

        if (!primaryElements.length) return;

        const bestPrimary = primaryElements.sort((a, b) => b.CDV - a.CDV)[0];

        const maxOther = Math.max(
            ...metrics.filter(m => !m.el.matches(this.primarySelector)).map(m => m.CDV),
            0
        );

        const margin = bestPrimary.CDV - maxOther;
        const invariantHolds = margin > this.deltaThreshold;

        const result = {
            primary: bestPrimary.CDV,
            maxOther,
            margin,
            invariantHolds,
            metrics
        };

        window.__NAAS_EVAL__ = result;

        if (this.onEvaluate) {
            this.onEvaluate(result);
        }

        if (!invariantHolds) {
            console.warn("NAAS invariant violation detected.");
        }
    }

    computeCDV(m) {
        const [w1, w2, w3] = this.weights;
        return w1 * m.C_norm + w2 * m.S_norm + w3 * m.T_norm;
    }

    async computeMetrics(el) {
        const rect = el.getBoundingClientRect();
        const style = getComputedStyle(el);

        const S = rect.width * rect.height;
        const T = this.normalizeTypography(style);

        const fg = style.color;
        const bg = this.getBackgroundColor(el);

        let C;

        if (this.worker) {
            C = await this.computeContrastWorker(fg, bg);
        } else {
            C = this.contrastFallback(fg, bg);
        }

        return { el, S, T, C };
    }

    normalizeTypography(style) {
        const fontSize = parseFloat(style.fontSize) || 16;

        let weight = style.fontWeight;

        if (weight === "bold") weight = 700;
        if (weight === "normal") weight = 400;

        weight = parseInt(weight) || 400;

        return fontSize * weight;
    }

    computeContrastWorker(fg, bg) {
        return new Promise(resolve => {
            const id = typeof crypto !== "undefined" && crypto.randomUUID
                ? crypto.randomUUID()
                : Math.random().toString(36).substring(2);

            this.workerCallbacks.set(id, resolve);
            this.worker.postMessage({ id, fg, bg });
        });
    }

    getBackgroundColor(el) {
        let current = el;

        while (current && current !== document.body) {
            const bg = getComputedStyle(current).backgroundColor;

            if (bg && bg !== "rgba(0, 0, 0, 0)" && bg !== "transparent") {
                return bg;
            }

            current = current.parentElement;
        }

        return "rgb(255,255,255)";
    }

    contrastFallback(fg, bg) {
        const parse = str =>
            (str.match(/\d+/g) || [255, 255, 255]).slice(0, 3).map(Number);

        const toLinear = v => {
            v /= 255;
            return v <= 0.03928
                ? v / 12.92
                : Math.pow((v + 0.055) / 1.055, 2.4);
        };

        const luminance = rgb =>
            0.2126 * toLinear(rgb[0]) +
            0.7152 * toLinear(rgb[1]) +
            0.0722 * toLinear(rgb[2]);

        const L1 = luminance(parse(fg));
        const L2 = luminance(parse(bg));

        const lighter = Math.max(L1, L2);
        const darker = Math.min(L1, L2);

        return (lighter + 0.05) / (darker + 0.05);
    }
}

// ===== PURE UTILITIES FOR TESTING =====

export function contrastRatioPure(fg, bg) {
    const parse = str =>
        (str.match(/\d+/g) || [255, 255, 255]).slice(0, 3).map(Number);

    const toLinear = v => {
        v /= 255;
        return v <= 0.03928
            ? v / 12.92
            : Math.pow((v + 0.055) / 1.055, 2.4);
    };

    const luminance = rgb =>
        0.2126 * toLinear(rgb[0]) +
        0.7152 * toLinear(rgb[1]) +
        0.0722 * toLinear(rgb[2]);

    const L1 = luminance(parse(fg));
    const L2 = luminance(parse(bg));

    const lighter = Math.max(L1, L2);
    const darker = Math.min(L1, L2);

    return (lighter + 0.05) / (darker + 0.05);
}

export function normalizeTypographyPure(fontSize, fontWeight) {
    const size = parseFloat(fontSize) || 16;

    let weight = fontWeight;
    if (weight === "bold") weight = 700;
    if (weight === "normal") weight = 400;

    weight = parseInt(weight) || 400;

    return size * weight;
}

export function computeCDVPure(C_norm, S_norm, T_norm, weights) {
    const [w1, w2, w3] = weights;
    return w1 * C_norm + w2 * S_norm + w3 * T_norm;
}

export function invariantHoldsPure(primary, maxOther, deltaThreshold) {
    return (primary - maxOther) > deltaThreshold;
}