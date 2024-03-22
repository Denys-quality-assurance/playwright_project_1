/*
 * This module exports a custom class named 'CustomReporter' that's used for constructing a detailed and specific test report.
 * The main function of the class is to collect and report tests issues on different stages of the tests:
 * end of each test (`onTestEnd()`) and end of all tests (`onEnd()`).
 *
 * Known bug issues related to tests are collected and categorised based on the test outcome:
 *    - failed tests with known unfixed or fixed bug issues
 *    - failed tests without known bug issues
 *    - passed tests with known unfixed bug issues
 *
 * These lists of bug issues are stored as class instance variables and are updated after each test ends.
 *
 * The `onTestEnd()` (end of each test) function collects and handles related issues
 * by sorting known bug issues based on their status (unfixed or fixed).
 *
 * The `onEnd()` (end of all tests) function reports all compiled bug issues based on their categories.
 *
 */

import { knownBugs } from '../knownBugs.js';
import {
  findRelatedBugsForTest,
  sortKnownIssues,
} from '../../utilities/customReporterHelper.js';

import {
  FAILED_STR,
  NO_KNOWN_ISSUE_STR,
  RUN_STATUS_STR,
  FAILED_TESTS_WITH_KNOWN_UNFIXED_ISSUES_STR,
  FAILED_TESTS_WITHOUT_KNOWN_ISSUES_STR,
  FAILED_TESTS_WITH_KNOWN_FIXED_ISSUES_STR,
  PASSED_TESTS_WITH_KNOWN_UNFIXED_ISSUES_STR,
} from '../../utilities/customReporterHelper.js';

const testStatus = {
  FAILED: 'failed',
  TIMEOUT: 'timedOut',
  PASSED: 'passed',
  SKIPPED: 'skipped',
  INTERRUPTED: 'interrupted',
};

export default class CustomReporter {
  constructor() {
    // List of the known unfixed issues for failed tests on the current environment
    this.allKnownUnfixedIssuesForFailed = [];
    // List of the failed tests with known fixed issues on the current environment
    this.allKnownFixedIssuesForFailed = [];
    // List of the failed tests without known unfixed issues on the current environment
    this.allUnknownIssuesForFailed = [];
    // List of the passed tests with known unfixed issues on the current environment
    this.allKnownUnfixedIssuesForPassed = [];
    // Environment for current test project
    this.currentENV = '';
  }

  onTestEnd(test, result) {
    try {
      if (
        result.status !== testStatus.SKIPPED &&
        result.status !== testStatus.INTERRUPTED
      ) {
        // Current test path
        const currentTitlePath = test.titlePath();
        const currentTestPath = `[${currentTitlePath[1]}] › ${currentTitlePath.slice(2).join(' › ')}`;
        // Environment for current test project
        this.currentENV = test.parent.project().metadata.currentENV;

        // Get known bugs related to the test
        const relatedBugs = findRelatedBugsForTest(
          test.location.file,
          test.title,
          knownBugs
        );

        // If there are related bugs for the test
        if (relatedBugs.length > 0) {
          // Add info to the custom reporter if the test has related bugs
          // If the test failed or timed out in its first run
          if (isFirstFailure()) {
            // Collect the list of the failed tests with known fixed and unfixed issues
            const listKnownIssues = sortKnownIssues(
              result.status,
              currentTestPath,
              relatedBugs,
              this.currentENV,
              this.allKnownUnfixedIssuesForFailed,
              this.allKnownFixedIssuesForFailed
            );

            // Store known unfixed and fixed issues for the failed test
            // List of the known unfixed issues for the test
            this.allKnownUnfixedIssuesForFailed =
              listKnownIssues.listKnownUnfixedIssues;
            // List of the known fixed issues for the test
            this.allKnownFixedIssuesForFailed =
              listKnownIssues.listKnownFixedIssues;
            // If the test has passed without any retries
          } else if (
            result.status === testStatus.PASSED &&
            result.retry === 0
          ) {
            // Store the known unfixed issues for the passed test
            const listKnownIssues = sortKnownIssues(
              result.status,
              currentTestPath,
              relatedBugs,
              this.currentENV,
              this.allKnownUnfixedIssuesForPassed
            );

            // List of the known unfixed issues for the test
            this.allKnownUnfixedIssuesForPassed =
              listKnownIssues.listKnownUnfixedIssues;
          }
        } // If there are no known bugs for the test and it failed or timed out in its first run
        else if (isFirstFailure()) {
          // Log the info about the absence of known bugs for the current failed test
          this.allUnknownIssuesForFailed.push(
            `${FAILED_STR} ${currentTestPath}`
          );
          this.allUnknownIssuesForFailed.push(`${NO_KNOWN_ISSUE_STR}`);
          this.allUnknownIssuesForFailed.push('------------------------');
        }
      }
    } catch (error) {
      console.error(
        `Failed to get related known bugs for the custom report: ${error.message}`
      );
    }

    // Check if the test failed or timed out in its first run
    function isFirstFailure() {
      return (
        (result.status === testStatus.FAILED ||
          result.status === testStatus.TIMEOUT) &&
        result.retry === 0
      );
    }
  }

  onEnd(result) {
    // Get the list of all known issues
    const issueReportMessages = [
      `\n${RUN_STATUS_STR}: ${result.status}\n`,
      ...formatIssuesForReport(
        this.currentENV,
        FAILED_TESTS_WITH_KNOWN_UNFIXED_ISSUES_STR,
        this.allKnownUnfixedIssuesForFailed
      ),
      ...formatIssuesForReport(
        'ALL',
        FAILED_TESTS_WITHOUT_KNOWN_ISSUES_STR,
        this.allUnknownIssuesForFailed
      ),
      ...formatIssuesForReport(
        this.currentENV,
        FAILED_TESTS_WITH_KNOWN_FIXED_ISSUES_STR,
        this.allKnownFixedIssuesForFailed
      ),
      ...formatIssuesForReport(
        this.currentENV,
        PASSED_TESTS_WITH_KNOWN_UNFIXED_ISSUES_STR,
        this.allKnownUnfixedIssuesForPassed
      ),
    ];

    // Format issues into a string for reporting
    function formatIssuesForReport(environment, title, issues) {
      return [
        '==================================',
        `<${environment}> ${title}:`,
        '==================================',
        ...issues,
      ];
    }

    console.log(issueReportMessages.join('\n'));
  }
}
