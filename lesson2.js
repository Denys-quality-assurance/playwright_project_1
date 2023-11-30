const { chromium } = require('playwright');

async function runAutomation() {
  //Launch the browser, open a new page, and navigate to DuckDuckGo
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();
  await page.goto('https://duckduckgo.com/');

  //Enter a search query and hit Enter
  await page.fill('#searchbox_input', 'Playwright tutorial');
  await page.press('#searchbox_input', 'Enter');

  //Wait for the search results to load
  await page.waitForSelector('.react-results--main [data-testid="result-title-a"]', { timeout: 5000 });

  //Extract URLs from search results and print them
  const urls = await page.$$eval('.react-results--main [data-testid="result-title-a"]', (links) =>
    links.map((link) => link.href)
  );
  console.log(urls);

  //Close the browser after completion
  await browser.close();
}

runAutomation();
