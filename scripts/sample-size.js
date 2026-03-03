/**
 * NAAS Statistical Utility: Sample Size Calculator
 * 
 * Used to determine how many users are needed in an A/B test 
 * to verify if a change in CDV weights leads to a significant 
 * increase in Conversion Rate (CVR).
 */

function sampleSize(p1, p2, _alpha = 0.05, _power = 0.8) {
    const zAlpha = 1.96; // Standard 95% confidence
    const zBeta = 0.84;  // Standard 80% power

    const p = (p1 + p2) / 2;
    const numerator = Math.pow(zAlpha * Math.sqrt(2 * p * (1 - p)) +
        zBeta * Math.sqrt(p1 * (1 - p1) + p2 * (1 - p2)), 2);

    const denominator = Math.pow(p1 - p2, 2);

    return Math.ceil(numerator / denominator);
}

// Scenario: We want to see if our new CDV weights increase CVR from 10% to 12%
const baseline = 0.10;
const uplift = 0.02;

const n = sampleSize(baseline, baseline + uplift);
console.log(`--- NAAS Experiment Calibration ---`);
console.log(`Users per variant needed: ${n}`);
console.log(`Total users for the test: ${n * 2}`);