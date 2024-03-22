/*
 * This module exports a `test` object which is used to create test cases.
 * # Test Lifecycle Manager
 * This code manages the test lifecycle in the context of known bugs.
 * It determines if tests should be skipped or failed based on existing known
 * bugs. This information is retrieved from a `knownBugs` JSON file.
 *
 * The code exports a function - `initSharedContext()` - which sets up the
 * shared context for a test and configures each test based on the context
 * options.
 *
 * # Screenshot and HTML Report Manager
 * This code is responsible for managing screenshot captures and handling
 * known bug information related to test cases.
 *
 * Main features:
 * 1. Determines if screenshots should be taken for test case pass scenarios
 * 2. Attaches viewport and full-page screenshots to HTML reports
 * 3. Attaches information about known bugs to the HTML report
 *
 * At the end of every test case, the context is closed to ensure proper freeing of resources.
 *
 */

import { test as base } from '@playwright/test';
import { knownBugs } from '../tests/knownBugs.js';
import {
  findRelatedUnfixedBugsForTest,
  findRelatedBugsForTest,
  sortKnownIssues,
} from '../utilities/customReporterHelper.js';
import { NO_KNOWN_ISSUE_STR } from '../utilities/customReporterHelper.js';
import { generateUniqueFileName } from '../utilities/fileSystemHelper';
const testStatus = {
  FAILED: 'failed',
  TIMEOUT: 'timedOut',
  PASSED: 'passed',
  SKIPPED: 'skipped',
  INTERRUPTED: 'interrupted',
};

