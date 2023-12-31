export default class GoogleHomePicturesPage {
  constructor(page) {
    this.page = page;
    this.selectors = {
      cookiesModal: `#CXQnmb`, // Cookies consent modal
      rejectAllCookiesButton: `button#W0wltc`, // Reject all cookies button
      picturesSearchButton: `.gb_B[href*="https://www.google.com/imghp"]`, // Pictures Search button
      searchInputTextArea: `textarea[name=q]`, // Search query imput area
      firstSearchResult: `#islrg >> [data-ri="0"]`, // 1st result in the list of results
      firstSearchResultText: `#islrg >> [data-ri="0"] >> .bytUYc`, // Text of the 1st result in the list of results
      picturePriview: `[role="link"] img[src*="https"]`, // Preview of the picture in the result list
      searchByPictureButton: `.NGBa0b[role="button"]`, // Search by uploaded picture button
      pictureUploadButton: `.DV7the[role="button"]`, // Picture upload button of search by picture modal
      searchByPictureResults: `.UAiK1e[dir="ltr"]`, // List of results of search by picture
    };
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
    if (await this.page.isVisible(this.selectors.cookiesModal)) {
      try {
        await this.page.click(this.selectors.rejectAllCookiesButton);
        await this.page.waitForSelector(this.selectors.cookiesModal, { state: 'hidden' });
      } catch (error) {
        console.error(`Failed to reject all Cookies: ${error.message}`);
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
      await this.page.waitForSelector(this.selectors.searchInputTextArea);
      await this.page.fill(this.selectors.searchInputTextArea, query);
      await this.page.press(this.selectors.searchInputTextArea, 'Enter');
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
      await this.page.click(this.selectors.picturesSearchButton);
      await this.page.waitForNavigation();
      await this.searchFor(query);
    } catch (error) {
      console.error(
        `Failed to navigate to Home page, reject all Cookies, navigate to Pictures and search for query: ${error.message}`
      );
    }
  }

  // Click on the search result to open picture preview
  async openPicturePreview(picture) {
    try {
      await this.page.click(picture);
      await this.page.waitForSelector(this.selectors.picturePriview);
      return this.page.$(this.selectors.picturePriview);
    } catch (error) {
      console.error(`Failed to open picture preview: ${error.message}`);
    }
  }

  // Upload the picture to search by picture
  async uploadPictureToSearch(imagePath) {
    try {
      // Click on the Search by picture button to open picture upload area
      await this.page.click(this.selectors.searchByPictureButton);
      await this.page.waitForSelector(this.selectors.pictureUploadButton);

      // Listen for the 'filechooser' event that triggers when file chooser dialog opens
      this.page.on('filechooser', async (fileChooser) => {
        // Set files for upload. Provide your own file path
        await fileChooser.setFiles(imagePath);
      });

      // Click the button that opens the file chooser dialog
      await this.page.click(this.selectors.pictureUploadButton);
    } catch (error) {
      console.error(`Failed to open upload picture to search: ${error.message}`);
    }
  }

  // Get Search by picture results
  async getSearchByPictureResults() {
    try {
      await this.page.waitForSelector(this.selectors.searchByPictureResults);
      const searchByPictureResults = await this.page.$$(this.selectors.searchByPictureResults);
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
