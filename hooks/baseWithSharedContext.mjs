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
      // Add viewport screenshots as attachments to HTML report
      const screenshotViewport = await page.screenshot();
      // const screenshotFullPage = await pages[i].screenshot({ fullPage: true }); // Add fullPage screenshots for debugging
      const timestamp = Date.now();
      const projectName = testInfo.project.name;
      await testInfo.attach(`${projectName}_viewport_screenshot_of_Page_${index}_${timestamp}`, {
        body: screenshotViewport,
        contentType: 'image/png',
      });
      // await testInfo.attach(`${projectName}_fullpage_screenshot_of_Page_${index}_${timestamp}, { body: screenshotFullPage, contentType: 'image/png' }); // Add fullPage screenshots for debugging
    });
    // Run all promises concurrently
    await Promise.all(screenshotPromises);
  });

  return test;
}

export { createSharedContextTest };
