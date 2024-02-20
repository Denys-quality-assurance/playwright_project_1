import { knownBugs } from '../knownBugs.js';
import { getFileName } from '../../utilities/fileSystemHelpers.js';

export default class CustomReporter {
  constructor() {
    // List of failed and flaky tests in the current run
    this.failedAndFlakyTests = new Set();
    // List of the known issues for failed tests in the current run
    this.knownIssues = '';
    // List of the failed tests without known issues in the current run
    this.unknownIssues = '';
  }
  onTestEnd(test, result) {
    try {
      // Get the current test path
      const currentTitlePath = test.titlePath();
      const currentTestPath = `[${currentTitlePath[1]}] › ${currentTitlePath[2]} › ${currentTitlePath[3]} › ${currentTitlePath[4]}`;

      if (result.status === 'failed' && !this.failedAndFlakyTests.has(currentTestPath)) {
        // Add the current test path to the set of failed and flaky tests
        this.failedAndFlakyTests.add(currentTestPath);

        // Get the current spec file name, test title and test path
        const currentSpecFileName = getFileName(test.location.file);
        const currentTestTitle = test.title;

        // Find if the current failed test has known bugs
        const relatedBugs = knownBugs.filter(
          (bug) =>
            bug.testFile === currentSpecFileName &&
            bug.testTitle === currentTestTitle &&
            bug.status[process.env.currentENV] !== 'fixed'
        );

        if (relatedBugs.length > 0) {
          // Add the info about the failed test to custom report
          this.knownIssues += `[FAILED] ${currentTestPath}\n`;
          for (const relatedBug of relatedBugs) {
            // Add the info to the list of known bugs for the current failed test to custom report
            this.knownIssues += `››› HAS KNOWN ISSUE [${relatedBug.id}] ${relatedBug.summary}\n`;
          }
          this.knownIssues += '------------------------\n';
        } else {
          // Add the info about the failed test to custom report
          this.unknownIssues += `[FAILED] ${currentTestPath}\n`;
          // Add the info about the absence of known bugs for the current failed test to custom report
          this.unknownIssues += `>>> HAS NO KNOWN ISSUE\n`;
          // Add a separator
          this.unknownIssues += '------------------------\n';
        }
      }
    } catch (error) {
      console.error(`Failed to get related known bugs for the custom report: ${error.message}`);
    }
  }

  onEnd(result) {
    // Get the list of all known issues
    console.log(`\nRUN STATUS: ${result.status}\n\n`);
    console.log(`========================`);
    console.log(`FAILED TESTS WITH KNOWN ISSUES:\n========================\n${this.knownIssues}\n`);
    console.log(`========================`);
    console.log(`FAILED TESTS WITHOUT KNOWN ISSUES:\n========================\n${this.unknownIssues}`);
  }
}
