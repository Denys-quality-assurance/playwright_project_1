import { expect } from '@playwright/test';
import test from '../../../hooks/testWithAfterEachHooks.mjs';
import GoogleSearchPage from '../../pages/googleSearchPage';
import {
  queryDataGeneral,
  queryDataCaseInsensitive,
  queryDataEmptyResults,
} from '../../test-data/googleSearch/queryData';
import { performSearchAndFetchResultsForNewPage } from '../../../utilities/pagesHelper';
const query = queryDataGeneral[1].query;
const expectedPatternOfNumberAndTimeMessageText =
  /\b\w+\b\s\b\d+(\.\d{3})*\b\s\b\w+\b\s\(\b\d+\,\d+\b\s\b\w+\b\)/; // Regex for the message with the total number of results and the time taken to fetch the result based on the template: <1 word> <Integer possibly with thousands as '.'> <1 space> <1 word> <space> (<floating point number with ','> <1 space> <1 word>): \b matches word boundary, \w+ matches matches one or more word character, \s matches whitespace, \d+ matches one or more digits, \,\d+ matches a comma followed by one or more digits, \b\d+(\.\d{3})*\bs\b matches an integer number that might have dot separators between thousands

test.describe(`Google Search results: Search results verification`, () => {
  let page; // Page instance
  let googleSearchPage; // Page object instance

  // Navigate to Home page and reject all Cookies
  test.beforeEach(
    'Navigate to Home page and reject all Cookies',
    async ({ sharedContext }, testInfo) => {
      if (testInfo.expectedStatus !== 'skipped') {
        page = await sharedContext.newPage();
        const isMobile = sharedContext._options.isMobile || false; // type of device is mobile
        googleSearchPage = new GoogleSearchPage(page, isMobile);
        await googleSearchPage.navigateAndRejectCookies();
      }
    }
  );

  test(`TEST-1: User can apply video filter on the Empty results page (mocked) and get search results @only-desktop @mocked @results @filters`, async ({
    sharedContext,
  }) => {
    // Mock the search response with Empty Results
    await googleSearchPage.mockResponseWithEmptyResults(sharedContext, query);
    // Search for query
    await googleSearchPage.searchForQueryByEnter(query);
    // Apply video filter
    await googleSearchPage.applyVideFilter();
    // Check if each search result actually contains query in its text
    const searchResults = await googleSearchPage.getSearchResultElements();
    const checkQueryResults =
      await googleSearchPage.checkIfAllSearchResultsContainQuery(
        searchResults,
        query
      );
    const errorMessage = `Some search results do not contain the '${
      checkQueryResults.failedQuery
    }' query.\nText of the results:\n\n${checkQueryResults.failedResultText.join('\n----------------------\n\n')}'`;

    expect(checkQueryResults.success, errorMessage).toBe(true);
  });

  queryDataGeneral.forEach((queryData) => {
    test(`TEST-2: Response body contains '${queryData.query}' query @results`, async () => {
      // Start waiting for response
      const responsePromise = googleSearchPage.waitForSearchResponse();
      // Search for query
      await googleSearchPage.searchForQueryByEnter(queryData.query);
      const response = await responsePromise;

      // Check if status is 200
      expect(response.status()).toEqual(200);

      // Check if response body starts with <!doctype html>
      const responseBody = await response.text();
      expect(responseBody.startsWith('<!doctype html>')).toBeTruthy();

      // Check if the body contains at least 1 instance of query
      const count = await googleSearchPage.countQueryInBody(queryData.query);
      expect(
        count,
        `The html body doesn't contains the '${queryData.query}' query`
      ).toBeGreaterThanOrEqual(1);
    });
  });

  queryDataGeneral.forEach((queryData) => {
    test(`TEST-3: Google search results page contains '${queryData.query}' query @results`, async () => {
      // Search for query
      await googleSearchPage.searchForQueryByEnter(queryData.query);
      // Check if each search result actually contains query in its text
      const searchResults = await googleSearchPage.getSearchResultElements();
      const checkQueryResults =
        await googleSearchPage.checkIfAllSearchResultsContainQuery(
          searchResults,
          queryData.query
        );
      const errorMessage = `Some search results do not contain the '${
        checkQueryResults.failedQuery
      }' query.\nText of the results:\n\n${checkQueryResults.failedResultText.join('\n----------------------\n\n')}'`;
      expect(checkQueryResults.success, errorMessage).toBe(true);
    });
  });

  queryDataGeneral.forEach((queryData) => {
    test(`TEST-4: Google search results page contains a message with the total number of results and the time taken to fetch the result for '${queryData.query}' query @only-desktop @results`, async () => {
      test.setTimeout(10000);
      // Search for query
      await googleSearchPage.searchForQueryByEnter(queryData.query);
      // Get the text of the message with the total number of results and the time taken to fetch the result
      const resultsNumberAndTimeMessageText =
        await googleSearchPage.getResultsNumberAndTimeMessageText();
      // Check if the message is according according to the template:
      // < 1 word > <Integer possibly with thousands as '.' > < 1 space > < 1 word > <space> (<floating point number with ','> <1 space> <1 word>)
      expect(resultsNumberAndTimeMessageText).toMatch(
        expectedPatternOfNumberAndTimeMessageText
      );
    });
  });

  queryDataGeneral.forEach((queryData) => {
    test(`TEST-5: Web page description contains '${queryData.query}' query highlighted in Google search results @only-desktop @results @result_description`, async () => {
      // Search for query
      await googleSearchPage.searchForQueryByEnter(queryData.query);
      // Check if each search result actually contains highlighted query in its text
      const searchResultsDescriptions =
        await googleSearchPage.getSearchResultsDescriptionElements();
      const checkQueryResults =
        await googleSearchPage.checkIfAllSearchResultsContainHighlightedQuery(
          searchResultsDescriptions,
          queryData.query
        );
      const errorMessage = `Some web page descriptions do not contain the '${
        checkQueryResults.failedQuery
      }' query highlighted.\nHTML of the results:\n\n${checkQueryResults.failedDescriptionHTML.join(
        '\n----------------------\n\n'
      )}'`;
      expect(checkQueryResults.success, errorMessage).toBe(true);
    });
  });

  queryDataEmptyResults.forEach((queryData) => {
    test(`TEST-6: Query '${queryData.query}' not having related result leads to 'did not match any documents' message @only-desktop @results`, async () => {
      // Search for query
      await googleSearchPage.searchForQueryByEnter(queryData.query);
      // Change to English if it's needed
      await googleSearchPage.changeToEnglishIfAsked();
      // Check if the message “did not match any documents” is visible
      const didNotMatchText = page.locator(
        googleSearchPage.selectors.didNotMatchText
      );
      await expect(didNotMatchText).toBeVisible();
    });
  });

  test(`TEST-7: Google search results page contains more than 1 result for '${query}' query @results`, async () => {
    // Search for query
    await googleSearchPage.searchForQueryByEnter(query);
    // Checking if the search results page contains more than 1 result for the query
    const searchResults = await googleSearchPage.getSearchResultElements();
    expect(
      searchResults.length,
      `Search results page doesn't contain more than 1 result for the '${query}' query`
    ).toBeGreaterThan(1);
  });

  test(`TEST-8: Clicking the search result leads to the corresponding web page for the '${query}' query @results @result_navigation`, async () => {
    // Search for query
    await googleSearchPage.searchForQueryByEnter(query);
    // Get titles of the web pages in the search results
    const searchResultsWebPagesTitlesText =
      await googleSearchPage.getSearchResultsWebPagesTitles();
    const firstTitle = searchResultsWebPagesTitlesText[0];
    // Get elements with web pages URLs in the search results
    const searchResultsWebPagesUrlElements =
      await googleSearchPage.getSearchResultsWebPagesUrlElements();
    const firstUrl = searchResultsWebPagesUrlElements[0];
    // Click or tap the 1st web link
    await googleSearchPage.clickOrTap(firstUrl);
    // Check if the title of the linked page in the search results contains the name of the web page from the search results
    const openPageTitle = await googleSearchPage.getPageTitle();
    expect(
      openPageTitle,
      `The title of the linked page in the search results does not contain the name of the web page from the search results for the '${query}' query`
    ).toContain(firstTitle);
  });

  test(`TEST-9: User can get the same search results for the same '${query}' query by pressing enter or clicking on search button @only-desktop @query_submitting`, async ({
    sharedContext,
  }) => {
    // Create new page 1 in the same context, search for the query by pressing Enter and get the text content of the results
    const searchResultsTexts1 = await performSearchAndFetchResultsForNewPage(
      sharedContext,
      query,
      GoogleSearchPage
    );
    // Create new page 2 in the same context, search for the query by clicking on search button and get the text content of the results
    const searchResultsTexts2 = await performSearchAndFetchResultsForNewPage(
      sharedContext,
      query,
      GoogleSearchPage,
      async (googleSearchPage, query) => {
        await googleSearchPage.searchForQueryBySearchButton(query);
      }
    );

    // Compare the search results from both pages
    expect(
      searchResultsTexts1,
      `Search results from two pages with the same '${query}' query are not equal`
    ).toEqual(searchResultsTexts2);
  });

  queryDataCaseInsensitive.forEach((queryData) => {
    test(`TEST-10: Search results are case insensitive to query case for the '${queryData.query}' query @results @case_insensitive`, async ({
      sharedContext,
    }) => {
      // Create new page 1 in the same context, search for the query in lower case and get the text content of the results
      const searchResultsTexts1 = await performSearchAndFetchResultsForNewPage(
        sharedContext,
        queryData.query.toLowerCase(),
        GoogleSearchPage
      );
      // Create new page 2 in the same context, search for the query with upper and lower cases and get the text content of the results
      const searchResultsTexts2 = await performSearchAndFetchResultsForNewPage(
        sharedContext,
        queryData.query,
        GoogleSearchPage
      );

      // Compare the search results from both pages
      expect(
        searchResultsTexts1,
        `Search results are not case insensitive to query case for the '${queryData.query}' query`
      ).toEqual(searchResultsTexts2);
    });
  });

  queryDataGeneral.forEach((queryData) => {
    test(`TEST-11: Page title contains '${queryData.query}' query @results @page_title`, async ({}) => {
      // Search for query
      await googleSearchPage.searchForQueryByEnter(queryData.query);
      const title = await googleSearchPage.getPageTitle();
      expect(
        title,
        `Page title doesn't contain the '${queryData.query}' query`
      ).toContain(queryData.query);
    });
  });
});
