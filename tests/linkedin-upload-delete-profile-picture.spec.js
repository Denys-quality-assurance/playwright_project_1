import { test, expect } from '@playwright/test';
const { loginToLinkedIn } = require('../helpers/playwrightHelpers');
const SELECTORS = require('../helpers/linkedinSelectors');
const { downloadImageFromUrlToTempDir, deleteTempFile } = require('../helpers/generalHelpers');
const SOURCES = require('../helpers/externalSources');

test('User can add and remove a profile picture', async ({ page }) => {
  // Download image from url to the system's directory for temporary files
  const imagePath = await downloadImageFromUrlToTempDir(SOURCES.profilePictureUrl);

  await loginToLinkedIn(page);

  // Open My profile page
  console.log('Open My profile page');
  await page.waitForSelector(SELECTORS.AVATAR_ICON);
  await page.click(SELECTORS.AVATAR_ICON);

  // Open Add photo modal
  console.log('Open Add photo modal');
  await page.waitForSelector(SELECTORS.ADD_PHOTO_BUTTON);
  await page.click(SELECTORS.ADD_PHOTO_BUTTON);
  await page.waitForSelector(SELECTORS.UPLOAD_PHOTO_BUTTON);

  // Upload profile picture from the specified image path
  console.log('Upload profile picture');
  const inputFile = await page.$(SELECTORS.UPLOAD_PHOTO_BUTTON);
  await inputFile.setInputFiles(imagePath);
  await page.waitForSelector(SELECTORS.SAVE_PHOTO_BUTTON);

  // Save changes
  console.log('Save changes');
  await page.click(SELECTORS.SAVE_PHOTO_BUTTON);

  // Wait for the Edit photo modal to be hidden
  console.log('Wait for the Edit photo modal to be hidden');
  await page.waitForSelector(SELECTORS.MODAL, { state: 'hidden' });

  // Refresh the page
  console.log('Refresh the page');
  await page.reload();

  // Wait for the new profile picture to load
  console.log('Wait for the new profile picture to load');
  await page.waitForSelector(SELECTORS.EDIT_PHOTO_BUTTON);

  // Open Profile photo modal
  console.log('Open Profile photo modal');
  await page.waitForSelector(SELECTORS.EDIT_PHOTO_BUTTON);
  await page.click(SELECTORS.EDIT_PHOTO_BUTTON);

  // Delete profile photo
  console.log('Delete profile photo');
  await page.click(SELECTORS.DELETE_PHOTO_BUTTON);
  await page.waitForSelector(SELECTORS.CONFIRMATION_BUTTON);
  await page.click(SELECTORS.CONFIRMATION_BUTTON);

  // Wait for the default profile picture to load
  console.log('Wait for the default profile picture to load');
  await page.waitForSelector(SELECTORS.ADD_PHOTO_BUTTON);

  // Check if the default profile picture is visible
  console.log('Check if the default profile picture is visible');
  const isDefaultProfilePictureVisible = await page.isVisible(SELECTORS.ADD_PHOTO_BUTTON);
  expect(isDefaultProfilePictureVisible).toBe(
    true,
    'Default profile picture is not visible after the profile picture was deleted'
  );

  // Delete the picture from PC
  deleteTempFile(imagePath);
});
