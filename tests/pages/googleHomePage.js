import { getTempFilePath, writeFile } from '../../utilities/fileSystemHelpers';

export default class GoogleHomePage {
  constructor(page, isMobile) {
    this.page = page;
    this.isMobile = isMobile; // type of device is mobile
    this.selectors = {
      cookiesModal: `#CXQnmb`, // Cookies consent modal
      rejectAllCookiesButton: `button#W0wltc`, // Reject all cookies button
      searchInputTextArea: `textarea[name=q]`, // Search query imput area
      searchResult: this.isMobile ? `.y0NFKc` : `.MjjYud >> .g`, // One search result for mobile and for desktop
    };
  }

  // Navigate to Home page
  async navigateHome() {
    try {
      await this.page.goto(`https://www.google.com`);
    } catch (error) {
      console.error(`Failed to navigate to Home page: ${error.message}`);
    }
  }

  // Reject all Cookies if it's needed
  async rejectCookiesIfAsked() {
    if (await this.page.isVisible(this.selectors.cookiesModal)) {
      try {
        await this.page.click(this.selectors.rejectAllCookiesButton);
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

  // Search for query
  async searchFor(query) {
    try {
      await this.page.waitForSelector(this.selectors.searchInputTextArea);
      await this.page.fill(this.selectors.searchInputTextArea, query);
      await this.page.press(this.selectors.searchInputTextArea, 'Enter');
      // Waiting for search result page to appear
      await this.page.waitForLoadState('networkidle');
    } catch (error) {
      console.error(`Failed to search: ${error.message}`);
    }
  }

  // Navigate to page, reject all Cookies and search for query
  async navigateAndSearch(query) {
    try {
      await this.navigateAndRejectCookies();
      await this.searchFor(query);
    } catch (error) {
      console.error(`Failed to navigate to page, reject all Cookies and search for query: ${error.message}`);
    }
  }

  // Get Search results
  async getSearchResults() {
    try {
      await this.page.waitForSelector(this.selectors.searchResult);
      const searchResults = await this.page.$$(this.selectors.searchResult);
      return searchResults;
    } catch (error) {
      console.error(`Failed to get search results: ${error.message}`);
    }
  }

  // Check if all search results contain query
  async checkIfSearchResultsContainQuery(searchResults, query) {
    try {
      for (let searchResult of searchResults) {
        // Get the text of each searchResult
        let resultText = await searchResult.textContent();
        resultText = resultText.toLowerCase();
        query = query.toLowerCase();
        // Check if the text contains query
        if (!resultText.includes(query)) {
          return false;
        }
      }
      return true;
    } catch (error) {
      console.error(`Failed to validate search results contain query: ${error.message}`);
    }
  }

  // Get text content from array of objects
  async getTextContent(objects) {
    try {
      let results = [];
      for (let i = 0; i < objects.length; i++) {
        const text = await objects[i].innerText();
        results.push(text);
      }
      return results;
    } catch (error) {
      console.error(`Failed to get text content from array of objects: ${error.message}`);
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
      let allItemsIncluded = true;
      expectedItems.forEach((item) => {
        if (!array.includes(item)) {
          allItemsIncluded = false;
        }
      });
      return allItemsIncluded;
    } catch (error) {
      console.error(`Failed to check if all expected items included to the array: ${error.message}`);
    }
  }

  // Get page title
  async getPageTitle() {
    try {
      return await this.page.title();
    } catch (error) {
      console.error(`Failed to get page title: ${error.message}`);
    }
  }

  // Get performance metrics for Search results
  async getPerformanceMetricsForSearchResults(query, testInfo) {
    try {
      // Performance API: Start performance tracing
      const currentBrowser = this.page.context().browser();
      let timestamp = Date.now();
      const tracesName = 'perfTraces_' + query + `_${timestamp}` + '.json';
      const tracesPath = getTempFilePath(tracesName);
      await currentBrowser.startTracing(this.page, { path: tracesPath, screenshots: true });

      // Make Search action
      await this.page.waitForSelector(this.selectors.searchInputTextArea);
      await this.page.fill(this.selectors.searchInputTextArea, query);
      await this.page.press(this.selectors.searchInputTextArea, 'Enter');

      //Performance.mark API: Start performance tracking
      await this.page.evaluate(() => window.performance.mark('Perf:Started'));

      // Chrome DevTool Protocol API: Create a new connection to an existing CDP session to enable performance Metrics
      const session = await this.page.context().newCDPSession(this.page);
      await session.send('Performance.enable');
      // Chrome DevTool Protocol API: Record the performance metrics before actions
      const metricsBefore = await session.send('Performance.getMetrics');

      // Wait for search Results are visible
      await this.page.waitForSelector(this.selectors.searchResult, { state: 'visible' });

      //Performance.mark API: Stop performance tracking
      await this.page.evaluate(() => window.performance.mark('Perf:Ended'));

      // Chrome DevTool Protocol API: Record the performance metrics after the actions
      const metricsAfter = await session.send('Performance.getMetrics');

      // Performance API: Stop performance tracing
      await currentBrowser.stopTracing();

      // Performance API: Attach traces to the test report
      await testInfo.attach(tracesName, {
        path: tracesPath,
        contentType: 'application/json',
      });

      // Metrics calculation
      // Performance.mark API: Performance measure
      await this.page.evaluate(() => window.performance.measure('action', 'Perf:Started', 'Perf:Ended'));

      // To get all performance marks
      const allMarksInfo = await this.page.evaluate(() =>
        JSON.stringify(window.performance.getEntriesByType('mark'), null, 2)
      );

      // Performance.mark API: Attach allMarksInfo to the test report
      const marksInfoDataName = 'marksInfoDataName' + `_${timestamp}` + '.json';
      const marksInfoDataPath = getTempFilePath(marksInfoDataName);
      await writeFile(marksInfoDataPath, allMarksInfo);
      await testInfo.attach(marksInfoDataName, {
        path: marksInfoDataPath,
        contentType: 'application/json',
      });

      // Performance.mark API: To get all performance measures
      const allMeasuresInfo = await this.page.evaluate(() =>
        JSON.stringify(window.performance.getEntriesByName('action'), null, 2)
      );

      // Performance.mark API: Duration of the action
      const allMeasuresJSONArray = JSON.parse(allMeasuresInfo);
      const actionDutation = allMeasuresJSONArray[0]['duration'];

      // Performance.mark API: Attach allMeasuresInfo to the test report
      const measuresInfoDataName = 'measuresInfoDataName' + `_${timestamp}` + '.json';
      const measuresInfoDataPath = getTempFilePath(measuresInfoDataName);
      await writeFile(measuresInfoDataPath, allMeasuresInfo);
      await testInfo.attach(measuresInfoDataName, {
        path: measuresInfoDataPath,
        contentType: 'application/json',
      });

      // Chrome DevTool Protocol API: Subtract the metrics before the action from the metrics after the action
      let metricsDiff = [];

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
      const metricsDiffData = JSON.stringify(metricsDiff, null, 2);
      const metricsDiffDataName = 'metricsDiffDataName' + `_${timestamp}` + '.json';
      const metricsDiffDataPath = getTempFilePath(metricsDiffDataName);
      await writeFile(metricsDiffDataPath, metricsDiffData);
      await testInfo.attach(metricsDiffDataName, {
        path: metricsDiffDataPath,
        contentType: 'application/json',
      });
      const metrics = { tracesPath, marksInfoDataPath, measuresInfoDataPath, metricsDiffDataPath };

      return { metrics, actionDutation };
    } catch (error) {
      console.error(`Failed to get performance metrics for Search results: ${error.message}`);
    }
  }
}
