import { expect } from '@playwright/test';
import test from '../hooks/testWithGeolocation.mjs';
import GoogleMapsPage from './pages/googleMapsPage';
const geoData = { longitude: 12.492507, latitude: 41.889938 }; // Rome, Italy

test.describe('Geolocation Tests @skip-for-firefox', () => {
  let googleMapsPage; // Page object instance

  test.beforeEach(async ({ sharedContext }) => {
    // Sets the geolocation
    await sharedContext.setGeolocation(geoData);

    // Navigate to page and reject all Cookies if it's needed
    let page = await sharedContext.newPage();
    const isMobile = sharedContext._options.isMobile || false; // type of device is mobile
    googleMapsPage = new GoogleMapsPage(page, isMobile);
    await googleMapsPage.openGoogleMaps();
  });

  // Check that URL contains geolocation data
  test(`Check that URL contains geolocation data`, async ({}) => {
    // Go to My Place
    await googleMapsPage.goToMyLocation();

    const url = googleMapsPage.getPageUrl();
    const expectedGeolocationData = `${geoData.latitude},${geoData.longitude}`;

    // Check if the URL contains the geolocation data
    expect(url).toContain(expectedGeolocationData, `URL does not contain the expected geolocation data`);
  });
});
