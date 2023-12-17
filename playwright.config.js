module.exports = {
  timeout: 60000, // Timeout of 60 seconds
  retries: 2, // Defines the maximum attempts to retry a test after a failure
  projects: [
    {
      name: 'chromium',

      use: {
        browserName: 'chromium',
        headless: false,
      },
    },
    {
      name: 'firefox',

      use: {
        browserName: 'firefox',
        headless: false,
      },
    },
    {
      name: 'webkit',

      use: {
        browserName: 'webkit',
        headless: false,
      },
    },
  ],
};
