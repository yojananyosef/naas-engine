// naas-engine.js (v3.4.1 - Loop Protection)

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
        this.domObserver = null;

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
        this.observeActions();
        this.observeDOM();
    }

    observeActions() {
        const actions = document.querySelectorAll(this.selector);
        if (this.observer) this.observer.disconnect();

        this.observer = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.visibleActions.add(entry.target);
                } else {
                    this.visibleActions.delete(entry.target);
                }
            });
            this.debouncedEvaluate();
        }, { threshold: 0.1 });

        actions.forEach(el => this.observer.observe(el));
    }

    observeDOM() {
        this.domObserver = new MutationObserver((mutations) => {
            // SOLO reacciona si se añaden o quitan elementos que coincidan con el selector
            const needsUpdate = mutations.some(mutation =>
                Array.from(mutation.addedNodes).some(node => node.nodeType === 1 && (node.matches(this.selector) || node.querySelector(this.selector))) ||
                Array.from(mutation.removedNodes).some(node => node.nodeType === 1 && (node.matches(this.selector) || node.querySelector(this.selector)))
            );

            if (needsUpdate) {
                this.observeActions();
            }
        });

        this.domObserver.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    stop() {
        if (this.observer) this.observer.disconnect();
        if (this.domObserver) this.domObserver.disconnect();
        if (this.worker) this.worker.terminate();
    }

    debouncedEvaluate() {
        clearTimeout(this.timer);
        this.timer = setTimeout(() => this.evaluate(), this.debounceMS);
    }

    async evaluate() {
        const elements = Array.from(this.visibleActions);
        if (!elements.length) return;

        const metrics = await Promise.all(elements.map(el => this.computeMetrics(el)));
        const maxS = Math.max(...metrics.map(m => m.S)) || 1;
        const maxT = Math.max(...metrics.map(m => m.T)) || 1;

        metrics.forEach(m => {
            m.S_norm = m.S / maxS;
            m.T_norm = m.T / maxT;
            m.C_norm = m.C / 21;
            m.CDV = this.computeCDV(m);
        });

        const primaryElements = metrics.filter(m => m.el.matches(this.primarySelector));
        if (!primaryElements.length) return;

        const bestPrimary = primaryElements.sort((a, b) => b.CDV - a.CDV)[0];
        const otherCDVs = metrics.filter(m => !m.el.matches(this.primarySelector)).map(m => m.CDV);
        const maxOther = otherCDVs.length ? Math.max(...otherCDVs) : 0;

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
        if (this.onEvaluate) this.onEvaluate(result);
    }

    computeCDV(m) {
        const [w1, w2, w3] = this.weights;
        return (w1 * m.C_norm) + (w2 * m.S_norm) + (w3 * m.T_norm);
    }

    async computeMetrics(el) {
        const rect = el.getBoundingClientRect();
        const style = getComputedStyle(el);
        const S = rect.width * rect.height;
        const T = this.normalizeTypography(style);
        const fg = style.color;
        const bg = this.getBackgroundColor(el);
        const C = this.worker ? await this.computeContrastWorker(fg, bg) : this.contrastFallback(fg, bg);
        return { el, S, T, C };
    }

    normalizeTypography(style) {
        const size = parseFloat(style.fontSize) || 16;
        let weight = style.fontWeight;
        if (weight === "bold") weight = 700;
        if (weight === "normal") weight = 400;
        return size * (parseInt(weight) || 400);
    }

    computeContrastWorker(fg, bg) {
        return new Promise(resolve => {
            const id = crypto.randomUUID();
            this.workerCallbacks.set(id, resolve);
            this.worker.postMessage({ id, fg, bg });
        });
    }

    getBackgroundColor(el) {
        let current = el;
        while (current && current !== document.body) {
            const bg = getComputedStyle(current).backgroundColor;
            if (bg && bg !== "rgba(0, 0, 0, 0)" && bg !== "transparent") return bg;
            current = current.parentElement;
        }
        return "rgb(255,255,255)";
    }

    contrastFallback(fg, bg) {
        const parse = str => (str.match(/\d+/g) || [255, 255, 255]).slice(0, 3).map(Number);
        const toLinear = v => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); };
        const luminance = rgb => 0.2126 * toLinear(rgb[0]) + 0.7152 * toLinear(rgb[1]) + 0.0722 * toLinear(rgb[2]);
        const L1 = luminance(parse(fg)), L2 = luminance(parse(bg));
        return (Math.max(L1, L2) + 0.05) / (Math.min(L1, L2) + 0.05);
    }
}