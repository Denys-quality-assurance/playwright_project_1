/*
 * The `GoogleSearchPage` class is a Page Object Model that represents the Google Search Page.
 * This class extends from a `BasePage` class and provides abstraction for the structure and behavior of the web page.
 *
 * The class provides a way to interact with the page, including performance tracking,
 * retrieving cookie and storage values, mocking a search response.
 *
 */

import BasePage from './basePage';
import {
  readDataFromFileSync,
  generateUniqueFileName,
  getTempFilePath,
  writeDataToFileAsync,
} from '../../utilities/fileSystemHelper';
import { escapeRegexSpecialCharacters } from '../../utilities/regexHelper';

const responseBodyForEmptyResultsMockPath =
  './tests/test-data/googleSearch/mocks/responseBodyForEmptyResults.html'; // HTML body for the mock response
const SEARCH_RESULTS_PAGE_URL_PART = '/search?q='; // Part of search results page URL
const PERF_MARK_STARTED = 'Perf:Started'; // 'Start marker' name for Performance.mark API
const PERF_MARK_ENDED = 'Perf:Ended'; // 'End marker' name for Performance.mark API
const PERF_MEASURE_NAME = 'action'; // Name of the performance measure for Performance.mark API
const PERF_ENTRY_TYPE = 'mark'; // Type of entries for Performance.mark API

export default class GoogleSearchPage extends BasePage {
  constructor(page, isMobile) {
    super(page, isMobile);

    this.selectors = {
      ...this.selectors,

      searchButton: `.FPdoLc >> .gNO89b[role="button"]`, // Search button on the Home page
      searchInputBox: this.isMobile ? `div.zGVn2e` : `.RNNXgb[jsname="RNNXgb"]`, // // Search imput box for mobile and for desktop
      autoSuggestionOption: `[role="option"]`, // One search auto suggestion option
      resultsNumberAndTimeMessage: `.LHJvCe >> #result-stats`, // Message with text “About X results (Y.YY seconds) ”
      didNotMatchText: `text=" - did not match any documents."`, // Message with text “did not match any documents”
      correctedQuery: `.p64x9c.KDCVqf`, // The corrected query text for the misspelled query in the message "Showing results for <correcter query>"
      webPageTitle: this.isMobile ? `.v7jaNc` : `.LC20lb`, // One title of the web page in the search result for mobile and for desktop
      webPageUrl: this.isMobile ? `.cz3goc` : `[jsname="UWckNb"]`, // One URL of the web page in the search result for mobile and for desktop
      searchResultsDescription: `.VwiC3b`, // One description of the web page in the search result
      googleLogo: this.isMobile ? `#hplogo` : `.lnXdpd[alt="Google"]`, // Google Logo for mobile and for desktop
      videoFilterButton: `.LatpMc[href*="tbm=vid"]`, // Video filter button under the main search query imput area
    };
    this.classes = {
      picturesSearchButton: `nDcEnd`, // Pictures Search button
      closeSearchByPictureModalButton: `BiKNf`, // Close button of the the search by picture modal
    };
  }

  // Get Locator object of Search auto suggestions
  async getSearchAutoSuggestionOptionsLocator() {
    try {
      return await this.getLocator(this.selectors.autoSuggestionOption);
    } catch (error) {
      console.error(
        `Failed to get search auto suggestion options elements: ${error.message}`
      );
    }
  }

  // Get Search auto suggestions text
  async getSearchAutoSuggestionOptions() {
    try {
      const searchAutoSuggestionOptionsLocator =
        await this.getSearchAutoSuggestionOptionsLocator();
      // Get text content from searchAutoSuggestionOptions
      const searchAutoSuggestionOptionsText = await this.getTextContent(
        searchAutoSuggestionOptionsLocator
      );
      return searchAutoSuggestionOptionsText;
    } catch (error) {
      console.error(`Failed to get search auto suggestions: ${error.message}`);
    }
  }

