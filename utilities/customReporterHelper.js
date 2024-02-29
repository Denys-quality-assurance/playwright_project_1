import { getFileName } from './fileSystemHelper.js';

// String constants for reporting
export const FAILED_STR = '[FAILED]';
export const PASSED_STR = '[PASSED]';
export const HAS_KNOWN_ISSUE_STR = '››› HAS KNOWN ISSUE';
export const RUN_STATUS_STR = 'RUN STATUS';
export const FAILED_TESTS_WITH_KNOWN_UNFIXED_ISSUES_STR =
  'FAILED AND FLAKY TESTS WITH KNOWN UNFIXED ISSUES ON THE ENVIRONMENT (expected test status - FAILED)';
export const FAILED_TESTS_WITHOUT_KNOWN_ISSUES_STR =
  'FAILED AND FLAKY TESTS WITHOUT KNOWN ISSUES (to determine the cause and link the bug)';
export const FAILED_TESTS_WITH_KNOWN_FIXED_ISSUES_STR =
  'FAILED AND FLAKY TESTS WITH KNOWN FIXED ISSUES ON THE ENVIRONMENT (to determine the cause and link or reopen the bug)';
export const NO_KNOWN_ISSUE_STR = '››› HAS NO KNOWN ISSUE - to determine the cause and link the bug';
export const PASSED_TESTS_WITH_KNOWN_UNFIXED_ISSUES_STR =
  'PASSED TESTS WITH KNOWN UNFIXED ISSUES ON THE ENVIRONMENT (to clarify and update the status of the linked bug)';

// Find if the current test has known bugs
export function findRelatedBugsTest(fileName, testTitle, knownBugs) {
  try {
    // Current spec file name, test title
    const currentSpecFileName = getFileName(fileName);
    const currentTestTitle = testTitle;

    const relatedBugs = knownBugs.filter(
      (bug) => bug.testFile === currentSpecFileName && bug.testTitle === currentTestTitle
    );
    return relatedBugs;
  } catch (error) {
    console.error(`Error while filtering known bugs for the current test: ${error.message}`);
  }
}

// Collect the list of the tests with known fixed and unfixed issues
export function sortKnownIssues(
  testStatus,
  currentTestPath,
  relatedBugs,
  currentENV,
  finalListKnownUnfixedIssues,
  finalListKnownFixedIssues
) {
  try {
    // Add header to the List of the tests with known unfixed issues on the current environment
    let knownUnfixedIssues =
      testStatus === 'passed' ? [`${PASSED_STR} ${currentTestPath}\n`] : [`${FAILED_STR} ${currentTestPath}\n`];
    // Add header to the List of the tests with known fixed issues on the current environment
    let knownFixedIssues =
      testStatus === 'passed' ? [`${PASSED_STR} ${currentTestPath}\n`] : [`${FAILED_STR} ${currentTestPath}\n`];

    // Add the bug data to the list of known fixed and unfixed issues
    const knownIssues = addBugData(relatedBugs, currentENV, knownUnfixedIssues, knownFixedIssues);
    knownUnfixedIssues = knownIssues.unfixedIssues;
    knownFixedIssues = knownIssues.fixedIssues;

    // List of the known unfixed issues for the test
    let listKnownUnfixedIssues = [...finalListKnownUnfixedIssues, ...checkIfKnownIssuesEmpty(knownUnfixedIssues)];
    // List of the known fixed issues for the test
    let listKnownFixedIssues =
      testStatus !== 'passed' ? [...finalListKnownFixedIssues, ...checkIfKnownIssuesEmpty(knownFixedIssues)] : [];
    return { listKnownUnfixedIssues, listKnownFixedIssues };
  } catch (error) {
    console.error(`Error while collecting the list of the tests with known fixed and unfixed issues: ${error.message}`);
  }
}

// Add the bug data to the list of known fixed and unfixed issues
export function addBugData(relatedBugs, currentENV, knownUnfixedIssues, knownFixedIssues) {
  try {
    let unfixedIssues = knownUnfixedIssues;
    let fixedIssues = knownFixedIssues;
    for (const relatedBug of relatedBugs) {
      if (relatedBug.status[currentENV] !== 'FIXED') {
        // If the bug for current env is not fixed, record it under known unfixed issues
        const bugData = getBugData(relatedBug, 'unfixed');
        unfixedIssues = [...unfixedIssues, ...bugData];
      } else {
        // If the bug for current env is fixed, record it under known fixed issues
        const bugData = getBugData(relatedBug, 'FIXED');
        fixedIssues = [...fixedIssues, ...bugData];
      }
    }
    return { unfixedIssues, fixedIssues };
  } catch (error) {
    console.error(`Error while adding the bug data to the list of known fixed and unfixed issues: ${error.message}`);
  }
}

// Get bug data
export function getBugData(relatedBug, status) {
  try {
    // Bug statuses of all environments
    const bugStatuses = Object.entries(relatedBug.status)
      .map(([key, value]) => `${key}:'${value}'`)
      .join(',');
    // Add the info to the list of known bugs for the current test to custom report
    const bugData = [
      `${HAS_KNOWN_ISSUE_STR} [${status}][${relatedBug.id}][${bugStatuses}] ${relatedBug.summary}`,
      '------------------------',
    ];
    return bugData;
  } catch (error) {
    console.error(`Error while building bug data: ${error.message}`);
  }
}

// Check if the list of the tests with known issues is empty
export function checkIfKnownIssuesEmpty(knownIssues) {
  try {
    // List is empty
    let allKnownIssues = [];
    // List is not empty and contains not onlu [`${FAILED_STR} ${currentTestPath}`]
    if (knownIssues.length > 1) {
      allKnownIssues = knownIssues;
    }
    return allKnownIssues;
  } catch (error) {
    console.error(`Error while updating the list of the tests with known issues: ${error.message}`);
  }
}
