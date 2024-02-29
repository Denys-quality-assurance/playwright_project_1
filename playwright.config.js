import { devices } from '@playwright/test';

module.exports = {
  fullyParallel: true, // Run tests in parallel
  workers: process.env.CI ? 4 : 2, // For CI: run up to 4 tests concurrently; for local run: run up to 2 tests concurrently
  timeout: 30000, // Timeout of 30 seconds: 30000. Unlimited Timeout for debugging - timeout: 0
  retries: 2, // Defines the maximum attempts to retry a test after a failure
  projects: [
    /* Test against desktop browsers */
    {
      name: 'Desktop_Google_Chrome_PROD',
      grepInvert: /^(.*@(skip-for-chromium|only-mobile)).*$/, // skip tests with @skip-for-chromium or @only-mobile
      metadata: {
        currentENV: process.env.CURRENT_ENV || 'PROD', // current environment of the project: QA, PREPROD or PROD
        skipKnownBugs: process.env.SKIP_KNOWN_BUGS || 'false', // test with unfixed bugs is skipped when SKIP_KNOWN_BUGS is 'true'
      },
      use: {
        ...devices['Desktop Chrome'],
        channel: 'chrome', // or 'chrome-beta'
        headless: false,
        baseURL: process.env.BASE_URL || 'https://www.google.com', // default PROD URL
      },
    },
    {
      name: 'Desktop_Webkit_PROD',
      grepInvert: /^(.*@(skip-for-webkit|only-mobile)).*$/, // skip tests with @skip-for-webkit or @only-mobile
      metadata: {
        currentENV: process.env.CURRENT_ENV || 'PROD', // current environment of the project: QA, PREPROD or PROD
        skipKnownBugs: process.env.SKIP_KNOWN_BUGS || 'false', // test with unfixed bugs is skipped when SKIP_KNOWN_BUGS is 'true'
      },
      use: {
        ...devices['Desktop Safari'],
        headless: false,
        baseURL: process.env.BASE_URL || 'https://www.google.com', //default PROD URL
      },
    },
    {
      name: 'Desktop_Microsoft_Edge_PROD',
      grepInvert: /^(.*@(skip-for-edge|only-mobile)).*$/, // skip tests with @skip-for-edge or @only-mobile
      metadata: {
        currentENV: process.env.CURRENT_ENV || 'PROD', // current environment of the project: QA, PREPROD or PROD
        skipKnownBugs: process.env.SKIP_KNOWN_BUGS || 'false', // test with unfixed bugs is skipped when SKIP_KNOWN_BUGS is 'true'
      },
      use: {
        ...devices['Desktop Edge'],
        channel: 'msedge', // or "msedge-beta" or 'msedge-dev'
        headless: false,
        baseURL: process.env.BASE_URL || 'https://www.google.com', //default PROD URL
      },
    },
    {
      name: 'Desktop_Firefox_PROD',
      grepInvert: /^(.*@(skip-for-firefox|only-mobile)).*$/, // skip tests with @skip-for-firefox or @only-mobile
      metadata: {
        currentENV: process.env.CURRENT_ENV || 'PROD', // current environment of the project: QA, PREPROD or PROD
        skipKnownBugs: process.env.SKIP_KNOWN_BUGS || 'false', // test with unfixed bugs is skipped when SKIP_KNOWN_BUGS is 'true'
      },
      use: {
        ...devices['Desktop Firefox'],
        headless: false,
        baseURL: process.env.BASE_URL || 'https://www.google.com', //default PROD URL
      },
    },
    /* Test against mobile viewports. */
    {
      name: 'iPhone_14_Safari_PROD',
      grepInvert: /^(.*@(skip-for-webkit|only-desktop)).*$/, // skip tests with @skip-for-webkit or @only-desktop
      metadata: {
        currentENV: process.env.CURRENT_ENV || 'PROD', // current environment of the project: QA, PREPROD or PROD
        skipKnownBugs: process.env.SKIP_KNOWN_BUGS || 'false', // test with unfixed bugs is skipped when SKIP_KNOWN_BUGS is 'true'
      },
      use: {
        ...devices['iPhone 14'],
        headless: false,
        baseURL: process.env.BASE_URL || 'https://www.google.com', //default PROD URL
      },
    },
    {
      name: 'iPhone_14_Safari_landscape_PROD',
      grepInvert: /^(.*@(skip-for-webkit|only-desktop)).*$/, // skip tests with @skip-for-webkit or @only-desktop
      metadata: {
        currentENV: process.env.CURRENT_ENV || 'PROD', // current environment of the project: QA, PREPROD or PROD
        skipKnownBugs: process.env.SKIP_KNOWN_BUGS || 'false', // test with unfixed bugs is skipped when SKIP_KNOWN_BUGS is 'true'
      },
      use: {
        ...devices['iPhone 14 landscape'],
        headless: false,
        baseURL: process.env.BASE_URL || 'https://www.google.com', //default PROD URL
      },
    },
    {
      name: 'Galaxy_Tab_S4_Chrome_PROD',
      grepInvert: /^(.*@(skip-for-chromium|only-desktop)).*$/, // skip tests with @skip-for-chromium or @only-desktop
      metadata: {
        currentENV: process.env.CURRENT_ENV || 'PROD', // current environment of the project: QA, PREPROD or PROD
        skipKnownBugs: process.env.SKIP_KNOWN_BUGS || 'false', // test with unfixed bugs is skipped when SKIP_KNOWN_BUGS is 'true'
      },
      use: {
        ...devices['Galaxy Tab S4'],
        channel: 'chrome', // or 'chrome-beta'
        headless: false,
        baseURL: process.env.BASE_URL || 'https://www.google.com', //default PROD URL
      },
    },
    {
      name: 'Galaxy_Tab_S4_Chrome_landscape_PROD',
      grepInvert: /^(.*@(skip-for-chromium|only-desktop)).*$/, // skip tests with @skip-for-chromium or @only-desktop
      metadata: {
        currentENV: process.env.CURRENT_ENV || 'PROD', // current environment of the project: QA, PREPROD or PROD
        skipKnownBugs: process.env.SKIP_KNOWN_BUGS || 'false', // test with unfixed bugs is skipped when SKIP_KNOWN_BUGS is 'true'
      },
      use: {
        ...devices['Galaxy Tab S4 landscape'],
        channel: 'chrome', // or 'chrome-beta'
        headless: false,
        baseURL: process.env.BASE_URL || 'https://www.google.com', //default PROD URL
      },
    },
  ],
  reporter: process.env.CI
    ? [['dot'], ['./tests/setup/customReporter.js'], ['html', { outputFolder: 'playwright-report' }]] // for CI: use concise 'dot' and 'html' reporters
    : [['list'], ['./tests/setup/customReporter.js'], ['html', { outputFolder: 'playwright-report' }]], // fol local run: use default 'list' and 'html' reporters
};
