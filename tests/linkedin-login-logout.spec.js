const { chromium } = require('playwright');
const credentials = require('../credentials');

(async () => {
  //Create a browser instance, open a new page, and navigate to the LinkedIn login page
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();
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

  //Click on the avatar icon to open the user menu
  console.log('Click on the avatar icon to open the user menu');
  await page.click('.global-nav__primary-link-me-menu-trigger');
  await page.waitForSelector('.global-nav__secondary-link.mv1');

  //Click on 'Sign out' button in the user menu
  console.log("Click on 'Sign out' button in the user menu");
  await page.click('.global-nav__secondary-link.mv1');
  await page.waitForSelector('.full-width.mt4', { state: 'visible' });

  //Click on 'Sign out' button on the modal
  console.log("Click on 'Sign out' button on the modal");
  await page.click('.full-width.mt4');
  await page.waitForSelector('[data-id="sign-in-form__submit-btn"]');

  //Close the browser instance
  console.log('Close the browser instance');
  await browser.close();
})();
