const { test, expect } = require('@playwright/test');
const GoogleHomePage = require('./pages/googleHomePage');
const query = 'Playwright';

test.describe(`Google Home Page: Search results testing for query 'Playwright'`, () => {
  let googleHomePage;
  let page2;

  // Navigate to Home page, reject all Cookies and search the query before each test in this block
  test.beforeEach(async ({ page }) => {
    googleHomePage = new GoogleHomePage(page);
    await googleHomePage.navigateAndSearch(query);
  });

  // Close the 2nd page if it's needed
  test.afterEach(async () => {
    if (page2) {
      await page2.close();
    }
  });

  test(`Google search results page contains query`, async () => {
    // Check if each search result actually contains query in its text
    const searchResults = await googleHomePage.getSearchResults();
    const doesEachSearchResultContainQuery = await googleHomePage.validateSearchResultsContainQuery(
      searchResults,
      query
    );
    expect(doesEachSearchResultContainQuery).toBe(true, 'At least one search result does not contain the query');
  });

  test(`Google search results page contains more than 10 results for 'Playwright' query`, async () => {
    // Checking if the search results page contains more than 10 results for 'Playwright' query
    const searchResults = await googleHomePage.getSearchResults();
    expect(searchResults.length).toBeGreaterThan(
      10,
      `Search results page doesn't contain more than 10 results for 'Playwright' query`
    );
  });

  test(`Compare search results from two pages with the same query`, async ({ context }) => {
    // Create the 2nd page, navigate to Home page and search the query
    const page2 = await context.newPage();
    const googleHomePage2 = new GoogleHomePage(page2);
    await googleHomePage2.navigateAndSearch(query);

    // Get search results for the page 1
    const searchResults1 = await googleHomePage.getSearchResults();
    const searchResultsTexts1 = await googleHomePage.getTextContent(searchResults1);

    // Get search results for the page 2
    const searchResults2 = await googleHomePage2.getSearchResults();
    const searchResultsTexts2 = await googleHomePage2.getTextContent(searchResults2);

    // Compare the search results from both pages
    expect(searchResultsTexts1).toEqual(
      searchResultsTexts2,
      `Search results from two pages with the same query are not equal`
    );
  });
});
