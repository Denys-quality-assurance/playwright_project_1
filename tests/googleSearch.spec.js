import { expect } from '@playwright/test';
import test from '../hooks/testWithAfterEachHooks.mjs';
import GoogleHomePage from './pages/googleHomePage';
import queryData from './test-data/queryData';
const query = queryData[1].query;
const expectedLocalStorageKeysData = {
  desktop: [`sb_wiz.zpc.gws-wiz-serp.`, `_c;;i`, `ds;;frib`, `sb_wiz.qc`], // Expected Local storage's keys for desktop
  mobile: [`sb_wiz.zpc.`], // Expected Local storage's keys for mobile
};
let expectedLocalStorageKeys;
const expectedSessionStorageKeys = [`_c;;i`]; // Expected session storage's keys
const expectedCookiesNames = ['__Secure-ENID', 'CONSENT', 'AEC', 'SOCS', 'DV']; // Expected cookies names

test.describe(`Google Home Page: Search results testing for '${query}' query`, () => {
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

  test(`Google search results page contains '${query}' query`, async () => {
    // Search for query
    await googleHomePage.searchFor(query);
    // Check if each search result actually contains query in its text
    const searchResults = await googleHomePage.getSearchResults();
    const doesEachSearchResultContainQuery = await googleHomePage.checkIfSearchResultsContainQuery(
      searchResults,
      query
    );
    expect(doesEachSearchResultContainQuery).toBe(true, `At least one search result does not contain '${query}' query`);
  });

  test(`Google search results page contains more than 1 result for '${query}' query`, async () => {
    // Search for query
    await googleHomePage.searchFor(query);
    // Checking if the search results page contains more than 1 result for the query
    const searchResults = await googleHomePage.getSearchResults();
    expect(searchResults.length).toBeGreaterThan(
      1,
      `Search results page doesn't contain more than 1 result for '${query}' query`
    );
  });

  test(`Compare search results from two pages with the same '${query}' query @only-desktop`, async ({
    sharedContext,
  }) => {
    test.setTimeout(20000);
    // Search for query
    await googleHomePage.searchFor(query);

    // Create the 2nd page, navigate to Home page and search the query
    const page2 = await sharedContext.newPage();
    const googleHomePage2 = new GoogleHomePage(page2);
    await googleHomePage2.navigateAndSearch(query);

    // Get search results for the page 1
    const searchResults1 = await googleHomePage.getSearchResults();
    const searchResultsTexts1 = await googleHomePage.getTextContent(searchResults1);

    // Get search results for the page 2
    const searchResults2 = await googleHomePage2.getSearchResults();
    const searchResultsTexts2 = await googleHomePage2.getTextContent(searchResults2);

    // Compare the search results from both pages
    expect(searchResultsTexts1).toEqual(
      searchResultsTexts2,
      `Search results from two pages with the same '${query}' query are not equal`
    );
  });

  test(`Check local storage content`, async ({}) => {
    // Search for query
    await googleHomePage.searchFor(query);
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
    await googleHomePage.searchFor(query);
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
    await googleHomePage.searchFor(query);
    // Check that all expected names included to the cookies
    const cookies = await googleHomePage.getCookies();
    const cookieNames = cookies.map((cookie) => cookie.name);
    let cookiesIncludeAllNames = googleHomePage.checkIfAllItemsInArray(cookieNames, expectedCookiesNames);

    expect(cookiesIncludeAllNames).toBe(true, `At least 1 name is not included in the cookies`);

    // Check that all cookies have non-empty values
    const cookiesValuesNotEmpty = cookies.every((cookie) => cookie.value !== '');
    expect(cookiesValuesNotEmpty).toBe(true, `At least 1 cookie value is empty`);
  });

  queryData.forEach((data) => {
    test(`Page title contains '${data.query}' query`, async ({}) => {
      // Search for query
      await googleHomePage.searchFor(data.query);
      const title = await googleHomePage.getPageTitle();
      expect(title).toContain(data.query, `Page title doesn't contain '${data.query}' query`);
    });
  });
});
