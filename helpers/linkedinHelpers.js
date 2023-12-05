const SELECTORS = require('./selectors');

module.exports = {
  loginToLinkedIn: async function (page, credentials) {
    try {
      //Navigate to the LinkedIn login page
      await page.goto('https://www.linkedin.com/login');
      await page.waitForSelector(SELECTORS.LOGIN_BUTTON);

      //Type the email and password into their respective input fields
      console.log('Type the email and password into their respective input fields');
      await page.fill(SELECTORS.LOGIN_EMAIL, credentials.username);
      await page.fill(SELECTORS.LOGIN_PASSWORD, credentials.password);

      //Click on the Sign-in button to submit the login form
      console.log('Click on the Sign-in button to submit the login form');
      await page.click(SELECTORS.LOGIN_BUTTON);

      //Wait for the main page to load after a successful login
      console.log('Wait for the main page to load after a successful login');
      await page.waitForSelector(SELECTORS.AVATAR_ICON);
    } catch (err) {
      console.error('loginToLinkedIn error:', err);
    }
  },

  getCookies: async function (page) {
    try {
      // Log cookies
      const cookies = await page.context().cookies();
      console.log('Cookies:', cookies);
    } catch (err) {
      console.error('getCookies error:', err);
    }
  },

  getLocalStorage: async function (page) {
    try {
      // Log local storage
      const localStorageData = await page.evaluate(() => window.localStorage);
      console.log('Local Storage:', localStorageData);
    } catch (err) {
      console.error('getLocalStorage error:', err);
    }
  },

  searchOnLinkedIn: async function (page, searchQuery) {
    try {
      // Type the search query in the search box and press Enter
      console.log('Type the search query in the search box and press Enter');
      await page.fill(SELECTORS.SEARCH_BOX, searchQuery);
      await page.keyboard.press('Enter');

      // Wait for the search results page to load
      console.log('Wait for the search results page to load');
      await page.waitForSelector(SELECTORS.SEARCH_RESULTS);
    } catch (err) {
      console.error('searchOnLinkedIn error:', err);
    }
  },

  closeBrowser: async function (browser) {
    if (browser) {
      //Closing the browser instance
      console.log('Closing the browser instance');
      await browser.close();
    }
  },
};
