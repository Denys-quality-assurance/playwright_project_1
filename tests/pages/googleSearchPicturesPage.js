/*
 * The `GoogleSearchPicturesPage` class is a Page Object Model that represents the Google Picture Search Page.
 * This class extends from a `BasePage` class and provides abstraction for the structure and behavior of the web page.
 *
 * With methods such as searching and navigating through pages, viewing picture previews, retrieving picture description
 * and download link, performing a picture-based search, and checking if search results contain a specified query,
 * the class provides a way to interact with the page.
 *
 */

import BasePage from './basePage';
import { escapeRegexSpecialCharacters } from '../../utilities/regexHelper';

const PICTURES_PAGE_URL_PART = '/imghp?'; // Part of picture search results URL

export default class GoogleSearchPicturesPage extends BasePage {
  constructor(page, isMobile) {
    super(page, isMobile);

    this.selectors = {
      ...this.selectors,

      picturesSearchButton: this.isMobile
        ? `[href*="/webhp"]` // Pictures Search button for mobile
        : `[href*="/imghp"]`, // Pictures Search button for desktop
      firstSearchResult: this.isMobile
        ? `div.kb0PBd:first-of-type` // 1st result in the list of results for mobile
        : `[data-ri="0"]`, // 1st result in the list of results for desktop
      firstSearchResultText: this.isMobile
        ? `div.kb0PBd:first-of-type >> .Q6A6Dc` // Text of the 1st result in the list of results for mobile
        : `[data-ri="0"] >> .bytUYc`, // Text of the 1st result in the list of results for desktop
      picturePreview: this.isMobile
        ? `img.iPVvYb[src*="https"][role="button"]` // Preview of the picture in the result list for mobile
        : `[role="link"] img[src*="https"]`, // Preview of the picture in the result list for desktop
      searchByPictureButton: this.isMobile
        ? `.r5jQRd[role="link"]` // Search by uploaded picture button for mobile
        : `.NGBa0b[role="button"]`, // Search by uploaded picture button for desktop
      searchByPictureResults: `.UAiK1e[dir="ltr"]`, // List of results of search by picture
    };
  }

  // Navigate to Home page, reject all Cookies, navigate to Pictures and search for query
  async goToHomeAndSearchPictures(query) {
    try {
      // Navigate to home page and reject all cookies
      await this.goToHomeAndRejectCookies();
      await this.page.waitForSelector(this.selectors.picturesSearchButton);
      // Navigate to Pictures
      await this.clickOrTap(this.selectors.picturesSearchButton);
      await this.page.waitForNavigation({
        url: (url) => url.toString().includes(PICTURES_PAGE_URL_PART),
      });
      // Search for the specific query
      await this.searchForQueryByEnter(query);
    } catch (error) {
      console.error(
        `Failed to navigate to Home page, reject all Cookies, navigate to Pictures and search for query: ${error.message}`
      );
    }
  }

  // Click on a selected search result to open picture preview
  async viewSelectedPictureInPreview(picture) {
    try {
      // Click on selected picture
      await this.clickOrTap(picture);
      return await this.getLocator(this.selectors.picturePreview);
    } catch (error) {
      console.error(`Failed to open picture preview: ${error.message}`);
    }
  }

  // Get the description and the download link of the first result from the picture search
  async getFirstPictureDescriptionAndDownloadLink() {
    try {
      // Get Locator for firstSearchResultText
      const firstSearchResultTextLocator = await this.getLocator(
        this.selectors.firstSearchResultText
      );
      // Get the text description from the first search result
      const pictureDescription = await firstSearchResultTextLocator.innerText();

      // Click on the 1st search result to open picture preview
      const picturePreview = await this.viewSelectedPictureInPreview(
        this.selectors.firstSearchResult
      );

      // Get the source URL of the picture from the preview
      const imageUrl = await picturePreview.getAttribute('src');

      return { pictureDescription, imageUrl };
    } catch (error) {
      console.error(
        `Failed to get description and picture link of the the 1st picture search result: ${error.message}`
      );
    }
  }

  // Upload a picture and perform a picture-based search
  async performPictureSearchByUploading(imagePath) {
    try {
      // Click on the "Search by picture" button to open the picture upload area
      await this.page.waitForSelector(this.selectors.searchByPictureButton);
      await this.clickOrTap(this.selectors.searchByPictureButton);
      await this.page.waitForSelector(this.selectors.pictureUploadButton);

      // Listen for the 'filechooser' event, which triggers when the file chooser dialog opens
      this.page.on('filechooser', async (fileChooser) => {
        // Set the path of the file to be uploaded
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

  // Get Locator object of Search by picture results
  async getSearchByPictureResultsLocator() {
    try {
      // Return a Locator for the search results element
      return await this.getLocator(this.selectors.searchByPictureResults);
    } catch (error) {
      console.error(
        `Failed to get search by picture results: ${error.message}`
      );
    }
  }

  // Checks if any of the returned search results contain a specified query
  async checkIfAnySearchResultContainsQuery(searchResultsLocator, query) {
    try {
      // Get an array of individual search result elements
      const allSearchResultElements = await searchResultsLocator.all();
      // Case-insensitive regex for the query
      let queryRegex = new RegExp(escapeRegexSpecialCharacters(query), 'i'); // 'i' flag for case insensitive

      // Loop through each search result element
      for (let searchResult of allSearchResultElements) {
        // Get the text of the specific search result
        let resultText = await searchResult.innerText();

        // Check if the specific search result text contains the query
        if (queryRegex.test(resultText)) {
          // If a search result contains the query, stop checking the rest and return true
          return true;
        }
      }

      // If no search results contain the query, return false
      return false;
    } catch (error) {
      console.error(
        `Failed to validate search results contain query: ${error.message}`
      );
    }
  }
}
