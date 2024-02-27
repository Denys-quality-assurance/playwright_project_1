// Create new page in the same context, navigate to Home page and reject all Cookies if it's needed
export async function navigateHomeForNewPage(sharedContext, GoogleSearchPageClass) {
  const newPage = await sharedContext.newPage();
  const isMobile = sharedContext._options.isMobile || false; // type of device is mobile
  const googleSearchPage = new GoogleSearchPageClass(newPage, isMobile);
  await googleSearchPage.navigateAndRejectCookies();
  return { newPage, googleSearchPage };
}

// Create new page in the same context, navigate to Google Home page, search for the query and get the text content of the results
export async function performSearchAndFetchResultsForNewPage(
  sharedContext,
  query,
  GoogleSearchPageClass,
  searchFunction
) {
  const newPage = await sharedContext.newPage();
  const isMobile = sharedContext._options.isMobile || false; // type of device is mobile
  const googleSearchPage = new GoogleSearchPageClass(newPage, isMobile);
  await googleSearchPage.navigateAndRejectCookies();

  // Perform search using the passed function
  if (searchFunction) {
    await searchFunction(googleSearchPage, query);
  } else {
    await googleSearchPage.searchForQueryByEnter(query);
  }

  const searchResults = await googleSearchPage.getSearchResultElements();
  const searchResultsTexts = await googleSearchPage.getTextContent(searchResults);

  return searchResultsTexts;
}
