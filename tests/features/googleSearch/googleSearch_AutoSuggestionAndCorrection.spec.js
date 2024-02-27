import { expect } from '@playwright/test';
import test from '../../../hooks/testWithAfterEachHooks.mjs';
import GoogleHomePage from '../../pages/googleHomePage';
import { queryDataAutoSuggestion, queryDataMisspelled } from '../../test-data/queryData';
import { performSearchAndFetchResultsForNewPage, navigateHomeForNewPage } from '../../../utilities/pagesHelper';

test.describe(`Google Search results: Search results`, () => {
  let page; // Page instance
  let googleHomePage; // Page object instance

  // Navigate to Home page and reject all Cookies
  test.beforeEach('Navigate to Home page and reject all Cookies', async ({ sharedContext }) => {
    page = await sharedContext.newPage();
    const isMobile = sharedContext._options.isMobile || false; // type of device is mobile
    expectedLocalStorageKeys = isMobile ? expectedLocalStorageKeysData.mobile : expectedLocalStorageKeysData.desktop; // expectedLocalStorageKeys for mobile and for desktop
    googleHomePage = new GoogleHomePage(page, isMobile);
    await googleHomePage.navigateAndRejectCookies();
  });

  queryDataMisspelled.forEach((queryData) => {
    test(`Google search results page contains the corrected '${queryData.correctedQuery}' query when the query '${queryData.query}' is misspelled`, async () => {
      // Search for query
      await googleHomePage.searchForQueryByEnter(queryData.query);
      // Check if the message "Showing results for <correcter query> contains the corrected query
      const correctedQueryElementText = await googleHomePage.getCorrectedQueryFormMessageText();
      expect(correctedQueryElementText).toContain(
        queryData.correctedQuery,
        `The message "Showing results for <correcter query>" doesn't contain the corrected query`
      );
      // Check if each search result actually contains query in its text
      const searchResults = await googleHomePage.getSearchResultElements();
      const doesEachSearchResultContainQuery = await googleHomePage.checkIfAllSearchResultsContainQuery(
        searchResults,
        queryData.correctedQuery
      );
      expect(doesEachSearchResultContainQuery).toBe(
        true,
        `At least one search result does not contain the corrected query`
      );
    });
  });

  queryDataAutoSuggestion.forEach((queryData) => {
    test(`Auto-suggestion menu contains approptiate options for '${queryData.query}' query`, async () => {
      // Navigate to page and reject all Cookies if it's needed
      await googleHomePage.navigateAndRejectCookies();
      // Type the query
      await page.waitForSelector(googleHomePage.selectors.searchInputTextArea);
      await page.fill(googleHomePage.selectors.searchInputTextArea, queryData.query);
      // Get Search auto suggestions text
      const searchAutoSuggestionOptionsText = await googleHomePage.getSearchAutoSuggestionOptions();
      // Check if any auto-suggestion contains the expected approptiate option
      const doesAnyAutoSuggestionOptionContainQuery = await googleHomePage.checkIfAnyAutoSuggestionOptionContainQuery(
        searchAutoSuggestionOptionsText,
        queryData.autoSuggestion
      );
      expect(doesAnyAutoSuggestionOptionContainQuery).toBe(
        true,
        `No auto-suggestion option contains the expected approptiate option`
      );
    });
  });

  queryDataAutoSuggestion.forEach((queryData) => {
    test(`User can get the same search results for the same '${queryData.autoSuggestion}' query by pressing enter or clicking on auto-suggestion option @only-desktop`, async ({
      sharedContext,
    }) => {
      // Create new page 1 in the same context, search for the query in lower case and get the text content of the results
      const searchResultsTexts1 = await performSearchAndFetchResultsForNewPage(
        sharedContext,
        queryData.autoSuggestion,
        GoogleHomePage
      );
      // Create new page 2 in the same context, navigate to Home page and reject all Cookies if it's needed
      const { newPage: page2, googleHomePage: googleHomePage2 } = await navigateHomeForNewPage(
        sharedContext,
        GoogleHomePage
      );
      // Fill Search imput
      await googleHomePage2.fillSearchInput(queryData.query);
      // Get Search auto suggestions
      const autoSuggestionOptionElements = await googleHomePage2.getSearchAutoSuggestionOptionElements();
      // Get the 1st option element with expected query
      const elementsWithQuery = await googleHomePage2.getFirstElementWithQuery(
        autoSuggestionOptionElements,
        queryData.autoSuggestion
      );
      // Click or tap the auto-suggestion option and get search results
      await googleHomePage2.clickOrTap(elementsWithQuery);
      const searchResults2 = await googleHomePage2.getSearchResultElements();
      const searchResultsTexts2 = await googleHomePage2.getTextContent(searchResults2);

      // Compare the search results from both pages
      expect(searchResultsTexts1).toEqual(
        searchResultsTexts2,
        `Search results are not the same for the same query submitted by pressing enter and selecting the auto-suggest option`
      );
    });
  });
});
