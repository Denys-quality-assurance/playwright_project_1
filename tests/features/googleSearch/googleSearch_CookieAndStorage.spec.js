import { expect } from '@playwright/test';
import test from '../../../hooks/testWithAfterEachHooks.mjs';
import GoogleSearchPage from '../../pages/googleSearchPage';
import { queryDataGeneral } from '../../test-data/googleSearch/queryData';
const query = queryDataGeneral[1].query;
const expectedLocalStorageKeysData = {
  desktop: [`sb_wiz.zpc.gws-wiz-serp.`, `_c;;i`, `ds;;frib`, `sb_wiz.qc`], // Expected Local storage's keys for desktop
  mobile: [`sb_wiz.zpc.`], // Expected Local storage's keys for mobile
};
let expectedLocalStorageKeys;
const expectedSessionStorageKeys = [`_c;;i`]; // Expected session storage's keys
const expectedCookiesNames = ['__Secure-ENID', 'AEC', 'SOCS', 'DV']; // Expected cookies names

test.describe(`Google Search results: Cookies and storage`, () => {
  let page; // Page instance
  let googleSearchPage; // Page object instance

  // Navigate to Home page and reject all Cookies
  test.beforeEach('Navigate to Home page and reject all Cookies', async ({ sharedContext }) => {
    page = await sharedContext.newPage();
    const isMobile = sharedContext._options.isMobile || false; // type of device is mobile
    expectedLocalStorageKeys = isMobile ? expectedLocalStorageKeysData.mobile : expectedLocalStorageKeysData.desktop; // expectedLocalStorageKeys for mobile and for desktop
    googleSearchPage = new GoogleSearchPage(page, isMobile);
    await googleSearchPage.navigateAndRejectCookies();
  });

  test(`Check local storage content`, async ({}) => {
    // Search for query
    await googleSearchPage.searchForQueryByEnter(query);
    // Check that all expected keys included to the Local storage
    let localStorageHasKeys = await googleSearchPage.checkIfAllKeysExist(
      googleSearchPage.getLocalStorageItemsByKeys,
      page,
      expectedLocalStorageKeys
    );

    expect(localStorageHasKeys).toBe(true, `At least 1 key is not included in the local storage`);

    // Check that all Local storage values are not empty
    let localStorageData = await googleSearchPage.getLocalStorageItemsByKeys(page, expectedLocalStorageKeys);
    let localStorageValuesNotEmpty = await googleSearchPage.checkIfAllStorageValuesNotEmpty(
      localStorageData,
      expectedLocalStorageKeys
    );

    expect(localStorageValuesNotEmpty).toBe(true, `At least 1 local storage value is empty`);
  });

  test(`Check session storage content`, async ({}) => {
    // Search for query
    await googleSearchPage.searchForQueryByEnter(query);
    // Check that all expected keys included to the Session storage
    let sessionStorageHasKeys = await googleSearchPage.checkIfAllKeysExist(
      googleSearchPage.getSessionStorageItemsByKeys,
      page,
      expectedSessionStorageKeys
    );

    expect(sessionStorageHasKeys).toBe(true, `At least 1 key is not included in the session storage`);

    // Check if the search request value stored in the session storage
    const sessionStorageData = await googleSearchPage.getSessionStorage();
    const searchRequest = '/search?q=' + query;
    const isSearchRequestStoredInSession = googleSearchPage.checkIfValueExists(sessionStorageData, searchRequest);

    expect(isSearchRequestStoredInSession).toBe(true, `Search request value is not stored in the session storage`);

    // Check that all Session storage values are not empty
    const sessionStoragekeys = Object.keys(sessionStorageData);
    let sessionStorageValuesNotEmpty = await googleSearchPage.checkIfAllStorageValuesNotEmpty(
      sessionStoragekeys,
      expectedSessionStorageKeys
    );

    expect(sessionStorageValuesNotEmpty).toBe(true, `At least 1 session storage value is empty`);
  });

  test(`Check cookies content`, async ({}) => {
    // Search for query
    await googleSearchPage.searchForQueryByEnter(query);
    // Check that all expected names included to the cookies
    const cookies = await googleSearchPage.getCookies();
    const cookieNames = cookies.map((cookie) => cookie.name);
    let cookiesIncludeAllNames = googleSearchPage.checkIfAllItemsInArray(cookieNames, expectedCookiesNames);

    expect(cookiesIncludeAllNames).toBe(true, `At least 1 name is not included in the cookies`);

    // Check that all cookies have non-empty values
    const cookiesValuesNotEmpty = cookies.every((cookie) => cookie.value !== '');
    expect(cookiesValuesNotEmpty).toBe(true, `At least 1 cookie value is empty`);
  });
});