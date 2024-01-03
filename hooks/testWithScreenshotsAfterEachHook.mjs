import { test } from '@playwright/test';

test.afterEach(async ({ context }, testInfo) => {
  const pages = context.pages(); // get all open pages
  for (let i = 0; i < pages.length; i++) {
    const screenshotViewport = await pages[i].screenshot();
    const screenshotFullPage = await pages[i].screenshot({ fullPage: true });
    // Add viewport and fullPage screenshots as attachments to HTML report
    await testInfo.attach(`viewport_screenshot_of_Page_${i}`, { body: screenshotViewport, contentType: 'image/png' });
    await testInfo.attach(`fullpage_screenshot_of_Page_${i}`, { body: screenshotFullPage, contentType: 'image/png' });
  }
});

export default test;
