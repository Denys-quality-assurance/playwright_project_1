/*
 * This file contains a collection of known bugs in the system.
 * Each object represents a specific bug, having the following properties:
 *   - id: The identifier of the bug.
 *   - summary: A brief description of the bug.
 *   - testFile: The file where the bug was found.
 *   - testTitle: The tutle of the test during which the bug was found.
 *   - status: An object that maps the bug's status to different environments: QA, PrePROD, and PROD.
 *
 * When adding new bugs to the knownBugs array, a new object is added with the above properties.
 *
 * Initially, the status of a bug for all environments is 'unfixed'.
 * After error correction and rechecking,the status is changed to 'FIXED'.
 *
 * On the basis of the information provided in the knownBugs array, additional data is passed
 * to the custom report. Tests associated with known bugs are automatically marked as
 * "should fail" and can be skipped during the test run to save time and resources, focusing on new issues.
 *
 * NOTE: If the testFile ot testTitle of the test have changed, make sure that they have been updated in this document as well.
 *
 */

export const knownBugs = [
  {
    id: 'BUG-1',
    summary: `Not all highly relevant search results contain the corrected query when the query is misspelled in Cyrillic`,
    testFile: 'googleSearch_AutoSuggestionAndCorrection.spec.js',
    testTitle: `TEST-20: Google search results page contains the corrected 'новости' query when the query 'новоти' is misspelled @results @correction`,
    status: {
      QA: 'unfixed', // change to 'FIXED' after error correction and rechecking
      PrePROD: 'unfixed', // change to 'FIXED' after error correction and rechecking
      PROD: 'unfixed', // change to 'FIXED' after error correction and rechecking
    },
  },
  {
    id: 'BUG-2',
    summary: `The message "Showing results for <correcter query>" contains only 1 corrected word from the query with several misspelled words in Cyrillic`,
    testFile: 'googleSearch_AutoSuggestionAndCorrection.spec.js',
    testTitle: `TEST-20: Google search results page contains the corrected 'свежие новости' query when the query 'свужие новоти' is misspelled @results @correction`,
    status: {
      QA: 'unfixed', // change to 'FIXED' after error correction and rechecking
      PrePROD: 'unfixed', // change to 'FIXED' after error correction and rechecking
      PROD: 'unfixed', // change to 'FIXED' after error correction and rechecking
    },
  },
  {
    id: 'BUG-3',
    summary: `At least one web page description in highly relevant search results does not contain the highlighted query`,
    testFile: 'googleSearch_SearchResults.spec.js',
    testTitle: `TEST-5: Web page description contains 'Google' query highlighted in Google search results @only-desktop @results @result_description`,
    status: {
      QA: 'unfixed', // change to 'FIXED' after error correction and rechecking
      PrePROD: 'unfixed', // change to 'FIXED' after error correction and rechecking
      PROD: 'unfixed', // change to 'FIXED' after error correction and rechecking
    },
  },
  {
    id: 'BUG-3',
    summary: `At least one web page description in highly relevant search results does not contain the highlighted query`,
    testFile: 'googleSearch_SearchResults.spec.js',
    testTitle: `TEST-5: Web page description contains 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer viverra malesuada augue, eget sollicitudin est hendrerit id. Nullam dui sapien, dignissim sit amet sapien eu, vehicula convallis elit. Cras in feugiat libero, et iaculis enim. Nam et sodales lorem. Proin in tortor placerat, elementum mi a, rhoncus eros. Morbi sed aliquam diam. Suspendisse consectetur lectus vitae ipsum condimentum tincidunt. Suspendisse fermentum tincidunt tellus. Sed tincidunt sapien sit amet nisi fermentum condimentum. Praesent fringilla volutpat luctus.' query highlighted in Google search results @only-desktop @results @result_description`,
    status: {
      QA: 'unfixed', // change to 'FIXED' after error correction and rechecking
      PrePROD: 'unfixed', // change to 'FIXED' after error correction and rechecking
      PROD: 'unfixed', // change to 'FIXED' after error correction and rechecking
    },
  },
  {
    id: 'BUG-3',
    summary: `At least one web page description in highly relevant search results does not contain the highlighted query`,
    testFile: 'googleSearch_SearchResults.spec.js',
    testTitle: `TEST-5: Web page description contains '今天' query highlighted in Google search results @only-desktop @results @result_description`,
    status: {
      QA: 'unfixed', // change to 'FIXED' after error correction and rechecking
      PrePROD: 'unfixed', // change to 'FIXED' after error correction and rechecking
      PROD: 'unfixed', // change to 'FIXED' after error correction and rechecking
    },
  },
  {
    id: 'BUG-4',
    summary: `Search results are not the same for the same query submitted by pressing enter and selecting the auto-suggest option`,
    testFile: 'googleSearch_AutoSuggestionAndCorrection.spec.js',
    testTitle: `TEST-22: User can get the same search results for the same 'google maps' query by pressing enter or clicking on auto-suggestion option @only-desktop @results @autosuggestion @query_submitting`,
    status: {
      QA: 'unfixed', // change to 'FIXED' after error correction and rechecking
      PrePROD: 'unfixed', // change to 'FIXED' after error correction and rechecking
      PROD: 'unfixed', // change to 'FIXED' after error correction and rechecking
    },
  },
  {
    id: 'BUG-4',
    summary: `Search results are not the same for the same query submitted by pressing enter and selecting the auto-suggest option`,
    testFile: 'googleSearch_AutoSuggestionAndCorrection.spec.js',
    testTitle: `TEST-22: User can get the same search results for the same 'бег трусцой это' query by pressing enter or clicking on auto-suggestion option @only-desktop @results @autosuggestion @query_submitting`,
    status: {
      QA: 'unfixed', // change to 'FIXED' after error correction and rechecking
      PrePROD: 'unfixed', // change to 'FIXED' after error correction and rechecking
      PROD: 'unfixed', // change to 'FIXED' after error correction and rechecking
    },
  },
  {
    id: 'BUG-5',
    summary: `Search results are not the same for the same query with upper and lower cases`,
    testFile: 'googleSearch_SearchResults.spec.js',
    testTitle: `TEST-10: Search results are case insensitive to query case for the '@ AT' query @results @case_insensitive`,
    status: {
      QA: 'unfixed', // change to 'FIXED' after error correction and rechecking
      PrePROD: 'unfixed', // change to 'FIXED' after error correction and rechecking
      PROD: 'unfixed', // change to 'FIXED' after error correction and rechecking
    },
  },
  {
    id: 'BUG-5',
    summary: `Search results are not the same for the same query with upper and lower cases`,
    testFile: 'googleSearch_SearchResults.spec.js',
    testTitle: `TEST-10: Search results are case insensitive to query case for the 'PlayWright TeSt' query @results @case_insensitive`,
    status: {
      QA: 'unfixed', // change to 'FIXED' after error correction and rechecking
      PrePROD: 'unfixed', // change to 'FIXED' after error correction and rechecking
      PROD: 'unfixed', // change to 'FIXED' after error correction and rechecking
    },
  },
  {
    id: 'BUG-5',
    summary: `Search results are not the same for the same query with upper and lower cases`,
    testFile: 'googleSearch_SearchResults.spec.js',
    testTitle: `TEST-10: Search results are case insensitive to query case for the 'CAT' query @results @case_insensitive`,
    status: {
      QA: 'unfixed', // change to 'FIXED' after error correction and rechecking
      PrePROD: 'unfixed', // change to 'FIXED' after error correction and rechecking
      PROD: 'unfixed', // change to 'FIXED' after error correction and rechecking
    },
  },
  {
    id: 'BUG-5',
    summary: `Search results are not the same for the same query with upper and lower cases`,
    testFile: 'googleSearch_SearchResults.spec.js',
    testTitle: `TEST-10: Search results are case insensitive to query case for the 'GoOGlE' query @results @case_insensitive`,
    status: {
      QA: 'unfixed', // change to 'FIXED' after error correction and rechecking
      PrePROD: 'unfixed', // change to 'FIXED' after error correction and rechecking
      PROD: 'unfixed', // change to 'FIXED' after error correction and rechecking
    },
  },
  {
    id: 'BUG-5',
    summary: `Search results are not the same for the same query with upper and lower cases`,
    testFile: 'googleSearch_SearchResults.spec.js',
    testTitle: `TEST-10: Search results are case insensitive to query case for the 'ПлэйрайТ' query @results @case_insensitive`,
    status: {
      QA: 'unfixed', // change to 'FIXED' after error correction and rechecking
      PrePROD: 'unfixed', // change to 'FIXED' after error correction and rechecking
      PROD: 'unfixed', // change to 'FIXED' after error correction and rechecking
    },
  },
  {
    id: 'BUG-6',
    summary: `Message with the total number of results and the time taken to fetch the result is shown only on the second try for Chinese or long queries`,
    testFile: 'googleSearch_SearchResults.spec.js',
    testTitle: `TEST-4: Google search results page contains a message with the total number of results and the time taken to fetch the result for '今天' query @only-desktop @results`,
    status: {
      QA: 'unfixed', // change to 'FIXED' after error correction and rechecking
      PrePROD: 'unfixed', // change to 'FIXED' after error correction and rechecking
      PROD: 'unfixed', // change to 'FIXED' after error correction and rechecking
    },
  },
  {
    id: 'BUG-6',
    summary: `Message with the total number of results and the time taken to fetch the result is shown only on the second try for Chinese or long queries`,
    testFile: 'googleSearch_SearchResults.spec.js',
    testTitle: `TEST-4: Google search results page contains a message with the total number of results and the time taken to fetch the result for 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer viverra malesuada augue, eget sollicitudin est hendrerit id. Nullam dui sapien, dignissim sit amet sapien eu, vehicula convallis elit. Cras in feugiat libero, et iaculis enim. Nam et sodales lorem. Proin in tortor placerat, elementum mi a, rhoncus eros. Morbi sed aliquam diam. Suspendisse consectetur lectus vitae ipsum condimentum tincidunt. Suspendisse fermentum tincidunt tellus. Sed tincidunt sapien sit amet nisi fermentum condimentum. Praesent fringilla volutpat luctus.' query @only-desktop @results`,
    status: {
      QA: 'unfixed', // change to 'FIXED' after error correction and rechecking
      PrePROD: 'unfixed', // change to 'FIXED' after error correction and rechecking
      PROD: 'unfixed', // change to 'FIXED' after error correction and rechecking
    },
  },
  {
    id: 'BUG-7',
    summary: `Search results from two pages with the same query are not equal`,
    testFile: 'googleSearch_SearchResults.spec.js',
    testTitle: `TEST-9: User can get the same search results for the same 'cat' query by pressing enter or clicking on search button @only-desktop @query_submitting`,
    status: {
      QA: 'unfixed', // change to 'FIXED' after error correction and rechecking
      PrePROD: 'unfixed', // change to 'FIXED' after error correction and rechecking
      PROD: 'unfixed', // change to 'FIXED' after error correction and rechecking
    },
  },
  {
    id: 'BUG-8',
    summary: `At least one search result does not contain the query`,
    testFile: 'googleSearch_SearchResults.spec.js',
    testTitle: `TEST-3: Google search results page contains 'Плэйрайт' query @results`,
    status: {
      QA: 'unfixed', // change to 'FIXED' after error correction and rechecking
      PrePROD: 'unfixed', // change to 'FIXED' after error correction and rechecking
      PROD: 'unfixed', // change to 'FIXED' after error correction and rechecking
    },
  },
  {
    id: 'BUG-9',
    summary: `At least one search result does not contain the query`,
    testFile: 'googleSearch_SearchResults.spec.js',
    testTitle: `TEST-3: Google search results page contains '@ at' query @results`,
    status: {
      QA: 'unfixed', // change to 'FIXED' after error correction and rechecking
      PrePROD: 'unfixed', // change to 'FIXED' after error correction and rechecking
      PROD: 'unfixed', // change to 'FIXED' after error correction and rechecking
    },
  },
  {
    id: 'BUG-998',
    summary: `Bug for PASSED TESTS WITH KNOWN UNFIXED ISSUES ON THE ENVIRONMENT testing`,
    testFile: 'googleCalculator.spec.js',
    testTitle: `TEST-28: Google calculator is visiable on the Home page`,
    status: {
      QA: 'unfixed', // change to 'FIXED' after error correction and rechecking
      PrePROD: 'unfixed', // change to 'FIXED' after error correction and rechecking
      PROD: 'unfixed', // change to 'FIXED' after error correction and rechecking
    },
  },
  {
    id: 'BUG-999',
    summary: `Bug 2 for PASSED TESTS WITH KNOWN UNFIXED ISSUES ON THE ENVIRONMENT testing`,
    testFile: 'googleCalculator.spec.js',
    testTitle: `TEST-28: Google calculator is visiable on the Home page`,
    status: {
      QA: 'unfixed', // change to 'FIXED' after error correction and rechecking
      PrePROD: 'unfixed', // change to 'FIXED' after error correction and rechecking
      PROD: 'unfixed', // change to 'FIXED' after error correction and rechecking
    },
  },
];
