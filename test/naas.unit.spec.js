import {
    contrastRatioPure,
    normalizeTypographyPure,
    computeCDVPure,
    invariantHoldsPure
} from '../naas-engine.js';

describe("NAAS Unit Tests", () => {

    test("contrastRatioPure black/white should be ~21", () => {
        const ratio = contrastRatioPure(
            "rgb(0,0,0)",
            "rgb(255,255,255)"
        );

        expect(ratio).toBeGreaterThan(20);
    });

    test("contrastRatioPure identical colors should be 1", () => {
        const ratio = contrastRatioPure(
            "rgb(100,100,100)",
            "rgb(100,100,100)"
        );

        expect(ratio).toBeCloseTo(1, 5);
    });

    test("normalizeTypographyPure handles bold keyword", () => {
        const value = normalizeTypographyPure("16px", "bold");
        expect(value).toBe(16 * 700);
    });

    test("normalizeTypographyPure defaults weight", () => {
        const value = normalizeTypographyPure("16px", undefined);
        expect(value).toBe(16 * 400);
    });

    test("computeCDVPure calculates weighted sum correctly", () => {
        const cdv = computeCDVPure(
            0.5,
            0.6,
            0.7,
            [0.4, 0.4, 0.2]
        );

        expect(cdv).toBeCloseTo(
            0.4 * 0.5 + 0.4 * 0.6 + 0.2 * 0.7,
            5
        );
    });

    test("invariantHoldsPure respects deltaThreshold", () => {
        const result = invariantHoldsPure(
            0.8,
            0.75,
            0.02
        );

        expect(result).toBe(true);
    });

    test("invariantHoldsPure fails when margin too small", () => {
        const result = invariantHoldsPure(
            0.8,
            0.79,
            0.05
        );

        expect(result).toBe(false);
    });

});