import { expect } from '@playwright/test';
import test from '../../../hooks/testWithAfterEachHooks.mjs';
import GoogleHomePage from '../../pages/googleHomePage';
import { queryDataGeneral, queryDataCaseInsensitive, queryDataEmptyResults } from '../../test-data/queryData';
import { performSearchAndFetchResultsForNewPage, navigateHomeForNewPage } from '../../../utilities/pagesHelper';
const query = queryDataGeneral[1].query;

test.describe(`Google Search results: Search results verification`, () => {
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

  test(`User can apply video filter on the Empty results page (mocked) and get search results @only-desktop`, async ({
    sharedContext,
  }) => {
    // Mock the search response with Empty Results
    await googleHomePage.mockResponseWithEmptyResults(sharedContext, query);
    // Search for query
    await googleHomePage.searchForQueryByEnter(query);
    // Apply video filter
    await googleHomePage.applyVideFilter();
    // Check if each search result actually contains query in its text
    const searchResults = await googleHomePage.getSearchResultElements();
    const doesEachSearchResultContainQuery = await googleHomePage.checkIfAllSearchResultsContainQuery(
      searchResults,
      query
    );
    expect(doesEachSearchResultContainQuery).toBe(true, `At least one search result does not contain the query`);
  });

  queryDataGeneral.forEach((queryData) => {
    test(`Response body contains '${queryData.query}' query`, async () => {
      // Start waiting for response
      const responsePromise = googleHomePage.waitForSearchResponse();
      // Search for query
      await googleHomePage.searchForQueryByEnter(queryData.query);
      const response = await responsePromise;

      // Check if status is 200
      expect(response.status()).toEqual(200);

      // Check if response body starts with <!doctype html>
      const responseBody = await response.text();
      expect(responseBody.startsWith('<!doctype html>')).toBeTruthy();

      // Check if the body contains at least 1 instance of query
      const count = await googleHomePage.countQueryInBody(queryData.query);
      expect(count).toBeGreaterThanOrEqual(1, `The html body doesn't contains the query`);
    });
  });

  queryDataGeneral.forEach((queryData) => {
    test(`Google search results page contains '${queryData.query}' query`, async () => {
      // Search for query
      await googleHomePage.searchForQueryByEnter(queryData.query);
      // Check if each search result actually contains query in its text
      const searchResults = await googleHomePage.getSearchResultElements();
      const doesEachSearchResultContainQuery = await googleHomePage.checkIfAllSearchResultsContainQuery(
        searchResults,
        queryData.query
      );
      expect(doesEachSearchResultContainQuery).toBe(true, `At least one search result does not contain the query`);
    });
  });

  queryDataGeneral.forEach((queryData) => {
    test(`Google search results page contains a message with the total number of results and the time taken to fetch the result for '${queryData.query}' query @only-desktop`, async () => {
      test.setTimeout(10000);
      // Search for query
      await googleHomePage.searchForQueryByEnter(queryData.query);
      // Get the text of the message with the total number of results and the time taken to fetch the result
      const resultsNumberAndTimeMessageText = await googleHomePage.getResultsNumberAndTimeMessageText();
      // Check if the message is according according to the template:
      // < 1 word > <Integer possibly with thousands as '.' > < 1 space > < 1 word > <space> (<floating point number with ','> <1 space> <1 word>)
      expect(resultsNumberAndTimeMessageText).toMatch(expectedPatternOfNumberAndTimeMessageText);
    });
  });

  queryDataGeneral.forEach((queryData) => {
    test(`Web page description contains '${queryData.query}' query highlighted in Google search results @only-desktop`, async () => {
      // Search for query
      await googleHomePage.searchForQueryByEnter(queryData.query);
      // Check if each search result actually contains query in its text
      const searchResultsDescriptions = await googleHomePage.getSearchResultsDescriptionElements();
      const doesEachSearchResultContainQuery = await googleHomePage.checkIfAllSearchResultsContainHighlightedQuery(
        searchResultsDescriptions,
        queryData.query
      );
      expect(doesEachSearchResultContainQuery).toBe(
        true,
        `At least one web page description in search results does not contain the highlighted query`
      );
    });
  });

  queryDataEmptyResults.forEach((queryData) => {
    test(`Query '${queryData.query}' not having related result leads to 'did not match any documents' message @only-desktop`, async () => {
      // Search for query
      await googleHomePage.searchForQueryByEnter(queryData.query);
      // Change to English if it's needed
      await googleHomePage.changeToEnglishIfAsked();
      // Check if the message “did not match any documents” is visible
      const didNotMatchText = page.locator(googleHomePage.selectors.didNotMatchText);
      await expect(didNotMatchText).toBeVisible();
    });
  });

  test(`Google search results page contains more than 1 result for '${query}' query`, async () => {
    // Search for query
    await googleHomePage.searchForQueryByEnter(query);
    // Checking if the search results page contains more than 1 result for the query
    const searchResults = await googleHomePage.getSearchResultElements();
    expect(searchResults.length).toBeGreaterThan(
      1,
      `Search results page doesn't contain more than 1 result for the query`
    );
  });

  test(`Clicking the search result leads to the corresponding web page for '${query}' query`, async () => {
    // Search for query
    await googleHomePage.searchForQueryByEnter(query);
    // Get titles of the web pages in the search results
    const searchResultsWebPagesTitlesText = await googleHomePage.getSearchResultsWebPagesTitles();
    const firstTitle = searchResultsWebPagesTitlesText[0];
    // Get elements with web pages URLs in the search results
    const searchResultsWebPagesUrlElements = await googleHomePage.getSearchResultsWebPagesUrlElements();
    const firstUrl = searchResultsWebPagesUrlElements[0];
    // Click or tap the 1st web link
    await googleHomePage.clickOrTap(firstUrl);
    // Check if the title of the linked page in the search results contains the name of the web page from the search results
    const openPageTitle = await googleHomePage.getPageTitle();
    expect(openPageTitle).toContain(
      firstTitle,
      `The title of the linked page in the search results does not contain the name of the web page from the search results`
    );
  });

  test(`User can get the same search results for the same '${query}' query by pressing enter or clicking on search button @only-desktop`, async ({
    sharedContext,
  }) => {
    // Create new page 1 in the same context, search for the query by pressing Enter and get the text content of the results
    const searchResultsTexts1 = await performSearchAndFetchResultsForNewPage(sharedContext, query, GoogleHomePage);
    // Create new page 2 in the same context, search for the query by clicking on search button and get the text content of the results
    const searchResultsTexts2 = await performSearchAndFetchResultsForNewPage(
      sharedContext,
      query,
      GoogleHomePage,
      async (googleHomePage, query) => {
        await googleHomePage.searchForQueryBySearchButton(query);
      }
    );

    // Compare the search results from both pages
    expect(searchResultsTexts1).toEqual(
      searchResultsTexts2,
      `Search results from two pages with the same query are not equal`
    );
  });

  queryDataCaseInsensitive.forEach((queryData) => {
    test(`Search results are case insensitive to query case for the '${queryData.query}' query`, async ({
      sharedContext,
    }) => {
      // Create new page 1 in the same context, search for the query in lower case and get the text content of the results
      const searchResultsTexts1 = await performSearchAndFetchResultsForNewPage(
        sharedContext,
        queryData.query.toLowerCase(),
        GoogleHomePage
      );
      // Create new page 2 in the same context, search for the query with upper and lower cases and get the text content of the results
      const searchResultsTexts2 = await performSearchAndFetchResultsForNewPage(
        sharedContext,
        queryData.query,
        GoogleHomePage
      );

      // Compare the search results from both pages
      expect(searchResultsTexts1).toEqual(searchResultsTexts2, `Search results are not case insensitive to query case`);
    });
  });

  queryDataGeneral.forEach((queryData) => {
    test(`Page title contains '${queryData.query}' query`, async ({}) => {
      // Search for query
      await googleHomePage.searchForQueryByEnter(queryData.query);
      const title = await googleHomePage.getPageTitle();
      expect(title).toContain(queryData.query, `Page title doesn't contain the query`);
    });
  });
});
