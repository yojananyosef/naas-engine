// naas-worker.js

function parseRGB(str) {
    if (!str) return [255, 255, 255];

    const nums = str.match(/\d+(\.\d+)?/g);
    if (!nums) return [255, 255, 255];

    return nums.slice(0, 3).map(Number);
}

function toLinear(v) {
    v /= 255;
    return v <= 0.03928
        ? v / 12.92
        : Math.pow((v + 0.055) / 1.055, 2.4);
}

function luminance(rgb) {
    return (
        0.2126 * toLinear(rgb[0]) +
        0.7152 * toLinear(rgb[1]) +
        0.0722 * toLinear(rgb[2])
    );
}

function contrastRatio(fg, bg) {
    const L1 = luminance(parseRGB(fg));
    const L2 = luminance(parseRGB(bg));

    const lighter = Math.max(L1, L2);
    const darker = Math.min(L1, L2);

    return (lighter + 0.05) / (darker + 0.05);
}

self.onmessage = e => {
    const { id, fg, bg } = e.data;

    const contrast = contrastRatio(fg, bg);

    self.postMessage({
        id,
        contrast
    });
};