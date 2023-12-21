const { test, expect } = require('@playwright/test');
const GoogleHomePicturesPage = require('./pages/googleHomePicturesPage');
const { downloadImageFromUrlToTempDir, checkFileExists, deleteTempFile } = require('../utilities/fileSystemHelpers');
const query = 'cat jpg';

test.describe(`Google Home Pictures Page: Download picture by query, Search by picture`, () => {
  test(`User can download picture from test results, User can search by picture`, async ({ page }) => {
    // Navigate to Home page, reject all Cookies and search the query before each test in this block
    let googleHomePicturesPage = new GoogleHomePicturesPage(page);
    await googleHomePicturesPage.navigateAndSearchPictures(query);

    // Get text from the 1st search result
    const pictureDescription = await page.$eval(googleHomePicturesPage.firstSearchResultTest, (el) => el.innerText);

    // Click on the 1st search result to open picture preview
    await page.click(googleHomePicturesPage.firstSearchResult);
    await page.waitForSelector(googleHomePicturesPage.picturePriview);
    const picturePriview = await page.$(googleHomePicturesPage.picturePriview);

    // Get picture link of the preview
    const imageUrl = await picturePriview.getAttribute('src');
    console.log('imageUrl: ', imageUrl);

    // Download picture from url to the system's directory for temporary files
    const imagePath = await downloadImageFromUrlToTempDir(imageUrl);

    // Check picture downloaded
    checkFileExists(imagePath);

    // Click on the Search by picture button to open picture upload area
    await page.click(googleHomePicturesPage.searchByPictureButton);
    await page.waitForSelector(googleHomePicturesPage.pictureUploadButton);

    // Listen for the 'filechooser' event that triggers when file chooser dialog opens
    page.on('filechooser', async (fileChooser) => {
      // Set files for upload. Provide your own file path
      await fileChooser.setFiles(imagePath);
    });

    // Click the button that opens the file chooser dialog
    await page.click(googleHomePicturesPage.pictureUploadButton); // Replace with your own selector

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
