class GoogleHomePicturesPage {
  constructor(page) {
    this.page = page;
    this.cookiesModal = `#CXQnmb`; // Cookies consent modal
    this.rejectAllCookiesButton = `button#W0wltc`; // Reject all cookies button
    this.picturesSearchButton = `.gb_B[href*="https://www.google.com/imghp"]`; // Pictures Search button
    this.searchInputTextArea = `textarea[name=q]`; // Search query imput area
    this.firstSearchResult = `#islrg >> [data-ri="0"]`; // 1st result in the list of results
    this.firstSearchResultTest = `#islrg >> [data-ri="0"] >> .bytUYc`; // Text of the 1st result in the list of results
    this.picturePriview = `[role="link"] img[src*="https"]`; // Preview of the picture in the result list
    this.searchByPictureButton = `.NGBa0b[role="button"]`; // Search by uploaded picture button
    this.pictureUploadButton = `.DV7the[role="button"]`; // Picture upload button of search by picture modal
    this.searchByPictureResults = `.UAiK1e[dir="ltr"]`; // List of results of search by picture
  }
  // Navigate to Home page
  async navigateHome() {
    try {
      await this.page.goto(`https://www.google.com`);
    } catch (error) {
      console.error(`Failed to navigate to Home page: ${error.message}`);
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

  // Navigate to page and reject all Cookies if it's needed
  async navigateAndRejectCookies() {
    try {
      await this.navigateHome();
      await this.rejectCookiesIfExist();
    } catch (error) {
      console.error(`Failed to navigate to page and reject all Cookies: ${error.message}`);
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
    }
  }

  // Navigate to Home page, reject all Cookies, navigate to Pictures and search for query
  async navigateAndSearchPictures(query) {
    try {
      await this.navigateAndRejectCookies();
      await this.page.click(this.picturesSearchButton);
      await this.page.waitForNavigation();
      await this.searchFor(query);
    } catch (error) {
      console.error(
        `Failed to navigate to Home page, reject all Cookies, navigate to Pictures and search for query: ${error.message}`
      );
    }
  }

  // Get Search by picture results
  async getSearchByPictureResults() {
    try {
      await this.page.waitForSelector(this.searchByPictureResults);
      const searchByPictureResults = await this.page.$$(this.searchByPictureResults);
      return searchByPictureResults;
    } catch (error) {
      console.error(`Failed to get search by picture results: ${error.message}`);
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
    }
  }

  // Check if any search results contain query
  async checkIfSearchResultsContainQuery(searchResults, query) {
    try {
      let result = false;
      for (let searchResult of searchResults) {
        // Get the text of each searchResult
        let resultText = await searchResult.textContent();
        resultText = resultText.toLowerCase();
        query = query.toLowerCase();
        // Check if the text contains query
        if (resultText.includes(query)) {
          result = true;
        }
      }
      return result;
    } catch (error) {
      console.error(`Failed to validate search results contain query: ${error.message}`);
    }
  }
}

module.exports = GoogleHomePicturesPage;
