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
const expectedCookiesNames = ['__Secure-ENID', 'AEC', 'SOCS']; // Expected cookies names

test.describe(`Google Search results: Cookies and storage`, () => {
  let page; // Page instance
  let googleSearchPage; // Page object instance

  // Navigate to Home page and reject all Cookies
  test.beforeEach(
    'Navigate to Home page and reject all Cookies',
    async ({ sharedContext }, testInfo) => {
      if (testInfo.expectedStatus !== 'skipped') {
        page = await sharedContext.newPage();
        const isMobile = sharedContext._options.isMobile || false; // type of device is mobile
        expectedLocalStorageKeys = isMobile
          ? expectedLocalStorageKeysData.mobile
          : expectedLocalStorageKeysData.desktop; // expectedLocalStorageKeys for mobile and for desktop
        googleSearchPage = new GoogleSearchPage(page, isMobile);
        await googleSearchPage.goToHomeAndRejectCookies();
      }
    }
  );

  test(`TEST-17: Check local storage content @results @storage`, async ({}) => {
    // Search for query
    await googleSearchPage.searchForQueryByEnter(query);
    await page.waitForSelector(googleSearchPage.selectors.searchResult);
    // Check that all expected keys included to the Local storage
    let checkIfAllLocalStorageKeysExist =
      await googleSearchPage.checkIfAllKeysExist(
        googleSearchPage.getLocalStorageItemsByKeys,
        page,
        expectedLocalStorageKeys
      );

    expect(
      checkIfAllLocalStorageKeysExist.isSuccess,
      `Not all expected keys included to the Local storage. Missing: ${checkIfAllLocalStorageKeysExist.missingKeys.join(
        ', '
      )}`
    ).toBe(true);

    // Check that all Local storage values are not empty
    let localStorageData = await googleSearchPage.getLocalStorageItemsByKeys(
      page,
      expectedLocalStorageKeys
    );
    let checkIfAllLocalStorageValuesNotEmpty =
      await googleSearchPage.checkIfAllStorageValuesNotEmpty(
        expectedLocalStorageKeys,
        localStorageData
      );

    expect(
      checkIfAllLocalStorageValuesNotEmpty.isSuccess,
      `Not all Local storage values are not empty. Empty keys: ${checkIfAllLocalStorageValuesNotEmpty.failedKeys.join(
        ', '
      )}`
    ).toBe(true);
  });

  test(`TEST-18: Check session storage content @results @storage`, async ({}) => {
    // Search for query
    await googleSearchPage.searchForQueryByEnter(query);
    await page.waitForSelector(googleSearchPage.selectors.searchResult);
    // Check that all expected keys included to the Session storage
    let checkIfAllSessionStorageKeysExist =
      await googleSearchPage.checkIfAllKeysExist(
        googleSearchPage.getSessionStorageItemsByKeys,
        page,
        expectedSessionStorageKeys
      );

    expect(
      checkIfAllSessionStorageKeysExist.isSuccess,
      `Not all expected keys included to the Session storage. Missing: ${checkIfAllSessionStorageKeysExist.missingKeys.join(
        ', '
      )}`
    ).toBe(true);

    // Check if the search request value stored in the session storage
    const searchRequest = '/search?q=' + query;
    const isSearchRequestStoredInSession =
      await googleSearchPage.checkIfValueExists(searchRequest);

    expect(
      isSearchRequestStoredInSession,
      `Search request value is not stored in the session storage`
    ).toBe(true);

    // Check that all Session storage values are not empty
    let checkIfAllSessionStorageValuesNotEmpty =
      await googleSearchPage.checkIfAllStorageValuesNotEmpty(
        expectedSessionStorageKeys
      );

    expect(
      checkIfAllSessionStorageValuesNotEmpty.isSuccess,
      `Not all Session storage values are not empty. Empty keys: ${checkIfAllSessionStorageValuesNotEmpty.failedKeys.join(
        ', '
      )}`
    ).toBe(true);
  });

  test(`TEST-19: Check cookies content @results @cookies`, async ({}) => {
    // Search for query
    await googleSearchPage.searchForQueryByEnter(query);
    await page.waitForSelector(googleSearchPage.selectors.searchResult);
    // Check that all expected names included to the cookies
    const cookies = await googleSearchPage.getCookies();
    const cookieNames = cookies.map((cookie) => cookie.name);
    let checkResult = googleSearchPage.checkIfAllItemsInArray(
      cookieNames,
      expectedCookiesNames
    );

    expect(
      checkResult.hasAllItems,
      `Not all expected names found in the cookies array. Missing: ${checkResult.missingItems.join(', ')}`
    ).toBe(true);

    // Check that all cookies have non-empty values
    const cookiesValuesNotEmpty = cookies.every(
      (cookie) => cookie.value !== ''
    );
    expect(cookiesValuesNotEmpty, `At least 1 cookie value is empty`).toBe(
      true
    );
  });
});
