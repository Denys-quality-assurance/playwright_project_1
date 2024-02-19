import { devices } from '@playwright/test';

module.exports = {
  workers: parseInt(process.env.CI_WORKERS, 5) || 3, // for CI: run up to CI_WORKERS tests concurrently; for local run: run up to 3 tests concurrently
  timeout: 30000, // Timeout of 30 seconds: 30000. Unlimited Timeout for debugging - timeout: 0
  retries: 2, // Defines the maximum attempts to retry a test after a failure
  projects: [
    /* Test against desktop browsers */
    {
      name: 'Desktop_Google_Chrome_PROD',
      grepInvert: /^(.*@(skip-for-chromium|only-mobile)).*$/, // skip tests with @skip-for-chromium or @only-mobile
      use: {
        ...devices['Desktop Chrome'],
        channel: 'chrome', // or 'chrome-beta'
        headless: false,
        baseURL: process.env.BASE_URL || 'https://www.google.com', // default PROD URL
        currentENV: process.env.CURRENT_ENV || 'PROD', // current environment of the project: QA, PREPROD or PROD
      },
    },
    {
      name: 'Desktop_Webkit_PROD',
      grepInvert: /^(.*@(skip-for-webkit|only-mobile)).*$/, // skip tests with @skip-for-webkit or @only-mobile
      use: {
        ...devices['Desktop Safari'],
        headless: false,
        baseURL: process.env.BASE_URL || 'https://www.google.com', //default PROD URL
        currentENV: process.env.CURRENT_ENV || 'PROD', // current environment of the project: QA, PREPROD or PROD
      },
    },
    {
      name: 'Desktop_Microsoft_Edge_PROD',
      grepInvert: /^(.*@(skip-for-edge|only-mobile)).*$/, // skip tests with @skip-for-edge or @only-mobile
      use: {
        ...devices['Desktop Edge'],
        channel: 'msedge', // or "msedge-beta" or 'msedge-dev'
        headless: false,
        baseURL: process.env.BASE_URL || 'https://www.google.com', //default PROD URL
        currentENV: process.env.CURRENT_ENV || 'PROD', // current environment of the project: QA, PREPROD or PROD
      },
    },
    {
      name: 'Desktop_Firefox_PROD',
      grepInvert: /^(.*@(skip-for-firefox|only-mobile)).*$/, // skip tests with @skip-for-firefox or @only-mobile
      use: {
        ...devices['Desktop Firefox'],
        headless: false,
        baseURL: process.env.BASE_URL || 'https://www.google.com', //default PROD URL
        currentENV: process.env.CURRENT_ENV || 'PROD', // current environment of the project: QA, PREPROD or PROD
      },
    },
    /* Test against mobile viewports. */
    {
      name: 'iPhone_14_Safari_PROD',
      grepInvert: /^(.*@(skip-for-webkit|only-desktop)).*$/, // skip tests with @skip-for-webkit or @only-desktop
      use: {
        ...devices['iPhone 14'],
        headless: false,
        baseURL: process.env.BASE_URL || 'https://www.google.com', //default PROD URL
        currentENV: process.env.CURRENT_ENV || 'PROD', // current environment of the project: QA, PREPROD or PROD
      },
    },
    {
      name: 'iPhone_14_Safari_landscape_PROD',
      grepInvert: /^(.*@(skip-for-webkit|only-desktop)).*$/, // skip tests with @skip-for-webkit or @only-desktop
      use: {
        ...devices['iPhone 14 landscape'],
        headless: false,
        baseURL: process.env.BASE_URL || 'https://www.google.com', //default PROD URL
        currentENV: process.env.CURRENT_ENV || 'PROD', // current environment of the project: QA, PREPROD or PROD
      },
    },
    {
      name: 'Galaxy_Tab_S4_Chrome_PROD',
      grepInvert: /^(.*@(skip-for-chromium|only-desktop)).*$/, // skip tests with @skip-for-chromium or @only-desktop
      use: {
        ...devices['Galaxy Tab S4'],
        channel: 'chrome', // or 'chrome-beta'
        headless: false,
        baseURL: process.env.BASE_URL || 'https://www.google.com', //default PROD URL
        currentENV: process.env.CURRENT_ENV || 'PROD', // current environment of the project: QA, PREPROD or PROD
      },
    },
    {
      name: 'Galaxy_Tab_S4_Chrome_landscape_PROD',
      grepInvert: /^(.*@(skip-for-chromium|only-desktop)).*$/, // skip tests with @skip-for-chromium or @only-desktop
      use: {
        ...devices['Galaxy Tab S4 landscape'],
        channel: 'chrome', // or 'chrome-beta'
        headless: false,
        baseURL: process.env.BASE_URL || 'https://www.google.com', //default PROD URL
        currentENV: process.env.CURRENT_ENV || 'PROD', // current environment of the project: QA, PREPROD or PROD
      },
    },
  ],
  reporter: process.env.CI
    ? [['dot'], ['html', { outputFolder: 'playwright-report' }]] // for CI: use concise 'dot' and 'html' reporters
    : [['list'], ['html', { outputFolder: 'playwright-report' }]], // fol local run: use default 'list' and 'html' reporters
};
