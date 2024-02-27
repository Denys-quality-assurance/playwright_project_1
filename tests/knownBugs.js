export const knownBugs = [
  {
    id: 'BUG-1',
    summary: `Not all highly relevant search results contain the corrected query when the query is misspelled in Cyrillic`,
    testFile: 'googleSearch_AutoSuggestionAndCorrection.spec.js',
    testTitle: `Google search results page contains the corrected 'новости' query when the query 'новоти' is misspelled`,
    status: {
      QA: 'unfixed', // change to 'FIXED' after error correction and rechecking // change to 'FIXED' after error correction and rechecking
      PrePROD: 'unfixed', // change to 'FIXED' after error correction and rechecking
      PROD: 'unfixed', // change to 'FIXED' after error correction and rechecking
    },
  },
  {
    id: 'BUG-2',
    summary: `The message "Showing results for <correcter query>" contains only 1 corrected word from the query with several misspelled words in Cyrillic`,
    testFile: 'googleSearch_AutoSuggestionAndCorrection.spec.js',
    testTitle: `Google search results page contains the corrected 'свежие новости' query when the query 'свужие новоти' is misspelled`,
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
    testTitle: `Web page description contains 'Google' query highlighted in Google search results @only-desktop`,
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
    testTitle: `Web page description contains 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer viverra malesuada augue, eget sollicitudin est hendrerit id. Nullam dui sapien, dignissim sit amet sapien eu, vehicula convallis elit. Cras in feugiat libero, et iaculis enim. Nam et sodales lorem. Proin in tortor placerat, elementum mi a, rhoncus eros. Morbi sed aliquam diam. Suspendisse consectetur lectus vitae ipsum condimentum tincidunt. Suspendisse fermentum tincidunt tellus. Sed tincidunt sapien sit amet nisi fermentum condimentum. Praesent fringilla volutpat luctus.' query highlighted in Google search results @only-desktop`,
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
    testTitle: `Web page description contains '今天' query highlighted in Google search results @only-desktop`,
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
    testTitle: `User can get the same search results for the same 'google maps' query by pressing enter or clicking on auto-suggestion option @only-desktop`,
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
    testTitle: `User can get the same search results for the same 'бег трусцой это' query by pressing enter or clicking on auto-suggestion option @only-desktop`,
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
    testTitle: `Search results are case insensitive to query case for the '@ AT' query`,
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
    testTitle: `Search results are case insensitive to query case for the 'PlayWright TeSt' query`,
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
    testTitle: `Search results are case insensitive to query case for the 'CAT' query`,
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
    testTitle: `Search results are case insensitive to query case for the 'GoOGlE' query`,
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
    testTitle: `Google search results page contains a message with the total number of results and the time taken to fetch the result for '今天' query @only-desktop`,
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
    testTitle: `Google search results page contains a message with the total number of results and the time taken to fetch the result for 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer viverra malesuada augue, eget sollicitudin est hendrerit id. Nullam dui sapien, dignissim sit amet sapien eu, vehicula convallis elit. Cras in feugiat libero, et iaculis enim. Nam et sodales lorem. Proin in tortor placerat, elementum mi a, rhoncus eros. Morbi sed aliquam diam. Suspendisse consectetur lectus vitae ipsum condimentum tincidunt. Suspendisse fermentum tincidunt tellus. Sed tincidunt sapien sit amet nisi fermentum condimentum. Praesent fringilla volutpat luctus.' query @only-desktop`,
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
    testTitle: `User can get the same search results for the same 'cat' query by pressing enter or clicking on search button @only-desktop`,
    status: {
      QA: 'unfixed', // change to 'FIXED' after error correction and rechecking
      PrePROD: 'unfixed', // change to 'FIXED' after error correction and rechecking
      PROD: 'unfixed', // change to 'FIXED' after error correction and rechecking
    },
  },
];
