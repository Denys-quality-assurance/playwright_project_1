const SELECTORS = require('./selectors');

module.exports = {
  // Login to LinkedIn profile
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

  // Get and log Coolies
  getCookies: async function (page) {
    try {
      // Log cookies
      const cookies = await page.context().cookies();
      console.log('Cookies:', cookies);
    } catch (err) {
      console.error('getCookies error:', err);
    }
  },

  // Get and log local storage
  getLocalStorage: async function (page) {
    try {
      // Log local storage
      const localStorageData = await page.evaluate(() => window.localStorage);
      console.log('Local Storage:', localStorageData);
    } catch (err) {
      console.error('getLocalStorage error:', err);
    }
  },

  // Search by query
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

  // Follow multiple profiles
  followMultipleProfiles: async function (page, profileLinks) {
    for (const link of profileLinks) {
      try {
        await page.goto(link);
        // Click the follow button if it's available on the page
        console.log("Click the follow button if it's available on the page");
        await page.waitForSelector(SELECTORS.FOLLOW_BUTTON, { timeout: 5000 });
        await page.click(SELECTORS.FOLLOW_BUTTON);
        await page.waitForSelector(SELECTORS.UNFOLLOW_BUTTON, { timeout: 5000 });

        console.log(`Following ${link}`);
      } catch (error) {
        console.log(`Couldn't follow ${link}`);
      }
    }
  },

  // Unfollow multiple profiles
  unfollowMultipleProfiles: async function (page, profileLinks) {
    for (const link of profileLinks) {
      try {
        await page.goto(link);
        // Click the unfollof button if it's available on the page
        console.log("Click the unfollof button if it's available on the page");
        await page.waitForSelector(SELECTORS.UNFOLLOW_BUTTON, { timeout: 5000 });
        await page.click(SELECTORS.UNFOLLOW_BUTTON);

        // Click the unfollof button if it's available on the unfollof modal
        console.log("Click the unfollof button if it's available on the unfollof modal");
        await page.waitForSelector(SELECTORS.UNFOLLOW_BUTTON_MODAL, { timeout: 5000 });
        await page.click(SELECTORS.UNFOLLOW_BUTTON_MODAL);
        await page.waitForSelector(SELECTORS.FOLLOW_BUTTON, { timeout: 5000 });

        console.log(`Unfollowed ${link}`);
      } catch (error) {
        console.log(`Couldn't unfollow ${link}`);
      }
    }
  },

  // Close browser
  closeBrowser: async function (browser) {
    if (browser) {
      //Closing the browser instance
      console.log('Closing the browser instance');
      await browser.close();
    }
  },
};
