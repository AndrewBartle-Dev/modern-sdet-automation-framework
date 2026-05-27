import { test, expect } from '@playwright/test';

test('User can login to EventHub', async ({ page }) => {
  await page.goto('/login');

  await page.getByPlaceholder('you@email.com').fill(process.env.TEST_EMAIL!);

  await page.getByPlaceholder('••••••').fill(process.env.TEST_PASSWORD!);

  await page.getByRole('button', { name: 'Sign In' }).click();

  await expect(page).toHaveURL(/eventhub\.rahulshettyacademy\.com\/?/);
});