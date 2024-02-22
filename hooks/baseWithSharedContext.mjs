import { test as base } from '@playwright/test';
import { knownBugs } from '../tests/knownBugs.js';
import { findRelatedBugsTest, sortKnownIssues } from '../utilities/customReporterHelper.js';

import { NO_KNOWN_ISSUE_STR } from '../utilities/customReporterHelper.js';

function createSharedContextTest(contextOptions) {
  const test = base.extend({
    sharedContext: async ({ browser }, use) => {
      const context = await browser.newContext(contextOptions);
      await use(context);
    },
  });

  test.afterEach(
    'Add screenshots as attachments to HTML report. Add info to the custom report',
    async ({ sharedContext }, testInfo) => {
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
          if (testInfo.status === 'failed' || testInfo.status === 'timedOut' || testInfo.retry > 0) {
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
        // Add info to the custom report if the test had failed 1st time
        if (testInfo.status === 'failed' || testInfo.status === 'timedOut' || testInfo.retry > 0) {
          // Find if the current failed test has known bugs
          const relatedBugs = findRelatedBugsTest(testInfo.file, testInfo.title, knownBugs);

          if (relatedBugs.length > 0) {
            // Collect the list of the failed tests with known fixed and unfixed issues
            const listKnownIssues = sortKnownIssues(
              currentTestPath,
              relatedBugs,
              currentENV,
              knownBugsForCurrentTest,
              knownBugsForCurrentTest
            );
            // Add a header for the List of the known issues
            knownBugsForCurrentTest.push('KNOWN ISSUES:');
            // List of the known unfixed issues for the test
            knownBugsForCurrentTest = [...knownBugsForCurrentTest, ...listKnownIssues.listKnownUnfixedIssues];
            // List of the known fixed issues for the test
            knownBugsForCurrentTest = [...knownBugsForCurrentTest, ...listKnownIssues.listKnownFixedIssues];

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
        }
      } catch (error) {
        console.error(`Failed to add into to the custom report: ${error.message}`);
      }
    }
  );

  return test;
}

export { createSharedContextTest };
