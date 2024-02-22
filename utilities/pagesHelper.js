// Create new page in the same context, navigate to Home page and reject all Cookies if it's needed
export async function navigateHomeForNewPage(sharedContext, GoogleHomePageClass) {
  const newPage = await sharedContext.newPage();
  const isMobile = sharedContext._options.isMobile || false; // type of device is mobile
  const googleHomePage = new GoogleHomePageClass(newPage, isMobile);
  await googleHomePage.navigateAndRejectCookies();
  return { newPage, googleHomePage };
}

// Create new page in the same context, navigate to Google Home page, search for the query and get the text content of the results
export async function performSearchAndFetchResultsForNewPage(
  sharedContext,
  query,
  GoogleHomePageClass,
  searchFunction
) {
  const newPage = await sharedContext.newPage();
  const isMobile = sharedContext._options.isMobile || false; // type of device is mobile
  const googleHomePage = new GoogleHomePageClass(newPage, isMobile);
  await googleHomePage.navigateAndRejectCookies();

  // Perform search using the passed function
  if (searchFunction) {
    await searchFunction(googleHomePage, query);
  } else {
    await googleHomePage.searchForQueryByEnter(query);
  }

  const searchResults = await googleHomePage.getSearchResultElements();
  const searchResultsTexts = await googleHomePage.getTextContent(searchResults);

  return searchResultsTexts;
}
