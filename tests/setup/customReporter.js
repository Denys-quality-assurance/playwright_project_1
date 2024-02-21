import { knownBugs } from '../knownBugs.js';
import { findRelatedBugsTest, sortKnownIssues } from '../../utilities/customReporterHelper.js';

import {
  FAILED_STR,
  NO_KNOWN_ISSUE_STR,
  RUN_STATUS_STR,
  FAILED_TESTS_WITH_KNOWN_UNFIXED_ISSUES_STR,
  FAILED_TESTS_WITHOUT_KNOWN_ISSUES_STR,
  FAILED_TESTS_WITH_KNOWN_FIXED_ISSUES_STR,
} from '../../utilities/customReporterHelper.js';

export default class CustomReporter {
  constructor() {
    // List of failed and flaky tests in the current run
    this.failedAndFlakyTests = new Set();
    // List of the known unfixed issues for failed tests on the current environment
    this.allKnownUnfixedIssues = [];
    // List of the failed tests with known fixed issues on the current environment
    this.allKnownFixedIssues = [];
    // List of the failed tests without known unfixed issues on the current environment
    this.allUnknownIssues = [];
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

      if (result.status === 'failed' && !this.failedAndFlakyTests.has(currentTestPath)) {
        // Add the current test path to the set of failed and flaky tests
        this.failedAndFlakyTests.add(currentTestPath);

        // Find if the current failed test has known bugs
        const relatedBugs = findRelatedBugsTest(test.location.file, test.title, knownBugs);

        if (relatedBugs.length > 0) {
          // Collect the list of the failed tests with known fixed and unfixed issues
          const listKnownIssues = sortKnownIssues(
            currentTestPath,
            relatedBugs,
            this.currentENV,
            this.allKnownUnfixedIssues,
            this.allKnownFixedIssues
          );

          // List of the known unfixed issues for the test
          this.allKnownUnfixedIssues = [...this.allKnownUnfixedIssues, ...listKnownIssues.listKnownUnfixedIssues];
          // List of the known fixed issues for the test
          this.allKnownFixedIssues = [...this.allKnownFixedIssues, ...listKnownIssues.listKnownFixedIssues];
        } else {
          // If there is no known bugs for the test add the info about the absence of known bugs for the current failed test to custom report
          this.allUnknownIssues.push(`${FAILED_STR} ${currentTestPath}`);
          this.allUnknownIssues.push(`${NO_KNOWN_ISSUE_STR}`);
          this.allUnknownIssues.push('------------------------');
        }
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
      `${FAILED_TESTS_WITH_KNOWN_UNFIXED_ISSUES_STR} <${this.currentENV}>:`,
      '==================================',
      ...this.allKnownUnfixedIssues,
      '==================================',
      `${FAILED_TESTS_WITHOUT_KNOWN_ISSUES_STR}:`,
      '==================================',
      ...this.allUnknownIssues,
      '==================================',
      `${FAILED_TESTS_WITH_KNOWN_FIXED_ISSUES_STR} <${this.currentENV}>:`,
      '==================================',
      ...this.allKnownFixedIssues,
    ];

    console.log(messages.join('\n'));
  }
}
