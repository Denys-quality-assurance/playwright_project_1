import { devices } from '@playwright/test';

module.exports = {
  workers: parseInt(process.env.CI_WORKERS, 10) || 3, // for CI: run up to CI_WORKERS tests concurrently; for local run: run up to 3 tests concurrently
  // timeout: 0, // Unlimited Timeout for debugging
  timeout: 60000, // Timeout of 60 seconds
  retries: 0, // Defines the maximum attempts to retry a test after a failure
  projects: [
    /* Test against desktop browsers */
    {
      name: 'Desktop_Google_Chrome',
      grep: /^(?!.*@(skip-for-chromium|@only-mobile)).*$/, // skip tests with @skip-for-chromium
      use: {
        ...devices['Desktop Chrome'],
        channel: 'chrome', // or 'chrome-beta'
        headless: false,
      },
    },
    {
      name: 'Desktop_Webkit',
      grep: /^(?!.*(@skip-for-webkit|@only-mobile)).*$/, // skip tests with @skip-for-webkit
      use: {
        ...devices['Desktop Safari'],
        headless: false,
      },
    },
    {
      name: 'Desktop_Microsoft_Edge',
      grep: /^(?!.*(@skip-for-edge|@only-mobile)).*$/, // skip tests with @skip-for-edge
      use: {
        ...devices['Desktop Edge'],
        channel: 'msedge', // or "msedge-beta" or 'msedge-dev'
        headless: false,
      },
    },
    {
      name: 'Desktop_Firefox',
      grep: /^(?!.*(@skip-for-firefox|@only-mobile)).*$/, // skip tests with @skip-for-firefox
      use: {
        ...devices['Desktop Firefox'],
        headless: false,
      },
    },
    /* Test against mobile viewports. */
    {
      name: 'iPhone_14_Safari',
      grep: /^(?!.*@(skip-for-webkit|skip-for-mobile)).*$/, // skip tests with @skip-for-webkit
      use: {
        ...devices['iPhone 14'],
        headless: false,
      },
    },
    {
      name: 'iPhone_14_Safari_landscape',
      grep: /^(?!.*@(skip-for-webkit|skip-for-mobile)).*$/, // skip tests with @skip-for-webkit
      use: {
        ...devices['iPhone 14 landscape'],
        headless: false,
      },
    },
    {
      name: 'iPad_Pro_11_Safari',
      grep: /^(?!.*@(skip-for-webkit|skip-for-mobile)).*$/, // skip tests with @skip-for-webkit
      use: {
        ...devices['iPad Pro 11'],
        headless: false,
      },
    },
    {
      name: 'iPad_Pro_11_Safari_landscape',
      grep: /^(?!.*@(skip-for-webkit|skip-for-mobile)).*$/, // skip tests with @skip-for-webkit
      use: {
        ...devices['iPad Pro 11 landscape'],
        headless: false,
      },
    },
    {
      name: 'Galaxy_S9+_Chrome',
      grep: /^(?!.*@(skip-for-chromium|skip-for-mobile)).*$/, // skip tests with @skip-for-chromium
      use: {
        ...devices['Galaxy S9+'],
        channel: 'chrome', // or 'chrome-beta'
        headless: false,
      },
    },
    {
      name: 'Galaxy_S9+_Chrome_landscape',
      grep: /^(?!.*@(skip-for-chromium|skip-for-mobile)).*$/, // skip tests with @skip-for-chromium
      use: {
        ...devices['Galaxy S9+ landscape'],
        channel: 'chrome', // or 'chrome-beta'
        headless: false,
      },
    },
    {
      name: 'Galaxy_Tab_S4_Chrome',
      grep: /^(?!.*@(skip-for-chromium|skip-for-mobile)).*$/, // skip tests with @skip-for-chromium
      use: {
        ...devices['Galaxy Tab S4'],
        channel: 'chrome', // or 'chrome-beta'
        headless: false,
      },
    },
    {
      name: 'Galaxy_Tab_S4_Chrome_landscape',
      grep: /^(?!.*@(skip-for-chromium|skip-for-mobile)).*$/, // skip tests with @skip-for-chromium
      use: {
        ...devices['Galaxy Tab S4 landscape'],
        channel: 'chrome', // or 'chrome-beta'
        headless: false,
      },
    },
  ],
  reporter: process.env.CI
    ? [['dot'], ['html', { outputFolder: 'playwright-report' }]] // for CI: use concise 'dot' and 'html' reporters
    : [['list'], ['html', { outputFolder: 'playwright-report' }]], // fol local run: use default 'list' and 'html' reporters
};
