import { test, expect } from '@playwright/test';
const { loginToLinkedIn, getLocalStorage } = require('../helpers/playwrightHelpers');

test('Check StorageData content after login to LinkedIn', async ({ page }) => {
  await loginToLinkedIn(page);
  // StorageData after login to LinkedIn
  const localStorageData = await getLocalStorage(page);

  // StorageData content
  const isBadgesExists = 'voyager-web:badges' in localStorageData;
  const isNewTabBeaconExists = 'voyager-web:new-tab-beacon' in localStorageData;

  // Check if StorageData include 'voyager-web:badges' after login to LinkedIn
  expect(isBadgesExists).toBe(true, "StorageData don't include 'voyager-web:badges' after login to LinkedIn");
  // Check if StorageData include 'voyager-web:new-tab-beacon' after login to LinkedIn
  expect(isNewTabBeaconExists).toBe(
    true,
    "StorageData don't include 'voyager-web:new-tab-beacon' after login to LinkedIn"
  );
});
