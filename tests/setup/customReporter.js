import { knownBugs } from '../knownBugs.js';
import { findRelatedBugsTest, sortKnownIssues } from '../../utilities/customReporterHelper.js';

import {
  FAILED_STR,
  NO_KNOWN_ISSUE_STR,
  RUN_STATUS_STR,
  FAILED_TESTS_WITH_KNOWN_UNFIXED_ISSUES_STR,
  FAILED_TESTS_WITHOUT_KNOWN_ISSUES_STR,
  FAILED_TESTS_WITH_KNOWN_FIXED_ISSUES_STR,
  PASSED_TESTS_WITH_KNOWN_UNFIXED_ISSUES_STR,
} from '../../utilities/customReporterHelper.js';

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
      // Current test path
      const currentTitlePath = test.titlePath();
      const currentTestPath = `[${currentTitlePath[1]}] › ${currentTitlePath[2]} › ${currentTitlePath[3]} › ${currentTitlePath[4]}`;
      // Environment for current test project
      this.currentENV = test.parent.project().metadata.currentENV;

      // Find if the current test has known bugs
      const relatedBugs = findRelatedBugsTest(test.location.file, test.title, knownBugs);

      if (relatedBugs.length > 0) {
        // Add info to the custom reporter if the test has related bugs
        // If the test failed 1st time
        if ((result.status === 'failed' || result.status === 'timedOut') && result.retry === 0) {
          // Collect the list of the failed tests with known fixed and unfixed issues
          const listKnownIssues = sortKnownIssues(
            result.status,
            currentTestPath,
            relatedBugs,
            this.currentENV,
            this.allKnownUnfixedIssuesForFailed,
            this.allKnownFixedIssuesForFailed
          );

          // List of the known unfixed issues for the test
          this.allKnownUnfixedIssuesForFailed = listKnownIssues.listKnownUnfixedIssues;
          // List of the known fixed issues for the test
          this.allKnownFixedIssuesForFailed = listKnownIssues.listKnownFixedIssues;
        } else if (result.status === 'passed') {
          // Collect the list of the passed tests with known unfixed issues
          const listKnownIssues = sortKnownIssues(
            result.status,
            currentTestPath,
            relatedBugs,
            this.currentENV,
            this.allKnownUnfixedIssuesForPassed
          );

          // List of the known unfixed issues for the test
          this.allKnownUnfixedIssuesForPassed = listKnownIssues.listKnownUnfixedIssues;
        }
      } else if ((result.status === 'failed' || result.status === 'timedOut') && result.retry === 0) {
        // If there is no known bugs for the test add the info about the absence of known bugs for the current failed test to custom report
        this.allUnknownIssuesForFailed.push(`${FAILED_STR} ${currentTestPath}`);
        this.allUnknownIssuesForFailed.push(`${NO_KNOWN_ISSUE_STR}`);
        this.allUnknownIssuesForFailed.push('------------------------');
      }
    } catch (error) {
      console.error(`Failed to get related known bugs for the custom report: ${error.message}`);
    }
  }

  onEnd(result) {
    // Get the list of all known issues
    const messages = [
      `\n${RUN_STATUS_STR}: ${result.status}\n`,
      '==================================',
      `<${this.currentENV}> ${FAILED_TESTS_WITH_KNOWN_UNFIXED_ISSUES_STR}:`,
      '==================================',
      ...this.allKnownUnfixedIssuesForFailed,
      '==================================',
      `${FAILED_TESTS_WITHOUT_KNOWN_ISSUES_STR}:`,
      '==================================',
      ...this.allUnknownIssuesForFailed,
      '==================================',
      `<${this.currentENV}> ${FAILED_TESTS_WITH_KNOWN_FIXED_ISSUES_STR}:`,
      '==================================',
      ...this.allKnownFixedIssuesForFailed,
      '==================================',
      `<${this.currentENV}> ${PASSED_TESTS_WITH_KNOWN_UNFIXED_ISSUES_STR}:`,
      '==================================',
      ...this.allKnownUnfixedIssuesForPassed,
    ];

    console.log(messages.join('\n'));
  }
}
