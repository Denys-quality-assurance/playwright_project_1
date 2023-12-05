const { chromium } = require('playwright');
const credentials = require('../credentials');
const { loginToLinkedIn, getCookies, getLocalStorage, searchOnLinkedIn } = require('../helpers/linkedinHelpers');

(async () => {
  //Create a browser instance, open a new page, and login
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();
  await loginToLinkedIn(page, credentials);

  // Log local storage
  await getLocalStorage(page);

  //Close the browser instance
  console.log('Close the browser instance');
  await browser.close();
})();