  // Get the text of the message with the total number of results and the time taken to fetch the result
  async getResultsNumberAndTimeMessageText() {
    try {
      const resultsNumberAndTimeMessageLocator = await this.getLocator(
        this.selectors.resultsNumberAndTimeMessage
      );
      // Get text content from resultsNumberAndTimeMessageLocator
      return await resultsNumberAndTimeMessageLocator.innerText();
    } catch (error) {
      console.error(
        `Failed to get the text of the message with the total number of results and the time taken to fetch the result: ${error.message}`
      );
    }
  }

  // Get the 1st element with expected query
  async getFirstElementWithQuery(locator, query) {
    try {
      // Get an array of individual elements
      const elements = await locator.all();
      for (const element of elements) {
        // get the text content of the element
        const textContent = await element.innerText();

        // check if the text content contains the query
        if (textContent.includes(query)) {
          return element; // return the element if the text content contains the query
        }
      }

      // return null if no matching element was found
      return null;
    } catch (error) {
      console.error(
        `Failed to the 1st  element with expected query: ${error.message}`
      );
    }
  }

  // Check if any auto-suggestion contains the expected approptiate option
  async checkIfAnyAutoSuggestionOptionContainQuery(
    searchAutoSuggestionOptionsText,
    query
  ) {
    try {
      // Get all words from the query as an array
      const queryWords = query.split(' ');

      for (let optionText of searchAutoSuggestionOptionsText) {
        // Check if the option contains any query word
        if (
          this.checkIfSearchResultsContainsQueryWords(optionText, queryWords)
        ) {
          return true;
        }
      }
      return false; // No option contains the query
    } catch (error) {
      console.error(
        `Failed to check if any auto-suggestion option contains the query: ${error.message}`
      );
    }
  }

  // Search for query by clicking on search button
  async searchForQueryBySearchButton(query) {
    try {
      // Fill Search imput with query
      await this.fillSearchInput(query);
      // Submit the query by clicking on search button
      await this.page.waitForSelector(this.selectors.searchButton);
      await this.clickOrTap(this.selectors.searchButton);
      // Waiting for search result page to appear
      await this.page.waitForNavigation({
        url: (url) => url.toString().includes(SEARCH_RESULTS_PAGE_URL_PART),
      });
    } catch (error) {
      console.error(
        `Failed to search for query by clicking on search button: ${error.message}`
      );
    }
  }

  // Navigate to page, reject all Cookies and search for query
  async goToHomeAndSearch(query) {
    try {
      await this.goToHomeAndRejectCookies();
      await this.searchForQueryByEnter(query);
    } catch (error) {
      console.error(
        `Failed to navigate to page, reject all Cookies and search for query: ${error.message}`
      );
    }
  }

  // Get number of query instances in the page body
  async countQueryInBody(query) {
    try {
      const bodyText = await this.page.textContent('body');
      return (
        bodyText.match(new RegExp(escapeRegexSpecialCharacters(query), 'g')) ||
        []
      ).length;
    } catch (error) {
      console.error(
        `Failed to get the number of query instances in the page body: ${error.message}`
      );
    }
  }

  // Mock the search response with Empty Results by loading data from a file and setting up playwright routes with the loaded data
  async mockEmptySearchResponse(sharedContext, query) {
    try {
      // Read the mock response data from the specified file path
      let responseBodyForEmptyResults = readDataFromFileSync(
        responseBodyForEmptyResultsMockPath
      );
      // Replace all instances of 'Query' within the data with the provided search query
      responseBodyForEmptyResults = responseBodyForEmptyResults.toString();
      const responseBodyForEmptyResultsCurrentQuery =
        responseBodyForEmptyResults.replace(/Query/g, query);

      // Set up a playwright route for the search results endpoint to always return the modified mock data when called
      await sharedContext.route(this.apiEndpoints.searchResults, (route) => {
        route.fulfill({
          status: 200,
          contentType: 'text/html; charset=UTF-8',
          body: responseBodyForEmptyResultsCurrentQuery,
        });
      });
    } catch (error) {
      console.error(
        `Failed to mock the search response with Empty Results: ${error.message}`
      );
    }
  }

