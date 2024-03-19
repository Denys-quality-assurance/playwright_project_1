/*
 * Google Search Test Suite:
 * This test suite validates the keyboard navigation functionality of the Google Search results.
 *
 * Setup: An instance of the Page object and the GoogleSearchPage object are initialized,
 * with the test navigating to the Google homepage and rejecting all cookies.
 *
 * The GoogleSearchPage class houses helper methods for Google Search interactions.
 *
 * This suite assumes keyboard navigation on a desktop device and does not handle mobile scenarios.
 *
 * The data for the search queries is imported from queryData and can be used with Data-driven testing (DDT) approach.
 *
 */

import { expect } from '@playwright/test';
import test from '../../../hooks/testWithAfterEachHooks.mjs';
import GoogleSearchPage from '../../pages/googleSearchPage';
import { queryDataGeneral } from '../../test-data/googleSearch/queryData';

const testStatus = {
  SKIPPED: 'skipped',
};

const query = queryDataGeneral[1].query;

test.describe(`Google Search results: Keyboard navigation`, () => {
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

  test(`TEST-13: User can navigate via Tab, Shift+Tab and Enter @only-desktop @keyboard_navigation`, async ({}) => {
    // Search for query
    await googleSearchPage.searchForQueryByEnter(query);
    await page.waitForSelector(googleSearchPage.selectors.searchResult);
    // Navigate via Tab
    // Navigate via Tab to select the pictures search button (item number N=11)
    await googleSearchPage.selectElementByTabbing(10);
    // Get class of the active (focused) element
    let activeElementClass = await googleSearchPage.getActiveElementClass();
    // Check if the active element has the expected class
    expect(
      activeElementClass,
      `The active element has an unexpected class`
    ).toBe(googleSearchPage.classes.picturesSearchButton);

    // Navigate via Enter
    // Press Enter
    await page.keyboard.press('Enter');
    // Check if the search by picture modal with the picture upload button is visible
    const pictureUploadButton = page.locator(
      googleSearchPage.selectors.pictureUploadButton
    );
    await expect(pictureUploadButton).toBeVisible();

    // Navigate via Shift+Tab
    // Navigate via Shift+Tab to select the close button (item number N=1) of the the search by picture modal
    await googleSearchPage.selectElementByShiftTabbing(1);
    // Get class of the active (focused) element
    activeElementClass = await googleSearchPage.getActiveElementClass();
    // Check if the active element has the expected class
    expect(
      activeElementClass,
      `The active element has an unexpected class`
    ).toBe(googleSearchPage.classes.closeSearchByPictureModalButton);
  });
});
