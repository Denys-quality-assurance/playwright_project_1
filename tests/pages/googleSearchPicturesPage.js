import { escapeRegexSpecialCharacters } from '../../utilities/regexHelper';

export default class GoogleSearchPicturesPage {
  constructor(page, isMobile) {
    this.page = page;
    this.isMobile = isMobile; // type of device is mobile
    this.selectors = {
      cookiesModal: `#CXQnmb`, // Cookies consent modal
      rejectAllCookiesButton: `button#W0wltc`, // Reject all cookies button
      picturesSearchButton: this.isMobile
        ? `[href*="/webhp"]` // Pictures Search button for mobile
        : `[href*="/imghp"]`, // Pictures Search button for desktop
      searchInputTextArea: `textarea[name=q]`, // Search query imput area
      firstSearchResult: `[data-ri="0"]`, // 1st result in the list of results
      firstSearchResultText: `[data-ri="0"] >> .bytUYc`, // Text of the 1st result in the list of results
      picturePriview: `[role="link"] img[src*="https"]`, // Preview of the picture in the result list
      searchByPictureButton: this.isMobile ? `.r5jQRd[role="link"]` : `.NGBa0b[role="button"]`, // Search by uploaded picture button for mobile and for desktop
      pictureUploadButton: `.DV7the[role="button"]`, // Picture upload button of search by picture modal
      searchByPictureResults: `.UAiK1e[dir="ltr"]`, // List of results of search by picture
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

  // Navigate to Home page
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
        await this.clickOrTap(this.selectors.rejectAllCookiesButton);
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
      await this.rejectCookiesIfAsked();
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
      await this.page.waitForSelector(this.selectors.picturesSearchButton);
      await this.clickOrTap(this.selectors.picturesSearchButton);
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
      await this.clickOrTap(picture);
      await this.page.waitForSelector(this.selectors.picturePriview);
      return this.page.$(this.selectors.picturePriview);
    } catch (error) {
      console.error(`Failed to open picture preview: ${error.message}`);
    }
  }

  // Get description and picture link of the the 1st picture search result
  async get1stPictureDescriptionAndDownload() {
    try {
      // Get text from the 1st search result
      await this.page.waitForSelector(this.selectors.firstSearchResultText);
      const pictureDescription = await this.page.$eval(this.selectors.firstSearchResultText, (el) => el.innerText);

      // Click on the 1st search result to open picture preview
      const picturePriview = await this.openPicturePreview(this.selectors.firstSearchResult);

      // Get picture link of the preview
      const imageUrl = await picturePriview.getAttribute('src');
      return { pictureDescription, imageUrl };
    } catch (error) {
      console.error(
        `Failed to get description and picture link of the the 1st picture search result: ${error.message}`
      );
    }
  }

  // Upload the picture to search by picture
  async uploadPictureToSearch(imagePath) {
    try {
      // Click on the Search by picture button to open picture upload area
      await this.page.waitForSelector(this.selectors.searchByPictureButton);
      await this.clickOrTap(this.selectors.searchByPictureButton);
      await this.page.waitForSelector(this.selectors.pictureUploadButton);

      // Listen for the 'filechooser' event that triggers when file chooser dialog opens
      this.page.on('filechooser', async (fileChooser) => {
        // Set files for upload. Provide your own file path
        await fileChooser.setFiles(imagePath);
      });

      // Click the button that opens the file chooser dialog
      await this.clickOrTap(this.selectors.pictureUploadButton);
    } catch (error) {
      console.error(`Failed to open upload picture to search: ${error.message}`);
    }
  }

  // Get Search by picture results
  async getSearchByPictureResultElements() {
    try {
      await this.page.waitForSelector(this.selectors.searchByPictureResults);
      const searchByPictureResultElements = await this.page.$$(this.selectors.searchByPictureResults);
      return searchByPictureResultElements;
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

  // Check if any search result contains query
  async checkIfAnySearchResultContainsQuery(searchResults, query) {
    try {
      let result = false;
      for (let searchResult of searchResults) {
        // Get the text of each searchResult
        let resultText = await searchResult.innerText();
        // Case insensitive regex for the query
        let queryRegex = new RegExp(escapeRegexSpecialCharacters(query), 'i'); // 'i' flag for case insensitive

        // Check if the text contains query
        if (queryRegex.test(resultText)) {
          result = true;
        }
      }
      return result;
    } catch (error) {
      console.error(`Failed to validate search results contain query: ${error.message}`);
    }
  }
}
