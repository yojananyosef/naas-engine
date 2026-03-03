import { test, expect } from '@playwright/test';

test('NAAS Invariant holds on Passing Case', async ({ page }) => {
  // Asegúrate de que la ruta sea correcta según tu servidor local
  await page.goto('http://localhost:3000/demo/passing-case.html');

  // Esperar a que el debounce del engine termine (120ms + margen)
  await page.waitForTimeout(500);

  const result = await page.evaluate(() => window.__NAAS_EVAL__);

  expect(result.invariantHolds).toBe(true);
  expect(result.margin).toBeGreaterThan(0);
});