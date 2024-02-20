import { readFileSync, createUniqueFileName, getTempFilePath, writeFile } from '../../utilities/fileSystemHelpers';
const responseBodyForEmptyResultsMockPath = './tests/test-data/mocks/responseBodyForEmptyResults.html';

export default class GoogleHomePage {
  constructor(page, isMobile) {
    this.page = page;
    this.isMobile = isMobile; // Type of device is mobile
    this.selectors = {
      searchButton: `.FPdoLc >> .gNO89b[role="button"]`, // Search button on the Home page
      cookiesModal: `#CXQnmb`, // Cookies consent modal
      rejectAllCookiesButton: `button#W0wltc`, // Reject all cookies button
      searchInputTextArea: `textarea[name=q]`, // Search query imput area
      autoSuggestionOption: `[role="option"]`, // One search auto suggestion option
      changeToEnglishModal: `#Rzn5id`, // Change to English modal
      changeToEnglishButton: `text="Change to English"`, // Change to English button
      resultsNumberAndTimeMessage: `.LHJvCe >> #result-stats`, // Message with text “About X results (Y.YY seconds) ”
      didNotMatchText: `text=" - did not match any documents."`, // Message with text “did not match any documents”
      correctedQuery: `.p64x9c.KDCVqf`, // The corrected query text for the misspelled query in the message "Showing results for <correcter query>"
      searchResult: this.isMobile ? `.y0NFKc` : `.MjjYud >> .g`, // One search result for mobile and for desktop
      webPageTitle: this.isMobile ? `.v7jaNc` : `.LC20lb`, // One title of the web page in the search result for mobile and for desktop
      webPageUrl: this.isMobile ? `.cz3goc` : `[jsname="UWckNb"]`, // One URL of the web page in the search result for mobile and for desktop
      webPageDescription: `.VwiC3b`, // One description of the web page in the search result
      googleLogo: this.isMobile ? `#hplogo` : `.lnXdpd[alt="Google"]`, // Google Logo for mobile and for desktop
      videoFilterButton: `.LatpMc[href*="tbm=vid"]`, // Video filter button under the main search query imput area
      pictureUploadButton: `.DV7the[role="button"]`, // Picture upload button of search by picture modal
    };
    this.classes = {
      picturesSearchButton: `nDcEnd`, // Pictures Search button
      closeSearchByPictureModalButton: `BiKNf`, // Close button of the the search by picture modal
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
        await this.page.waitForSelector(this.selectors.rejectAllCookiesButton);
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

  // Fill Search imput with query
  async fillSearchInput(query) {
    try {
      await this.page.waitForSelector(this.selectors.searchInputTextArea);
      await this.page.fill(this.selectors.searchInputTextArea, query);
    } catch (error) {
      console.error(`Failed to fill Search imput with query: ${error.message}`);
    }
  }

  // Get Search auto suggestions
  async getSearchAutoSuggestionOptionElements() {
    try {
      await this.page.waitForSelector(this.selectors.autoSuggestionOption);
      const searchAutoSuggestionOptionElements = await this.page.$$(this.selectors.autoSuggestionOption);
      return searchAutoSuggestionOptionElements;
    } catch (error) {
      console.error(`Failed to get search auto suggestion options elements: ${error.message}`);
    }
  }

  // Get Search auto suggestions text
  async getSearchAutoSuggestionOptions() {
    try {
      const searchAutoSuggestionOptionElements = await this.getSearchAutoSuggestionOptionElements();
      // Get text content from searchAutoSuggestionOptions
      const searchAutoSuggestionOptionsText = await this.getTextContent(searchAutoSuggestionOptionElements);
      return searchAutoSuggestionOptionsText;
    } catch (error) {
      console.error(`Failed to get search auto suggestions: ${error.message}`);
    }
  }

  // Get the text of the message with the total number of results and the time taken to fetch the result
  async getResultsNumberAndTimeMessageText() {
    try {
      await this.page.waitForSelector(this.selectors.resultsNumberAndTimeMessage);
      const resultsNumberAndTimeMessageElement = await this.page.$(this.selectors.resultsNumberAndTimeMessage);
      // Get text content from resultsNumberAndTimeMessageElement
      const resultsNumberAndTimeMessageText = await resultsNumberAndTimeMessageElement.innerText();
      return resultsNumberAndTimeMessageText;
    } catch (error) {
      console.error(
        `Failed to get the text of the message with the total number of results and the time taken to fetch the result: ${error.message}`
      );
    }
  }

  // Get the 1st element with expected query
  async getFirstElementWithQuery(elements, query) {
    try {
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
      console.error(`Failed to the 1st  element with expected query: ${error.message}`);
    }
  }

  // Check if any auto-suggestion contains the expected approptiate option
  async checkIfAnyAutoSuggestionOptionContainQuery(searchAutoSuggestionOptionsText, query) {
    try {
      // Get all words from the query as an array
      const queryWords = query.toLowerCase().split(' ');

      for (let optionText of searchAutoSuggestionOptionsText) {
        // Check if the option contains any query word
        if (this.hasQueryWords(optionText, queryWords)) {
          return true;
        }
      }
      return false; // No option contains the query
    } catch (error) {
      console.error(`Failed to if any auto-suggestion option contains the query: ${error.message}`);
    }
  }

  // Search for query by pressing enter
  async searchForQueryByEnter(query) {
    try {
      // Fill Search imput with query
      await this.fillSearchInput(query);
      // Submit the query by pressing enter
      await this.page.press(this.selectors.searchInputTextArea, 'Enter');
      // Waiting for search result page to appear
      await this.page.waitForLoadState('networkidle');
    } catch (error) {
      console.error(`Failed to search for query by pressing enter: ${error.message}`);
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
      await this.page.waitForLoadState('networkidle');
    } catch (error) {
      console.error(`Failed to search for query by clicking on search button: ${error.message}`);
    }
  }

  // Change to English if it's needed
  async changeToEnglishIfAsked() {
    if (await this.page.isVisible(this.selectors.changeToEnglishModal)) {
      try {
        await this.page.waitForSelector(this.selectors.changeToEnglishButton);
        await this.clickOrTap(this.selectors.changeToEnglishButton);
        await this.page.waitForSelector(this.selectors.changeToEnglishModal, { state: 'hidden' });
      } catch (error) {
        console.error(`Failed to change to English: ${error.message}`);
      }
    }
  }

  // Navigate to page, reject all Cookies and search for query
  async navigateAndSearch(query) {
    try {
      await this.navigateAndRejectCookies();
      await this.searchForQueryByEnter(query);
    } catch (error) {
      console.error(`Failed to navigate to page, reject all Cookies and search for query: ${error.message}`);
    }
  }

  // Wait for the search response
  async waitForSearchResponse() {
    return this.page.waitForResponse('/search?q=**');
  }

  // Get number of query instances in the page body
  async countQueryInBody(query) {
    try {
      const bodyText = await this.page.textContent('body');
      return (bodyText.match(new RegExp(query, 'g')) || []).length;
    } catch (error) {
      console.error(`Failed to get the number of query instances in the page body: ${error.message}`);
    }
  }

  // Mock the search response with Empty Results
  async mockResponseWithEmptyResults(sharedContext, query) {
    try {
      let responseBodyForEmptyResults = readFileSync(responseBodyForEmptyResultsMockPath);
      // Replace 'Query' with the current query globally in the HTML
      responseBodyForEmptyResults = responseBodyForEmptyResults.toString();
      const responseBodyForEmptyResultsCurrentQuery = responseBodyForEmptyResults.replace(/Query/g, query);
      await sharedContext.route('/search?q=**', (route, request) => {
        route.fulfill({
          status: 200,
          contentType: 'text/html; charset=UTF-8',
          body: responseBodyForEmptyResultsCurrentQuery,
        });
      });
    } catch (error) {
      console.error(`Failed to mock the search response with Empty Results: ${error.message}`);
    }
  }

  // Get Search results
  async getSearchResultElements() {
    try {
      await this.page.waitForSelector(this.selectors.searchResult);
      const searchResultElements = await this.page.$$(this.selectors.searchResult);
      return searchResultElements;
    } catch (error) {
      console.error(`Failed to get search results: ${error.message}`);
    }
  }

  // Get Search results descriptions
  async getSearchResultsDescriptionElements() {
    try {
      await this.page.waitForSelector(this.selectors.webPageDescription);
      const searchResultsDescriptionElements = await this.page.$$(this.selectors.webPageDescription);
      return searchResultsDescriptionElements;
    } catch (error) {
      console.error(`Failed to get search results descriptions: ${error.message}`);
    }
  }

  // Get titles of the web pages in the search results
  async getSearchResultsWebPagesTitles() {
    try {
      await this.page.waitForSelector(this.selectors.webPageTitle);
      const searchResultsWebPagesTitles = await this.page.$$(this.selectors.webPageTitle);
      // Get text content from searchResultsWebPagesTitles
      const searchResultsWebPagesTitlesText = await this.getTextContent(searchResultsWebPagesTitles);
      return searchResultsWebPagesTitlesText;
    } catch (error) {
      console.error(`Failed to get titles of the web pagep in the search results: ${error.message}`);
    }
  }

  // Get corrected query text for the misspelled query in the message "Showing results for <correcter query>"
  async getCorrectedQueryFormMessageText() {
    try {
      await this.page.waitForSelector(this.selectors.correctedQuery);
      const correctedQueryElement = await this.page.$(this.selectors.correctedQuery);
      // Get text content from correctedQueryElement
      const correctedQueryElementText = await correctedQueryElement.innerText();
      return correctedQueryElementText;
    } catch (error) {
      console.error(
        `Failed to get corrected query text for the misspelled query in the message "Showing results for <correcter query>": ${error.message}`
      );
    }
  }

  // Get elements with web pages URLs in the search results
  async getSearchResultsWebPagesUrlElements() {
    try {
      await this.page.waitForSelector(this.selectors.webPageUrl);
      const searchResultsWebPagesUrlElements = await this.page.$$(this.selectors.webPageUrl);
      return searchResultsWebPagesUrlElements;
    } catch (error) {
      console.error(`Failed to get URLs of the web pagep in the search results: ${error.message}`);
    }
  }

  // Check if all search results contain query
  async checkIfAllSearchResultsContainQuery(searchResults, query) {
    try {
      // Get all words from the query as an array
      const queryWords = query.toLowerCase().split(' ');

      for (let searchResult of searchResults) {
        // Get the text of each searchResult
        let resultText = await searchResult.innerText();
        resultText = resultText.toLowerCase();

        // Check if the search result contains any query word
        if (this.hasQueryWords(resultText, queryWords)) {
          continue;
        } else {
          return false;
        }
      }

      return true; // Passed all checks
    } catch (error) {
      console.error(`Failed to check if all search results contain query: ${error.message}`);
    }
  }

  // Check if the search result contains any query word
  hasQueryWords(resultText, queryWords) {
    if (queryWords.some((queryWord) => resultText.includes(queryWord))) {
      return true;
    } else return false;
  }

  // Check if all search results contain highlighted query in descriptions of the web pages
  async checkIfAllSearchResultsContainHighlightedQuery(searchResultsDescriptions, query) {
    try {
      // Get all words from the query as an array
      const queryWords = query.toLowerCase().split(' ');

      for (let description of searchResultsDescriptions) {
        // Get the text of each searchResult
        const descriptionHTML = await description.innerHTML();

        // Check if the description contains any query word highlighted
        if (this.hasHighlightedWords(descriptionHTML, queryWords)) {
          continue;
        } else {
          return false;
        }
      }

      return true; // Passed all checks
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
      .map((word) => word.split('</em>')[0].toLowerCase());

    // Check if some word from the query is included in the words between <em> and </em> tags
    for (let highlightedWord of highlightedWords) {
      const highlightedParts = highlightedWord.split(' ');

      if (highlightedParts.some((part) => queryWords.some((queryWord) => part.includes(queryWord)))) {
        return true;
      }
    }
    return false;
  }

  // Get text content from array of objects
  async getTextContent(objects) {
    try {
      let results = [];
      for (let element of objects) {
        const text = await element.innerText();
        results.push(text);
      }
      return results;
    } catch (error) {
      console.error(`Failed to get text content from array of objects: ${error.message}`);
    }
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
      console.error(`Failed to get href attributes from array of objects: ${error.message}`);
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
      console.error(`Failed to get local storage items by keys: ${error.message}`);
    }
  }

  // Get session storage
  async getSessionStorage() {
    try {
      const sessionStorageData = await this.page.evaluate(() => window.sessionStorage);
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
      console.error(`Failed to get session storage items by keys: ${error.message}`);
    }
  }

  // Check if all expected keys exist in the object
  async checkIfAllKeysExist(getItemsByKeys, page, keys) {
    try {
      let storageHasKeys = true;
      // Run loop until all keys are detected in the Storage
      for (let i = 0; i < 10; i++) {
        let storageData = await getItemsByKeys(page, keys);
        keys.forEach((key) => {
          if (storageData[key] === null) {
            storageHasKeys = false;
          }
        });
        if (storageHasKeys) break;

        // Sleep for 1 second between retries
        await page.waitForTimeout(1000);
      }
      return storageHasKeys;
    } catch (error) {
      console.error(`Failed to check if all expected keys exist in the object: ${error.message}`);
    }
  }

  // Check if all storage values are not empty
  async checkIfAllStorageValuesNotEmpty(storageData, keys) {
    try {
      let storageValuesNotEmpty = true;
      keys.forEach((key) => {
        if (storageData[key] === null || storageData[key] === '') {
          storageValuesNotEmpty = false;
        }
      });
      return storageValuesNotEmpty;
    } catch (error) {
      console.error(`Failed to check if all storage values are not empty: ${error.message}`);
    }
  }

  // Check if the object includes the part among its values
  checkIfValueExists(object, part) {
    try {
      const values = Object.values(object);
      return values.some((value) => value.toLowerCase().includes(part.toLowerCase()));
    } catch (error) {
      console.error(`Failed to check if the object includes the part among its values: ${error.message}`);
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
      return expectedItems.every((item) => array.includes(item));
    } catch (error) {
      console.error(`Failed to check if all expected items included to the array: ${error.message}`);
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
  async attachJSONToTest(testInfo, data, filename) {
    try {
      const dataName = createUniqueFileName(testInfo, `${filename}.json`);
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
      const elementHandle = await this.page.$(this.selectors.googleLogo);
      const screenshotBuffer = await elementHandle.screenshot();
      const screenshotPath = getTempFilePath(createUniqueFileName(testInfo, `logo_screenshot.png`));
      await writeFile(screenshotPath, screenshotBuffer);
      return screenshotPath;
    } catch (error) {
      console.error(`Failed to make and save a screenshot of the Google Logo: ${error.message}`);
    }
  }

  // Get performance metrics for Search results
  async getPerformanceMetricsForSearchResults(query, testInfo, defaultBrowserType) {
    try {
      if (defaultBrowserType == 'chromium') {
        // Performance API: Start performance tracing
        var currentBrowser = this.page.context().browser();
        var tracesName = createUniqueFileName(testInfo, `${query}_perfTraces.json`);
        var tracesPath = getTempFilePath(tracesName);
        await currentBrowser.startTracing(this.page, { path: tracesPath, screenshots: true });
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
      await this.page.waitForSelector(this.selectors.searchResult, { state: 'visible' });

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
          const metricAfter = metricsAfter.metrics.find((metric) => metric.name === metricBefore.name);

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
        var metricsDiffDataPath = await this.attachJSONToTest(testInfo, metricsDiff, `${query}_metricsDiffDataName`);
      }

      // Metrics calculation
      // Performance.mark API: Performance measure
      await this.page.evaluate(() => window.performance.measure('action', 'Perf:Started', 'Perf:Ended'));

      // To get all performance marks
      const allMarksInfo = await this.page.evaluate(() => window.performance.getEntriesByType('mark'));

      // Performance.mark API: Attach allMarksInfo to the test report
      const marksInfoDataPath = await this.attachJSONToTest(testInfo, allMarksInfo, `${query}_marksInfoDataName`);

      // Performance.mark API: To get all performance measures
      const allMeasuresInfo = await this.page.evaluate(() => window.performance.getEntriesByName('action'));

      // Performance.mark API: Duration of the action
      const actionDuration = allMeasuresInfo[0]['duration'];

      // Performance.mark API: Attach allMeasuresInfo to the test report
      const measuresInfoDataPath = await this.attachJSONToTest(
        testInfo,
        allMeasuresInfo,
        `${query}_measuresInfoDataName`
      );

      if (defaultBrowserType == 'chromium') {
        var metrics = {
          tracesPath,
          marksInfoDataPath,
          measuresInfoDataPath,
          metricsDiffDataPath,
        };
      } else {
        var metrics = {
          marksInfoDataPath,
          measuresInfoDataPath,
        };
      }

      return { metrics, actionDuration };
    } catch (error) {
      console.error(`Failed to get performance metrics for Search results: ${error.message}`);
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
      }
    } catch (error) {
      console.error(`Failed to navigate via Tab to select the item number N: ${error.message}`);
    }
  }

  // Navigate via Tab to select the item number N
  async selectElementNViaTab(elementNumber) {
    try {
      for (let i = 0; i < elementNumber; i++) {
        await this.page.keyboard.press('Tab'); // Move focus to the next focusable element
      }
    } catch (error) {
      console.error(`Failed to navigate via Tab to select the item number N: ${error.message}`);
    }
  }

  // Navigate via Shift+Tab to select the item number N
  async selectElementNViaShiftTab(elementNumber) {
    try {
      for (let i = 0; i < elementNumber; i++) {
        await this.page.keyboard.press('Shift+Tab'); // Move focus to the next focusable element
      }
    } catch (error) {
      console.error(`Failed to navigate via Shift+Tab to select the item number N: ${error.message}`);
    }
  }

  // Get class of the active (focused) element
  async getActiveElementClass() {
    try {
      // Fetch the class of the active element
      return await this.page.evaluate(() => document.activeElement.className);
    } catch (error) {
      console.error(`Failed to get class of the active (focused) element: ${error.message}`);
    }
  }
}
