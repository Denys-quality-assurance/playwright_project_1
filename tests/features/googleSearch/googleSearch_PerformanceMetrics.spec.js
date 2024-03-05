import { expect } from '@playwright/test';
import test from '../../../hooks/testWithAfterEachHooks.mjs';
import GoogleSearchPage from '../../pages/googleSearchPage';
import { queryDataGeneral } from '../../test-data/googleSearch/queryData';
import acceptablePerformanceData from '../../test-data/googleSearch/acceptablePerformanceData';
import { checkFileExists, deleteTempFile } from '../../../utilities/fileSystemHelper';

const acceptableActionDutation = acceptablePerformanceData.acceptableSearchDutation; // The duration of the action should not exide the limit (ms)

test.describe(`Google Search results: Performance metrics`, () => {
  let page; // Page instance
  let googleSearchPage; // Page object instance

  // Navigate to Home page and reject all Cookies
  test.beforeEach('Navigate to Home page and reject all Cookies', async ({ sharedContext }, testInfo) => {
    if (testInfo.expectedStatus !== 'skipped') {
      page = await sharedContext.newPage();
      const isMobile = sharedContext._options.isMobile || false; // type of device is mobile
      googleSearchPage = new GoogleSearchPage(page, isMobile);
      await googleSearchPage.navigateAndRejectCookies();
    }
  });

  queryDataGeneral.forEach((queryData) => {
    test(`Performance metrics for Search results for '${queryData.query}' query @results @performance`, async ({}, testInfo) => {
      // Get browser type
      const defaultBrowserType = testInfo.project.use.defaultBrowserType;
      // Get performance metrics for Search results
      const { metrics, actionDuration } = await googleSearchPage.getPerformanceMetricsForSearchResults(
        queryData.query,
        testInfo,
        defaultBrowserType
      );
      // API Performance.mark: Check if the duration of the action does not exceed limits
      expect(actionDuration, `The duration of the action exceeds limits`).toBeLessThanOrEqual(acceptableActionDutation);

      // Performance.mark API: Check if marksInfoData collected
      const isMarksInfoFileCreated = checkFileExists(metrics.marksInfoDataPath);
      expect(isMarksInfoFileCreated, `The trmarksInfoDataaces for the query are not saved in the file system`).toBe(
        true
      );
      // Performance.mark API: Check if measuresInfoData collected
      const isMeasuresInfoFileCreated = checkFileExists(metrics.measuresInfoDataPath);
      expect(isMeasuresInfoFileCreated, `The measuresInfoData for the query are not saved in the file system`).toBe(
        true
      );

      // Additional metrics only for cromium browsers
      if (defaultBrowserType == 'chromium') {
        // Performance API: Check if the traices collected
        const isTraiceFileCreated = checkFileExists(metrics.tracesPath);
        expect(isTraiceFileCreated, `The Performance API traces for the query are not saved in the file system`).toBe(
          true
        );
        // Chrome DevTool Protocol API: Check if Chrome DevTool Protocol metrics collected
        const isCDPDataFileCreated = checkFileExists(metrics.metricsDiffDataPath);
        expect(
          isCDPDataFileCreated,
          `The Chrome DevTool Protocol metrics for the query are not saved in the file system`
        ).toBe(true);
      }

      // Delete the temporaty files
      for (let key in metrics) {
        deleteTempFile(metrics[key]);
      }
    });
  });
});
