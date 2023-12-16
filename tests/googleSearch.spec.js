const { test, expect } = require('@playwright/test');
const GoogleHomePage = require('./pages/googleHomePage');

test.describe(`Google Home Page: Search results testing for query 'Playwright'`, () => {
  let googleHomePage;

  // Navigate to Home page and reject all Cookies before each test in this block
  test.beforeEach(async ({ page, context }) => {
    googleHomePage = new GoogleHomePage(page);
    await googleHomePage.navigate();
    await googleHomePage.rejectAllCookies();
  });

  test(`Google search results page contains query`, async () => {
    await googleHomePage.searchFor('Playwright');

    // Check if each search result actually contains query in its text
    const searchResults = await googleHomePage.getSearchResults();
    const doesEachSearchResultContainQuery = await googleHomePage.validateSearchResultsContainQuery(
      searchResults,
      'Playwright'
    );
    expect(doesEachSearchResultContainQuery).toBe(true, 'At least one search result does not contain the query');
  });

  test(`Google search results page contains more than 10 results for 'Playwright' query`, async () => {
    await googleHomePage.searchFor('Playwright');

    // Checking if the search results page contains more than 10 results for 'Playwright' query
    const searchResults = await googleHomePage.getSearchResults();
    expect(searchResults.length).toBeGreaterThan(
      10,
      `Search results page doesn't contain more than 10 results for 'Playwright' query`
    );
  });

  test.only(`Compare search results from two pages with the same query`, async ({ context }) => {
    await googleHomePage.searchFor('Playwright');
    const searchResults1 = await googleHomePage.getSearchResults();
    const searchResultsTexts1 = await googleHomePage.getTextContent(searchResults1);
    console.log('searchResults1', searchResultsTexts1);

    const page2 = await context.newPage();
    const googleHomePage2 = new GoogleHomePage(page2);
    await googleHomePage2.navigate();
    await googleHomePage2.searchFor('Playwright');
    const searchResults2 = await googleHomePage2.getSearchResults();
    const searchResultsTexts2 = await googleHomePage2.getTextContent(searchResults2);
    console.log('searchResults2', searchResultsTexts2);

    // Compare the search results from both pages
    expect(searchResultsTexts1).toEqual(
      searchResultsTexts2,
      `Search results from two pages with the same query are not equal`
    );
  });
});
