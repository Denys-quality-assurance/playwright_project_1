/*
 * Google Search Results Performance Test Suite:
 * This suite of tests is designed to measure, analyze, and validate the performance of Google's search results.
 *
 * The suite begins by setting up a page instance and GoogleSearchPage object instance.
 * It then navigates to the Google homepage and rejects all cookies.
 * Each test in the suite then performs a search of 'queryData' and gathers key performance metrics.
 *
 * These metrics include action duration (using Performance.mark API) to ensure the action doesn't exceed set limits,
 * as well as information on performance marks and measures (also via Performance.mark API).
 * In the case of Chromium browser, additional metrics collected include traces (Performance API)
 * and Chrome DevTool Protocol metrics.
 *
 * The collected metrics are checked to ensure they have been properly saved in the system.
 *
 * The GoogleSearchPage class includes helper methods for search interactions and performance metrics gathering.
 * The 'fileSystemHelper' module is utilized for handling file-related operations.
 *
 * The data for the search queries is imported from queryData and can be used with Data-driven testing (DDT) approach.
 *
 */

import { expect } from '@playwright/test';
import test from '../../../hooks/testWithAfterEachHooks.mjs';
import GoogleSearchPage from '../../pages/googleSearchPage';
import { queryDataGeneral } from '../../test-data/googleSearch/queryData';
import acceptablePerformanceData from '../../test-data/googleSearch/acceptablePerformanceData';
import {
  checkFileExists,
  deleteFileAtPath,
} from '../../../utilities/fileSystemHelper';

const testStatus = {
  SKIPPED: 'skipped',
};

const acceptableActionDutation =
  acceptablePerformanceData.acceptableSearchDutation; // The duration of the action should not exide the limit (ms)

test.describe(`Google Search results: Performance metrics`, () => {
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
  let googleSearchPage; // Page object instance

  // Navigate to Home page and reject all Cookies
  test.beforeEach(
    'Navigate to Home page and reject all Cookies',
    async ({ sharedContext }, testInfo) => {
      // Prepare the test only if the test is not skipped
      if (testInfo.expectedStatus !== testStatus.SKIPPED) {
        page = await sharedContext.newPage();
        const isMobile = sharedContext._options.isMobile || false; // type of device is mobile
        googleSearchPage = new GoogleSearchPage(page, isMobile);
        await googleSearchPage.goToHomeAndRejectCookies();
      }
    }
  );

  queryDataGeneral.forEach((queryData) => {
    test(`TEST-12: Main performance metrics for Search results for '${queryData.query}' query @only-chromium @results @performance`, async ({}, testInfo) => {
      // Get browser type
      const defaultBrowserType = testInfo.project.use.defaultBrowserType;
      // Get performance metrics for Search results
      const { metrics, actionDuration } =
        await googleSearchPage.getPerformanceMetricsForSearchResults(
          queryData.query,
          testInfo,
          defaultBrowserType
        );
      // API Performance.mark: Check if the duration of the action does not exceed limits
      expect(
        actionDuration,
        `The duration of the action exceeds limits`
      ).toBeLessThanOrEqual(acceptableActionDutation);

      // Performance.mark API: Check if marksInfoData collected
      const isMarksInfoFileCreated = checkFileExists(metrics.marksInfoDataPath);
      expect(
        isMarksInfoFileCreated,
        `The marksInfoData for the '${queryData.query}' query are not saved in the file system`
      ).toBe(true);
      // Performance.mark API: Check if measuresInfoData collected
      const isMeasuresInfoFileCreated = checkFileExists(
        metrics.measuresInfoDataPath
      );
      expect(
        isMeasuresInfoFileCreated,
        `The measuresInfoData for the '${queryData.query}' query are not saved in the file system`
      ).toBe(true);

      // Additional metrics only for cromium browsers
      // Performance API: Check if the traices collected
      const isTraiceFileCreated = checkFileExists(metrics.tracesPath);
      expect(
        isTraiceFileCreated,
        `The Performance API traces for the '${queryData.query}' query are not saved in the file system`
      ).toBe(true);
      // Chrome DevTool Protocol API: Check if Chrome DevTool Protocol metrics collected
      const isCDPDataFileCreated = checkFileExists(metrics.metricsDiffDataPath);
      expect(
        isCDPDataFileCreated,
        `The Chrome DevTool Protocol metrics for the '${queryData.query}' query are not saved in the file system`
      ).toBe(true);

      // Delete the temporaty files
      for (let key in metrics) {
        deleteFileAtPath(metrics[key]);
      }
    });
  });

  queryDataGeneral.forEach((queryData) => {
    test(`TEST-13: Performance metrics (exept Chromium) for Search results for '${queryData.query}' query @skip-for-chromium @results @performance`, async ({}, testInfo) => {
      // Get browser type
      const defaultBrowserType = testInfo.project.use.defaultBrowserType;
      // Get performance metrics for Search results
      const { metrics, actionDuration } =
        await googleSearchPage.getPerformanceMetricsForSearchResults(
          queryData.query,
          testInfo,
          defaultBrowserType
        );
      // API Performance.mark: Check if the duration of the action does not exceed limits
      expect(
        actionDuration,
        `The duration of the action exceeds limits`
      ).toBeLessThanOrEqual(acceptableActionDutation);

      // Performance.mark API: Check if marksInfoData collected
      const isMarksInfoFileCreated = checkFileExists(metrics.marksInfoDataPath);
      expect(
        isMarksInfoFileCreated,
        `The marksInfoData for the '${queryData.query}' query are not saved in the file system`
      ).toBe(true);
      // Performance.mark API: Check if measuresInfoData collected
      const isMeasuresInfoFileCreated = checkFileExists(
        metrics.measuresInfoDataPath
      );
      expect(
        isMeasuresInfoFileCreated,
        `The measuresInfoData for the '${queryData.query}' query are not saved in the file system`
      ).toBe(true);

      // Delete the temporaty files
      for (let key in metrics) {
        deleteFileAtPath(metrics[key]);
      }
    });
  });
});
