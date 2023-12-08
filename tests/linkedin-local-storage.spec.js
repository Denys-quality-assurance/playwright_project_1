const { credentials } = require('../helpers/credentials');
const {
  launchBrowserWithPage,
  loginToLinkedIn,
  getLocalStorage,
  closeBrowser,
} = require('../helpers/playwrightHelpers');

(async () => {
  let browser;
  try {
    // Create a browser instance, open a new page, and login
    const { browser: newBrowser, page } = await launchBrowserWithPage();
    browser = newBrowser;
    await loginToLinkedIn(page, credentials);

    // Log local storage
    await getLocalStorage(page);
  } catch (err) {
    console.error('Error occurred:', err);
  } finally {
    // Closing the browser instance
    await closeBrowser(browser);
  }
})();
