/*
 * Google Custom Search Engine Test Suite:
 * This suite tests the functionality of the Google custom search engine.
 *
 * The suite utilizes a page object model (GoogleCustomSearchEnginePage) representing the Google search engine frame.
 *
 * Each test begins by initializing a new page instance and a related GoogleCustomSearchEnginePage object instance.
 * The testing process then involves searching the 'query' in the Google search engine within the frame.
 * Helper methods for Google search engine interactions are present in the GoogleCustomSearchEnginePage class.
 *
 * The data for the search queries is imported from queryData and can be used with Data-driven testing (DDT) approach.
 *
 */

import { expect } from '@playwright/test';
import test from '../../../hooks/testWithAfterEachHooks.mjs';
import GoogleCustomSearchEnginePage from '../../pages/googleCustomSearchEngineIframe';
import { queryDataGeneral } from '../../test-data/googleSearch/queryData';

const testStatus = {
  SKIPPED: 'skipped',
};

const query = queryDataGeneral[0].query;

test.describe(`Google Custom Search Engine: Search results testing for '${query}' query @only-desktop`, () => {
  // Test should be failed when the condition is true: there is at least 1 unfixed bug
  test.fail(
    ({ shouldFailTest }) => shouldFailTest > 0,
    `Test marked as "should fail" due to the presence of unfixed bug(s)`
  );
  // Test should be skipped when the condition is true: flag skipTestsWithKnownBugs is 'true' and there is at least 1 unfixed bug
  test.skip(
    ({ shouldSkipTest }) => shouldSkipTest,
    `Test skipped due to the presence of unfixed bug(s)`
  );

  let googleCSEPage; // Page object instance
  test.use({ baseURL: 'https://www.steegle.com/' }); // Set a specific base URL for this test

  // Navigate to Google Custom Search Engine page and init iFrame
  test.beforeEach(
    'Navigate to Google Custom Search Engine page and init iFrame',
    async ({ sharedContext }, testInfo) => {
      // Prepare the test only if the test is not skipped
      if (testInfo.expectedStatus !== testStatus.SKIPPED) {
        const page = await sharedContext.newPage();
        const isMobile = sharedContext._options.isMobile || false; // type of device is mobile
        googleCSEPage = new GoogleCustomSearchEnginePage(page, isMobile);
        await googleCSEPage.selectFrame();
      }
    }
  );

  test(`TEST-26: Google CSE search results page contains '${query}' query`, async () => {
    await googleCSEPage.searchForQueryByEnter(
      query,
      googleCSEPage.iFrameHandler
    );
    // Check if each search result actually contains the query in its text
    const searchResultsLocator = await googleCSEPage.getSearchResultsLocator(
      googleCSEPage.iFrameHandler
    );
    const checkQueryResults =
      await googleCSEPage.checkIfAllSearchResultsContainQuery(
        searchResultsLocator,
        query
      );
    const errorMessage = `Some search results do not contain the '${
      checkQueryResults.failedQuery
    }' query.\nText of the results:\n\n${checkQueryResults.failedResultText.join('\n----------------------\n\n')}'`;

    expect(checkQueryResults.isSuccess, errorMessage).toBe(true);
  });

  test(`TEST-27: Google search results page contains 10 results on 1 page for '${query}' query`, async () => {
    await googleCSEPage.searchForQueryByEnter(
      query,
      googleCSEPage.iFrameHandler
    );
    // Checking if the search results page contains 10 results on 1 page for the query
    const searchResultsLocator = await googleCSEPage.getSearchResultsLocator(
      googleCSEPage.iFrameHandler
    );
    expect(
      await searchResultsLocator.count(),
      `Search results page doesn't contain 10 results on 1 page for '${query}' query`
    ).toBe(10);
  });
});
