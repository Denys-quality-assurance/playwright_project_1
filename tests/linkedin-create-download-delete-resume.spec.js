const { credentials, imagePath } = require('../helpers/credentials');
const SELECTORS = require('../helpers/linkedinSelectors');
const { launchBrowserWithPage, loginToLinkedIn, closeBrowser } = require('../helpers/playwrightHelpers');
const { checkFileExists, deleteTempFile } = require('../helpers/generalHelpers');
const pictureUrl =
  'https://i.natgeofe.com/n/548467d8-c5f1-4551-9f58-6817a8d2c45e/NationalGeographic_2572187_square.jpg';

(async () => {
  let browser;
  try {
    // Create a browser instance, open a new page, and login
    const { browser: newBrowser, page } = await launchBrowserWithPage();
    browser = newBrowser;
    await loginToLinkedIn(page);

    // Open My profile page

    await page.waitForSelector(SELECTORS.AVATAR_ICON);
    await page.click(SELECTORS.AVATAR_ICON);

    // Go to Resume builder

    await page.waitForSelector(SELECTORS.MORE_ACTIONS_BUTTON);
    await page.click(SELECTORS.MORE_ACTIONS_BUTTON);
    await page.waitForSelector(SELECTORS.BUILD_RESUME_BUTTON);
    await page.click(SELECTORS.BUILD_RESUME_BUTTON);
    await page.waitForSelector(SELECTORS.CREATE_RESUME_BUTTON);

    // Create a Resume from profile

    await page.click(SELECTORS.CREATE_RESUME_BUTTON);
    await page.waitForSelector(SELECTORS.JOB_TITLE_COMBOBOX);
    await page.fill(SELECTORS.JOB_TITLE_COMBOBOX, 'Student');
    await page.waitForSelector(SELECTORS.JOB_TITLE_COMBOBOX_ITEM);
    await page.click(SELECTORS.JOB_TITLE_COMBOBOX_ITEM);
    await page.waitForSelector(SELECTORS.APPLY_JOB_TITLE_BUTTON);
    await page.click(SELECTORS.APPLY_JOB_TITLE_BUTTON);
    await page.waitForSelector(SELECTORS.DOWNLOAD_RESUME_BUTTON);

    // Download the Resume

    await page.click(SELECTORS.DOWNLOAD_RESUME_BUTTON);

    // Wait for the Resume download to complete

    const download = await page.waitForEvent('download');
    const downloadPath = await download.path();

    // Check Resume downloaded

    checkFileExists(downloadPath);

    // Go to Resume builder

    await page.waitForSelector(SELECTORS.VIEW_RESUMES);
    await page.click(SELECTORS.VIEW_RESUMES);

    // Delete the Resume from LinkedIn

    await page.click(SELECTORS.SHOW_OPTIONS_FOR_RESUME_BUTTON);
    await page.waitForSelector(SELECTORS.DELETE_RESUME_BUTTON);
    await page.click(SELECTORS.DELETE_RESUME_BUTTON);
    await page.waitForSelector(SELECTORS.CONFIRMATION_BUTTON);
    await page.click(SELECTORS.CONFIRMATION_BUTTON);

    // Wait for the Resume to be hidden

    await page.waitForSelector(SELECTORS.SHOW_OPTIONS_FOR_RESUME_BUTTON, { state: 'hidden' });

    // Delete the Resume from PC
    deleteTempFile(downloadPath);
  } catch (err) {
    console.error('Error occurred:', err);
  } finally {
    // Closing the browser instance
    await closeBrowser(browser);
  }
})();
