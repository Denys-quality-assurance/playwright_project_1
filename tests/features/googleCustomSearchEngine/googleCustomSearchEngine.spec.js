import { expect } from '@playwright/test';
import test from '../../../hooks/testWithAfterEachHooks.mjs';
import GoogleCustomSearchEnginePage from '../../pages/googleCustomSearchEngineIframe';
import { queryDataGeneral } from '../../test-data/googleSearch/queryData';
const query = queryDataGeneral[0].query;

test.describe.only(`Google Custom Search Engine: Search results testing for '${query}' query`, () => {
  let googleCSEPage; // Page object instance
  test.use({ baseURL: 'https://www.steegle.com/' }); // Set a specific base URL for this test

  // Navigate to Google Custom Search Engine page and init iFrame
  test.beforeEach(
    'Navigate to Google Custom Search Engine page and init iFrame',
    async ({ sharedContext }, testInfo) => {
      if (testInfo.expectedStatus !== 'skipped') {
        const page = await sharedContext.newPage();
        googleCSEPage = new GoogleCustomSearchEnginePage(page);
        await googleCSEPage.selectFrame();
      }
    }
  );

  test(`Google CSE search results page contains '${query}' query`, async () => {
    await googleCSEPage.searchFor(query);

    // Check if each search result actually contains the query in its text
    const searchResults = await googleCSEPage.getSearchResultElements();
    const checkQueryResults = await googleCSEPage.checkIfAllSearchResultsContainQuery(searchResults, query);
    expect(
      checkQueryResults.success,
      `Search result text\n${checkQueryResults.failedResultText}\n\ndoes not contain the query\n'${checkQueryResults.failedQuery}'`
    ).toBe(true);
  });

  test(`Google search results page contains 10 results on 1 page for '${query}' query`, async () => {
    await googleCSEPage.searchFor(query);

    // Checking if the search results page contains 10 results on 1 page for the query
    const searchResults = await googleCSEPage.getSearchResultElements();
    expect(searchResults.length, `Search results page doesn't contain 10 results on 1 page for the query`).toBe(10);
  });
});
