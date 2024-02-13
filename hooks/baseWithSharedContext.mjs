import { test as base } from '@playwright/test';

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

        // Conditionally save fullpage screenshot if the test had failed
        if (testInfo.status === 'failed') {
          const screenshotFullPage = await page.screenshot({ fullPage: true });
          await testInfo.attach(`${projectName}_${timestamp}_fullpage_screenshot_of_Page_${index}.png`, {
            body: screenshotFullPage,
            contentType: 'image/png',
          });
        }
      } catch (error) {
        console.error(`Failed to get screenshots: ${error.message}`);
      }
    });
    // Run all promises concurrently
    await Promise.all(screenshotPromises);
  });

  return test;
}

export { createSharedContextTest };
