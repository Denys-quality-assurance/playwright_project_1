/*
 * Google Search Pictures Test Suite:
 * This suite of tests validates the functionality of Google Search for Pictures.
 *
 * Setup: The suite creates a page instance and a Google Search Pictures Page object.
 * It navigates to the home page, rejects all cookies, and performs a search query.
 *
 * Useful methods for picture interaction are specified in the GoogleSearchPicturesPage class.
 * Helper functions for download, file existence check, and file deletion are imported from fileSystemHelper.
 *
 * The data for the search queries is imported from queryData.
 *
 */

import { expect } from '@playwright/test';
import test from '../../../hooks/testWithAfterEachHooks.mjs';
import GoogleSearchPicturesPage from '../../pages/googleSearchPicturesPage';
import {
  downloadImageFromUrlToTempDir,
  checkFileExists,
  deleteFileAtPath,
} from '../../../utilities/fileSystemHelper';
import { escapeRegexSpecialCharacters } from '../../../utilities/regexHelper';
import { queryDataGeneral } from '../../test-data/googleSearch/queryData';

const testStatus = {
  SKIPPED: 'skipped',
};

const query = queryDataGeneral[1].query;
const queryWithExtension = query + ' jpg';

test.describe(`Google Home Pictures Page: Download picture by '${query}' query, Search by picture`, () => {
  // Test should be failed when the condition is true: there is at least 1 unfixed bug
  test.fail(
    ({ shouldFailTest }) => shouldFailTest > 0,
    `Test marked as "should fail" due to the presence of unfixed bug(s)`
  );
  // Test should be skipped when the condition is true: flag skipTestsWithKnownBugs is 'true' and there is at least 1 unfixed bug
  test.skip(
    ({ shouldSkipTest }) => shouldSkipTest,
    `Test skipped due to the presence of unfixed bug(s)`
  );

  let page; // Page instance
  let googleSearchPicturesPage; // Page object instance

  // Navigate to Home page, reject all Cookies and search the query
  test.beforeEach(
    'Navigate to Home page, reject all Cookies and search the query',
    async ({ sharedContext }, testInfo) => {
      // Prepare the test only if the test is not skipped
      if (testInfo.expectedStatus !== testStatus.SKIPPED) {
        page = await sharedContext.newPage();
        const isMobile = sharedContext._options.isMobile || false; // type of device is mobile
        googleSearchPicturesPage = new GoogleSearchPicturesPage(page, isMobile);
        await googleSearchPicturesPage.goToHomeAndSearchPictures(
          queryWithExtension
        );
      }
    }
  );

  test(`TEST-23: User can download picture from test results, User can search by picture @skip-for-webkit @only-desktop`, async ({}, testInfo) => {
    // Get description and picture link of the the 1st picture search result
    const { pictureDescription, imageUrl } =
      await googleSearchPicturesPage.getFirstPictureDescriptionAndDownloadLink();
    // Case insensitive regex for the query
    let queryRegex = new RegExp(escapeRegexSpecialCharacters(query), 'i'); // 'i' flag for case insensitive
    // Check if the picture's description contains the query
    expect(
      queryRegex.test(pictureDescription),
      `The picture's description doesn't contain the query`
    ).toBe(true);

    // Download picture from url to the system's directory for temporary files
    const imagePath = await downloadImageFromUrlToTempDir(imageUrl, testInfo);

    // Check if the picture downloaded
    const isPictureDownloaded = checkFileExists(imagePath);
    expect(
      isPictureDownloaded,
      'The picture is not saved in the file system'
    ).toBe(true);

    // Upload the picture to search by picture
    await googleSearchPicturesPage.performPictureSearchByUploading(imagePath);

    // Get search results
    const searchResultsLocator =
      await googleSearchPicturesPage.getSearchByPictureResultsLocator();

    // Delete the picture from PC
    deleteFileAtPath(imagePath);

    // Check if any search result description contains the downloaded picture query
    const doesAnySearchResultContainsPictureQuery =
      await googleSearchPicturesPage.checkIfAnySearchResultContainsQuery(
        searchResultsLocator,
        query
      );
    expect(
      doesAnySearchResultContainsPictureQuery,
      'There is no search result with query of the downloaded picture'
    ).toBe(true);
  });

  test(`TEST-24: User can download picture from test results, User can search by picture @only-mobile`, async ({}, testInfo) => {
    // Get description and picture link of the the 1st picture search result
    const { pictureDescription, imageUrl } =
      await googleSearchPicturesPage.getFirstPictureDescriptionAndDownloadLink();
    // Case insensitive regex for the query
    let queryRegex = new RegExp(escapeRegexSpecialCharacters(query), 'i'); // 'i' flag for case insensitive
    // Check if the picture's description contains the query
    expect(
      queryRegex.test(pictureDescription),
      `The picture's description doesn't contain the query`
    ).toBe(true);

    // Download picture from url to the system's directory for temporary files
    const imagePath = await downloadImageFromUrlToTempDir(imageUrl, testInfo);

    // Check if the picture downloaded
    const isPictureDownloaded = checkFileExists(imagePath);
    expect(
      isPictureDownloaded,
      'The picture is not saved in the file system'
    ).toBe(true);

    // Delete the picture from PC
    deleteFileAtPath(imagePath);
  });
});
