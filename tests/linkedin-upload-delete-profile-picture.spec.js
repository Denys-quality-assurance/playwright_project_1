const credentials = require('../helpers/credentials');
const SELECTORS = require('../helpers/selectors');
const { launchBrowserWithPage, loginToLinkedIn, closeBrowser } = require('../helpers/linkedinHelpers');

(async () => {
  let browser;
  try {
    // Create a browser instance, open a new page, and login
    const { browser: newBrowser, page } = await launchBrowserWithPage();
    browser = newBrowser;
    await loginToLinkedIn(page, credentials);

    // Open My profile page
    console.log('Open My profile page');
    await page.waitForSelector(SELECTORS.AVATAR_ICON);
    await page.click(SELECTORS.AVATAR_ICON);

    // Open Add photo modal
    console.log('Open Add photo modal');
    await page.waitForSelector(SELECTORS.ADD_PHOTO_BUTTON);
    await page.click(SELECTORS.ADD_PHOTO_BUTTON);
    await page.waitForSelector(SELECTORS.UPLOAD_PHOTO_BUTTON);

    // Upload profile picture
    console.log('Upload profile picture');
    const imagePath = 'C:\\Users\\Denys_Matolikov\\Downloads\\OIG.9atye.2Om9dB5eX9KCUu.jpg'; // Set the path to the image you want to upload
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
    await page.waitForSelector(SELECTORS.DELETE_PHOTO_CONFIRMATION_BUTTON);
    await page.click(SELECTORS.DELETE_PHOTO_CONFIRMATION_BUTTON);

    // Wait for the default profile picture to load
    console.log('Wait for the default profile picture to load');
    await page.waitForSelector(SELECTORS.ADD_PHOTO_BUTTON);
  } catch (err) {
    console.error('Error occurred:', err);
  } finally {
    // Closing the browser instance
    await closeBrowser(browser);
  }
})();