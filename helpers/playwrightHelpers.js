const { chromium } = require('playwright');
const SELECTORS = require('./linkedinSelectors');
require('dotenv').config();

module.exports = {
  // Create a browser instance, open a new page
  launchBrowserWithPage: async function () {
    try {
      const browser = await chromium.launch({ headless: false });
      const page = await browser.newPage();
      return { browser, page };
    } catch (err) {
      console.error('launchBrowserWithPage error:', err);
    }
  },

  // Login to LinkedIn profile
  loginToLinkedIn: async function (page) {
    try {
      //Navigate to the LinkedIn login page
      await page.goto('https://www.linkedin.com/login');
      await page.waitForSelector(SELECTORS.LOGIN_BUTTON);

      //Type the email and password into their respective input fields
      await page.fill(SELECTORS.LOGIN_EMAIL, process.env.EMAIL);
      await page.fill(SELECTORS.LOGIN_PASSWORD, process.env.PASSWORD);

      //Click on the Sign-in button to submit the login form
      await page.click(SELECTORS.LOGIN_BUTTON);

      //Wait for the main page to load after a successful login
      await page.waitForSelector(SELECTORS.AVATAR_ICON_MAIN);
    } catch (err) {
      console.error('loginToLinkedIn error:', err);
    }
  },

  // Logout from LinkedIn profile
  logoutFromLinkedIn: async function (page) {
    try {
      //Click on the avatar icon to open the user menu
      await page.click(SELECTORS.AVATAR_ICON_MAIN);
      await page.waitForSelector(SELECTORS.SIGNOUT_BUTTON_USER_MENU);

      //Click on 'Sign out' button in the user menu
      await page.click(SELECTORS.SIGNOUT_BUTTON_USER_MENU);
      //Wait for the logout page to load after a successful login
      await page.waitForSelector(SELECTORS.SUBMIT_BUTTON);
    } catch (err) {
      console.error('logoutFromLinkedIn error:', err);
    }
  },

  // Get Cookies
  getCookies: async function (page) {
    try {
      const cookies = await page.context().cookies();
      return cookies;
    } catch (err) {
      console.error('getCookies error:', err);
    }
  },

  // Get and log local storage
  getLocalStorage: async function (page) {
    try {
      // Log local storage
      const localStorageData = await page.evaluate(() => window.localStorage);
      return localStorageData;
    } catch (err) {
      console.error('getLocalStorage error:', err);
    }
  },

  // Search by query
  searchOnLinkedIn: async function (page, searchQuery) {
    try {
      // Type the search query in the search box and press Enter
      await page.fill(SELECTORS.SEARCH_BOX, searchQuery);
      await page.keyboard.press('Enter');
    } catch (err) {
      console.error('searchOnLinkedIn error:', err);
    }
  },

  // Follow multiple profiles
  followMultipleProfiles: async function (page, profileLinks) {
    for (const link of profileLinks) {
      try {
        await page.goto(link);
        // Click the follow button if it's available on the page
        await page.waitForSelector(SELECTORS.FOLLOW_BUTTON, { timeout: 5000 });
        await page.click(SELECTORS.FOLLOW_BUTTON);
        await page.waitForSelector(SELECTORS.UNFOLLOW_BUTTON, { timeout: 5000 });
      } catch (error) {}
    }
  },

  // Unfollow multiple profiles
  unfollowMultipleProfiles: async function (page, profileLinks) {
    for (const link of profileLinks) {
      try {
        await page.goto(link);
        // Click the unfollof button if it's available on the page
        await page.waitForSelector(SELECTORS.UNFOLLOW_BUTTON, { timeout: 5000 });
        await page.click(SELECTORS.UNFOLLOW_BUTTON);

        // Click the unfollof button if it's available on the unfollof modal
        await page.waitForSelector(SELECTORS.CONFIRMATION_BUTTON, { timeout: 5000 });
        await page.click(SELECTORS.CONFIRMATION_BUTTON);
        await page.waitForSelector(SELECTORS.FOLLOW_BUTTON, { timeout: 5000 });
      } catch (error) {}
    }
  },

  // Close browser
  closeBrowser: async function (browser) {
    try {
      if (browser) {
        // Closing the browser instance
        await browser.close();
      }
    } catch (error) {}
  },
};
