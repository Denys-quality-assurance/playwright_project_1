/*
 * Geolocation Test Suite:
 * This suite of tests is responsible for validating the geolocation functionality on the Google Maps page.
 *
 * Before each test, the geolocation is set, the Google Maps page is loaded, and any present cookies are rejected.
 * In particular, these tests simulate the following scenario:
 *
 * The suite uses a set of utility functions and a page object instance of the GoogleMapsPage.
 * A 'skip-for-firefox' tag is added to this suite due to potential issues with the geolocation functionality on Firefox.
 * Helper methods for manipulating the Google Maps page are available in the GoogleMapsPage class.
 *
 */

import { expect } from '@playwright/test';
import test from '../../../hooks/testWithGeolocation.mjs';
import GoogleMapsPage from '../../pages/googleMapsPage';

const testStatus = {
  SKIPPED: 'skipped',
};

const geoData = { longitude: 12.492507, latitude: 41.889938 }; // Rome, Italy

test.describe('Geolocation Tests @skip-for-firefox', () => {
  // Test should be failed when the condition is true: there is at least 1 unfixed bug
  test.fail(
    ({ shouldFailTest }) => shouldFailTest,
    `Test marked as "should fail" due to the presence of unfixed bug(s)`
  );
  // Test should be skipped when the condition is true: flag skipTestsWithKnownBugs is 'true' and there is at least 1 unfixed bug
  test.skip(
    ({ shouldSkipTest }) => shouldSkipTest,
    `Test skipped due to the presence of unfixed bug(s)`
  );

  let googleMapsPage; // Page object instance

  // Sets the geolocation, navigate to Google Maps page and reject all Cookies if it's needed
  test.beforeEach(
    `Sets the geolocation, navigate to Google Maps page and reject all Cookies if it's needed`,
    async ({ sharedContext }, testInfo) => {
      // Prepare the test only if the test is not skipped
      if (testInfo.expectedStatus !== testStatus.SKIPPED) {
        // Sets the geolocation
        await sharedContext.setGeolocation(geoData);

        // Navigate to page and reject all Cookies if it's needed
        let page = await sharedContext.newPage();
        const isMobile = sharedContext._options.isMobile || false; // type of device is mobile
        googleMapsPage = new GoogleMapsPage(page, isMobile);
        await googleMapsPage.goToGoogleMapsPage();
      }
    }
  );

  // Check that URL contains geolocation data
  test(`TEST-25: Check that URL contains geolocation data`, async ({}) => {
    // Go to My Place
    await googleMapsPage.goToMyLocation();

    const url = googleMapsPage.getCurrentPageUrl();
    const expectedGeolocationData = `${geoData.latitude},${geoData.longitude}`;

    // Check if the URL contains the geolocation data
    expect(url, `URL does not contain the expected geolocation data`).toContain(
      expectedGeolocationData
    );
  });
});
