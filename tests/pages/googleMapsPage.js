export default class GoogleMapsPage {
  constructor(page, isMobile) {
    this.page = page;
    this.isMobile = isMobile; // type of device is mobile
    this.selectors = {
      cookiesModal: `#CXQnmb`, // Cookies consent modal
      rejectAllCookiesButton: `button#W0wltc`, // Reject all cookies button
      navigationModal: `.OuM1Vb[role="dialog"]`, // navigation tracking modal
      rejectNavigationButton: `button.vrdm1c`, // Reject navigation tracking button
      myPlaceButton: this.isMobile ? `button.uWaeI` : `button#sVuEFc`, // My place button for mobile and for desktop
    };
  }

  // Click or Tap
  async clickOrTap(selector) {
    if (this.isMobile) {
      await this.page.tap(selector);
    } else {
      await this.page.click(selector);
    }
  }

  // Navigate to URL
  async navigateHome(URL) {
    try {
      await this.page.goto(URL);
      await this.page.waitForLoadState('networkidle');
    } catch (error) {
      console.error(`Failed to navigate to URL: ${error.message}`);
    }
  }

  // Reject all Cookies if it's needed
  async rejectCookiesIfAsked() {
    if (await this.page.isVisible(this.selectors.cookiesModal)) {
      try {
        await this.clickOrTap(this.selectors.rejectAllCookiesButton);
        await this.page.waitForSelector(this.selectors.cookiesModal, { state: 'hidden' });
      } catch (error) {
        console.error(`Failed to reject all Cookies: ${error.message}`);
      }
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
    await this.navigateHome('/');
    await this.rejectCookiesIfAsked();
    await this.navigateHome('/maps');
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
