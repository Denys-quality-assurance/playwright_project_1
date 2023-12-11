module.exports = {
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
