/*
 * The `BasePage` class is a base Page Object Model (POM) that encapsulates common page interactions and behaviors
 * across the application.
 *
 * This class provides methods to perform tasks such as navigation, cookie rejection, form filling/search, language
 * change, and server response wait operations. It also encapsulates routines for checking if search results
 * contain a specified query and getting text contents from elements.
 *
 */

import { escapeRegexSpecialCharacters } from '../../utilities/regexHelper';

export default class BasePage {
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

    this.apiEndpoints = {
      searchResults: '/search?q=**', // API endpoint of the search results page. It uses a wildcard pattern to match any search query
    };
  }

  // Perform click or tap action based on the environment (desktop/mobile) and the type of input (string/element)
  async clickOrTap(elementOrSelector) {
    try {
      // If elementOrSelector is String, identifying whether to click or tap based on 'isMobile' flag
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
  async goToHome() {
    try {
      // Navigate to home page (baseURL)
      await this.page.goto('/');
    } catch (error) {
      console.error(`Failed to navigate to Home page: ${error.message}`);
    }
  }

  // Reject all Cookies if a cookie modal is present
  async rejectCookiesIfAsked() {
    if (await this.page.isVisible(this.selectors.cookiesModal)) {
      try {
        await this.page.waitForSelector(this.selectors.rejectAllCookiesButton);
        await this.clickOrTap(this.selectors.rejectAllCookiesButton);
        // Wait for the cookie modal to be hidden after clicking on the button
        await this.page.waitForSelector(this.selectors.cookiesModal, {
          state: 'hidden',
        });
      } catch (error) {
        console.error(`Failed to reject all Cookies: ${error.message}`);
      }
    }
  }

  // Navigate to home page and reject all Cookies if a cookie modal is present
  async goToHomeAndRejectCookies() {
    try {
      await this.goToHome();
      await this.rejectCookiesIfAsked();
    } catch (error) {
      console.error(
        `Failed to navigate to page and reject all Cookies: ${error.message}`
      );
    }
  }

  // Fill a form's search input field with a specified query string
  async fillSearchInput(query, pageOrFrame = this.page) {
    try {
      await pageOrFrame.waitForSelector(this.selectors.searchInputTextArea);
      await pageOrFrame.fill(this.selectors.searchInputTextArea, query);
    } catch (error) {
      console.error(`Failed to fill Search imput with query: ${error.message}`);
    }
  }

  // Sends a query string to a page's form by filling the search input and submitting the form using the Enter key
  async searchForQueryByEnter(query, pageOrFrame = this.page) {
    try {
      // Fill a form's search input field with a specified query string
      await this.fillSearchInput(query, pageOrFrame);
      // Simulate the pressing of the 'Enter' key in order to submit the form
      await pageOrFrame.press(this.selectors.searchInputTextArea, 'Enter');
    } catch (error) {
      console.error(
        `Failed to search for query by pressing enter: ${error.message}`
      );
    }
  }

  // Change to English if it's needed
  async changeToEnglishIfAsked() {
    if (await this.page.isVisible(this.selectors.changeToEnglishModal)) {
      try {
        await this.page.waitForSelector(this.selectors.changeToEnglishButton);
        await this.clickOrTap(this.selectors.changeToEnglishButton);
        // Wait for the language modal to be hidden after clicking on the button
        await this.page.waitForSelector(this.selectors.changeToEnglishModal, {
          state: 'hidden',
        });
      } catch (error) {
        console.error(`Failed to change to English: ${error.message}`);
      }
    }
  }

  // Wait for the search response from the server
  async waitForSearchResponse() {
    return this.page.waitForResponse(this.apiEndpoints.searchResults);
  }

  // Get Locator for selector on the Page or IFrame
  async getLocator(selector, pageOrIFrame = this.page) {
    try {
      await pageOrIFrame.waitForSelector(selector);
      return pageOrIFrame.locator(selector);
    } catch (error) {
      console.error(
        `Failed to get locator for selector '${selector}': ${error.message}`
      );
    }
  }

  // Get Locator object for Search results on the Page or IFrame
  async getSearchResultsLocator(pageOrIFrame = this.page) {
    try {
      return await this.getLocator(this.selectors.searchResult, pageOrIFrame);
    } catch (error) {
      console.error(`Failed to get search results: ${error.message}`);
    }
  }

  // Check if all search results contain query
  async checkIfAllSearchResultsContainQuery(searchResultsLocator, query) {
    try {
      // Get all individual search result elements
      const allSearchResultElements = await searchResultsLocator.all();
      // Get all words from the query as an array
      const queryWords = query.split(' ');
      let failedResults = [];

      for (let searchResultElement of allSearchResultElements) {
        // Get the text of each searchResult
        let resultText = await searchResultElement.innerText();

        // Check if the search result contains any query word
        const doesContainQueryWords =
          this.checkIfSearchResultsContainsQueryWords(resultText, queryWords);
        // If search result doesn't contain any query word, add it to the failed results array
        if (!doesContainQueryWords) {
          failedResults.push(resultText);
        }
      }

      // isSuccess is true if no items in failedResults
      return {
        isSuccess: failedResults.length === 0,
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
  checkIfSearchResultsContainsQueryWords(resultText, queryWords) {
    // The some() method tests whether at least one element in the array passes the test
    // Test if each of the queried word is in the resultText
    // This matching is done in a case-insensitive manner
    return queryWords.some((queryWord) =>
      new RegExp(escapeRegexSpecialCharacters(queryWord), 'i').test(resultText)
    );
  }

  // Get text content from an array of elements or Locator object
  async getTextContent(elementArrayOrLocator) {
    try {
      // Checks if the input is an array or locator
      // If it's a locator retrieves all elements else uses the array as is
      const elementsArray = Array.isArray(elementArrayOrLocator)
        ? elementArrayOrLocator
        : await elementArrayOrLocator.all();

      // Returns a promise that results in an array of the inner text of all the elements
      return Promise.all(
        elementsArray.map(async (element) => element.innerText())
      );
    } catch (error) {
      console.error(
        `Failed to get text content from an array of elements: ${error.message}`
      );
    }
  }
}
