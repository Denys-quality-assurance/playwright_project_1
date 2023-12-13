import { test, expect } from '@playwright/test';
require('dotenv').config();
const SELECTORS = require('../helpers/linkedinSelectors');
const { loginToLinkedIn, logoutFromLinkedIn } = require('../helpers/playwrightHelpers');

test.describe('LinkedIn User can login and logout', () => {
  test('User can login to LinkedIn', async ({ page }) => {
    await loginToLinkedIn(page);

    // Check if the Avatar Icon is visible after user logged in to LinkedIn
    const isAvatarIconVisible = await page.isVisible(SELECTORS.AVATAR_ICON_MAIN);
    expect(isAvatarIconVisible).toBe(true, 'Avatar Icon is not visible after user logged in to LinkedIn');
  });

  test('User can logout from LinkedIn', async ({ page }) => {
    await loginToLinkedIn(page);

    await logoutFromLinkedIn(page);

    // Check if the 'Sing in' button is visible after user logged out from LinkedIn
    const isSignInButtonVisible = await page.isVisible(SELECTORS.SUBMIT_BUTTON);
    expect(isSignInButtonVisible).toBe(true, "'Sing in' button is visible after user logged out from LinkedIn");
  });
});
