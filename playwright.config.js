module.exports = {
  timeout: 60000, // Timeout of 60 seconds
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
