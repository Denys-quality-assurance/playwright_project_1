import basePage from './basePage';
import {
  readFileSync,
  createUniqueFileName,
  getTempFilePath,
  writeFile,
} from '../../utilities/fileSystemHelper';
import { escapeRegexSpecialCharacters } from '../../utilities/regexHelper';

const responseBodyForEmptyResultsMockPath =
  './tests/test-data/googleSearch/mocks/responseBodyForEmptyResults.html';

export default class GoogleSearchPage extends basePage {
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
      webPageDescription: `.VwiC3b`, // One description of the web page in the search result
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
      await this.page.waitForSelector(this.selectors.autoSuggestionOption);
      return this.page.locator(this.selectors.autoSuggestionOption);
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
      await this.page.waitForSelector(
        this.selectors.resultsNumberAndTimeMessage
      );
      const resultsNumberAndTimeMessageElement = this.page.locator(
        this.selectors.resultsNumberAndTimeMessage
      );
      // Get text content from resultsNumberAndTimeMessageElement
      return await resultsNumberAndTimeMessageElement.innerText();
    } catch (error) {
      console.error(
        `Failed to get the text of the message with the total number of results and the time taken to fetch the result: ${error.message}`
      );
    }
  }

  // Get the 1st element with expected query
  async getFirstElementWithQuery(locator, query) {
    try {
      // // Collect all elements of locator
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
        if (this.hasQueryWords(optionText, queryWords)) {
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
        url: (url) => url.includes('/search?q='),
      });
    } catch (error) {
      console.error(
        `Failed to search for query by clicking on search button: ${error.message}`
      );
    }
  }

  // Navigate to page, reject all Cookies and search for query
  async navigateAndSearch(query) {
    try {
      await this.navigateAndRejectCookies();
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

  // Mock the search response with Empty Results
  async mockResponseWithEmptyResults(sharedContext, query) {
    try {
      let responseBodyForEmptyResults = readFileSync(
        responseBodyForEmptyResultsMockPath
      );
      // Replace 'Query' with the current query globally in the HTML
      responseBodyForEmptyResults = responseBodyForEmptyResults.toString();
      const responseBodyForEmptyResultsCurrentQuery =
        responseBodyForEmptyResults.replace(/Query/g, query);
      await sharedContext.route('/search?q=**', (route) => {
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
      await this.page.waitForSelector(this.selectors.webPageDescription);
      return this.page.locator(this.selectors.webPageDescription);
    } catch (error) {
      console.error(
        `Failed to get search results descriptions: ${error.message}`
      );
    }
  }

  // Get titles of the web pages in the search results
  async getSearchResultsWebPagesTitles() {
    try {
      await this.page.waitForSelector(this.selectors.webPageTitle);
      const searchResultsWebPagesTitlesLocator = this.page.locator(
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
      await this.page.waitForSelector(this.selectors.correctedQuery);
      const correctedQueryElement = this.page.locator(
        this.selectors.correctedQuery
      );
      // Get text content from correctedQueryElement
      return await correctedQueryElement.innerText();
    } catch (error) {
      console.error(
        `Failed to get corrected query text for the misspelled query in the message "Showing results for <correcter query>": ${error.message}`
      );
    }
  }

  // Get Locator object of elements with web pages URLs in the search results
  async getSearchResultsWebPagesUrlsLocator() {
    try {
      await this.page.waitForSelector(this.selectors.webPageUrl);
      return this.page.locator(this.selectors.webPageUrl);
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
      // Get all words from the query as an array
      const queryWords = query.split(' ');
      const searchResultsDescriptions =
        await searchResultsDescriptionLocator.all();
      let failedResults = [];

      for (let description of searchResultsDescriptions) {
        // Get the text of each searchResult
        const descriptionHTML = await description.innerHTML();

        // Check if the description contains any query word highlighted
        const hasHighlightedWords = this.hasHighlightedWords(
          descriptionHTML,
          queryWords
        );
        if (!hasHighlightedWords) {
          failedResults.push(descriptionHTML);
        }
      }
      // success is try if no items in failedResults
      return {
        success: failedResults.length === 0,
        failedDescriptionHTML: failedResults,
        failedQuery: query,
      };
    } catch (error) {
      console.error(
        `Failed to check if all search results contain highlighted query in descriptions of the web pages: ${error.message}`
      );
    }
  }

  // Check if the description contains any query word highlighted
  hasHighlightedWords(descriptionHTML, queryWords) {
    // Get arrays of highlighted words between <em> and </em> tags
    const highlightedWords = descriptionHTML
      .split('<em>')
      .filter((word) => word.includes('</em>'))
      .map((word) => word.split('</em>')[0]);

    // Check if some word from the query is included in the words between <em> and </em> tags
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
  async getHrefAttribute(objects) {
    try {
      let results = [];
      for (let element of objects) {
        const href = await element.getAttribute('href');
        results.push(href);
      }
      return results;
    } catch (error) {
      console.error(
        `Failed to get href attributes from array of objects: ${error.message}`
      );
    }
  }

  // Get local storage - isn't used
  async getLocalStorage(page) {
    try {
      const localStorageData = await page.evaluate(() => window.localStorage);
      return localStorageData;
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
  async getSessionStorage() {
    try {
      const sessionStorageData = await this.page.evaluate(
        () => window.sessionStorage
      );
      return sessionStorageData;
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
      // Run loop until all keys are detected in the Storage
      for (let i = 0; i < 10; i++) {
        let storageData = await getItemsByKeys(page, keys);
        missingKeys = keys.filter((key) => storageData[key] === null);

        if (missingKeys.length === 0) break;

        // Sleep for 1 second between retries
        await page.waitForTimeout(200);
      }
      // success is try if no items in failedResults
      return { success: missingKeys.length === 0, missingKeys: missingKeys };
    } catch (error) {
      console.error(
        `Failed to check if all expected keys exist in the object: ${error.message}`
      );
    }
  }

  // Check if all storage values are not empty
  async checkIfAllStorageValuesNotEmpty(keys, storageData) {
    try {
      // Run loop until all keys are detected in the Storage
      for (let i = 0; i < 10; i++) {
        var failedKeys = [];
        const sessionStorageData = storageData
          ? storageData
          : await this.getSessionStorage();
        keys.forEach((key) => {
          if (
            sessionStorageData[key] === null ||
            sessionStorageData[key] === ''
          ) {
            failedKeys.push(key);
          }
        });
        if (failedKeys.length === 0) break;

        // Sleep for 1 second between retries
        await this.page.waitForTimeout(200);
      }
      // success is try if no items in failedResults
      return { success: failedKeys.length === 0, failedKeys: failedKeys };
    } catch (error) {
      console.error(
        `Failed to check if all storage values are not empty: ${error.message}`
      );
    }
  }

  // Check if the object includes the expectedValue among its values
  async checkIfValueExists(expectedValue) {
    try {
      // Run loop until all keys are detected in the Storage
      for (let i = 0; i < 10; i++) {
        const sessionStorageData = await this.getSessionStorage();
        const values = Object.values(sessionStorageData);
        const isExpectedValueIncluded = values.some((value) =>
          new RegExp(escapeRegexSpecialCharacters(expectedValue), 'i').test(
            value
          )
        );
        if (isExpectedValueIncluded) {
          return true;
        }

        // Sleep for 1 second between retries
        await this.page.waitForTimeout(200);
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
  checkIfAllItemsInArray(array, expectedItems) {
    try {
      const missingItems = expectedItems.filter(
        (item) => !array.includes(item)
      );
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

  // Attach JSON to test
  async attachJSONToTest(testInfo, data, fileName) {
    try {
      const dataName = createUniqueFileName(testInfo, `${fileName}.json`);
      const dataPath = getTempFilePath(dataName);
      await writeFile(dataPath, JSON.stringify(data, null, 2));
      await testInfo.attach(dataName, {
        path: dataPath,
        contentType: 'application/json',
      });
      return dataPath;
    } catch (error) {
      console.error(`Failed to attach JSON to test: ${error.message}`);
    }
  }

  // Make and save a screenshot of the Google Logo
  async saveGoogleLogoScreenshot(testInfo) {
    try {
      await this.page.waitForSelector(this.selectors.googleLogo);
      const element = this.page.locator(this.selectors.googleLogo);
      const screenshotBuffer = await element.screenshot();
      const screenshotPath = getTempFilePath(
        createUniqueFileName(testInfo, `logo_screenshot.png`)
      );
      await writeFile(screenshotPath, screenshotBuffer);
      return screenshotPath;
    } catch (error) {
      console.error(
        `Failed to make and save a screenshot of the Google Logo: ${error.message}`
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
      if (defaultBrowserType == 'chromium') {
        // Performance API: Start performance tracing
        var currentBrowser = this.page.context().browser();
        var tracesName = createUniqueFileName(
          testInfo,
          `${query}_perfTraces.json`
        );
        var tracesPath = getTempFilePath(tracesName);
        await currentBrowser.startTracing(this.page, {
          path: tracesPath,
          screenshots: true,
        });
      }

      // Make Search action
      // Fill Search imput with query
      await this.fillSearchInput(query);
      await this.page.press(this.selectors.searchInputTextArea, 'Enter');

      //Performance.mark API: Start performance tracking
      await this.page.evaluate(() => window.performance.mark('Perf:Started'));

      if (defaultBrowserType == 'chromium') {
        // Chrome DevTool Protocol API: Create a new connection to an existing CDP session to enable performance Metrics
        var session = await this.page.context().newCDPSession(this.page);
        await session.send('Performance.enable');
        // Chrome DevTool Protocol API: Record the performance metrics before actions
        var metricsBefore = await session.send('Performance.getMetrics');
      }

      // Wait for search Results are visible
      await this.page.waitForSelector(this.selectors.searchResult, {
        state: 'visible',
      });

      //Performance.mark API: Stop performance tracking
      await this.page.evaluate(() => window.performance.mark('Perf:Ended'));

      if (defaultBrowserType == 'chromium') {
        // Chrome DevTool Protocol API: Record the performance metrics after the actions
        var metricsAfter = await session.send('Performance.getMetrics');

        // Performance API: Stop performance tracing
        await currentBrowser.stopTracing();

        // Performance API: Attach traces to the test report
        await testInfo.attach(tracesName, {
          path: tracesPath,
          contentType: 'application/json',
        });

        // Metrics calculation
        // Chrome DevTool Protocol API: Subtract the metrics before the action from the metrics after the action
        var metricsDiff = [];

        for (let metricBefore of metricsBefore.metrics) {
          // find corresponding metricAfter
          const metricAfter = metricsAfter.metrics.find(
            (metric) => metric.name === metricBefore.name
          );

          // prepare a new object
          if (metricAfter) {
            const diff = metricAfter.value - metricBefore.value;
            const metricDiffObj = {
              name: metricBefore.name,
              value_before: metricBefore.value,
              value_after: metricAfter.value,
              value_diff: diff,
            };

            // push the new object to metricsDiff array
            metricsDiff.push(metricDiffObj);
          } else {
            const metricDiffObj = {
              name: metricBefore.name,
              value_before: metricBefore.value,
              value_after: null,
              value_diff: null,
            };
            metricsDiff.push(metricDiffObj);
          }
        }

        // Chrome DevTool Protocol API: Attach metricsDiff to the test report
        var metricsDiffDataPath = await this.attachJSONToTest(
          testInfo,
          metricsDiff,
          `${query}_metricsDiffDataName`
        );
      }

      // Metrics calculation
      // Performance.mark API: Performance measure
      await this.page.evaluate(() =>
        window.performance.measure('action', 'Perf:Started', 'Perf:Ended')
      );

      // To get all performance marks
      const allMarksInfo = await this.page.evaluate(() =>
        window.performance.getEntriesByType('mark')
      );

      // Performance.mark API: Attach allMarksInfo to the test report
      const marksInfoDataPath = await this.attachJSONToTest(
        testInfo,
        allMarksInfo,
        `${query}_marksInfoDataName`
      );

      // Performance.mark API: To get all performance measures
      const allMeasuresInfo = await this.page.evaluate(() =>
        window.performance.getEntriesByName('action')
      );

      // Performance.mark API: Duration of the action
      const actionDuration = allMeasuresInfo[0]['duration'];

      // Performance.mark API: Attach allMeasuresInfo to the test report
      const measuresInfoDataPath = await this.attachJSONToTest(
        testInfo,
        allMeasuresInfo,
        `${query}_measuresInfoDataName`
      );
      let metrics;
      if (defaultBrowserType == 'chromium') {
        metrics = {
          tracesPath,
          marksInfoDataPath,
          measuresInfoDataPath,
          metricsDiffDataPath,
        };
      } else {
        metrics = {
          marksInfoDataPath,
          measuresInfoDataPath,
        };
      }

      return { metrics, actionDuration };
    } catch (error) {
      console.error(
        `Failed to get performance metrics for Search results: ${error.message}`
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

  // Navigate via Tab to select the item number N
  async selectElementNViaTab(elementNumber) {
    try {
      for (let i = 0; i < elementNumber; i++) {
        await this.page.keyboard.press('Tab'); // Move focus to the next focusable element
        await this.page.waitForTimeout(10);
      }
    } catch (error) {
      console.error(
        `Failed to navigate via Tab to select the item number N: ${error.message}`
      );
    }
  }

  // Navigate via Shift+Tab to select the item number N
  async selectElementNViaShiftTab(elementNumber) {
    try {
      for (let i = 0; i < elementNumber; i++) {
        await this.page.keyboard.press('Shift+Tab'); // Move focus to the next focusable element
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

  // Get horizontal centre of the element by the selector
  async getHorizontalCentreBySelector(selector) {
    try {
      await this.page.waitForSelector(selector);
      const element = this.page.locator(selector);
      const elementBox = await element.boundingBox();
      const elementCentre = elementBox.x + elementBox.width / 2;
      return elementCentre;
    } catch (error) {
      console.error(
        `Failed to horizontal centre of the element by the selector: ${error.message}`
      );
    }
  }
}
