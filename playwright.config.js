/*
 * This configuration file controls the settings for running end-to-end tests using Playwright test.
 *
 * The file configures:
 * - The number of tests that can run at the same time
 * - The maximum time a test is allowed to run before it is considered failed
 * - The maximum number of retries when a test fails
 * - The file paths for the tests
 * - The environment specific settings for the projects we're testing.
 *
 * The best practices enforced in this config include:
 * - Testing across multiple browsers (Chrome, Safari, Firefox, Edge) for comprehensive coverage
 * - Inclusion of device-specific settings for both desktop and mobile testing
 * - Use of relevant configurations to skip tests known to fail, maximizing efficiency
 * - Use of environment variables, allowing for flexibility and security
 * - Ability to test individual features
 * - Different reporter options for Continuous Integration (CI) and local environments: customReporter.js + 'dot'/'list' + 'html'
 */

import { devices } from '@playwright/test';

module.exports = {
  fullyParallel: true, // Run tests in parallel
  workers: process.env.CI ? 4 : 2, // For CI: run up to 4 tests concurrently; for local run: run up to 2 tests concurrently
  timeout: 30000, // Timeout of 30 seconds: 30000. Unlimited Timeout for debugging - timeout: 0
  retries: 2, // Defines the maximum attempts to retry a test after a failure
  testMatch: 'tests/**/*.spec.js', // Glob patterns or regular expressions that match test files
  projects: [
    /* Test against desktop browsers - Specific feature testing */
    {
      name: 'Desktop_Chromium_Features_PROD',
      grepInvert: /^(.*@(skip-for-chromium|only-mobile)).*$/, // skip tests with @skip-for-chromium or @only-mobile
      testMatch: 'tests/**/*.spec.js', // glob patterns or regular expressions that match test files
      grep: /^(.*@(filters|result_description)).*$/, // only tests with @<feature name>
      metadata: {
        currentENV: process.env.CURRENT_ENV || 'PROD', // current environment of the project: QA, PREPROD or PROD
        skipTestsWithKnownBugs:
          process.env.SKIP_TESTS_WITH_KNOWN_BUGS || 'false', // test with unfixed bugs is skipped when SKIP_TESTS_WITH_KNOWN_BUGS is 'true'
        passedTestsScreenshots: process.env.PASSED_TESTS_SCREENSHOT || 'false', // screenshots for passed tests are taken when PASSED_TESTS_SCREENSHOT is 'true'
      },
      use: {
        ...devices['Desktop Chrome'],
        headless: false,
        baseURL: process.env.BASE_URL || 'https://www.google.com', // default PROD URL
      },
    },
    /* Test against desktop browsers */
    {
      name: 'Desktop_Google_Chrome_PROD',
      grepInvert: /^(.*@(skip-for-chromium|only-mobile)).*$/, // skip tests with @skip-for-chromium or @only-mobile
      metadata: {
        currentENV: process.env.CURRENT_ENV || 'PROD', // current environment of the project: QA, PREPROD or PROD
        skipTestsWithKnownBugs:
          process.env.SKIP_TESTS_WITH_KNOWN_BUGS || 'false', // test with unfixed bugs is skipped when SKIP_TESTS_WITH_KNOWN_BUGS is 'true'
        passedTestsScreenshots: process.env.PASSED_TESTS_SCREENSHOT || 'false', // screenshots for passed tests are taken when PASSED_TESTS_SCREENSHOT is 'true'
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
      grepInvert: /^(.*@(skip-for-webkit|only-mobile|only-chromium)).*$/, // skip tests with @skip-for-webkit, @only-mobile, @only-chromium
      metadata: {
        currentENV: process.env.CURRENT_ENV || 'PROD', // current environment of the project: QA, PREPROD or PROD
        skipTestsWithKnownBugs:
          process.env.SKIP_TESTS_WITH_KNOWN_BUGS || 'false', // test with unfixed bugs is skipped when SKIP_TESTS_WITH_KNOWN_BUGS is 'true'
        passedTestsScreenshots: process.env.PASSED_TESTS_SCREENSHOT || 'false', // screenshots for passed tests are taken when PASSED_TESTS_SCREENSHOT is 'true'
      },
      use: {
        ...devices['Desktop Safari'],
        headless: false,
        baseURL: process.env.BASE_URL || 'https://www.google.com', // default PROD URL
      },
    },
    {
      name: 'Desktop_Microsoft_Edge_PROD',
      grepInvert: /^(.*@(skip-for-edge|skip-for-chromium|only-mobile)).*$/, // skip tests with @skip-for-edge, @skip-for-chromium, @only-mobile
      metadata: {
        currentENV: process.env.CURRENT_ENV || 'PROD', // current environment of the project: QA, PREPROD or PROD
        skipTestsWithKnownBugs:
          process.env.SKIP_TESTS_WITH_KNOWN_BUGS || 'false', // test with unfixed bugs is skipped when SKIP_TESTS_WITH_KNOWN_BUGS is 'true'
        passedTestsScreenshots: process.env.PASSED_TESTS_SCREENSHOT || 'false', // screenshots for passed tests are taken when PASSED_TESTS_SCREENSHOT is 'true'
      },
      use: {
        ...devices['Desktop Edge'],
        channel: 'msedge', // or "msedge-beta" or 'msedge-dev'
        headless: false,
        baseURL: process.env.BASE_URL || 'https://www.google.com', // default PROD URL
      },
    },
    {
      name: 'Desktop_Firefox_PROD',
      grepInvert: /^(.*@(skip-for-firefox|only-mobile|only-chromium)).*$/, // skip tests with @skip-for-firefox, @only-mobile, @only-chromium
      metadata: {
        currentENV: process.env.CURRENT_ENV || 'PROD', // current environment of the project: QA, PREPROD or PROD
        skipTestsWithKnownBugs:
          process.env.SKIP_TESTS_WITH_KNOWN_BUGS || 'false', // test with unfixed bugs is skipped when SKIP_TESTS_WITH_KNOWN_BUGS is 'true'
        passedTestsScreenshots: process.env.PASSED_TESTS_SCREENSHOT || 'false', // screenshots for passed tests are taken when PASSED_TESTS_SCREENSHOT is 'true'
      },
      use: {
        ...devices['Desktop Firefox'],
        headless: false,
        baseURL: process.env.BASE_URL || 'https://www.google.com', // default PROD URL
      },
    },
    /* Test against mobile viewports. */
    {
      name: 'iPhone_14_Safari_PROD',
      grepInvert: /^(.*@(skip-for-webkit|only-desktop|only-chromium)).*$/, // skip tests with @skip-for-webkit,@only-desktop, @only-chromium
      metadata: {
        currentENV: process.env.CURRENT_ENV || 'PROD', // current environment of the project: QA, PREPROD or PROD
        skipTestsWithKnownBugs:
          process.env.SKIP_TESTS_WITH_KNOWN_BUGS || 'false', // test with unfixed bugs is skipped when SKIP_TESTS_WITH_KNOWN_BUGS is 'true'
        passedTestsScreenshots: process.env.PASSED_TESTS_SCREENSHOT || 'false', // screenshots for passed tests are taken when PASSED_TESTS_SCREENSHOT is 'true'
      },
      use: {
        ...devices['iPhone 14'],
        headless: false,
        baseURL: process.env.BASE_URL || 'https://www.google.com', // default PROD URL
      },
    },
    {
      name: 'iPhone_14_Safari_landscape_PROD',
      grepInvert: /^(.*@(skip-for-webkit|only-desktop|only-chromium)).*$/, // skip tests with @skip-for-webkit,@only-desktop, @only-chromium
      metadata: {
        currentENV: process.env.CURRENT_ENV || 'PROD', // current environment of the project: QA, PREPROD or PROD
        skipTestsWithKnownBugs:
          process.env.SKIP_TESTS_WITH_KNOWN_BUGS || 'false', // test with unfixed bugs is skipped when SKIP_TESTS_WITH_KNOWN_BUGS is 'true'
        passedTestsScreenshots: process.env.PASSED_TESTS_SCREENSHOT || 'false', // screenshots for passed tests are taken when PASSED_TESTS_SCREENSHOT is 'true'
      },
      use: {
        ...devices['iPhone 14 landscape'],
        headless: false,
        baseURL: process.env.BASE_URL || 'https://www.google.com', // default PROD URL
      },
    },
    {
      name: 'Galaxy_Tab_S4_Chrome_PROD',
      grepInvert: /^(.*@(skip-for-chromium|only-desktop)).*$/, // skip tests with @skip-for-chromium or @only-desktop
      metadata: {
        currentENV: process.env.CURRENT_ENV || 'PROD', // current environment of the project: QA, PREPROD or PROD
        skipTestsWithKnownBugs:
          process.env.SKIP_TESTS_WITH_KNOWN_BUGS || 'false', // test with unfixed bugs is skipped when SKIP_TESTS_WITH_KNOWN_BUGS is 'true'
        passedTestsScreenshots: process.env.PASSED_TESTS_SCREENSHOT || 'false', // screenshots for passed tests are taken when PASSED_TESTS_SCREENSHOT is 'true'
      },
      use: {
        ...devices['Galaxy Tab S4'],
        channel: 'chrome', // or 'chrome-beta'
        headless: false,
        baseURL: process.env.BASE_URL || 'https://www.google.com', // default PROD URL
      },
    },
    {
      name: 'Galaxy_Tab_S4_Chrome_landscape_PROD',
      grepInvert: /^(.*@(skip-for-chromium|only-desktop)).*$/, // skip tests with @skip-for-chromium or @only-desktop
      metadata: {
        currentENV: process.env.CURRENT_ENV || 'PROD', // current environment of the project: QA, PREPROD or PROD
        skipTestsWithKnownBugs:
          process.env.SKIP_TESTS_WITH_KNOWN_BUGS || 'false', // test with unfixed bugs is skipped when SKIP_TESTS_WITH_KNOWN_BUGS is 'true'
        passedTestsScreenshots: process.env.PASSED_TESTS_SCREENSHOT || 'false', // screenshots for passed tests are taken when PASSED_TESTS_SCREENSHOT is 'true'
      },
      use: {
        ...devices['Galaxy Tab S4 landscape'],
        channel: 'chrome', // or 'chrome-beta'
        headless: false,
        baseURL: process.env.BASE_URL || 'https://www.google.com', // default PROD URL
      },
    },
  ],
  reporter: process.env.CI
    ? [
        // for CI: use concise 'dot', customReporter and 'html' reporters:
        ['dot'], // 'dot' reporter displays a very concise output. Well-suited for less verbose reporting of test runs in continuous integration (CI) environments.
        ['./tests/setup/customReporter.js'], // A Custom reporter defined in the project.
        ['html', { outputFolder: 'playwright-report' }], // 'html' reporter generates a static website with test results. The outputFolder option specifies the directory where the report should be saved.
      ]
    : [
        // for local run: use default 'list', customReporter and 'html' reporters
        ['list'], // 'list' reporter prints test progress and results in a detailed list format. Useful for local development.
        ['./tests/setup/customReporter.js'],
        ['html', { outputFolder: 'playwright-report' }],
      ],
};
