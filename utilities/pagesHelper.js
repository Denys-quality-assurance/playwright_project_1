// Create new page in the same context, navigate to Google Home page, search for the query and get the text content of the results
export async function performSearchAndFetchResults(sharedContext, query, GoogleHomePageClass, searchFunction) {
  const newPage = await sharedContext.newPage();
  const googleHomePage = new GoogleHomePageClass(newPage);
  await googleHomePage.navigateAndRejectCookies();

  // Perform search using the passed function
  if (searchFunction) {
    await searchFunction(googleHomePage, query);
  } else {
    await googleHomePage.searchForQueryByEnter(query);
  }

  const searchResults = await googleHomePage.getSearchResults();
  const searchResultsTexts = await googleHomePage.getTextContent(searchResults);

  return searchResultsTexts;
}
