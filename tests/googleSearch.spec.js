import { expect } from '@playwright/test';
import test from '../hooks/testWithAfterEachHooks.mjs';
import GoogleHomePage from './pages/googleHomePage';
import { queryDataGeneral, queryDataCaseInsensitive } from './test-data/queryData';
import acceptablePerformanceData from './test-data/acceptablePerformanceData';
import { checkFileExists, deleteTempFile, getMismatchedPixelsCount } from '../utilities/fileSystemHelpers';
import { performSearchAndFetchResults } from '../utilities/pagesHelper';
const query = queryDataGeneral[1].query;
const expectedLocalStorageKeysData = {
  desktop: [`sb_wiz.zpc.gws-wiz-serp.`, `_c;;i`, `ds;;frib`, `sb_wiz.qc`], // Expected Local storage's keys for desktop
  mobile: [`sb_wiz.zpc.`], // Expected Local storage's keys for mobile
};
let expectedLocalStorageKeys;
const expectedSessionStorageKeys = [`_c;;i`]; // Expected session storage's keys
const expectedCookiesNames = ['__Secure-ENID', 'CONSENT', 'AEC', 'SOCS', 'DV']; // Expected cookies names
const acceptableActionDutation = acceptablePerformanceData.acceptableSearchDutation; // The duration of the action should not exide the limit (ms)