  // Get Locator object of Search results descriptions
  async getSearchResultsDescriptionLocator() {
    try {
      return await this.getLocator(this.selectors.searchResultsDescription);
    } catch (error) {
      console.error(
        `Failed to get search results descriptions: ${error.message}`
      );
    }
  }

  // Get titles of the web pages in the search results
  async getSearchResultsWebPagesTitles() {
    try {
      const searchResultsWebPagesTitlesLocator = await this.getLocator(
        this.selectors.webPageTitle
      );
      // Get text content from searchResultsWebPagesTitles
      const searchResultsWebPagesTitlesText = await this.getTextContent(
        searchResultsWebPagesTitlesLocator
      );
      return searchResultsWebPagesTitlesText;
    } catch (error) {
      console.error(
        `Failed to get titles of the web pagep in the search results: ${error.message}`
      );
    }
  }

  // Get corrected query text for the misspelled query in the message "Showing results for <correcter query>"
  async getCorrectedQueryFormMessageText() {
    try {
      const correctedQueryLocator = await this.getLocator(
        this.selectors.correctedQuery
      );
      // Get text content from correctedQueryLocator
      return await correctedQueryLocator.innerText();
    } catch (error) {
      console.error(
        `Failed to get corrected query text for the misspelled query in the message "Showing results for <correcter query>": ${error.message}`
      );
    }
  }

  // Get Locator object of elements with web pages URLs in the search results
  async getSearchResultsWebPagesUrlsLocator() {
    try {
      return await this.getLocator(this.selectors.webPageUrl);
    } catch (error) {
      console.error(
        `Failed to get URLs of the web pagep in the search results: ${error.message}`
      );
    }
  }

  // Check if all search results contain highlighted query in descriptions of the web pages
  async checkIfAllSearchResultsContainHighlightedQuery(
    searchResultsDescriptionLocator,
    query
  ) {
    try {
      // Split the query into individual words
      const queryWords = query.split(' ');
      // Get an array of individual elements
      const searchResultsDescriptions =
        await searchResultsDescriptionLocator.all();

      // Get the HTML of each searchResultsDescription
      const searchDescriptionsHTML = await Promise.all(
        searchResultsDescriptions.map(
          async (description) => await description.innerHTML()
        )
      );

      // Test each HTML description to see if it contains any of the query words. Store any that fail this check
      const failedResults = searchDescriptionsHTML.filter(
        (descriptionHTML) =>
          !this.hasHighlightedWords(descriptionHTML, queryWords)
      );

      // isSuccess is true if no items in failedResults
      return {
        isSuccess: failedResults.length === 0,
        failedDescriptionHTML: failedResults,
        failedQuery: query,
      };
    } catch (error) {
      console.error(
        `Failed to check if all search results contain highlighted query in descriptions of the web pages: ${error.message}`
      );
    }
  }

  // Check if the HTML text contains any query word highlighted
  hasHighlightedWords(HTMLText, queryWords) {
    // Get arrays of 'highlighted' words enclosed with <em></em> tags
    const highlightedWords = HTMLText.split('<em>')
      .filter((word) => word.includes('</em>'))
      .map((word) => word.split('</em>')[0]);

    // Check each highlighted word if it includes any of the query word
    for (let highlightedWord of highlightedWords) {
      const highlightedParts = highlightedWord.split(' ');

      if (
        highlightedParts.some((part) =>
          queryWords.some((queryWord) =>
            new RegExp(escapeRegexSpecialCharacters(queryWord), 'i').test(part)
          )
        )
      ) {
        return true;
      }
    }
    return false;
  }

  // Get href attributes from array of objects
  async getHrefAttributes(objects) {
    try {
      return await Promise.all(
        objects.map((element) => element.getAttribute('href'))
      );
    } catch (error) {
      console.error(
        `Failed to get href attributes from array of objects: ${error.message}`
      );
    }
  }

