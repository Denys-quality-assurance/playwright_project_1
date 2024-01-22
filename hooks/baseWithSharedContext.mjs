import { test as base } from '@playwright/test';

function createSharedContextTest(contextOptions) {
  const test = base.extend({
    sharedContext: async ({ browser }, use) => {
      const context = await browser.newContext(contextOptions);
      await use(context);
      await context.close();
    },
  });

  test.afterEach({ timeout: 120000 }, async ({ sharedContext }, testInfo) => {
    const pages = sharedContext.pages(); // get all open pages
    for (let i = 0; i < pages.length; i++) {
      // Add viewport screenshots as attachments to HTML report
      const screenshotViewport = await pages[i].screenshot();
      // const screenshotFullPage = await pages[i].screenshot({ fullPage: true }); // Add fullPage screenshots for debugging
      let timestamp = Date.now();
      await testInfo.attach(`viewport_screenshot_of_Page_${i}_${timestamp}`, {
        body: screenshotViewport,
        contentType: 'image/png',
      });
      // await testInfo.attach(`fullpage_screenshot_of_Page_${i}`, { body: screenshotFullPage, contentType: 'image/png' }); // Add fullPage screenshots for debugging
    }
  });

  return test;
}

export { createSharedContextTest };
