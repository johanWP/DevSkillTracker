
import { test, expect, type Page } from '@playwright/test';

// --- Test Credentials ---
// IMPORTANT: You must create these users in your Firebase Authentication console.
const ADMIN_USER = {
  email: 'testadmin@example.com',
  password: 'password123', // Use a secure, known password
};
const NON_ADMIN_USER = {
  email: 'testuser@example.com',
  password: 'password123', // Use a secure, known password
};

// --- Helper Functions ---
async function login(page: Page, user: { email: string; password: string }) {
  await page.getByLabel('Email Address').fill(user.email);
  await page.getByLabel('Password').fill(user.password);
  await page.getByRole('button', { name: 'Log in' }).click();
}

test.describe('DevSkillTracker E2E Tests', () => {
  // Navigate to the app before each test
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test.describe('Authentication', () => {
    test('should allow a valid admin to log in', async ({ page }) => {
      await login(page, ADMIN_USER);
      // Wait for the dashboard to appear by checking for the user's email
      await expect(page.getByText(ADMIN_USER.email)).toBeVisible({ timeout: 10000 });
      await expect(page.getByRole('button', { name: 'Log out' })).toBeVisible();
      // Check that the URL is no longer the login page (though it stays at base URL)
      await expect(page.getByRole('heading', { name: 'DevSkillTracker' })).toHaveCount(2); // One in header, one on page
    });

    test('should prevent a non-admin user from accessing the dashboard', async ({ page }) => {
      await login(page, NON_ADMIN_USER);
      // Expect to see the authorization error message
      await expect(page.getByText('You are not authorized to access this application.')).toBeVisible({ timeout: 10000 });
      // Expect the login form to still be visible
      await expect(page.getByLabel('Email Address')).toBeVisible();
    });
  });

  test.describe('Developer Management', () => {
    // A unique email for this test run to avoid data collisions
    const developerEmail = `e2e-dev-${Date.now()}@test.com`;
    const developerName = 'E2E Test Developer';

    test('should allow an admin to create a developer and see them in the list', async ({ page }) => {
      // 1. Log in as an admin
      await login(page, ADMIN_USER);
      await expect(page.getByText(ADMIN_USER.email)).toBeVisible();

      // 2. Navigate to the "Add Developer" page
      await page.getByRole('button', { name: 'Add Developer' }).click();
      await expect(page.getByRole('heading', { name: 'Add New Developer' })).toBeVisible();

      // 3. Fill out the form
      await page.getByLabel('Full Name').fill(developerName);
      await page.getByLabel('Email Address').fill(developerEmail);
      await page.getByLabel('Role').fill('E2E Tester');
      await page.getByLabel('Project').fill('Test Suite');
      
      // Add a skill
      await page.getByLabel('Skill').selectOption('React');
      await page.getByLabel('Proficiency (1-5)').selectOption('4');
      await page.getByRole('button', { name: 'Add Skill' }).click();
      await expect(page.getByText('React - Proficiency: 4')).toBeVisible();

      // 4. Save the developer
      await page.getByRole('button', { name: 'Save Developer' }).click();

      // 5. Verify the success message and form reset
      await expect(page.getByText(`Developer "${developerName}" created successfully.`)).toBeVisible();
      await expect(page.getByLabel('Full Name')).toBeEmpty();

      // 6. Navigate to the Developers list
      await page.getByRole('button', { name: 'Developers' }).click();
      
      // 7. Verify the new developer is in the table
      const developerRow = page.getByRole('row', { name: new RegExp(developerName) });
      await expect(developerRow).toBeVisible();
      await expect(developerRow.getByRole('cell', { name: developerEmail })).toBeVisible();
      await expect(developerRow.getByRole('cell', { name: 'E2E Tester' })).toBeVisible();
      await expect(developerRow.getByRole('cell', { name: 'React' })).toBeVisible();
    });

    test('should prevent creating a developer with a duplicate email', async ({ page }) => {
      // Log in as an admin
      await login(page, ADMIN_USER);
      await expect(page.getByText(ADMIN_USER.email)).toBeVisible();

      // Navigate to the "Add Developer" page
      await page.getByRole('button', { name: 'Add Developer' }).click();
      
      // Attempt to create the same developer again
      await page.getByLabel('Full Name').fill(developerName);
      await page.getByLabel('Email Address').fill(developerEmail); // Using the same email from the previous test
      
      await page.getByRole('button', { name: 'Save Developer' }).click();

      // Verify the duplicate error message
      await expect(page.getByText('A developer with this email already exists.')).toBeVisible();
    });
  });
});