  // Get local storage
  async getLocalStoragetData(page) {
    try {
      return await page.evaluate(() => window.localStorage);
    } catch (error) {
      console.error(`Failed to get local storage: ${error.message}`);
    }
  }

  // Get local storage items by keys
  async getLocalStorageItemsByKeys(page, keys) {
    try {
      const localStorageItemsByKeys = await page.evaluate((keys) => {
        let data = {};
        keys.forEach((key) => {
          // Get the value of the current key from local storage and assign it to the data object
          data[key] = window.localStorage.getItem(key);
        });
        return data;
      }, keys);
      return localStorageItemsByKeys;
    } catch (error) {
      console.error(
        `Failed to get local storage items by keys: ${error.message}`
      );
    }
  }

  // Get session storage
  async getSessionStorageData() {
    try {
      return await this.page.evaluate(() => window.sessionStorage);
    } catch (error) {
      console.error(`Failed to get session storage: ${error.message}`);
    }
  }

  // Get session storage items by keys
  async getSessionStorageItemsByKeys(page, keys) {
    try {
      const sessionStorageItemsByKeys = await page.evaluate((keys) => {
        let data = {};
        keys.forEach((key) => {
          // Get the value of the current key from session storage and assign it to the data object
          data[key] = window.sessionStorage.getItem(key);
        });
        return data;
      }, keys);
      return sessionStorageItemsByKeys;
    } catch (error) {
      console.error(
        `Failed to get session storage items by keys: ${error.message}`
      );
    }
  }

  // Check if all expected keys exist in the object
  async checkIfAllKeysExist(getItemsByKeys, page, keys) {
    try {
      let missingKeys = [];
      // Run loop until all keys are detected in the Storage, up to 20 attempts
      for (let i = 0; i < 20; i++) {
        let storageData = await getItemsByKeys(page, keys);
        missingKeys = keys.filter((key) => storageData[key] === null);

        if (missingKeys.length === 0) break;

        // Sleep between retries
        await page.waitForTimeout(50);
      }
      // success is true if no items in failedResults
      return { isSuccess: missingKeys.length === 0, missingKeys: missingKeys };
    } catch (error) {
      console.error(
        `Failed to check if all expected keys exist in the object: ${error.message}`
      );
    }
  }

  // Check if all storage values are not empty
  async checkIfAllStorageKeysHaveData(keys, storageData) {
    try {
      // Run loop until all keys are detected in the Storage, up to 20 attempts
      for (let i = 0; i < 20; i++) {
        var failedKeys = [];

        // Fetch storage data if not provided
        const sessionStorageData = storageData
          ? storageData
          : await this.getSessionStorageData();

        keys.forEach((key) => {
          if (
            sessionStorageData[key] === null ||
            sessionStorageData[key] === ''
          ) {
            // If a key's value is empty, add to failed keys
            failedKeys.push(key);
          }
        });
        // If all keys have non-empty values, exit the loop
        if (failedKeys.length === 0) break;

        // Sleep between retries
        await this.page.waitForTimeout(50);
      }
      // isSuccess is true if no items in failedResults
      return { isSuccess: failedKeys.length === 0, failedKeys: failedKeys };
    } catch (error) {
      console.error(
        `Failed to check if all storage values are not empty: ${error.message}`
      );
    }
  }

  // Check if the object includes the expectedValue among its values
  async checkIfValueExists(expectedValue) {
    try {
      // Run loop until all keys are detected in the Storage, up to 20 attempts
      for (let i = 0; i < 20; i++) {
        const sessionStorageData = await this.getSessionStorageData();
        const values = Object.values(sessionStorageData);
        const isExpectedValueIncluded = values.some((value) =>
          new RegExp(escapeRegexSpecialCharacters(expectedValue), 'i').test(
            value
          )
        );
        if (isExpectedValueIncluded) {
          return true;
        }

        // Sleep between retries
        await this.page.waitForTimeout(50);
      }
      return false;
    } catch (error) {
      console.error(
        `Failed to check if the object includes the part among its values: ${error.message}`
      );
    }
  }

