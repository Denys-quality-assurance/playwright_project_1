const credentials = require('../helpers/credentials');
const {
  launchBrowserWithPage,
  loginToLinkedIn,
  searchOnLinkedIn,
  closeBrowser,
} = require('../helpers/linkedinHelpers');

(async () => {
  let browser;
  try {
    // Create a browser instance, open a new page, and login
    const { browser: newBrowser, page } = await launchBrowserWithPage();
    browser = newBrowser;
    await loginToLinkedIn(page, credentials);

    // Type the search query in the search box and press Enter
    await searchOnLinkedIn(page, 'Playwright');
  } catch (err) {
    console.error('Error occurred:', err);
  } finally {
    // Closing the browser instance
    await closeBrowser(browser);
  }
})();
