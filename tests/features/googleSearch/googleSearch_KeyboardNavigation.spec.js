import { expect } from '@playwright/test';
import test from '../../../hooks/testWithAfterEachHooks.mjs';
import GoogleSearchPage from '../../pages/googleSearchPage';
import { queryDataGeneral } from '../../test-data/googleSearch/queryData';
const query = queryDataGeneral[1].query;

test.describe(`Google Search results: Keyboard navigation`, () => {
  let page; // Page instance
  let googleSearchPage; // Page object instance

  // Navigate to Home page and reject all Cookies
  test.beforeEach(
    'Navigate to Home page and reject all Cookies',
    async ({ sharedContext }, testInfo) => {
      if (testInfo.expectedStatus !== 'skipped') {
        page = await sharedContext.newPage();
        const isMobile = sharedContext._options.isMobile || false; // type of device is mobile
        googleSearchPage = new GoogleSearchPage(page, isMobile);
        await googleSearchPage.navigateAndRejectCookies();
      }
    }
  );

  test(`TEST-13: User can navigate via Tab, Shift+Tab and Enter @only-desktop @keyboard_navigation`, async ({}) => {
    // Search for query
    await googleSearchPage.searchForQueryByEnter(query);

    // Navigate via Tab
    // Navigate via Tab to select the pictures search button (item number N=11)
    await googleSearchPage.selectElementNViaTab(11);
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
    await googleSearchPage.selectElementNViaShiftTab(1);
    // Get class of the active (focused) element
    activeElementClass = await googleSearchPage.getActiveElementClass();
    // Check if the active element has the expected class
    expect(
      activeElementClass,
      `The active element has an unexpected class`
    ).toBe(googleSearchPage.classes.closeSearchByPictureModalButton);
  });
});