  // Get Cookies
  async getCookies() {
    try {
      return this.page.context().cookies();
    } catch (error) {
      console.error(`Failed to get Cookies: ${error.message}`);
    }
  }

  // Check if all expected items included to the array
  checkIfAllItemsArePresentInArray(array, expectedItems) {
    try {
      // Filters the expected items to determine which, if any, are missing from the array
      const missingItems = expectedItems.filter(
        (item) => !array.includes(item)
      );
      // If there are no missing items, the length of the 'missingItems' array will be 0
      // so 'hasAllItems' will be true, otherwise it will be false
      return {
        hasAllItems: missingItems.length === 0,
        missingItems: missingItems,
      };
    } catch (error) {
      console.error(
        `Failed to check if all expected items included to the array: ${error.message}`
      );
    }
  }

  // Get page title
  async getPageTitle() {
    try {
      // Wait until the title is loaded
      await this.page.waitForFunction(() => document.title !== '');
      return await this.page.title();
    } catch (error) {
      console.error(`Failed to get page title: ${error.message}`);
    }
  }

  // Attach JSON to HTML report
  async attachJSONToReport(testInfo, data, fileName) {
    try {
      // Creating a temporary file path for the JSON file
      const dataName = generateUniqueFileName(testInfo, `${fileName}.json`);
      const dataPath = getTempFilePath(dataName);
      // Writing the JSON test data to the file
      await writeDataToFileAsync(dataPath, JSON.stringify(data, null, 2));
      // Attaching the JSON file to the test info context
      await testInfo.attach(dataName, {
        path: dataPath,
        contentType: 'application/json',
      });
      return dataPath;
    } catch (error) {
      console.error(`Failed to attach JSON to test: ${error.message}`);
    }
  }

  // Take a screenshot of the Google logo and save it
  async captureAndSaveGoogleLogoScreenshot(testInfo) {
    try {
      const element = await this.getLocator(this.selectors.googleLogo);
      const screenshotBuffer = await element.screenshot();
      // Generate a filename using the test's info and unique name
      const screenshotPath = getTempFilePath(
        generateUniqueFileName(testInfo, `logo_screenshot.png`)
      );
      // Write the screenshot buffer to the screenshot file
      await writeDataToFileAsync(screenshotPath, screenshotBuffer);
      return screenshotPath;
    } catch (error) {
      console.error(
        `Failed to make and save a screenshot of the Google Logo: ${error.message}`
      );
    }
  }

  // Switch to video searh
  async applyVideFilter() {
    try {
      await this.page.waitForSelector(this.selectors.videoFilterButton);
      await this.clickOrTap(this.selectors.videoFilterButton);
    } catch (error) {
      console.error(`Failed to apply video filter: ${error.message}`);
    }
  }

  // Select the 'elementNumber' th focusable element using the Tab key
  async selectElementByTabbing(elementNumber) {
    try {
      // Loop for 'elementNumber' times
      for (let i = 0; i < elementNumber; i++) {
        // Press the 'Tab' key each time to move the focus to the next focusable field or button in the web page
        await this.page.keyboard.press('Tab');
        // Wait after each tab press, this is to ensure that the focus has moved before the next key press
        await this.page.waitForTimeout(10);
      }
    } catch (error) {
      console.error(
        `Failed to navigate via Tab to select the item number N: ${error.message}`
      );
    }
  }

  // Select the 'elementNumber' th focusable element using the Shift + Tab keys
  async selectElementByShiftTabbing(elementNumber) {
    try {
      // Loop for 'elementNumber' times
      for (let i = 0; i < elementNumber; i++) {
        // Press the 'Shift + Tab' keys each time to move the focus to the previous focusable element in the web page
        await this.page.keyboard.press('Shift+Tab');
        // Wait after each tab press, this is to ensure that the focus has moved before the next key press
        await this.page.waitForTimeout(10);
      }
    } catch (error) {
      console.error(
        `Failed to navigate via Shift+Tab to select the item number N: ${error.message}`
      );
    }
  }

