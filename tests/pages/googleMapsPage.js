class GoogleMapsPage {
  constructor(page) {
    this.page = page;
    this.cookiesModal = `#CXQnmb`; // Cookies consent modal
    this.rejectAllCookiesButton = `button#W0wltc`; // Reject all cookies button
    this.myPlaceButton = `button#sVuEFc`; // My place button
  }
  // Navigate to URL
  async navigate(URL) {
    try {
      await this.page.goto(URL);
    } catch (error) {
      console.error(`Failed to navigate to URL: ${error.message}`);
    }
  }

  // Reject all Cookies if it's needed
  async rejectCookiesIfExist() {
    if (await this.page.isVisible(this.cookiesModal)) {
      try {
        await this.page.click(this.rejectAllCookiesButton);
        await this.page.waitForSelector(this.cookiesModal, { state: 'hidden' });
      } catch (error) {
        console.error(`Failed to reject all Cookies: ${error.message}`);
        throw error; // re-throw the error to fail the test
      }
    }
  }

  // Navigate to Google Maps
  async openGoogleMaps() {
    await this.navigate(`https://www.google.com`);
    await this.rejectCookiesIfExist();
    await this.navigate(`https://www.google.com/maps`);
  }

  // Go to My Place
  async goToMyLocation() {
    await this.page.click(this.myPlaceButton);
    await this.page.waitForNavigation();
  }
}

module.exports = GoogleMapsPage;
