import { expect } from '@playwright/test';
import test from '../hooks/testWithAfterEachHooks.mjs';
import GoogleHomeCalculatorPage from './pages/googleHomeCalculatorPage';
import { mathOperation } from './test-data/mathOperation';

test.describe(`Google calculator`, () => {
  let page; // Page instance
  let googleHomeCalculatorPage; // Page object instance

  // Navigate to Home page, reject all Cookies and search the 'calculator' query
  test.beforeEach(
    `Navigate to Home page, reject all Cookies and search the 'calculator' query`,
    async ({ sharedContext }) => {
      page = await sharedContext.newPage();
      const isMobile = sharedContext._options.isMobile || false; // type of device is mobile
      googleHomeCalculatorPage = new GoogleHomeCalculatorPage(page, isMobile);
      await googleHomeCalculatorPage.navigateAndRejectCookies();
      await googleHomeCalculatorPage.searchForQueryByEnter('calculator');
    }
  );

  test.only(`Google calculator is visiable on the Home page`, async () => {
    // Check if the Google calculator is visiable
    const calculatorLocator = page.locator(googleHomeCalculatorPage.selectors.calculatorScreen);
    await expect(calculatorLocator).toBeVisible();
  });

  // mathOperation.forEach((queryData) => {
  //   test(`Response body contains '${queryData.query}' query`, async () => {
  //     // Start waiting for response
  //     const responsePromise = googleHomeCalculatorPage.waitForSearchResponse();
  //     // Search for query
  //     await googleHomeCalculatorPage.searchForQueryByEnter(queryData.query);
  //     const response = await responsePromise;

  //     // Check if status is 200
  //     expect(response.status()).toEqual(200);

  //     // Check if response body starts with <!doctype html>
  //     const responseBody = await response.text();
  //     expect(responseBody.startsWith('<!doctype html>')).toBeTruthy();

  //     // Check if the body contains at least 1 instance of query
  //     const count = await googleHomeCalculatorPage.countQueryInBody(queryData.query);
  //     expect(count).toBeGreaterThanOrEqual(1, `The html body doesn't contains the query`);
  //   });
  // });
});
