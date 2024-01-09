export default class GoogleMapsPage {
  constructor(page) {
    this.page = page;
    this.selectors = {
      cookiesModal: `#CXQnmb`, // Cookies consent modal
      rejectAllCookiesButton: `button#W0wltc`, // Reject all cookies button
      myPlaceButton: `button#sVuEFc`, // My place button
    };
  }

  // Navigate to URL
  async navigateHome(URL) {
    try {
      await this.page.goto(URL);
    } catch (error) {
      console.error(`Failed to navigate to URL: ${error.message}`);
    }
  }

  // Reject all Cookies if it's needed
  async rejectCookiesIfExist() {
    if (await this.page.isVisible(this.selectors.cookiesModal)) {
      try {
        await this.page.click(this.selectors.rejectAllCookiesButton);
        await this.page.waitForSelector(this.selectors.cookiesModal, { state: 'hidden' });
      } catch (error) {
        console.error(`Failed to reject all Cookies: ${error.message}`);
      }
    }
  }

  // Navigate to Google Maps
  async openGoogleMaps() {
    await this.navigateHome(`https://www.google.com`);
    await this.rejectCookiesIfExist();
    await this.navigateHome(`https://www.google.com/maps`);
  }

  // Go to My Place
  async goToMyLocation() {
    await this.page.click(this.selectors.myPlaceButton);
    // Waiting for search result page to appear
    await this.page.waitForLoadState('networkidle');
  }

  // Get page url
  getPageUrl() {
    return this.page.url();
  }
}
