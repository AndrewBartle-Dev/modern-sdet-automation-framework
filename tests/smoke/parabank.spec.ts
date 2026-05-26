import { test, expect } from '@playwright/test';

test('ParaBank homepage loads', async ({ page }) => {
  await page.goto('/parabank');
  await expect(page.locator('text=Customer Login')).toBeVisible();
});