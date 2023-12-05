module.exports = {
  loginToLinkedIn: async function (page, credentials) {
    //Navigate to the LinkedIn login page
    await page.goto('https://www.linkedin.com/login');
    //Type the email and password into their respective input fields
    console.log('Type the email and password into their respective input fields');
    await page.waitForSelector('.login__form_action_container button');
    await page.fill('#username', credentials.username);
    await page.fill('#password', credentials.password);

    //Click on the Sign-in button to submit the login form
    console.log('Click on the Sign-in button to submit the login form');
    await page.click('.login__form_action_container button');

    //Wait for the main page to load after a successful login
    console.log('Wait for the main page to load after a successful login');
    await page.waitForSelector('.global-nav__primary-link-me-menu-trigger');
  },

  getCookies: async function (page) {
    // Log cookies
    const cookies = await page.context().cookies();
    console.log('Cookies:', cookies);
  },

  getLocalStorage: async function (page) {
    // Log local storage
    const localStorageData = await page.evaluate(() => window.localStorage);
    console.log('Local Storage:', localStorageData);
  },

  searchOnLinkedIn: async function (page, searchQuery) {
    // Type the search query in the search box and press Enter
    console.log('Type the search query in the search box and press Enter');
    await page.fill('input.search-global-typeahead__input', searchQuery);
    await page.keyboard.press('Enter');

    // Wait for the search results page to load
    console.log('Wait for the search results page to load');
    await page.waitForSelector('.reusable-search__entity-result-list');
  },
};
