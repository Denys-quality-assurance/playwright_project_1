import { expect } from '@playwright/test';
import test from '../../../hooks/testWithAfterEachHooks.mjs';
import GoogleHomePage from '../../pages/googleHomePage';
import { getMismatchedPixelsCount } from '../../../utilities/fileSystemHelper';

test.describe(`Google Home Page: User Interface`, () => {
  let page; // Page instance
  let googleHomePage; // Page object instance

  // Navigate to Home page and reject all Cookies
  test.beforeEach('Navigate to Home page and reject all Cookies', async ({ sharedContext }) => {
    page = await sharedContext.newPage();
    const isMobile = sharedContext._options.isMobile || false; // type of device is mobile
    googleHomePage = new GoogleHomePage(page, isMobile);
    await googleHomePage.navigateAndRejectCookies();
  });

  test(`Google logo is visiable on the Home page`, async ({ sharedContext }, testInfo) => {
    // Make and save a screenshot of the Google Logo
    const actualScreenshotPath = await googleHomePage.saveGoogleLogoScreenshot(testInfo);
    // Compare the actual Logo against the expected baseline Logo, attach results to the report, delete temporary files
    const mismatchedPixelsCount = await getMismatchedPixelsCount(actualScreenshotPath, testInfo, sharedContext);
    expect(mismatchedPixelsCount).toBe(0, `At least one pixel of the logo differs from the baseline`);
  });

  test(`Google logo is centre aligned on the Home page`, async () => {
    // Get horizontal centre of the logo
    const logoCentre = await googleHomePage.getHorizontalCentreBySelector(googleHomePage.selectors.googleLogo);

    // Get the viewport size of the page
    const viewportSize = page.viewportSize();
    // Calculate the horizontal centre of the viewport
    const viewportCentre = viewportSize.width / 2;

    // Check if the Google logo is centre aligned on the Home page
    expect(logoCentre).toBeCloseTo(viewportCentre, 1);
  });

  test(`Google search input area is centre aligned on the Home page`, async () => {
    // Get horizontal centre of the search input area
    const searchInputCentre = await googleHomePage.getHorizontalCentreBySelector(
      googleHomePage.selectors.searchInputBox
    );

    // Get the viewport size of the page
    const viewportSize = page.viewportSize();
    // Calculate the horizontal centre of the viewport
    const viewportCentre = viewportSize.width / 2;

    // Check if the Google search input area is centre aligned on the Home page
    expect(searchInputCentre).toBeCloseTo(viewportCentre, 1);
  });
});