  // Get class of the active (focused) element
  async getActiveElementClass() {
    try {
      // Fetch the class of the active element
      return await this.page.evaluate(() => document.activeElement.className);
    } catch (error) {
      console.error(
        `Failed to get class of the active (focused) element: ${error.message}`
      );
    }
  }

  // Compute the horizontal middle point of an element by the selector
  async getHorizontalMiddleOfElement(selector) {
    try {
      const element = await this.getLocator(selector);
      // Get the bounding box of an element which gives the (x, y) coordinates along with the width and height
      const elementBox = await element.boundingBox();
      // Calculate and return the middle point of the element on the x-axis
      const elementCentre = elementBox.x + elementBox.width / 2;
      return elementCentre;
    } catch (error) {
      console.error(
        `Failed to horizontal centre of the element by the selector: ${error.message}`
      );
    }
  }

  //Performance.mark API: Add marker
  async addPerformanceMark(markerName) {
    try {
      await this.page.evaluate(
        // window.performance.mark() creates a timestamp in the browser's performance entry buffer with the given name
        ([marker]) => window.performance.mark(marker),
        [markerName] // passing markerName to the page context
      );
    } catch (error) {
      this.handleError(
        `Failed to add performance marker ${markerName} with Performance.mark API: ${error.message}`
      );
    }
  }

  //Performance.mark API: Start performance tracking
  async startPerformanceMarkTracing() {
    try {
      // Adding "start" performance marker
      await this.addPerformanceMark(PERF_MARK_STARTED);
    } catch (error) {
      console.error(
        `Failed to start performance tracking with Performance.mark API: ${error.message}`
      );
    }
  }

  //Performance.mark API: Stop performance tracking. Attach results to the HTML report
  async stopPerformanceMarkTracingAndAttachResults(testInfo, query) {
    try {
      // Adding a performance marker to indicate the ending of measurement
      await this.addPerformanceMark(PERF_MARK_ENDED);

      // Calculate the performance metrics
      const { allMarksInfo, allMeasuresInfo, actionDuration } =
        await this.performanceMarkMetricsCalculation();

      // Attaching the performance marks information collected to the HTML report
      // The 'query' parameter is used to derive the name for the attachment
      const marksInfoDataPath = await this.attachJSONToReport(
        testInfo,
        allMarksInfo,
        `${query}_marksInfoDataName`
      );

      // Attaching the performance measures information collected to the HTML report
      // The 'query' parameter is again used to derive the name for the attachment
      const measuresInfoDataPath = await this.attachJSONToReport(
        testInfo,
        allMeasuresInfo,
        `${query}_measuresInfoDataName`
      );

      // Return the path of the attachments and the actionDuration
      return { marksInfoDataPath, measuresInfoDataPath, actionDuration };
    } catch (error) {
      console.error(
        `Failed to stop performance tracking with Performance.mark API and attach results to the HTML report: ${error.message}`
      );
    }
  }

