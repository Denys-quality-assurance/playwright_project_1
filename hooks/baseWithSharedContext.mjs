import { test as base } from '@playwright/test';
import { knownBugs } from '../tests/knownBugs.js';
import {
  findRelatedUnfixedBugsForTest,
  findRelatedBugsForTest,
  sortKnownIssues,
} from '../utilities/customReporterHelper.js';

import { NO_KNOWN_ISSUE_STR } from '../utilities/customReporterHelper.js';

function createSharedContextTest(contextOptions) {
  const test = base.extend({
    sharedContext: async ({ browser }, use) => {
      const context = await browser.newContext(contextOptions);
      await use(context);
    },
  });

  // Mark the current test as "should fail" or skip it
  test.beforeEach('Mark the current test as "should fail" or skip it', async ({}, testInfo) => {
    try {
      // Environment for current test project
      const currentENV = testInfo.project.metadata.currentENV;

      // Find if the current test has known bugs unfixed in the current environment
      const relatedUnfixedBugs = findRelatedUnfixedBugsForTest(testInfo.file, testInfo.title, knownBugs, currentENV);
      // Number of the related unfixed bugs
      const numberOfRelatedUnfixedBugs = relatedUnfixedBugs.length;
      // Test is marked as "should fail" when the condition is true: there is at least 1 related bug
      testInfo.fail(
        numberOfRelatedUnfixedBugs > 0,
        `Test marked as "should fail" due to the presence of ${numberOfRelatedUnfixedBugs} unfixed bug(s)`
      );
    } catch (error) {
      console.error(`Failed to mark the current test as "should fail" or skip it: ${error.message}`);
    }
  });

  // Add screenshots as attachments to HTML report. Add info to the custom report
  test.afterEach(
    'Add screenshots as attachments to HTML report. Add info to the custom report',
    async ({ sharedContext }, testInfo) => {
      try {
        // Get all open pages
        const pages = sharedContext.pages();
        // Get the current test path
        const projectName = testInfo.project.name;
        const currentTitlePath = testInfo.titlePath;
        const currentTestPath = `[${projectName}] › ${currentTitlePath[0]} › ${currentTitlePath[1]} › ${currentTitlePath[2]}}`;
        const timestamp = Date.now();

        // Add screenshots as attachments to HTML report
        const screenshotPromises = pages.map(async (page, index) => {
          try {
            // Add viewport screenshots as attachments to HTML report
            const screenshotViewport = await page.screenshot();

            await testInfo.attach(`${projectName}_${timestamp}_viewport_screenshot_of_Page_${index}.png`, {
              body: screenshotViewport,
              contentType: 'image/png',
            });

            // Conditionally save fullpage screenshot if the test had failed or retried
            if (
              testInfo.status === 'failed' ||
              testInfo.status === 'timedOut' ||
              (testInfo.status === 'passed' && testInfo.status === testInfo.expectedStatus && testInfo.retry > 0)
            ) {
              const screenshotFullPage = await page.screenshot({ fullPage: true });
              await testInfo.attach(`${projectName}_${timestamp}_fullpage_screenshot_of_Page_${index}.png`, {
                body: screenshotFullPage,
                contentType: 'image/png',
              });
            }
          } catch (error) {
            console.error(`Failed to add screenshots for Page ${index}: ${error.message}`);
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
          const currentENV = testInfo.project.metadata.currentENV;

          // List of the known bugs for the current test
          let knownBugsForCurrentTest = [];
          let listKnownIssuesForFailed = [];
          let listKnownIssuesForPassed = [];
          // Find if the current test has known bugs
          const relatedBugs = findRelatedBugsForTest(testInfo.file, testInfo.title, knownBugs);

          if (relatedBugs.length > 0) {
            // Add info to the custom report if the test has related bugs
            if (
              testInfo.status === 'failed' ||
              testInfo.status === 'timedOut' ||
              (testInfo.status === 'passed' && testInfo.status === testInfo.expectedStatus && testInfo.retry > 0)
            ) {
              // Collect the list of the known fixed and unfixed issues
              listKnownIssuesForFailed = sortKnownIssues(
                testInfo.status,
                currentTestPath,
                relatedBugs,
                currentENV,
                knownBugsForCurrentTest,
                knownBugsForCurrentTest
              );
            } else if (testInfo.status === 'passed' && testInfo.status !== testInfo.expectedStatus) {
              // Collect the list of the unfixed issues
              listKnownIssuesForPassed = sortKnownIssues(
                testInfo.status,
                currentTestPath,
                relatedBugs,
                currentENV,
                knownBugsForCurrentTest
              );
            }
            // Add a header for the List of the known issues
            knownBugsForCurrentTest.push('KNOWN ISSUES:');
            // List of the known unfixed issues for the test
            knownBugsForCurrentTest =
              testInfo.status !== 'passed'
                ? [...knownBugsForCurrentTest, ...listKnownIssuesForFailed.listKnownUnfixedIssues]
                : [...knownBugsForCurrentTest, ...listKnownIssuesForPassed.listKnownUnfixedIssues];
            // List of the known fixed issues for the test
            knownBugsForCurrentTest =
              testInfo.status !== 'passed'
                ? [...knownBugsForCurrentTest, ...listKnownIssuesForFailed.listKnownFixedIssues]
                : [...knownBugsForCurrentTest];

            // Attach the bugs info to the test info
            await testInfo.attach(`${projectName}_${timestamp}_known_bugs_for_the_current_test`, {
              body: knownBugsForCurrentTest.join('\n'),
              contentType: 'text/plain',
            });
          } else {
            // If there is no known bugs for the test, attach it under unknown issues
            await testInfo.attach(`${projectName}_${timestamp}_known_bugs_for_the_current_test_IS_EMPTY`, {
              body: NO_KNOWN_ISSUE_STR,
              contentType: 'text/plain',
            });
          }
        } catch (error) {
          console.error(`Failed to add info to the custom report: ${error.message}`);
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

  return test;
}

export { createSharedContextTest };
