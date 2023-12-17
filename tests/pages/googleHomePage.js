class GoogleHomePage {
  constructor(page) {
    this.page = page;
    this.cookiesModal = `#CXQnmb`; // Cookies consent modal
    this.rejectAllCookiesButton = `button#W0wltc`; // Reject all cookies button
    this.searchInputTextArea = `textarea[name=q]`; // Search query imput area
    this.searchResult = `.MjjYud >> .g`; // One search result
  }
  // Navigate to Home page
  async navigate() {
    try {
      await this.page.goto(`https://www.google.com`);
    } catch (error) {
      console.error(`Failed to navigate to Home page: ${error.message}`);
      throw error; // re-throw the error to fail the test
    }
  }

  // Reject all Cookies
  async rejectAllCookies() {
    try {
      // wait for cookies modal
      await this.page.waitForSelector(this.cookiesModal);
      await this.page.click(this.rejectAllCookiesButton);
      await this.page.waitForSelector(this.cookiesModal, { state: 'hidden' });
    } catch (error) {
      console.error(`Failed to reject all Cookies: ${error.message}`);
      throw error; // re-throw the error to fail the test
    }
  }

  // Navigate to page and reject all Cookies if it's needed
  async navigateAndRejectCookies() {
    try {
      await this.navigate();
      if (await this.page.isVisible(this.cookiesModal)) await this.rejectAllCookies();
    } catch (error) {
      console.error(`Failed to navigate to page and reject all Cookies: ${error.message}`);
      throw error; // re-throw the error to fail the test
    }
  }

  // Search for query
  async searchFor(query) {
    try {
      await this.page.waitForSelector(this.searchInputTextArea);
      await this.page.fill(this.searchInputTextArea, query);
      await this.page.press(this.searchInputTextArea, 'Enter');
      // Waiting for search result page to appear
      await this.page.waitForLoadState('networkidle');
    } catch (error) {
      console.error(`Failed to search: ${error.message}`);
      throw error; // re-throw the error to fail the test
    }
  }

  // Navigate to page, reject all Cookies and search for query
  async navigateAndSearch(query) {
    try {
      await this.navigateAndRejectCookies();
      await this.searchFor(query);
    } catch (error) {
      console.error(`Failed to navigate to page, reject all Cookies and search for query: ${error.message}`);
      throw error; // re-throw the error to fail the test
    }
  }

  // Get Search results
  async getSearchResults() {
    try {
      await this.page.waitForSelector(this.searchResult);
      const searchResults = await this.page.$$(this.searchResult);
      return searchResults;
    } catch (error) {
      console.error(`Failed to get search results: ${error.message}`);
      throw error; // re-throw the error to fail the test
    }
  }

  // Validate search results contain query
  async validateSearchResultsContainQuery(searchResults, query) {
    try {
      for (let searchResult of searchResults) {
        // Get the text of each searchResult
        let resultText = await searchResult.textContent();
        resultText = resultText.toLowerCase();
        query = query.toLowerCase();
        // Check if the text contains query
        if (!resultText.includes(query)) {
          return false;
        }
      }
      return true;
    } catch (error) {
      console.error(`Failed to validate search results contain query: ${error.message}`);
      throw error; // re-throw the error to fail the test
    }
  }

  // Get text content from array of objects
  async getTextContent(objects) {
    try {
      let results = [];
      for (let i = 0; i < objects.length; i++) {
        const text = await objects[i].innerText();
        results.push(text);
      }
      return results;
    } catch (error) {
      console.error(`Failed to get text content from array of objects: ${error.message}`);
      throw error; // re-throw the error to fail the test
    }
  }
}

module.exports = GoogleHomePage;