  // Performance.mark API: Metrics calculation
  async performanceMarkMetricsCalculation() {
    try {
      // Evaluate the performance measure inside the browser context.
      // This function uses the window.performance.measure API to measure the time between two performance marks.
      // PERF_MEASURE_NAME is the name given to the performance measure.
      // PERF_MARK_STARTED and PERF_MARK_ENDED are the names of the start and end marks.
      await this.page.evaluate(
        ([PERF_MEASURE_NAME, PERF_MARK_STARTED, PERF_MARK_ENDED]) =>
          window.performance.measure(
            PERF_MEASURE_NAME,
            PERF_MARK_STARTED,
            PERF_MARK_ENDED
          ),
        [PERF_MEASURE_NAME, PERF_MARK_STARTED, PERF_MARK_ENDED]
      );

      // Gather all performance marks created using the Performance.mark API
      const allMarksInfo = await this.page.evaluate(
        ([PERF_ENTRY_TYPE]) =>
          window.performance.getEntriesByType(PERF_ENTRY_TYPE),
        [PERF_ENTRY_TYPE]
      );

      // Get performance measures for a specific name using the Performance.mark API
      const allMeasuresInfo = await this.page.evaluate(
        ([PERF_MEASURE_NAME]) =>
          window.performance.getEntriesByName(PERF_MEASURE_NAME),
        [PERF_MEASURE_NAME]
      );

      // Get duration of the action via the measure object
      // The duration is the amount of time it took for the action to complete in milliseconds
      const actionDuration = allMeasuresInfo[0]['duration'];

      // Results info about all performance measures and marks, and action duration
      return { allMarksInfo, allMeasuresInfo, actionDuration };
    } catch (error) {
      console.error(
        `Failed to calculate performance metrics with Performance.mark API: ${error.message}`
      );
    }
  }

  // (Only Chromium) Performance API: Start performance tracing
  async startChromiumTracing(currentBrowser, testInfo, query) {
    try {
      // Get path where to save performance traces
      var tracesName = generateUniqueFileName(
        testInfo,
        `${query}_perfTraces.json`
      );
      var tracesPath = getTempFilePath(tracesName);

      // Start tracing collecting process, including screenshots
      await currentBrowser.startTracing(this.page, {
        path: tracesPath,
        screenshots: true,
      });

      // Return names of the trace file and path
      return { tracesName, tracesPath };
    } catch (error) {
      console.error(
        `Failed to start performance tracing with Chromium Performance API: ${error.message}`
      );
    }
  }

  // (Only Chromium) Performance API: Stop performance tracing. Attach results to the HTML report
  async stopChromiumTracingAndAttach(
    currentBrowser,
    testInfo,
    tracesName,
    tracesPath
  ) {
    try {
      // Stop tracing collecting process
      await currentBrowser.stopTracing();

      // Attach the trace to the testing report
      await testInfo.attach(tracesName, {
        path: tracesPath,
        contentType: 'application/json',
      });
    } catch (error) {
      console.error(
        `Failed to stop performance tracking with Chromium Performance API and attach results to the HTML report: ${error.message}`
      );
    }
  }

  // (Only Chromium) Chrome DevTool Protocol API: Start performance tracking
  async startChromeDevToolTracking() {
    try {
      // Chrome DevTool Protocol API: Create a new connection to an existing CDP session to enable performance Metrics
      var session = await this.page.context().newCDPSession(this.page);
      await session.send('Performance.enable');
      // Chrome DevTool Protocol API: Record the performance metrics before actions
      var metricsBefore = await session.send('Performance.getMetrics');
      return { session, metricsBefore };
    } catch (error) {
      console.error(
        `Failed to start performance tracing with Chrome DevTool Protocol API: ${error.message}`
      );
    }
  }

  // (Only Chromium) Chrome DevTool Protocol API: Stop performance tracking. Attach results to the HTML report
  async stopChromeDevToolTrackingAndAttachtResults(
    testInfo,
    query,
    session,
    metricsBefore
  ) {
    try {
      // Record the performance metrics after the actions
      var metricsAfter = await session.send('Performance.getMetrics');

      // Calculates the difference in performance metrics before and after the test execution
      var metricsDiff = this.performanceChromeDevToolMetricsDiffCalculation(
        metricsBefore,
        metricsAfter
      );

      // Attach the performance difference metrics to the HTML report
      var metricsDiffDataPath = await this.attachJSONToReport(
        testInfo,
        metricsDiff,
        `${query}_metricsDiffDataName`
      );

      return metricsDiffDataPath;
    } catch (error) {
      console.error(
        `Failed to stop performance tracking with Chrome DevTool Protocol API and attach results to the HTML report: ${error.message}`
      );
    }
  }

