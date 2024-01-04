import { test } from '@playwright/test';

test.afterEach({ timeout: 120000 }, async ({ context }, testInfo) => {
  const pages = context.pages(); // get all open pages
  for (let i = 0; i < pages.length; i++) {
    // Add viewport screenshots as attachments to HTML report
    const screenshotViewport = await pages[i].screenshot();
    // const screenshotFullPage = await pages[i].screenshot({ fullPage: true }); // Add fullPage screenshots for debugging

    await testInfo.attach(`viewport_screenshot_of_Page_${i}`, { body: screenshotViewport, contentType: 'image/png' });
    // await testInfo.attach(`fullpage_screenshot_of_Page_${i}`, { body: screenshotFullPage, contentType: 'image/png' }); // Add fullPage screenshots for debugging
  }
});

export default test;
