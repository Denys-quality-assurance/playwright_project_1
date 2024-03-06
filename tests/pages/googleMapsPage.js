import basePage from './basePage';

export default class GoogleMapsPage extends basePage {
  constructor(page, isMobile) {
    super(page, isMobile);

    this.selectors = {
      ...this.selectors,

      navigationModal: `.OuM1Vb[role="dialog"]`, // navigation tracking modal
      rejectNavigationButton: `button.vrdm1c`, // Reject navigation tracking button
      myPlaceButton: this.isMobile ? `button.uWaeI` : `button#sVuEFc`, // My place button for mobile and for desktop
    };
  }

  // Navigate to URL
  async navigateURL(URL) {
    try {
      await this.page.goto(URL);
      await this.page.waitForLoadState('networkidle');
    } catch (error) {
      console.error(`Failed to navigate to URL: ${error.message}`);
    }
  }

  // Reject navigation tracking if it's needed
  async rejectNavigationIfAsked() {
    if (await this.page.isVisible(this.selectors.navigationModal)) {
      try {
        await this.clickOrTap(this.selectors.rejectNavigationButton);
        await this.page.waitForSelector(this.selectors.navigationModal, { state: 'hidden' });
      } catch (error) {
        console.error(`Failed to reject location tracking: ${error.message}`);
      }
    }
  }

  // Navigate to Google Maps
  async openGoogleMaps() {
    await this.navigateURL('/');
    await this.rejectCookiesIfAsked();
    await this.navigateURL('/maps');
    await this.rejectNavigationIfAsked();
  }

  // Go to My Place
  async goToMyLocation() {
    await this.page.waitForSelector(this.selectors.myPlaceButton);
    await this.clickOrTap(this.selectors.myPlaceButton);
    await this.page.waitForNavigation();
    // Waiting for result page to appear
    await this.page.waitForLoadState('networkidle');
  }

  // Get page url
  getPageUrl() {
    return this.page.url();
  }
}
