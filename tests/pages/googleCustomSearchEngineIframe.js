class GoogleCustomSearchEnginePage {
  constructor(page) {
    this.page = page;
    this.frame = null;
    this.frameSelectors = [
      "[src*='https://www.gstatic.com/atari/embeds/']:first-of-type", // Google Custom Search Engine outer iFrame
      '#innerFrame', // Google Custom Search Engine inner iFrame
      '#userHtmlFrame',
    ]; // Google Custom Search Engine user iFrame
    this.searchInputTextArea = '.gsc-input-box >> [name="search"]'; // Search query imput area
    this.searchResult = '.gsc-results >> .gsc-result'; // One search result
  }
  // Navigate to Home page
  async init() {
    try {
      await this.page.goto(
        'https://www.steegle.com/google-sites/how-to/insert-custom-code/google-custom-search-engine'
      );
      // Get nested iFrame
      this.frame = await this.getNestedFrame(this.page, this.frameSelectors);
    } catch (error) {
      console.log(`Failed to navigate to CSE iFrame: ${error.message}`);
      throw error; // re-throw the error to fail the test
    }
  }

  // Get nested iFrame
  getNestedFrame = async (frame, selectors) => {
    try {
      const len = selectors.length;
      for (let i = 0; i < len; i++) {
        const frameHandle = await frame.waitForSelector(selectors[i]);
        // Ensure the frame is in the viewport
        if (frameHandle) await frameHandle.scrollIntoViewIfNeeded();
        frame = await frameHandle.contentFrame();
      }
      return frame;
    } catch (error) {
      console.log(`Failed to retrieve the nested iframe: ${error.message}`);
      throw error; // re-throw the error to fail the test
    }
  };

  // Search for query
  async searchFor(query) {
    try {
      await this.frame.waitForSelector(this.searchInputTextArea);
      await this.frame.fill(this.searchInputTextArea, query);
      await this.frame.press(this.searchInputTextArea, 'Enter');
      // Waiting for search result page to appear
      await this.frame.waitForLoadState('networkidle');
    } catch (error) {
      console.log(`Failed to search: ${error.message}`);
      throw error; // re-throw the error to fail the test
    }
  }

  // Get Search results
  async getSearchResults() {
    try {
      await this.frame.waitForSelector(this.searchResult);
      const searchResults = await this.frame.$$(this.searchResult);
      return searchResults;
    } catch (error) {
      console.log(`Failed to get search results: ${error.message}`);
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
      console.log(`Failed to validate search results contain query: ${error.message}`);
      throw error; // re-throw the error to fail the test
    }
  }
}

module.exports = GoogleCustomSearchEnginePage;
