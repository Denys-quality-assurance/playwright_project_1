import basePage from './basePage';
import { escapeRegexSpecialCharacters } from '../../utilities/regexHelper';

export default class GoogleSearchPicturesPage extends basePage {
  constructor(page, isMobile) {
    super(page, isMobile);

    this.selectors = {
      ...this.selectors,

      picturesSearchButton: this.isMobile
        ? `[href*="/webhp"]` // Pictures Search button for mobile
        : `[href*="/imghp"]`, // Pictures Search button for desktop
      firstSearchResult: this.isMobile
        ? `div.kb0PBd:first-of-type`
        : `[data-ri="0"]`, // 1st result in the list of results
      firstSearchResultText: this.isMobile
        ? `div.kb0PBd:first-of-type >> .Q6A6Dc`
        : `[data-ri="0"] >> .bytUYc`, // Text of the 1st result in the list of results
      picturePreview: this.isMobile
        ? `img.iPVvYb[src*="https"][role="button"]`
        : `[role="link"] img[src*="https"]`, // Preview of the picture in the result list
      searchByPictureButton: this.isMobile
        ? `.r5jQRd[role="link"]`
        : `.NGBa0b[role="button"]`, // Search by uploaded picture button for mobile and for desktop
      searchByPictureResults: `.UAiK1e[dir="ltr"]`, // List of results of search by picture
    };
  }

  // Navigate to Home page, reject all Cookies, navigate to Pictures and search for query
  async navigateAndSearchPictures(query) {
    try {
      await this.navigateAndRejectCookies();
      await this.page.waitForSelector(this.selectors.picturesSearchButton);
      await this.clickOrTap(this.selectors.picturesSearchButton);
      await this.page.waitForNavigation();
      await this.searchForQueryByEnter(query);
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
      await this.page.waitForSelector(this.selectors.picturePreview);
      return this.page.locator(this.selectors.picturePreview);
    } catch (error) {
      console.error(`Failed to open picture preview: ${error.message}`);
    }
  }

  // Get description and picture link of the the 1st picture search result
  async get1stPictureDescriptionAndDownload() {
    try {
      // Get text from the 1st search result
      const pictureDescription = await this.page
        .locator(this.selectors.firstSearchResultText)
        .innerText();

      // Click on the 1st search result to open picture preview
      const picturePreview = await this.openPicturePreview(
        this.selectors.firstSearchResult
      );

      // Get picture link of the preview
      const imageUrl = await picturePreview.getAttribute('src');
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
      console.error(
        `Failed to open upload picture to search: ${error.message}`
      );
    }
  }

  // Get Search by picture results
  async getSearchByPictureResultsLocator() {
    try {
      await this.page.waitForSelector(this.selectors.searchByPictureResults);
      return this.page.locator(this.selectors.searchByPictureResults);
    } catch (error) {
      console.error(
        `Failed to get search by picture results: ${error.message}`
      );
    }
  }

  // Check if any search result contains query
  async checkIfAnySearchResultContainsQuery(searchResultsLocator, query) {
    try {
      // Collect all elements of search results
      const allSearchResultElements = await searchResultsLocator.all();
      // Case insensitive regex for the query
      let queryRegex = new RegExp(escapeRegexSpecialCharacters(query), 'i'); // 'i' flag for case insensitive

      for (let searchResult of allSearchResultElements) {
        // Get the text of each searchResult
        let resultText = await searchResult.innerText();

        // Check if the text contains query
        if (queryRegex.test(resultText)) {
          // Stop iteration if we found a match
          return true;
        }
      }
      return false;
    } catch (error) {
      console.error(
        `Failed to validate search results contain query: ${error.message}`
      );
    }
  }
}
