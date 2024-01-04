module.exports = {
  reporter: process.env.CI
    ? [['dot'], ['html', { outputFolder: 'playwright-report' }]] // for CI: use concise 'dot' and 'html' reporters
    : [['list'], ['html', { outputFolder: 'playwright-report' }]], // fol local run: use default 'list' and 'html' reporters
  workers: process.env.CI
    ? 5 // for CI: run up to 5 tests concurrently              process.env.CI_WORKERS ||
    : 1, // for local run: run up to 2 tests concurrently
  // timeout: 0, // Unlimited Timeout for debugging
  timeout: 60000, // Timeout of 60 seconds
  retries: 2, // Defines the maximum attempts to retry a test after a failure
  projects: [
    {
      name: 'chromium',
      grep: /^(?!.*@skip-for-chromium).*$/, // skip tests with @skip-for-chromium
      use: {
        browserName: 'chromium',
        headless: false,
        viewport: { width: 1920, height: 1080 },
      },
    },
    {
      name: 'firefox',
      grep: /^(?!.*@skip-for-firefox).*$/, // skip tests with @skip-for-firefox
      use: {
        browserName: 'firefox',
        headless: false,
        viewport: { width: 1920, height: 1080 },
      },
    },
    {
      name: 'webkit',
      grep: /^(?!.*@skip-for-webkit).*$/, // skip tests with @skip-for-webkit
      use: {
        browserName: 'webkit',
        headless: false,
        viewport: { width: 1920, height: 1080 },
      },
    },
  ],
};
