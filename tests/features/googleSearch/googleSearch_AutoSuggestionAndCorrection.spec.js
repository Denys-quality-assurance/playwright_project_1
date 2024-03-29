/*
 * Google Search Test Suite:
 * This test suite aims to verify the functionality of key Google Search features
 * - 'Auto-suggestion' and 'Search Query Correction'.
 *
 * In the setup, a new page instance and a Google Search page object instance are created, and cookies are rejected.
 *
 * Helper functions and selectors are encapsulated in 'GoogleSearchPage' class.
 *
 *  The data for the search queries is imported from queryData and can be used with Data-driven testing (DDT) approach.
 *
 */

import { expect } from '@playwright/test';
import test from '../../../hooks/testWithAfterEachHooks.mjs';
import GoogleSearchPage from '../../pages/googleSearchPage';
import {
  queryDataAutoSuggestion,
  queryDataMisspelled,
} from '../../test-data/googleSearch/queryData';
import {
  performSearchAndFetchResultsForNewPage,
  goToHomeForNewPage,
} from '../../../utilities/pagesHelper';

const testStatus = {
  SKIPPED: 'skipped',
};

test.describe(`Google Search results: Auto-suggestion and Correction`, () => {
  // Test should be failed when the condition is true: there is at least 1 unfixed bug
  test.fail(
    ({ shouldFailTest }) => shouldFailTest,
    `Test marked as "should fail" due to the presence of unfixed bug(s)`
  );
  // Test should be skipped when the condition is true: flag skipTestsWithKnownBugs is 'true' and there is at least 1 unfixed bug
  test.skip(
    ({ shouldSkipTest }) => shouldSkipTest,
    `Test skipped due to the presence of unfixed bug(s)`
  );

  let page; // Page instance
  let googleSearchPage; // Page object instance

  // Navigate to Home page and reject all Cookies
  test.beforeEach(
    'Navigate to Home page and reject all Cookies',
    async ({ sharedContext }, testInfo) => {
      // Prepare the test only if the test is not skipped
      if (testInfo.expectedStatus !== testStatus.SKIPPED) {
        page = await sharedContext.newPage();
        const isMobile = sharedContext._options.isMobile || false; // type of device is mobile
        googleSearchPage = new GoogleSearchPage(page, isMobile);
        await googleSearchPage.goToHomeAndRejectCookies();
      }
    }
  );

  queryDataMisspelled.forEach((queryData) => {
    test(`TEST-20: Google search results page contains the corrected '${queryData.correctedQuery}' query when the query '${queryData.query}' is misspelled @results @correction`, async ({}) => {
      // Search for query
      await googleSearchPage.searchForQueryByEnter(queryData.query);
      await page.waitForSelector(googleSearchPage.selectors.searchResult);
      // Check if the message "Showing results for <correcter query> contains the corrected query
      const correctedQueryLocatorText =
        await googleSearchPage.getCorrectedQueryFormMessageText();
      expect(
        correctedQueryLocatorText,
        `The message "Showing results for <correcter query>" doesn't contain the corrected '${queryData.correctedQuery}' query`
      ).toContain(queryData.correctedQuery);
      // Check if each search result actually contains query in its text
      const searchResultsLocator =
        await googleSearchPage.getSearchResultsLocator();
      const checkQueryResults =
        await googleSearchPage.checkIfAllSearchResultsContainQuery(
          searchResultsLocator,
          queryData.correctedQuery
        );
      const errorMessage = `Some search results do not contain the corrected '${
        checkQueryResults.failedQuery
      }' query.\nText of the results:\n\n${checkQueryResults.failedResultText.join('\n----------------------\n\n')}'`;

      expect(checkQueryResults.isSuccess, errorMessage).toBe(true);
    });
  });

  queryDataAutoSuggestion.forEach((queryData) => {
    test(`TEST-21: Auto-suggestion menu contains approptiate options for '${queryData.query}' query @autosuggestion`, async () => {
      // Navigate to page and reject all Cookies if it's needed
      await googleSearchPage.goToHomeAndRejectCookies();
      // Type the query
      await page.waitForSelector(
        googleSearchPage.selectors.searchInputTextArea
      );
      await page.fill(
        googleSearchPage.selectors.searchInputTextArea,
        queryData.query
      );
      // Get Search auto suggestions text
      const searchAutoSuggestionOptionsText =
        await googleSearchPage.getSearchAutoSuggestionOptions();
      // Check if any auto-suggestion contains the expected approptiate option
      const doesAnyAutoSuggestionOptionContainQuery =
        await googleSearchPage.checkIfAnyAutoSuggestionOptionContainQuery(
          searchAutoSuggestionOptionsText,
          queryData.autoSuggestion
        );
      expect(
        doesAnyAutoSuggestionOptionContainQuery,
        `No auto-suggestion option contains the expected approptiate option '${queryData.autoSuggestion}`
      ).toBe(true);
    });
  });

  queryDataAutoSuggestion.forEach((queryData) => {
    test(`TEST-22: User can get the same search results for the same '${queryData.autoSuggestion}' query by pressing enter or clicking on auto-suggestion option @only-desktop @results @autosuggestion @query_submitting`, async ({
      sharedContext,
    }) => {
      // Create new page 1 in the same context, search for the query in lower case and get the text content of the results
      const searchResultsTexts1 = await performSearchAndFetchResultsForNewPage(
        sharedContext,
        queryData.autoSuggestion,
        GoogleSearchPage
      );
      // Create new page 2 in the same context, navigate to Home page and reject all Cookies if it's needed
      const { googleSearchPage: googleSearchPage2 } = await goToHomeForNewPage(
        sharedContext,
        GoogleSearchPage
      );
      // Fill Search imput
      await googleSearchPage2.fillSearchInput(queryData.query);
      // Get Search auto suggestions
      const autoSuggestionOptionsLocator =
        await googleSearchPage2.getSearchAutoSuggestionOptionsLocator();
      // Get the 1st option element with expected query
      const elementsWithQuery =
        await googleSearchPage2.getFirstElementWithQuery(
          autoSuggestionOptionsLocator,
          queryData.autoSuggestion
        );
      // Click or tap the auto-suggestion option and get search results
      await googleSearchPage2.clickOrTap(elementsWithQuery);
      const searchResultsLocator2 =
        await googleSearchPage2.getSearchResultsLocator();
      const searchResultsTexts2 = await googleSearchPage2.getTextContent(
        searchResultsLocator2
      );

      // Compare the search results from both pages
      expect(
        searchResultsTexts1,
        `Search results are not the same for the same '${queryData.autoSuggestion}' query submitted by pressing enter and selecting the auto-suggest option`
      ).toEqual(searchResultsTexts2);
    });
  });
});
