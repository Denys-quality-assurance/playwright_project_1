import { expect } from '@playwright/test';
import test from '../hooks/testWithAfterEachHooks.mjs';
import GoogleHomePicturesPage from './pages/googleHomePicturesPage';
import { downloadImageFromUrlToTempDir, checkFileExists, deleteTempFile } from '../utilities/fileSystemHelpers';
const query = 'cat jpg';

test.describe(`Google Home Pictures Page: Download picture by query, Search by picture`, () => {
  let page; // Page instance
  let googleHomePicturesPage; // Page object instance

  // Navigate to Home page, reject all Cookies and search the query before each test in this block
  test.beforeEach(async ({ sharedContext }) => {
    page = await sharedContext.newPage();
    googleHomePicturesPage = new GoogleHomePicturesPage(page);
    await googleHomePicturesPage.navigateAndSearchPictures(query);
  });

  test(`User can download picture from test results, User can search by picture @skip-for-webkit`, async ({}) => {
    // Get text from the 1st search result
    const pictureDescription = await page.$eval(
      googleHomePicturesPage.selectors.firstSearchResultText,
      (el) => el.innerText
    );

    // Click on the 1st search result to open picture preview
    const picturePriview = await googleHomePicturesPage.openPicturePreview(
      googleHomePicturesPage.selectors.firstSearchResult
    );

    // Get picture link of the preview
    const imageUrl = await picturePriview.getAttribute('src');

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
});
