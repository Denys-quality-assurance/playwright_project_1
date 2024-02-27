import { expect } from '@playwright/test';
import test from '../../../hooks/testWithAfterEachHooks.mjs';
import GoogleHomePage from '../../pages/googleHomePage';
import { queryDataGeneral } from '../../test-data/queryData';
const query = queryDataGeneral[1].query;

test.describe(`Google Search results: keyboard navigation`, () => {
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

  test(`User can navigate via Tab, Shift+Tab and Enter @only-desktop`, async ({}) => {
    // Search for query
    await googleHomePage.searchForQueryByEnter(query);

    // Navigate via Tab
    // Navigate via Tab to select the pictures search button (item number N=11)
    await googleHomePage.selectElementNViaTab(11);
    // Get class of the active (focused) element
    let activeElementClass = await googleHomePage.getActiveElementClass();
    // Check if the active element has the expected class
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
    // Check if the active element has the expected class
    expect(activeElementClass).toBe(
      googleHomePage.classes.closeSearchByPictureModalButton,
      `The active element has an unexpected class`
    );
  });
});
