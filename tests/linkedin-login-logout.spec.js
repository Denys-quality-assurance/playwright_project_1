const { credentials } = require('../helpers/credentials');
const SELECTORS = require('../helpers/linkedinSelectors');
const { launchBrowserWithPage, closeBrowser } = require('../helpers/linkedinHelpers');

(async () => {
  let browser;
  try {
    // Create a browser instance, open a new page
    const { browser: newBrowser, page } = await launchBrowserWithPage();
    browser = newBrowser;

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
    await page.waitForSelector(SELECTORS.AVATAR_ICON_MAIN);

    //Click on the avatar icon to open the user menu
    console.log('Click on the avatar icon to open the user menu');
    await page.click(SELECTORS.AVATAR_ICON_MAIN);
    await page.waitForSelector(SELECTORS.SIGNOUT_BUTTON_USER_MENU);

    //Click on 'Sign out' button in the user menu
    console.log("Click on 'Sign out' button in the user menu");
    await page.click(SELECTORS.SIGNOUT_BUTTON_USER_MENU);
    await page.waitForSelector(SELECTORS.SUBMIT_BUTTON);
  } catch (err) {
    console.error('Error occurred:', err);
  } finally {
    // Closing the browser instance
    await closeBrowser(browser);
  }
})();
