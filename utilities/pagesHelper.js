/*
 * This file provides utilities for creating a new page in the same context.
 * This is particularly useful when conducting searches on multiple
 * pages at the same time within the same browsing context.
 *
 */

// Create new page in the same context, navigate to Home page and reject all Cookies if it's needed
export async function goToHomeForNewPage(sharedContext, GoogleSearchPageClass) {
  const newPage = await sharedContext.newPage();
  const isMobile = sharedContext._options.isMobile || false; // type of device is mobile
  const googleSearchPage = new GoogleSearchPageClass(newPage, isMobile);
  // Navigate to the home page and reject all cookies
  await googleSearchPage.goToHomeAndRejectCookies();
  return { newPage, googleSearchPage };
}

// Create new page in the same context, navigate to Google Home page, search for the query and get the text content of the results
export async function performSearchAndFetchResultsForNewPage(
  sharedContext,
  query,
  GoogleSearchPageClass,
  searchFunction
) {
  // Create new page in the same context, navigate to Home page and reject all Cookies if it's needed
  const { googleSearchPage } = await goToHomeForNewPage(
    sharedContext,
    GoogleSearchPageClass
  );

  // Perform search using the passed function
  // If a custom search function is provided, use it to conduct the search. Otherwise, perform a basic search
  if (searchFunction) {
    await searchFunction(googleSearchPage, query);
  } else {
    await googleSearchPage.searchForQueryByEnter(query);
  }

  // Get the locator for the search results
  const searchResultsLocator = await googleSearchPage.getSearchResultsLocator();
  // Get all of the text content from the search results
  const searchResultsTexts =
    await googleSearchPage.getTextContent(searchResultsLocator);

  return searchResultsTexts;
}
