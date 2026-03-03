import { test, expect } from '@playwright/test';

test('NAAS invariant holds', async ({ page }) => {
  await page.goto('http://localhost:3000');

  await page.waitForTimeout(500);

  const result = await page.evaluate(() => window.__NAAS_EVAL__);

  expect(result.invariantHolds).toBeTruthy();
  expect(result.primary).toBeGreaterThan(result.maxOther);
});