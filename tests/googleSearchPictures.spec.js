import { expect } from '@playwright/test';
import test from '../hooks/testWithAfterEachHooks.mjs';
import GoogleHomePicturesPage from './pages/googleHomePicturesPage';
import { downloadImageFromUrlToTempDir, checkFileExists, deleteTempFile } from '../utilities/fileSystemHelpers';
import queryData from './test-data/queryData.json';
const query = queryData[2].query;

test.describe(`Google Home Pictures Page: Download picture by '${query}' query, Search by picture`, () => {
  let page; // Page instance
  let googleHomePicturesPage; // Page object instance

  // Navigate to Home page, reject all Cookies and search the query before each test in this block
  test.beforeEach(async ({ sharedContext }) => {
    page = await sharedContext.newPage();
    const isMobile = sharedContext._options.isMobile || false; // type of device is mobile
    googleHomePicturesPage = new GoogleHomePicturesPage(page, isMobile);
    await googleHomePicturesPage.navigateAndSearchPictures(query);
  });

  test(`User can download picture from test results, User can search by picture @skip-for-webkit @only-desktop`, async ({}) => {
    // Get description and picture link of the the 1st picture search result
    const { pictureDescription, imageUrl } = await googleHomePicturesPage.get1stPictureDescriptionAndDownloadPocture();
    // Download picture from url to the system's directory for temporary files
    const imagePath = await downloadImageFromUrlToTempDir(imageUrl);

    // Check if the picture downloaded
    const isPictureDownloaded = checkFileExists(imagePath);
    expect(isPictureDownloaded).toBe(true, 'The picture is not saved in the file system');

    // Upload the picture to search by picture
    await googleHomePicturesPage.uploadPictureToSearch(imagePath);

    // Get search results
    const searchResults = await googleHomePicturesPage.getSearchByPictureResults();

    // Delete the picture from PC
    deleteTempFile(imagePath);

    // Check if any search result description contains the downloaded picture description
    const doesAnySearchResultContainsPictureDescription = await googleHomePicturesPage.checkIfSearchResultsContainQuery(
      searchResults,
      pictureDescription
    );
    expect(doesAnySearchResultContainsPictureDescription).toBe(
      true,
      'There is no search result with description of the downloaded picture'
    );
  });
  test(`User can download picture from test results, User can search by picture @only-mobile`, async ({}) => {
    // Get description and picture link of the the 1st picture search result
    const { imageUrl } = await googleHomePicturesPage.get1stPictureDescriptionAndDownloadPocture();
    // Download picture from url to the system's directory for temporary files
    const imagePath = await downloadImageFromUrlToTempDir(imageUrl);

    // Check if the picture downloaded
    const isPictureDownloaded = checkFileExists(imagePath);
    expect(isPictureDownloaded).toBe(true, 'The picture is not saved in the file system');
  });
});
