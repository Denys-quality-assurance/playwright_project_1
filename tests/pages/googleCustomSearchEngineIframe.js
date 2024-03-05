import { escapeRegexSpecialCharacters } from '../../utilities/regexHelper';

export default class GoogleCustomSearchEnginePage {
  constructor(page) {
    this.page = page;
    this.frame = null;
    this.selectors = {
      frameSelectors: [
        `[src*='https://www.gstatic.com/atari/embeds/']:first-of-type`, // Google Custom Search Engine outer iFrame
        `#innerFrame`, // Google Custom Search Engine inner iFrame
        `#userHtmlFrame`, // Google Custom Search Engine user iFrame
      ],
      searchInputTextArea: `.gsc-input-box >> [name="search"]`, // Search query imput area
      searchResult: `.gsc-results >> .gsc-result`, // One search result
    };
  }

  // Navigate to Home page
  async selectFrame() {
    try {
      await this.page.goto('/google-sites/how-to/insert-custom-code/google-custom-search-engine/');
      // Get nested iFrame
      this.frame = await this.getNestedFrame(this.page, this.selectors.frameSelectors);
    } catch (error) {
      console.error(`Failed to navigate to CSE iFrame: ${error.message}`);
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
      console.error(`Failed to retrieve the nested iframe: ${error.message}`);
    }
  };

  // Search for query
  async searchFor(query) {
    try {
      await this.frame.waitForSelector(this.selectors.searchInputTextArea);
      await this.frame.fill(this.selectors.searchInputTextArea, query);
      await this.frame.press(this.selectors.searchInputTextArea, 'Enter');
      // Waiting for search result page to appear
      await this.frame.waitForLoadState('networkidle');
    } catch (error) {
      console.error(`Failed to search: ${error.message}`);
    }
  }

  // Get Search results
  async getSearchResultElements() {
    try {
      await this.frame.waitForSelector(this.selectors.searchResult);
      const searchResultElements = await this.frame.$$(this.selectors.searchResult);
      return searchResultElements;
    } catch (error) {
      console.error(`Failed to get search results: ${error.message}`);
    }
  }

  // Check if all search results contain query
  async checkIfAllSearchResultsContainQuery(searchResults, query) {
    try {
      // Get all words from the query as an array
      const queryWords = query.split(' ');

      for (let searchResult of searchResults) {
        // Get the text of each searchResult
        let resultText = await searchResult.innerText();

        // Check if the search result contains any query word
        const hasQueryWords = this.hasQueryWords(resultText, queryWords);
        if (!hasQueryWords) {
          return { success: false, failedResultText: resultText, failedQuery: query };
        }
      }

      return { success: true }; // Passed all checks
    } catch (error) {
      console.error(`Failed to check if all search results contain query: ${error.message}`);
    }
  }

  // Check if the search result contains any query word
  hasQueryWords(resultText, queryWords) {
    if (queryWords.some((queryWord) => new RegExp(escapeRegexSpecialCharacters(queryWord), 'i').test(resultText))) {
      return true;
    } else return false;
  }
}
