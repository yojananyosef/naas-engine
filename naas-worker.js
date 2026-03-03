self.addEventListener('message', (e) => {
    const { id, fg, bg } = e.data;
    try {
        const ratio = computeContrastRatio(fg, bg);
        self.postMessage({ id, contrast: ratio });
    } catch (err) {
        self.postMessage({ id, error: String(err) });
    }
});

function parseColor(input) {
    if (!input) return [255, 255, 255];
    const str = input.trim();

    // Extrae los números de rgb(0,0,0) o rgba(0,0,0,1)
    const m = str.match(/\d+/g);
    if (m && m.length >= 3) {
        return [parseInt(m[0]), parseInt(m[1]), parseInt(m[2])];
    }

    return [255, 255, 255]; // fallback a blanco si no detecta bien
}

function luminance(rgb) {
    const a = rgb.map((v) => {
        v /= 255;
        return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
    });
    return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
}

function computeContrastRatio(fgStr, bgStr) {
    const fg = parseColor(fgStr);
    const bg = parseColor(bgStr);

    const l1 = luminance(fg);
    const l2 = luminance(bg);

    const lighter = Math.max(l1, l2);
    const darker = Math.min(l1, l2);

    return (lighter + 0.05) / (darker + 0.05);
}