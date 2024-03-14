/*
 * Google Search Test Suite:
 *
 * This script tests the alignment and visibility of UI elements present on the Google Home Page.
 *
 * Setup: An instance of the Page object and the GoogleSearchPage object are initialized,
 * with the test navigating to the Google homepage and rejecting all cookies.
 *
 * Helper methods for UI interactions are present in the GoogleSearchPage class.
 * The utilities function 'compareScreenshotsAndReportDifferences' from fileSystemHelper is used to
 * conduct pixel comparisons between actual and baseline screenshots.
 *
 */

import { expect } from '@playwright/test';
import test from '../../../hooks/testWithAfterEachHooks.mjs';
import GoogleSearchPage from '../../pages/googleSearchPage';
import { compareScreenshotsAndReportDifferences } from '../../../utilities/fileSystemHelper';

test.describe(`Google Home Page: User Interface`, () => {
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
        await googleSearchPage.goToHomeAndRejectCookies();
      }
    }
  );

  test(`TEST-14: Google logo is visiable on the Home page (pixel check) @UI`, async ({
    sharedContext,
  }, testInfo) => {
    // Make and save a screenshot of the Google Logo
    const actualScreenshotPath =
      await googleSearchPage.captureAndSaveGoogleLogoScreenshot(testInfo);
    // Compare the actual Logo against the expected baseline Logo, attach results to the report, delete temporary files
    const mismatchedPixelsCount = await compareScreenshotsAndReportDifferences(
      actualScreenshotPath,
      testInfo,
      sharedContext
    );
    expect(
      mismatchedPixelsCount,
      `At least one pixel of the logo differs from the baseline`
    ).toBe(0);
  });

  test(`TEST-15: Google logo is centre aligned on the Home page @UI`, async () => {
    // Get horizontal centre of the logo
    const logoCentre = await googleSearchPage.getHorizontalMiddleOfElement(
      googleSearchPage.selectors.googleLogo
    );

    // Get the viewport size of the page
    const viewportSize = page.viewportSize();
    // Calculate the horizontal centre of the viewport
    const viewportCentre = viewportSize.width / 2;

    // Check if the Google logo is centre aligned on the Home page
    expect(logoCentre).toBeCloseTo(viewportCentre, 1);
  });

  test(`TEST-16: Google search input area is centre aligned on the Home page @UI`, async () => {
    // Get horizontal centre of the search input area
    const searchInputCentre =
      await googleSearchPage.getHorizontalMiddleOfElement(
        googleSearchPage.selectors.searchInputBox
      );

    // Get the viewport size of the page
    const viewportSize = page.viewportSize();
    // Calculate the horizontal centre of the viewport
    const viewportCentre = viewportSize.width / 2;

    // Check if the Google search input area is centre aligned on the Home page
    expect(searchInputCentre).toBeCloseTo(viewportCentre, 1);
  });
});