  // (Only Chromium) Chrome DevTool Protocol API: calculate the difference in metrics before and after an action using the Chrome DevTool Protocol API
  performanceChromeDevToolMetricsDiffCalculation(metricsBefore, metricsAfter) {
    try {
      var metricsDiff = [];

      // Iterate through each metric from the 'before' metrics
      for (let metricBefore of metricsBefore.metrics) {
        // Find the corresponding metric from the 'after' metrics
        const metricAfter = metricsAfter.metrics.find(
          (metric) => metric.name === metricBefore.name
        );

        if (metricAfter) {
          // Calculate the difference between the 'before' and 'after' metric values
          const diff = metricAfter.value - metricBefore.value;
          // Create a new object storing the metric name, 'before' value,
          // 'after' value and its difference. Then, add it to the metricsDifference array
          metricsDiff.push({
            name: metricBefore.name,
            value_before: metricBefore.value,
            value_after: metricAfter.value,
            value_diff: diff,
          });
        } else {
          // If there's no corresponding 'after' metric, create a new object with
          // the metric name and 'before' value, and set the 'after' value and difference to null.
          // Then, add it to the metricsDifference array
          metricsDiff.push({
            name: metricBefore.name,
            value_before: metricBefore.value,
            value_after: null,
            value_diff: null,
          });
        }
      }

      // Return the array
      return metricsDiff;
    } catch (error) {
      console.error(
        `Failed to calculate performance metrics with Chrome DevTool Protocol API: ${error.message}`
      );
    }
  }

  // Get performance metrics for Search results
  async getPerformanceMetricsForSearchResults(
    query,
    testInfo,
    defaultBrowserType
  ) {
    try {
      var currentBrowser = this.page.context().browser();
      if (defaultBrowserType == 'chromium') {
        // (Only Chromium) Performance API: Start performance tracing
        var { tracesName, tracesPath } = await this.startChromiumTracing(
          currentBrowser,
          testInfo,
          query
        );
      }

      // Make Search action
      // Fill Search imput with query
      await this.fillSearchInput(query);
      await this.page.press(this.selectors.searchInputTextArea, 'Enter');

      //Performance.mark API: Start performance tracking
      await this.startPerformanceMarkTracing();

      if (defaultBrowserType == 'chromium') {
        // (Only Chromium) Chrome DevTool Protocol API: Start performance tracing
        var { session, metricsBefore } =
          await this.startChromeDevToolTracking(defaultBrowserType);
      }

      // Wait for search Results are visible
      await this.page.waitForSelector(this.selectors.searchResult, {
        state: 'visible',
      });

      if (defaultBrowserType == 'chromium') {
        // (Only Chromium) Performance API: Stop performance tracing. Attach results to the HTML report
        await this.stopChromiumTracingAndAttach(
          currentBrowser,
          testInfo,
          tracesName,
          tracesPath
        );

        // (Only Chromium) Chrome DevTool Protocol API: Stop performance tracking. Attach results to the HTML report
        var metricsDiffDataPath =
          await this.stopChromeDevToolTrackingAndAttachtResults(
            testInfo,
            query,
            session,
            metricsBefore
          );
      }

      // Performance.mark API: Stop performance tracking. Performance measure. Attach results to the HTML report
      const { marksInfoDataPath, measuresInfoDataPath, actionDuration } =
        await this.stopPerformanceMarkTracingAndAttachResults(testInfo, query);

      // Construct an object to store all performance metrics information
      let metrics =
        defaultBrowserType == 'chromium'
          ? {
              tracesPath,
              marksInfoDataPath,
              measuresInfoDataPath,
              metricsDiffDataPath,
            }
          : {
              marksInfoDataPath,
              measuresInfoDataPath,
            };

      // Return the performance metrics and the duration of the action
      return { metrics, actionDuration };
    } catch (error) {
      console.error(
        `Failed to get performance metrics for Search results: ${error.message}`
      );
    }
  }
}