// Lifecycle manager
// Create a browser shared context and configures each test based on the context options
function initSharedContext(contextOptions) {
  const test = base.extend({
    sharedContext: async ({ browser }, use) => {
      // Create new context with the given options
      const context = await browser.newContext(contextOptions);
      // Pass the values to the test functions
      await use(context);
    },
    shouldFailTest: async ({}, use, testInfo) => {
      // Test should be failed when the condition is true: there is at least 1 unfixed bug
      const shouldFailTest = hasUnfixedBugs(testInfo);
      // Pass the values to the test functions
      await use(shouldFailTest);
    },
    shouldSkipTest: async ({}, use, testInfo) => {
      // Test should be skipped when the condition is true: flag skipTestsWithKnownBugs is 'true' and there is at least 1 unfixed bug
      const shouldSkipTest = shoulSkipTest(testInfo);
      // Pass the values to the test functions
      await use(shouldSkipTest);
    },
  });

  // Check if the test has unfixed bugs
  function hasUnfixedBugs(testInfo) {
    // Environment for current test project
    const currentProjectEnv = testInfo.project.metadata.currentENV;
    // Find if the current test has known bugs unfixed in the current environment
    const relatedUnfixedBugs = findRelatedUnfixedBugsForTest(
      testInfo.file,
      testInfo.title,
      knownBugs,
      currentProjectEnv
    );

    // Returns true if the test has any unfixed bugs
    return relatedUnfixedBugs.length > 0;
  }

  // Mark the current test as "should skip"
  function shoulSkipTest(testInfo) {
    // Check if the test has unfixed bugs
    const hasUnfixed = hasUnfixedBugs(testInfo);
    // Check whether a project should skip known bugs
    const skipTestsWithKnownBugs = shouldSkipTestsWithKnownBugs(testInfo);
    // Test is skipped when the condition is true: flag skipTestsWithKnownBugs is 'true' and there is at least 1 unfixed bug
    return skipTestsWithKnownBugs && hasUnfixed;
  }

  // Check whether the project should skip tests with known bugs
  function shouldSkipTestsWithKnownBugs(testInfo) {
    try {
      // Test with unfixed bugs is skipped when skipTestsWithKnownBugs is 'true'
      return (
        testInfo.project.metadata.skipTestsWithKnownBugs.toLowerCase() ===
        'true'
      );
    } catch (error) {
      console.error(
        `Failed to check whether a project should skip tests with known bugs: ${error.message}`
      );
    }
  }

  // Screenshot and HTML Report Manager
  // Attach screenshots to HTML report
  // Add test info to the HTML report
  test.afterEach(
    'Attach screenshots to HTML report. Add test info to the HTML report',
    async ({ sharedContext }, testInfo) => {
      try {
        if (
          testInfo.status !== testStatus.SKIPPED &&
          testInfo.status !== testStatus.INTERRUPTED
        ) {
          // Get all open pages
          const pages = sharedContext.pages();
          // Get the current test path
          const projectName = testInfo.project.name;
          const currentTitlePath = testInfo.titlePath;
          const currentTestPath = `[${projectName}] › ${currentTitlePath.join(' › ')}`;
          // Current timestamp
          const timestamp = Date.now();

          // Attach screenshots to HTML report
          // By mapping over each page
          const screenshotPromises = pages.map(async (page, index) => {
            await attachPageScreenshotsToReport(
              page,
              index,
              testInfo,
              projectName,
              timestamp
            );
          });
          try {
            // Execute all screenshot taking promises sequentially
            await Promise.all(screenshotPromises);
          } catch (error) {
            console.error(
              `Failed to attach screenshots to HTML report: ${error.message}`
            );
          }

          // Attach known bugs info info to the HTML report
          await attachKnownBugsInfoToReport(testInfo, currentTestPath);
        }
      } catch (error) {
        console.error(
          `Failed to attach screenshots to HTML report or add info to the HTML report: ${error.message}`
        );
      }
    }
  );

  // Check whether the project should take screenshot for passed tests
  function shouldTakeScreenshotsForPassedTests(testInfo) {
    try {
      // screenshots for passed tests are taken when PASSED_TESTS_SCREENSHOT is 'true'
      return (
        testInfo.project.metadata.passedTestsScreenshots.toLowerCase() ===
        'true'
      );
    } catch (error) {
      console.error(
        `Failed to check whether the project should take screenshot for passed tests: ${error.message}`
      );
    }
  }

  // Attache viewport and fullpage screenshots to the HTML report for a specific page
  async function attachPageScreenshotsToReport(
    page,
    index,
    testInfo,
    projectName,
    timestamp
  ) {
    try {
      // Take a screenshot of the current viewport
      // If the test passed and the project should take screenshot for passed tests
      if (
        testInfo.status === testStatus.PASSED &&
        shouldTakeScreenshotsForPassedTests(testInfo)
      ) {
        const screenshotViewport = await page.screenshot();
        // Attach viewport screenshots to HTML report
        // It is named uniquely by using the project name, timestamp and page index
        await testInfo.attach(
          `${projectName}_${timestamp}_viewport_screenshot_of_Page_${index}.png`,
          {
            body: screenshotViewport,
            contentType: 'image/png',
          }
        );
      }

      // If the test failed, was retried or passed unexpectedly, take a full page screenshot
      if (isTestFailedOrRetriedOrPassedUnexpectedly(testInfo)) {
        // Take a fullpage screenshot
        const screenshotFullPage = await page.screenshot({
          fullPage: true,
        });
        // Attach viewport screenshots to HTML report
        // It is named uniquely by using the project name, timestamp and page index
        await testInfo.attach(
          `${projectName}_${timestamp}_fullpage_screenshot_of_Page_${index}.png`,
          {
            body: screenshotFullPage,
            contentType: 'image/png',
          }
        );
      }
    } catch (error) {
      console.error(
        `Failed to attach screenshots to HTML report for Page ${index}: ${error.message}`
      );
    }
  }

  // Check if the test failed, was retried or passed unexpectedly
  function isTestFailedOrRetriedOrPassedUnexpectedly(testInfo) {
    return (
      // Check if the test status is FAILED or TIMEOUT. If so, it means the test has failed and return true.
      testInfo.status === testStatus.FAILED ||
      testInfo.status === testStatus.TIMEOUT ||
      // Check if the test status is PASSED and it equals the expected test status.
      // Moreover, check if the retry count is more than 0 which means the test has been retried,
      // thus indicating an initial failure.
      // If this condition is met, return true as well.
      (testInfo.status === testStatus.PASSED &&
        testInfo.status === testInfo.expectedStatus &&
        testInfo.retry > 0) ||
      // Check if the test status is PASSED and it doesn't equal the expected test status,
      // thus indicating an unexpected pass.
      // If this condition is met, return true as well.
      (testInfo.status === testStatus.PASSED &&
        testInfo.status !== testInfo.expectedStatus)
    );
  }

  // Attach known bugs info to the HTML report
  async function attachKnownBugsInfoToReport(testInfo, currentTestPath) {
    try {
      // Environment for current test project
      const currentProjectEnv = testInfo.project.metadata.currentENV;

      // Return known bugs related to the current test file and title
      const relatedBugs = findRelatedBugsForTest(
        testInfo.file,
        testInfo.title,
        knownBugs
      );

      // Attach info to the HTML report if the test has related bugs
      // and if the test failed, was retried or passed unexpectedly
      if (
        relatedBugs.length > 0 &&
        isTestFailedOrRetriedOrPassedUnexpectedly(testInfo)
      ) {
        // Collects fixed and unfixed known issues
        var listKnownIssues = sortKnownIssues(
          testInfo.status,
          currentTestPath,
          relatedBugs,
          currentProjectEnv
        );

        // Initialize list of known bugs for current test with a header
        let knownBugsForCurrentTest = ['KNOWN ISSUES:'];

        // Conditionally add unfixed and fixed issues to knownBugsForCurrentTest
        knownBugsForCurrentTest =
          testInfo.status !== testStatus.PASSED
            ? [
                ...knownBugsForCurrentTest,
                ...listKnownIssues.listKnownUnfixedIssues,
                ...listKnownIssues.listKnownFixedIssues,
              ]
            : [
                ...knownBugsForCurrentTest,
                ...listKnownIssues.listKnownUnfixedIssues,
              ];

        // Attach known bugs info to test info
        await attachTextToTestReport(
          testInfo,
          knownBugsForCurrentTest.join('\n'),
          'known_bugs_for_the_current_test'
        );
      } else {
        // Attach string if no known bugs exist for test
        await attachTextToTestReport(
          testInfo,
          NO_KNOWN_ISSUE_STR,
          'known_bugs_for_the_current_test_IS_EMPTY'
        );
      }
    } catch (error) {
      console.error(`Failed to add info to the HTML report: ${error.message}`);
    }
  }

  // Attach text to HTML report
  async function attachTextToTestReport(testInfo, data, fileName) {
    try {
      // Creating a temporary file path for the JSON file
      const dataName = generateUniqueFileName(testInfo, `${fileName}`);
      // Attaching the JSON file to the test info context
      await testInfo.attach(dataName, {
        body: data,
        contentType: 'text/plain',
      });
    } catch (error) {
      console.error(`Failed to attach text to HTML report: ${error.message}`);
    }
  }

  // Ensure the context always gets closed at the end.
  test.afterEach('Close Browser Context', async ({ sharedContext }) => {
    await sharedContext.close();
  });

  return test;
}

export { initSharedContext };
