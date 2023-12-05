const { chromium } = require('playwright');
const credentials = require('../credentials');
const { loginToLinkedIn, getCookies, getLocalStorage, searchOnLinkedIn } = require('../helpers/linkedinHelpers');

(async () => {
  //Create a browser instance, open a new page, and login
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();
  await loginToLinkedIn(page, credentials);

  // Type the search query in the search box and press Enter
  await searchOnLinkedIn(page, 'Playwright');

  //Close the browser instance
  console.log('Close the browser instance');
  await browser.close();
})();
