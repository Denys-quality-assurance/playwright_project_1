import { expect } from '@playwright/test';
import test from '../hooks/testWithScreenshotsAfterEachHook.mjs';
const GoogleMapsPage = require(`./pages/googleMapsPage`);
const geoData = { longitude: 12.492507, latitude: 41.889938 }; // Rome, Italy

test.describe('Geolocation Tests @skip-for-firefox', () => {
  let context;
  let page;
  let googleMapsPage;

  test.beforeEach(async ({ browser }) => {
    // Create a new context with the GeoLocation and Permission options
    context = await browser.newContext({
      geolocation: geoData,
      permissions: [`geolocation`], // Allow Google to track the geolocation
      ignoreHTTPSErrors: true,
    });
    // Navigate to page and reject all Cookies if it's needed
    page = await context.newPage();
    googleMapsPage = new GoogleMapsPage(page);
    await googleMapsPage.openGoogleMaps();
  });

  // Close the 2nd page if it's needed
  test.afterEach(async () => {
    // Close the context once done
    await context.close();
  });

  // Check that URL contains geolocation data
  test(`Check that URL contains geolocation data`, async ({}) => {
    // Go to My Place
    await googleMapsPage.goToMyLocation();

    const url = page.url();
    const expectedGeolocationData = `${geoData.latitude},${geoData.longitude}`;

    // Check if the URL contains the geolocation data
    expect(url).toContain(
      expectedGeolocationData,
      `URL does not contain the expected geolocation data: ${expectedGeolocationData}`
    );
  });
});
