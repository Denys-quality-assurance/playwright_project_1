const { chromium } = require('playwright');

async function loginAutomation() {
  //Launch the browser, open a new page, and navigate to the-internet.herokuapp.com
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  await page.goto('https://the-internet.herokuapp.com/login');

  //Submit username and password
  await page.fill('#username', 'tomsmith');
  await page.fill('#password', 'SuperSecretPassword!');
  await page.click('button[type="submit"]');

  //Wait for success modal
  await page.waitForSelector('.flash.success', { timeout: 5000 });

  console.log('Login successful');

  //Close the browser after completion
  await browser.close();
}

loginAutomation();
