const { test, expect } = require('@playwright/test');
const GoogleHomePage = require('./pages/googleHomePage');

test.describe("Search results testing for query 'Playwright'", () => {
  let googleHomePage;

  // Navigate to Home page and reject all Cookies before each test in this block
  test.beforeEach(async ({ page }) => {
    googleHomePage = new GoogleHomePage(page);
    await googleHomePage.navigate();
    await googleHomePage.rejectAllCookies();
  });

  test('Google search results page contains query', async ({ page }) => {
    await googleHomePage.searchFor('Playwright');

    // Check if each search result actually contains query in its text
    const searchResults = await googleHomePage.getSearchResults();
    const doesEachSearchResultContainQuery = await googleHomePage.validateSearchResultsContainQuery(
      searchResults,
      'Playwright'
    );
    expect(doesEachSearchResultContainQuery).toBe(true, 'Not each search result contains query');
  });

  test("Google search results page contains more than 10 results for 'Playwright' query", async ({ page }) => {
    await googleHomePage.searchFor('Playwright');

    // Checking if the search results page contains more than 10 results for 'Playwright' query
    const searchResults = await googleHomePage.getSearchResults();

    expect(searchResults.length).toBeGreaterThan(
      10,
      "Search results page doesn't contain more than 10 results for 'Playwright' query"
    );
  });
});