test.describe(`Google Home Page: Search results`, () => {
  let page; // Page instance
  let googleHomePage; // Page object instance

  // Navigate to Home page, reject all Cookies and search the query before each test in this block
  test.beforeEach(async ({ sharedContext }) => {
    page = await sharedContext.newPage();
    const isMobile = sharedContext._options.isMobile || false; // type of device is mobile
    expectedLocalStorageKeys = isMobile ? expectedLocalStorageKeysData.mobile : expectedLocalStorageKeysData.desktop; // expectedLocalStorageKeys for mobile and for desktop
    googleHomePage = new GoogleHomePage(page, isMobile);
    await googleHomePage.navigateAndRejectCookies();
  });

  test(`Google logo is visiable on the Home page`, async ({ sharedContext }, testInfo) => {
    // Make and save a screenshot of the Google Logo
    const actualScreenshotPath = await googleHomePage.saveGoogleLogoScreenshot(testInfo);
    // Compare the actual Logo against the expected baseline Logo and attach results to the report
    const mismatchedPixelsCount = await getMismatchedPixelsCount(actualScreenshotPath, testInfo, sharedContext);
    expect(mismatchedPixelsCount).toBe(0, `At least one pixel of the logo differs from the baseline`);
  });

  test(`User can apply video filter on the Empty results page (mocked) and get search results @only-desktop`, async ({
    sharedContext,
  }) => {
    // Mock the search response with Empty Results
    await googleHomePage.mockResponseWithEmptyResults(sharedContext);
    // Search for query
    await googleHomePage.searchForQueryByEnter(query);
    // Apply video filter
    await googleHomePage.applyVideFilter();
    // Check if each search result actually contains query in its text
    const searchResults = await googleHomePage.getSearchResults();
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
      const searchResults = await googleHomePage.getSearchResults();
      const doesEachSearchResultContainQuery = await googleHomePage.checkIfAllSearchResultsContainQuery(
        searchResults,
        queryData.query
      );
      expect(doesEachSearchResultContainQuery).toBe(true, `At least one search result does not contain the query`);
    });
  });

  test(`Google search results page contains more than 1 result for '${query}' query`, async () => {
    // Search for query
    await googleHomePage.searchForQueryByEnter(query);
    // Checking if the search results page contains more than 1 result for the query
    const searchResults = await googleHomePage.getSearchResults();
    expect(searchResults.length).toBeGreaterThan(
      1,
      `Search results page doesn't contain more than 1 result for the query`
    );
  });

  test(`User can get the same search results for the same '${query}' query by pressing enter or clicking on search button @only-desktop`, async ({
    sharedContext,
  }) => {
    test.setTimeout(20000);
    // Create new page 1 in the same context, search for the query by pressing Enter and get the text content of the results
    const searchResultsTexts1 = await performSearchAndFetchResults(sharedContext, query, GoogleHomePage);
    // Create new page 2 in the same context, search for the query by clicking on search button and get the text content of the results
    const searchResultsTexts2 = await performSearchAndFetchResults(
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
    test.only(`Search results are case insensitive to query case for the '${queryData.query}' query`, async ({
      sharedContext,
    }) => {
      test.setTimeout(20000);
      // Create new page 1 in the same context, search for the query in lower case and get the text content of the results
      const searchResultsTexts1 = await performSearchAndFetchResults(
        sharedContext,
        queryData.query.toLowerCase(),
        GoogleHomePage
      );
      // Create new page 2 in the same context, search for the query with upper and lower cases and get the text content of the results
      const searchResultsTexts2 = await performSearchAndFetchResults(sharedContext, queryData.query, GoogleHomePage);

      // Compare the search results from both pages
      expect(searchResultsTexts1).toEqual(searchResultsTexts2, `Search results are not case insensitive to query case`);
    });
  });

  test(`Check local storage content`, async ({}) => {
    // Search for query
    await googleHomePage.searchForQueryByEnter(query);
    // Check that all expected keys included to the Local storage
    let localStorageHasKeys = await googleHomePage.checkIfAllKeysExist(
      googleHomePage.getLocalStorageItemsByKeys,
      page,
      expectedLocalStorageKeys
    );

    expect(localStorageHasKeys).toBe(true, `At least 1 key is not included in the local storage`);

    // Check that all Local storage values are not empty
    let localStorageData = await googleHomePage.getLocalStorageItemsByKeys(page, expectedLocalStorageKeys);
    let localStorageValuesNotEmpty = await googleHomePage.checkIfAllStorageValuesNotEmpty(
      localStorageData,
      expectedLocalStorageKeys
    );

    expect(localStorageValuesNotEmpty).toBe(true, `At least 1 local storage value is empty`);
  });

  test(`Check session storage content`, async ({}) => {
    // Search for query
    await googleHomePage.searchForQueryByEnter(query);
    // Check that all expected keys included to the Session storage
    let sessionStorageHasKeys = await googleHomePage.checkIfAllKeysExist(
      googleHomePage.getSessionStorageItemsByKeys,
      page,
      expectedSessionStorageKeys
    );

    expect(sessionStorageHasKeys).toBe(true, `At least 1 key is not included in the session storage`);

    // Check if the search request value stored in the session storage
    const sessionStorageData = await googleHomePage.getSessionStorage();
    const searchRequest = '/search?q=' + query;
    const isSearchRequestStoredInSession = googleHomePage.checkIfValueExists(sessionStorageData, searchRequest);

    expect(isSearchRequestStoredInSession).toBe(true, `Search request value is not stored in the session storage`);

    // Check that all Session storage values are not empty
    const sessionStoragekeys = Object.keys(sessionStorageData);
    let sessionStorageValuesNotEmpty = await googleHomePage.checkIfAllStorageValuesNotEmpty(
      sessionStoragekeys,
      expectedSessionStorageKeys
    );

    expect(sessionStorageValuesNotEmpty).toBe(true, `At least 1 session storage value is empty`);
  });

  test(`Check cookies content`, async ({}) => {
    // Search for query
    await googleHomePage.searchForQueryByEnter(query);
    // Check that all expected names included to the cookies
    const cookies = await googleHomePage.getCookies();
    const cookieNames = cookies.map((cookie) => cookie.name);
    let cookiesIncludeAllNames = googleHomePage.checkIfAllItemsInArray(cookieNames, expectedCookiesNames);

    expect(cookiesIncludeAllNames).toBe(true, `At least 1 name is not included in the cookies`);

    // Check that all cookies have non-empty values
    const cookiesValuesNotEmpty = cookies.every((cookie) => cookie.value !== '');
    expect(cookiesValuesNotEmpty).toBe(true, `At least 1 cookie value is empty`);
  });

  queryDataGeneral.forEach((queryData) => {
    test(`Page title contains '${queryData.query}' query`, async ({}) => {
      // Search for query
      await googleHomePage.searchFor(queryData.query);
      const title = await googleHomePage.getPageTitle();
      expect(title).toContain(queryData.query, `Page title doesn't contain the query`);
    });
  });

  test(`User can navigate via Tab, Shift+Tab and Enter @only-desktop`, async ({}) => {
    // Search for query
    await googleHomePage.searchForQueryByEnter(query);

    // Navigate via Tab
    // Navigate via Tab to select the pictures search button (item number N=10)
    await googleHomePage.selectElementNViaTab(10);
    // Get class of the active (focused) element
    let activeElementClass = await googleHomePage.getActiveElementClass();
    // Chech if the active element has the expected class
    expect(activeElementClass).toBe(
      googleHomePage.classes.picturesSearchButton,
      `The active element has an unexpected class`
    );

    // Navigate via Enter
    // Press Enter
    await page.keyboard.press('Enter');
    // Check if the search by picture modal with the picture upload button is visible
    const pictureUploadButton = page.locator(googleHomePage.selectors.pictureUploadButton);
    await expect(pictureUploadButton).toBeVisible();

    // Navigate via Shift+Tab
    // Navigate via Shift+Tab to select the close button (item number N=1) of the the search by picture modal
    await googleHomePage.selectElementNViaShiftTab(1);
    // Get class of the active (focused) element
    activeElementClass = await googleHomePage.getActiveElementClass();
    // Chech if the active element has the expected class
    expect(activeElementClass).toBe(
      googleHomePage.classes.closeSearchByPictureModalButton,
      `The active element has an unexpected class`
    );
  });

  queryDataGeneral.forEach((queryData) => {
    test(`Performance metrics for Search results for '${queryData.query}' query`, async ({}, testInfo) => {
      // Get browser type
      const defaultBrowserType = testInfo.project.use.defaultBrowserType;
      // Get performance metrics for Search results
      const { metrics, actionDuration } = await googleHomePage.getPerformanceMetricsForSearchResults(
        queryData.query,
        testInfo,
        defaultBrowserType
      );
      // API Performance.mark: Check if the duration of the action does not exceed limits
      expect(actionDuration).toBeLessThanOrEqual(acceptableActionDutation, `The duration of the action exceeds limits`);

      // Performance.mark API: Check if marksInfoData collected
      const isMarksInfoFileCreated = checkFileExists(metrics.marksInfoDataPath);
      expect(isMarksInfoFileCreated).toBe(
        true,
        `The trmarksInfoDataaces for the query are not saved in the file system`
      );
      // Performance.mark API: Check if measuresInfoData collected
      const isMeasuresInfoFileCreated = checkFileExists(metrics.measuresInfoDataPath);
      expect(isMeasuresInfoFileCreated).toBe(
        true,
        `The measuresInfoData for the query are not saved in the file system`
      );

      // Additional metrics only for cromium browsers
      if (defaultBrowserType == 'chromium') {
        // Performance API: Check if the traices collected
        const isTraiceFileCreated = checkFileExists(metrics.tracesPath);
        expect(isTraiceFileCreated).toBe(
          true,
          `The Performance API traces for the query are not saved in the file system`
        );
        // Chrome DevTool Protocol API: Check if Chrome DevTool Protocol metrics collected
        const isCDPDataFileCreated = checkFileExists(metrics.metricsDiffDataPath);
        expect(isCDPDataFileCreated).toBe(
          true,
          `The Chrome DevTool Protocol metrics for the query are not saved in the file system`
        );
      }

      // Delete the temporaty files
      for (let key in metrics) {
        deleteTempFile(metrics[key]);
      }
    });
  });
});
