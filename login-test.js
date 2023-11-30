const { chromium } = require('playwright');

async function loginAutomation() {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();
  await page.goto('https://the-internet.herokuapp.com/login');

  await page.fill('#username', 'tomsmith');
  await page.fill('#password', 'SuperSecretPassword!');
  await page.click('button[type="submit"]');

  await page.waitForSelector('.flash.success', { timeout: 5000 });

  console.log('Login successful');

  await browser.close();
}

loginAutomation();
