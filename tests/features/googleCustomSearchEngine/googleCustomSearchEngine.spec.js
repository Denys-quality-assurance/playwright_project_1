import { expect } from '@playwright/test';
import test from '../../../hooks/testWithAfterEachHooks.mjs';
import GoogleCustomSearchEnginePage from '../../pages/googleCustomSearchEngineIframe';
import { queryDataGeneral } from '../../test-data/googleSearch/queryData';
const query = queryDataGeneral[0].query;

test.describe.only(`Google Custom Search Engine: Search results testing for '${query}' query @only-desktop`, () => {
  let googleCSEPage; // Page object instance
  test.use({ baseURL: 'https://www.steegle.com/' }); // Set a specific base URL for this test

  // Navigate to Google Custom Search Engine page and init iFrame
  test.beforeEach(
    'Navigate to Google Custom Search Engine page and init iFrame',
    async ({ sharedContext }, testInfo) => {
      if (testInfo.expectedStatus !== 'skipped') {
        const page = await sharedContext.newPage();
        const isMobile = sharedContext._options.isMobile || false; // type of device is mobile
        googleCSEPage = new GoogleCustomSearchEnginePage(page, isMobile);
        await googleCSEPage.selectFrame();
      }
    }
  );

  test(`TEST-26: Google CSE search results page contains '${query}' query`, async () => {
    await googleCSEPage.searchForQueryByEnter(query, googleCSEPage.frame);

    // Check if each search result actually contains the query in its text
    const searchResults = await googleCSEPage.getSearchResultElements(googleCSEPage.frame);
    const checkQueryResults = await googleCSEPage.checkIfAllSearchResultsContainQuery(searchResults, query);
    const errorMessage = `Some search results do not contain the '${
      checkQueryResults.failedQuery
    }' query.\nText of the results:\n\n${checkQueryResults.failedResultText.join('\n----------------------\n\n')}'`;

    expect(checkQueryResults.success, errorMessage).toBe(true);
  });

  test(`TEST-27: Google search results page contains 10 results on 1 page for '${query}' query`, async () => {
    await googleCSEPage.searchForQueryByEnter(query, googleCSEPage.frame);

    // Checking if the search results page contains 10 results on 1 page for the query
    const searchResults = await googleCSEPage.getSearchResultElements(googleCSEPage.frame);
    expect(searchResults.length, `Search results page doesn't contain 10 results on 1 page for '${query}' query`).toBe(
      10
    );
  });
});
