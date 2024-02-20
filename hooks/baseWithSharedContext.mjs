import { test as base } from '@playwright/test';
import { knownBugs } from '../tests/knownBugs.js';
import { getFileName } from '../utilities/fileSystemHelpers.js';

let failedAndFlakyTests = new Set();

function createSharedContextTest(contextOptions) {
  const test = base.extend({
    sharedContext: async ({ browser }, use) => {
      const context = await browser.newContext(contextOptions);
      await use(context);
      await context.close();
    },
  });

  test.afterEach(async ({ sharedContext }, testInfo) => {
    const pages = sharedContext.pages(); // get all open pages
    const screenshotPromises = pages.map(async (page, index) => {
      try {
        // Add viewport screenshots as attachments to HTML report
        const screenshotViewport = await page.screenshot();
        const timestamp = Date.now();
        const projectName = testInfo.project.name;
        await testInfo.attach(`${projectName}_${timestamp}_viewport_screenshot_of_Page_${index}.png`, {
          body: screenshotViewport,
          contentType: 'image/png',
        });
        // Get the current test path
        const currentTitlePath = testInfo.titlePath;
        const currentTestPath = `[${projectName}] › ${currentTitlePath[0]} › ${currentTitlePath[1]} › ${currentTitlePath[2]} › ${currentTitlePath[3]}`;

        if (testInfo.status === 'failed' && !failedAndFlakyTests.has(currentTestPath)) {
          // Add the current test path to the set of failed and flaky tests
          failedAndFlakyTests.add(currentTestPath);
          // List of the known bugs for the current test
          let knownBugsForCurrentTest = 'KNOWN ISSUES:\n';
          // Get the current spec file name, test title
          const currentSpecFileName = getFileName(testInfo.file);
          const currentTestTitle = testInfo.title;

          // Find if the current failed test has known bugs
          const relatedBugs = knownBugs.filter(
            (bug) =>
              bug.testFile === currentSpecFileName &&
              bug.testTitle === currentTestTitle &&
              bug.status[process.env.currentENV] !== 'fixed'
          );

          if (relatedBugs.length > 0) {
            // Add the info about the failed test to html report
            knownBugsForCurrentTest += `${currentTestPath}\n`;
            for (const relatedBug of relatedBugs) {
              // Add the info to the list of known bugs for the current test
              knownBugsForCurrentTest += `>>> HAS KNOWN ISSUE [${relatedBug.id}] ${relatedBug.summary}\n`;
            }
          }
          if (knownBugsForCurrentTest === 'KNOWN ISSUES:\n') {
            // Attach the bugs info to the test info
            await testInfo.attach(`${projectName}_${timestamp}_known_bugs_for_the_current_test_IS_EMPTY`, {
              body: 'IS EMPTY',
              contentType: 'text/plain',
            });
          } else {
            // Attach the bugs info to the test info
            await testInfo.attach(`${projectName}_${timestamp}_known_bugs_for_the_current_test`, {
              body: knownBugsForCurrentTest,
              contentType: 'text/plain',
            });
          }

          // Conditionally save fullpage screenshot if the test had failed
          if (testInfo.status === 'failed' || failedAndFlakyTests.has(currentTestPath)) {
            const screenshotFullPage = await page.screenshot({ fullPage: true });
            await testInfo.attach(`${projectName}_${timestamp}_fullpage_screenshot_of_Page_${index}.png`, {
              body: screenshotFullPage,
              contentType: 'image/png',
            });
          }
        }
      } catch (error) {
        console.error(`Failed to get screenshots and related known bugs: ${error.message}`);
      }
    });
    // Run all promises concurrently
    await Promise.all(screenshotPromises);
  });

  return test;
}

export { createSharedContextTest };
