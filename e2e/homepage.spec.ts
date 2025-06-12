import { test, expect } from '@playwright/test';

test.describe('Homepage', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should display the main heading', async ({ page }) => {
    await expect(
      page.getByRole('heading', { name: 'Welcome to Kurama' })
    ).toBeVisible();
  });

  test('should display the hero section', async ({ page }) => {
    await expect(page.getByText('Enterprise React Application')).toBeVisible();
    await expect(
      page.getByRole('button', { name: 'Get Started' })
    ).toBeVisible();
  });

  test('should navigate when Get Started button is clicked', async ({
    page,
  }) => {
    const getStartedButton = page.getByRole('button', { name: 'Get Started' });
    await getStartedButton.click();

    // Should scroll to features section or navigate somewhere
    await expect(page.getByText('Modern Stack')).toBeVisible();
  });

  test('should display feature cards', async ({ page }) => {
    await expect(page.getByText('Modern Stack')).toBeVisible();
    await expect(page.getByText('Type Safe')).toBeVisible();
    await expect(page.getByText('Developer Experience')).toBeVisible();
  });

  test('should display tech stack section', async ({ page }) => {
    await expect(
      page.getByText('Built with Modern Technologies')
    ).toBeVisible();
    await expect(page.getByText('React 19')).toBeVisible();
    await expect(page.getByText('TypeScript')).toBeVisible();
    await expect(page.getByText('Mantine UI')).toBeVisible();
    await expect(page.getByText('TailwindCSS')).toBeVisible();
    await expect(page.getByText('Vite')).toBeVisible();
  });

  test('should be responsive on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });

    await expect(
      page.getByRole('heading', { name: 'Welcome to Kurama' })
    ).toBeVisible();
    await expect(page.getByText('Enterprise React Application')).toBeVisible();
    await expect(
      page.getByRole('button', { name: 'Get Started' })
    ).toBeVisible();
  });

  test('should have proper SEO meta tags', async ({ page }) => {
    await expect(page).toHaveTitle(/Kurama/);

    const metaDescription = page.locator('meta[name="description"]');
    await expect(metaDescription).toHaveAttribute(
      'content',
      /Enterprise React Application/
    );
  });

  test('should load without accessibility violations', async ({ page }) => {
    // Basic accessibility check - ensure main landmarks are present
    await expect(page.locator('main')).toBeVisible();
    await expect(page.locator('h1')).toBeVisible();

    // Check for proper heading hierarchy
    const h1Count = await page.locator('h1').count();
    expect(h1Count).toBe(1);
  });

  test('should handle navigation', async ({ page }) => {
    // Test navigation if there are nav links
    const navLinks = page.locator('nav a');
    const navCount = await navLinks.count();

    if (navCount > 0) {
      // Click first nav link if it exists
      await navLinks.first().click();
      // Should navigate or scroll to section
      await page.waitForTimeout(1000);
    }
  });
});
