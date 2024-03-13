/*
 * The `GoogleCustomSearchEnginePage` class is a Page Object Model representing the Google Custom Search Engine page.
 * This class extends from the `basePage` class providing an abstraction of the web page's structure and behavior.
 *
 * Key functionalities of this class include searching for specific queries, handling multiple iframes,
 * navigating to the Custom Search Engine (CSE) page, and retrieving search results.
 *
 * The `getNestedIFrameHandler()` method is particularly useful when dealing with a page
 * that includes nested iframes, as it can dynamically retrieve the handler for the desired iframe.
 *
 */

import basePage from './basePage';

const CSE_PAGE_URL_PART =
  '/google-sites/how-to/insert-custom-code/google-custom-search-engine/'; // Part of Google custom search engine page URL

export default class GoogleCustomSearchEnginePage extends basePage {
  constructor(page, isMobile) {
    super(page, isMobile);

    this.iFrameHandler = null; // handler for nested iFrame(s)
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

  // Selection of iFrames inside the Google Custom Search Engine page
  async selectFrame() {
    try {
      await this.page.goto(CSE_PAGE_URL_PART);
      // Get the nested iFrame handler
      this.iFrameHandler = await this.getNestedIFrameHandler(
        this.page,
        this.selectors.frameSelectors
      );
    } catch (error) {
      console.error(`Failed to navigate to CSE iFrame: ${error.message}`);
    }
  }

  // Get nested iFrame handler based on provided selectors
  getNestedIFrameHandler = async (iframe, selectors) => {
    try {
      const len = selectors.length;
      for (let i = 0; i < len; i++) {
        const iFrameHandler = await iframe.waitForSelector(selectors[i]);
        // Ensure the iFrame is visible on the viewport
        if (iFrameHandler) await iFrameHandler.scrollIntoViewIfNeeded();
        // Update current iframe to the next nested iFrame
        iframe = await iFrameHandler.contentFrame();
      }
      // Return latest nested iFrame
      return iframe;
    } catch (error) {
      console.error(`Failed to retrieve the nested iframe: ${error.message}`);
    }
  };
}
