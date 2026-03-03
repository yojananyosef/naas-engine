function sampleSize(p1, p2, _alpha = 0.05, _power = 0.8) {
    const zAlpha = 1.96; // alpha 0.05
    const zBeta = 0.84;  // power 0.8

    const p = (p1 + p2) / 2;
    const numerator =
        Math.pow(zAlpha * Math.sqrt(2 * p * (1 - p)) +
            zBeta * Math.sqrt(p1 * (1 - p1) + p2 * (1 - p2)), 2);

    const denominator = Math.pow(p1 - p2, 2);

    return Math.ceil(numerator / denominator);
}

// Example usage
const baseline = 0.10;
const uplift = 0.02;

const n = sampleSize(baseline, baseline + uplift);
console.log(`Users per group needed: ${n}`);
console.log(`Total users needed: ${n * 2}`);