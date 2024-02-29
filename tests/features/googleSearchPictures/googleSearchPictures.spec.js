import { expect } from '@playwright/test';
import test from '../../../hooks/testWithAfterEachHooks.mjs';
import GoogleSearchPicturesPage from '../../pages/googleSearchPicturesPage';
import { downloadImageFromUrlToTempDir, checkFileExists, deleteTempFile } from '../../../utilities/fileSystemHelper';
import { escapeRegexSpecialCharacters } from '../../../utilities/regexHelper';
import { queryDataGeneral } from '../../test-data/googleSearch/queryData';
const query = queryDataGeneral[1].query;
const queryWithExtension = query + ' jpg';

test.describe(`Google Home Pictures Page: Download picture by '${query}' query, Search by picture`, () => {
  let page; // Page instance
  let googleSearchPicturesPage; // Page object instance

  // Navigate to Home page, reject all Cookies and search the query
  test.beforeEach('Navigate to Home page, reject all Cookies and search the query', async ({ sharedContext }) => {
    page = await sharedContext.newPage();
    const isMobile = sharedContext._options.isMobile || false; // type of device is mobile
    googleSearchPicturesPage = new GoogleSearchPicturesPage(page, isMobile);
    await googleSearchPicturesPage.navigateAndSearchPictures(queryWithExtension);
  });

  test(`User can download picture from test results, User can search by picture @skip-for-webkit @only-desktop`, async ({}, testInfo) => {
    // Get description and picture link of the the 1st picture search result
    const { pictureDescription, imageUrl } = await googleSearchPicturesPage.get1stPictureDescriptionAndDownload();
    // Case insensitive regex for the query
    let queryRegex = new RegExp(escapeRegexSpecialCharacters(query), 'i'); // 'i' flag for case insensitive
    // Check if the picture's description contains the query
    expect(queryRegex.test(pictureDescription)).toBe(true, `The picture's description doesn't contain the query`);

    // Download picture from url to the system's directory for temporary files
    const imagePath = await downloadImageFromUrlToTempDir(imageUrl, testInfo);

    // Check if the picture downloaded
    const isPictureDownloaded = checkFileExists(imagePath);
    expect(isPictureDownloaded).toBe(true, 'The picture is not saved in the file system');

    // Upload the picture to search by picture
    await googleSearchPicturesPage.uploadPictureToSearch(imagePath);

    // Get search results
    const searchResults = await googleSearchPicturesPage.getSearchByPictureResultElements();

    // Delete the picture from PC
    deleteTempFile(imagePath);

    // Check if any search result description contains the downloaded picture query
    const doesAnySearchResultContainsPictureQuery = await googleSearchPicturesPage.checkIfAnySearchResultContainsQuery(
      searchResults,
      query
    );
    expect(doesAnySearchResultContainsPictureQuery).toBe(
      true,
      'There is no search result with query of the downloaded picture'
    );
  });

  test(`User can download picture from test results, User can search by picture @only-mobile`, async ({}, testInfo) => {
    // Get description and picture link of the the 1st picture search result
    const { pictureDescription, imageUrl } = await googleSearchPicturesPage.get1stPictureDescriptionAndDownload();
    // Case insensitive regex for the query
    let queryRegex = new RegExp(escapeRegexSpecialCharacters(query), 'i'); // 'i' flag for case insensitive
    // Check if the picture's description contains the query
    expect(queryRegex.test(pictureDescription)).toBe(true, `The picture's description doesn't contain the query`);

    // Download picture from url to the system's directory for temporary files
    const imagePath = await downloadImageFromUrlToTempDir(imageUrl, testInfo);

    // Check if the picture downloaded
    const isPictureDownloaded = checkFileExists(imagePath);
    expect(isPictureDownloaded).toBe(true, 'The picture is not saved in the file system');

    // Delete the picture from PC
    deleteTempFile(imagePath);
  });
});