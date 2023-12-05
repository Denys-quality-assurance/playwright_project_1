const { chromium } = require('playwright');
const credentials = require('../credentials');
const { loginToLinkedIn, getCookies, closeBrowser } = require('../helpers/linkedinHelpers');

(async () => {
  let browser;
  try {
    //Create a browser instance, open a new page, and login
    browser = await chromium.launch({ headless: false });
    const page = await browser.newPage();
    await loginToLinkedIn(page, credentials);

    // Log cookies
    await getCookies(page);
  } catch (err) {
    console.error('Error occurred:', err);
  } finally {
    //Closing the browser instance
    await closeBrowser(browser);
  }
})();
