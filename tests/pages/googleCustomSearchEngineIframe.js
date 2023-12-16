class GoogleCustomSearchEnginePage {
  constructor(page) {
    this.page = page;
    this.frame = null;
    this.outerFrameSelector = "[src*='https://www.gstatic.com/atari/embeds/']:first-of-type"; // Google Custom Search Engine outer iFrame
    this.innerFrameSelector = '#innerFrame'; // Google Custom Search Engine inner iFrame
    this.userFrameSelector = '#userHtmlFrame'; // Google Custom Search Engine user iFrame
    this.searchInputTextArea = '.gsc-input-box >> [name="search"]'; // Search query imput area
    this.searchResult = '.gsc-results >> .gsc-result'; // One search result
  }
  // Navigate to Home page
  async init() {
    try {
      await this.page.goto(
        'https://www.steegle.com/google-sites/how-to/insert-custom-code/google-custom-search-engine'
      );
      // Fing the outer iFrame
      const outerFrameHandle = await this.page.waitForSelector(this.outerFrameSelector);
      // Ensure the frame is in the viewport
      if (outerFrameHandle) await outerFrameHandle.scrollIntoViewIfNeeded();
      const outerFrame = await outerFrameHandle.contentFrame();

      // Fing the inner iFrame inside the outer iFrame
      const innerFrameHandle = await outerFrame.waitForSelector(this.innerFrameSelector);
      // Ensure the frame is in the viewport
      if (innerFrameHandle) await innerFrameHandle.scrollIntoViewIfNeeded();
      const innerFrame = await innerFrameHandle.contentFrame();

      // Fing the user iFrame inside the inner iFrame
      const userFrameHandle = await innerFrame.waitForSelector(this.userFrameSelector);
      // Ensure the frame is in the viewport
      if (userFrameHandle) await userFrameHandle.scrollIntoViewIfNeeded();
      this.frame = await userFrameHandle.contentFrame();
    } catch (error) {
      console.log(`Failed to navigate to CSE iFrame: ${error.message}`);
      throw error; // re-throw the error to fail the test
    }
  }

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
      let result;
      for (let searchResult of searchResults) {
        // Get the text of each searchResult
        let resultText = await searchResult.textContent();
        resultText = resultText.toLowerCase();
        query = query.toLowerCase();
        // Check if the text contains query
        if (resultText.includes(query)) {
          result = true;
        } else {
          result = false;
          return result;
        }
      }
      return result;
    } catch (error) {
      console.log(`Failed to validate search results contain query: ${error.message}`);
      throw error; // re-throw the error to fail the test
    }
  }
}

module.exports = GoogleCustomSearchEnginePage;
