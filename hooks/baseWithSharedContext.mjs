import { test as base } from '@playwright/test';
import { knownBugs } from '../tests/knownBugs.js';
import {
  findRelatedUnfixedBugsForTest,
  findRelatedBugsForTest,
  sortKnownIssues,
} from '../utilities/customReporterHelper.js';

import { NO_KNOWN_ISSUE_STR } from '../utilities/customReporterHelper.js';
const testStatus = {
  FAILED: 'failed',
  TIMEOUT: 'timedOut',
  PASSED: 'passed',
  SKIPPED: 'skipped',
  INTERRUPTED: 'interrupted',
};

// This module manages tests lifecycle including decision if
// test should be skipped or failed based on existing known bugs

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

  // Check whether a project should skip tests with known bugs
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

  // Add screenshots as attachments to HTML report. Add info to the custom report
  test.afterEach(
    'Add screenshots as attachments to HTML report. Add info to the custom report',
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
          const timestamp = Date.now();

          // Add screenshots as attachments to HTML report
          const screenshotPromises = pages.map(async (page, index) => {
            try {
              // Add viewport screenshots as attachments to HTML report
              const screenshotViewport = await page.screenshot();

              await testInfo.attach(
                `${projectName}_${timestamp}_viewport_screenshot_of_Page_${index}.png`,
                {
                  body: screenshotViewport,
                  contentType: 'image/png',
                }
              );

              // Conditionally save fullpage screenshot if the test had failed or retried
              if (
                testInfo.status === testStatus.FAILED ||
                testInfo.status === testStatus.TIMEOUT ||
                (testInfo.status === testStatus.PASSED &&
                  testInfo.status === testInfo.expectedStatus &&
                  testInfo.retry > 0)
              ) {
                const screenshotFullPage = await page.screenshot({
                  fullPage: true,
                });
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
                `Failed to add screenshots for Page ${index}: ${error.message}`
              );
            }
          });

          try {
            await Promise.all(screenshotPromises);
          } catch (error) {
            console.error(`Failed to add screenshots: ${error.message}`);
          }

          // Add info to the custom report
          try {
            // Environment for current test project
            const currentProjectEnv = testInfo.project.metadata.currentENV;

            // List of the known bugs for the current test
            let knownBugsForCurrentTest = [];
            let listKnownIssuesForFailed = [];
            let listKnownIssuesForPassed = [];
            // Find if the current test has known bugs
            const relatedBugs = findRelatedBugsForTest(
              testInfo.file,
              testInfo.title,
              knownBugs
            );

            if (relatedBugs.length > 0) {
              // Add info to the custom report if the test has related bugs
              if (
                testInfo.status === testStatus.FAILED ||
                testInfo.status === testStatus.TIMEOUT ||
                (testInfo.status === testStatus.PASSED &&
                  testInfo.status === testInfo.expectedStatus &&
                  testInfo.retry > 0)
              ) {
                // Collect the list of the known fixed and unfixed issues
                listKnownIssuesForFailed = sortKnownIssues(
                  testInfo.status,
                  currentTestPath,
                  relatedBugs,
                  currentProjectEnv,
                  knownBugsForCurrentTest,
                  knownBugsForCurrentTest
                );
              } else if (
                testInfo.status === testStatus.PASSED &&
                testInfo.status !== testInfo.expectedStatus
              ) {
                // Collect the list of the unfixed issues
                listKnownIssuesForPassed = sortKnownIssues(
                  testInfo.status,
                  currentTestPath,
                  relatedBugs,
                  currentProjectEnv,
                  knownBugsForCurrentTest
                );
              }
              // Add a header for the List of the known issues
              knownBugsForCurrentTest.push('KNOWN ISSUES:');
              // List of the known unfixed issues for the test
              knownBugsForCurrentTest =
                testInfo.status !== testStatus.PASSED
                  ? [
                      ...knownBugsForCurrentTest,
                      ...listKnownIssuesForFailed.listKnownUnfixedIssues,
                    ]
                  : [
                      ...knownBugsForCurrentTest,
                      ...listKnownIssuesForPassed.listKnownUnfixedIssues,
                    ];
              // List of the known fixed issues for the test
              knownBugsForCurrentTest =
                testInfo.status !== testStatus.PASSED
                  ? [
                      ...knownBugsForCurrentTest,
                      ...listKnownIssuesForFailed.listKnownFixedIssues,
                    ]
                  : [...knownBugsForCurrentTest];

              // Attach the bugs info to the test info
              await testInfo.attach(
                `${projectName}_${timestamp}_known_bugs_for_the_current_test`,
                {
                  body: knownBugsForCurrentTest.join('\n'),
                  contentType: 'text/plain',
                }
              );
            } else {
              // If there is no known bugs for the test, attach it under unknown issues
              await testInfo.attach(
                `${projectName}_${timestamp}_known_bugs_for_the_current_test_IS_EMPTY`,
                {
                  body: NO_KNOWN_ISSUE_STR,
                  contentType: 'text/plain',
                }
              );
            }
          } catch (error) {
            console.error(
              `Failed to add info to the custom report: ${error.message}`
            );
          }
        }
      } catch (error) {
        console.error(
          `Failed to add screenshots as attachments to HTML report or add info to the custom report: ${error.message}`
        );
      } finally {
        // Always try to close the context, regardless of whether an error was thrown
        await sharedContext.close();
      }
    }
  );

  // Ensure the context always gets closed at the end.
  test.afterEach('Close Browser Context', async ({ sharedContext }) => {
    await sharedContext.close();
  });

  return test;
}

export { initSharedContext };
