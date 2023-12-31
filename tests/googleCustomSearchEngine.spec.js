import { expect } from '@playwright/test';
import test from '../hooks/testWithAfterEachHooks.mjs';
import GoogleCustomSearchEnginePage from './pages/googleCustomSearchEngineIframe';
const query = 'Google';

test.describe(`Google Custom Search Engine: Search results testing for query 'Google'`, () => {
  let googleCSEPage; // Page object instance

  // Navigate to Google Custom Search Engine page and init iFrame
  test.beforeEach(async ({ sharedContext }) => {
    const page = await sharedContext.newPage();
    googleCSEPage = new GoogleCustomSearchEnginePage(page);
    await googleCSEPage.init();
  });

  test(`Google CSE search results page contains query`, async () => {
    await googleCSEPage.searchFor(query);

    // Check if each search result actually contains query in its text
    const searchResults = await googleCSEPage.getSearchResults();
    const doesEachSearchResultContainQuery = await googleCSEPage.checkIfSearchResultsContainQuery(searchResults, query);
    expect(doesEachSearchResultContainQuery).toBe(true, `At least one search result does not contain the query`);
  });

  test(`Google search results page contains 10 results on 1 page for 'Google' query`, async () => {
    await googleCSEPage.searchFor(query);

    // Checking if the search results page contains 10 results on 1 page for 'Google' query
    const searchResults = await googleCSEPage.getSearchResults();
    expect(searchResults.length).toBe(
      10,
      `Search results page doesn't contain 10 results on 1 page for 'Google' query`
    );
  });
});
