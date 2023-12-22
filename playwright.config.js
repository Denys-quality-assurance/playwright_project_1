module.exports = {
  workers: 5, // up to 5 tests concurrently
  timeout: 60000, // Timeout of 60 seconds
  retries: 2, // Defines the maximum attempts to retry a test after a failure
  projects: [
    {
      name: 'chromium',

      use: {
        browserName: 'chromium',
        headless: false,
        viewport: { width: 1920, height: 1080 },
      },
    },
    {
      name: 'firefox',
      grep: /^(?!.*@skip-for-firefox).*$/,
      use: {
        browserName: 'firefox',
        headless: false,
        viewport: { width: 1920, height: 1080 },
      },
    },
    {
      name: 'webkit',

      use: {
        browserName: 'webkit',
        headless: false,
        viewport: { width: 1920, height: 1080 },
      },
    },
  ],
};
