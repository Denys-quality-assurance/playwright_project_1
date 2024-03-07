import { escapeRegexSpecialCharacters } from '../../utilities/regexHelper';

export default class basePage {
  constructor(page, isMobile) {
    this.page = page;
    this.isMobile = isMobile; // Type of device is mobile

    this.selectors = {
      cookiesModal: `#CXQnmb`, // Cookies consent modal
      rejectAllCookiesButton: `button#W0wltc`, // Reject all cookies button
      searchInputTextArea: `textarea[name=q]`, // Text imput field of Search query imput area
      searchResult: this.isMobile ? `.y0NFKc` : `.MjjYud >> .g`, // One search result for mobile and for desktop
      changeToEnglishModal: `#Rzn5id`, // Change to English modal
      changeToEnglishButton: `text="Change to English"`, // Change to English button
      pictureUploadButton: `.DV7the[role="button"]`, // Picture upload button of search by picture modal
    };
  }

  // Click or Tap
  async clickOrTap(elementOrSelector) {
    try {
      if (typeof elementOrSelector === 'string') {
        if (this.isMobile) {
          await this.page.tap(elementOrSelector);
        } else {
          await this.page.click(elementOrSelector);
        }
      } else {
        // elementOrSelector is an ElementHandle
        if (this.isMobile) {
          await elementOrSelector.tap();
        } else {
          await elementOrSelector.click();
        }
      }
    } catch (error) {
      console.error(`Failed to chose click or tap method: ${error.message}`);
    }
  }

  // Navigate to Google Home page
  async navigateHome() {
    try {
      await this.page.goto('/');
    } catch (error) {
      console.error(`Failed to navigate to Home page: ${error.message}`);
    }
  }

  // Reject all Cookies if it's needed
  async rejectCookiesIfAsked() {
    if (await this.page.isVisible(this.selectors.cookiesModal)) {
      try {
        await this.page.waitForSelector(this.selectors.rejectAllCookiesButton);
        await this.clickOrTap(this.selectors.rejectAllCookiesButton);
        await this.page.waitForSelector(this.selectors.cookiesModal, {
          state: 'hidden',
        });
      } catch (error) {
        console.error(`Failed to reject all Cookies: ${error.message}`);
      }
    }
  }

  // Navigate to page and reject all Cookies if it's needed
  async navigateAndRejectCookies() {
    try {
      await this.navigateHome();
      await this.rejectCookiesIfAsked();
    } catch (error) {
      console.error(
        `Failed to navigate to page and reject all Cookies: ${error.message}`
      );
    }
  }

  // Fill Search imput with query
  async fillSearchInput(query, pageOrFrame = this.page) {
    try {
      await pageOrFrame.waitForSelector(this.selectors.searchInputTextArea);
      await pageOrFrame.fill(this.selectors.searchInputTextArea, query);
    } catch (error) {
      console.error(`Failed to fill Search imput with query: ${error.message}`);
    }
  }

  // Search for query by pressing enter
  async searchForQueryByEnter(query, pageOrFrame = this.page) {
    try {
      // Fill Search imput with query
      await this.fillSearchInput(query, pageOrFrame);
      // Submit the query by pressing enter
      await pageOrFrame.press(this.selectors.searchInputTextArea, 'Enter');
    } catch (error) {
      console.error(
        `Failed to search for query by pressing enter: ${error.message}`
      );
    }
  }

  // Change to English if it's needed
  async changeToEnglishIfAsked() {
    try {
      await this.page.waitForSelector(
        this.selectors.changeToEnglishButton,
        1000
      );
      await this.clickOrTap(this.selectors.changeToEnglishButton);
      await this.page.waitForSelector(this.selectors.changeToEnglishModal, {
        state: 'hidden',
      });
    } catch (error) {
      // Ignore TimeoutError as it's an expected error when the modal does not appear.
      if (!(error instanceof this.page.errors.TimeoutError)) {
        console.error(`Failed to change to English: ${error.message}`);
      }
    }
  }

  // Wait for the search response
  async waitForSearchResponse() {
    return this.page.waitForResponse('/search?q=**');
  }

  // Get Search results
  async getSearchResultsLocator(pageOrFrame = this.page) {
    try {
      await pageOrFrame.waitForSelector(this.selectors.searchResult);
      return pageOrFrame.locator(this.selectors.searchResult);
    } catch (error) {
      console.error(`Failed to get search results: ${error.message}`);
    }
  }

  // Check if all search results contain query
  async checkIfAllSearchResultsContainQuery(searchResultsLocator, query) {
    try {
      // Collect all elements of search results
      const allSearchResultElements = await searchResultsLocator.all();
      // Get all words from the query as an array
      const queryWords = query.split(' ');
      let failedResults = [];

      for (let searchResult of allSearchResultElements) {
        // Get the text of each searchResult
        let resultText = await searchResult.innerText();

        // Check if the search result contains any query word
        const hasQueryWords = this.hasQueryWords(resultText, queryWords);
        if (!hasQueryWords) {
          failedResults.push(resultText);
        }
      }

      // success is try if no items in failedResults
      return {
        success: failedResults.length === 0,
        failedResultText: failedResults,
        failedQuery: query,
      };
    } catch (error) {
      console.error(
        `Failed to check if all search results contain query: ${error.message}`
      );
    }
  }

  // Check if the search result contains any query word
  hasQueryWords(resultText, queryWords) {
    if (
      queryWords.some((queryWord) =>
        new RegExp(escapeRegexSpecialCharacters(queryWord), 'i').test(
          resultText
        )
      )
    ) {
      return true;
    } else return false;
  }

  // Get text content from array of objects
  async getTextContent(arrayOrObject) {
    try {
      // Retrieve all elements from the array or locator
      const arrayOfElements = Array.isArray(arrayOrObject)
        ? arrayOrObject
        : await arrayOrObject.all();
      let results = [];
      for (let element of arrayOfElements) {
        const text = await element.innerText();
        results.push(text);
      }
      return results;
    } catch (error) {
      console.error(
        `Failed to get text content from array of objects: ${error.message}`
      );
    }
  }
}
