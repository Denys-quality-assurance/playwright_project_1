import basePage from './basePage';
import { escapeRegexSpecialCharacters } from '../../utilities/regexHelper';

export default class GoogleCustomSearchEnginePage extends basePage {
  constructor(page, isMobile) {
    super(page, isMobile);

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

  // Select Frame
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
}
