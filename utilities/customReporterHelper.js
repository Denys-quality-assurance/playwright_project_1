/*
 * This is a module that provides functions for classifying bugs in test cases and collecting data
 * to use it in Custom Perorter
 *
 */

import { extractFileNameFromPath } from './fileSystemHelper.js';
const bugStatus = {
  BUG_FIXED: 'FIXED',
  BUG_UNFIXED: 'unfixed',
};

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
export const NO_KNOWN_ISSUE_STR =
  '››› HAS NO KNOWN ISSUE - to determine the cause and link the bug';
export const PASSED_TESTS_WITH_KNOWN_UNFIXED_ISSUES_STR =
  'PASSED (OR FLAKY) TESTS WITH KNOWN UNFIXED ISSUES ON THE ENVIRONMENT (to clarify and update the status of the linked bug)';

// Find and return known bugs related to the current test file and title
export function findRelatedBugsForTest(fileName, testTitle, knownBugs) {
  try {
    // Current spec file name, test title
    const currentSpecFileName = extractFileNameFromPath(fileName);
    const currentTestTitle = testTitle;

    // Filter all known bugs to only include those related to the current test file and title
    const relatedBugs = knownBugs.filter(
      (bug) =>
        bug.testFile === currentSpecFileName &&
        bug.testTitle === currentTestTitle
    );
    return relatedBugs;
  } catch (error) {
    console.error(
      `Error while filtering known bugs for the current test: ${error.message}`
    );
  }
}

// Find if the current test has known bugs unfixed in the current environment
export function findRelatedUnfixedBugsForTest(
  fileName,
  testTitle,
  knownBugs,
  currentENV
) {
  try {
    // Filter all known bugs to only include those related to the current test file and title
    const relatedBugs = findRelatedBugsForTest(fileName, testTitle, knownBugs);
    // Filter out only those bugs that are NOT fixed in the current environment
    const relatedUnfixedBugs = relatedBugs.filter(
      (bug) => bug.status[currentENV] !== bugStatus.BUG_FIXED
    );
    return relatedUnfixedBugs;
  } catch (error) {
    console.error(
      `Error while filtering known unfixed bugs for the current test in the current environment: ${error.message}`
    );
  }
}

// Collect the list of the tests with known fixed and unfixed issues
export function sortKnownIssues(
  testStatus,
  currentTestPath,
  relatedBugs,
  currentENV,
  finalListKnownUnfixedIssues = [],
  finalListKnownFixedIssues = []
) {
  try {
    // Get status name
    const statusStr = testStatus === 'passed' ? PASSED_STR : FAILED_STR;
    // Add header to the List of the tests with known unfixed issues on the current environment
    let knownUnfixedIssues = [`${statusStr} ${currentTestPath}\n`];
    // Add header to the List of the tests with known fixed issues on the current environment
    let knownFixedIssues = [`${statusStr} ${currentTestPath}\n`];

    // Add the bug data to the list of known fixed and unfixed issues
    const { unfixedIssues, fixedIssues } = addBugData(
      relatedBugs,
      currentENV,
      knownUnfixedIssues,
      knownFixedIssues
    );

    // List of the known unfixed issues for the test
    let listKnownUnfixedIssues = [
      ...finalListKnownUnfixedIssues,
      ...checkIfKnownIssuesEmpty(unfixedIssues),
    ];
    // List of the known fixed issues for the test
    let listKnownFixedIssues =
      testStatus !== 'passed'
        ? [
            ...finalListKnownFixedIssues,
            ...checkIfKnownIssuesEmpty(fixedIssues),
          ]
        : [];

    return { listKnownUnfixedIssues, listKnownFixedIssues };
  } catch (error) {
    console.error(
      `Error while collecting the list of the tests with known fixed and unfixed issues: ${error.message}`
    );
  }
}

// Add the bug data to the list of known fixed and unfixed issues
export function addBugData(
  relatedBugs,
  currentENV,
  knownUnfixedIssues,
  knownFixedIssues
) {
  try {
    let unfixedIssues = knownUnfixedIssues;
    let fixedIssues = knownFixedIssues;
    for (const relatedBug of relatedBugs) {
      if (relatedBug.status[currentENV] !== bugStatus.BUG_FIXED) {
        // If the bug for current env is not fixed, record it under known unfixed issues
        const bugData = getBugData(relatedBug, bugStatus.BUG_UNFIXED);
        unfixedIssues = [...unfixedIssues, ...bugData];
      } else {
        // If the bug for current env is fixed, record it under known fixed issues
        const bugData = getBugData(relatedBug, bugStatus.BUG_FIXED);
        fixedIssues = [...fixedIssues, ...bugData];
      }
    }
    return { unfixedIssues, fixedIssues };
  } catch (error) {
    console.error(
      `Error while adding the bug data to the list of known fixed and unfixed issues: ${error.message}`
    );
  }
}

// Get bug data
// This function builds a data string about a bug, specifically for its status
export function getBugData(relatedBug, status) {
  try {
    // Format bug statuses of all environments into a string
    const bugStatuses = Object.entries(relatedBug.status)
      .map(([key, value]) => `${key}:'${value}'`)
      .join(',');

    // Structuring bug data
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
    // Check if the list is not empty and contains not only 1st element of the header [`${FAILED_STR} ${currentTestPath}`]
    // If it is empty - delete the header
    return knownIssues.length > 1 ? knownIssues : [];
  } catch (error) {
    console.error(
      `Error while updating the list of the tests with known issues: ${error.message}`
    );
  }
}
