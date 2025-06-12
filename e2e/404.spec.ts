import { test, expect } from '@playwright/test';

test.describe('404 Page', () => {
  test('should display 404 page for non-existent routes', async ({ page }) => {
    await page.goto('/non-existent-page');

    await expect(page.getByText('404')).toBeVisible();
    await expect(page.getByText('Page Not Found')).toBeVisible();
    await expect(
      page.getByText("The page you're looking for doesn't exist")
    ).toBeVisible();
  });

  test('should have navigation options', async ({ page }) => {
    await page.goto('/invalid-route');

    await expect(page.getByRole('button', { name: 'Go Home' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Go Back' })).toBeVisible();
  });

  test('should navigate home when Go Home button is clicked', async ({
    page,
  }) => {
    await page.goto('/does-not-exist');

    const goHomeButton = page.getByRole('button', { name: 'Go Home' });
    await goHomeButton.click();

    await expect(page).toHaveURL('/');
    await expect(page.getByText('Welcome to Kurama')).toBeVisible();
  });

  test('should go back when Go Back button is clicked', async ({ page }) => {
    // First visit home page
    await page.goto('/');
    await expect(page.getByText('Welcome to Kurama')).toBeVisible();

    // Then navigate to 404 page
    await page.goto('/invalid-page');
    await expect(page.getByText('404')).toBeVisible();

    // Click go back
    const goBackButton = page.getByRole('button', { name: 'Go Back' });
    await goBackButton.click();

    // Should be back on home page
    await expect(page.getByText('Welcome to Kurama')).toBeVisible();
  });

  test('should be responsive on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/mobile-404-test');

    await expect(page.getByText('404')).toBeVisible();
    await expect(page.getByText('Page Not Found')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Go Home' })).toBeVisible();
  });

  test('should have proper SEO meta tags', async ({ page }) => {
    await page.goto('/seo-404-test');

    await expect(page).toHaveTitle(/404/);
  });
});
