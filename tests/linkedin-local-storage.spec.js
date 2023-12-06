const { chromium } = require('playwright');
const credentials = require('../helpers/credentials');
const { loginToLinkedIn, getLocalStorage, closeBrowser } = require('../helpers/linkedinHelpers');

(async () => {
  let browser;
  try {
    //Create a browser instance, open a new page, and login
    browser = await chromium.launch({ headless: false });
    const page = await browser.newPage();
    await loginToLinkedIn(page, credentials);

    // Log local storage
    await getLocalStorage(page);
  } catch (err) {
    console.error('Error occurred:', err);
  } finally {
    //Closing the browser instance
    await closeBrowser(browser);
  }
})();
