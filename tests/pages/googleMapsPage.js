/*
 * The `GoogleMapsPage` class is a Page Object Model that represents the Google Maps page.
 * This class extends from a `BasePage` class and provides abstraction for the structure
 * and behavior of the web page.
 *
 * The class encapsulates key operations like navigating to specific URLs, handling navigation
 * tracking modals, redirecting to the Google Maps page, and fetching the current page URL.
 *
 */

import BasePage from './basePage';

const MAPS_PAGE_URL_PART = '/maps'; // Part of Google Maps page URL

export default class GoogleMapsPage extends BasePage {
  constructor(page, isMobile) {
    super(page, isMobile);

    this.selectors = {
      ...this.selectors,

      navigationModal: `.OuM1Vb[role="dialog"]`, // Navigation tracking modal
      rejectNavigationButton: `button.vrdm1c`, // Reject navigation tracking button
      myPlaceButton: this.isMobile ? `button.uWaeI` : `button#sVuEFc`, // 'My place' button for mobile and for desktop
    };
  }

  // Navigate to the specified URL
  async goToURL(URL) {
    try {
      await this.page.goto(URL);
    } catch (error) {
      console.error(`Failed to navigate to URL: ${error.message}`);
    }
  }

  // If navigation tracking modal exists, reject the tracking request
  async rejectNavigationIfAsked() {
    if (await this.page.isVisible(this.selectors.navigationModal)) {
      try {
        await this.clickOrTap(this.selectors.rejectNavigationButton);
        await this.page.waitForSelector(this.selectors.navigationModal, {
          state: 'hidden',
        });
      } catch (error) {
        console.error(`Failed to reject location tracking: ${error.message}`);
      }
    }
  }

  // Navigate to the homepage, reject cookies and then redirect to Google Maps page
  async goToGoogleMapsPage() {
    await this.goToURL('/'); // Navigate to homepage
    await this.rejectCookiesIfAsked(); // Handle cookies prompt
    await this.goToURL(MAPS_PAGE_URL_PART); // Redirect to Google Maps page
    await this.rejectNavigationIfAsked(); // Handle navigation prompt
  }

  // Click on the "My Place" button and wait for the page to navigate
  async goToMyLocation() {
    await this.page.waitForSelector(this.selectors.myPlaceButton);
    await this.clickOrTap(this.selectors.myPlaceButton);
    await this.page.waitForNavigation();
  }

  // Get the current page URL
  getCurrentPageUrl() {
    // Return the URL of the current page
    return this.page.url();
  }
}
