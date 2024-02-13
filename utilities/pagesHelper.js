// Create new page in the same context, navigate to Google Home page, search for the query and get the text content of the results
export async function performSearchAndFetchResults(sharedContext, query, GoogleHomePageClass, searchSubmitMethod) {
  const newPage = await sharedContext.newPage();
  const googleHomePage = new GoogleHomePageClass(newPage);
  await googleHomePage.navigateAndRejectCookies();

  // Choose the query subtim method
  if (searchSubmitMethod == 'searchForQueryBySearchButton') {
    // Search for query by clicking on search button
    await googleHomePage.searchForQueryBySearchButton(query);
  } else {
    // Search for query by pressing enter
    await googleHomePage.searchForQueryByEnter(query);
  }

  const searchResults = await googleHomePage.getSearchResults();
  const searchResultsTexts = await googleHomePage.getTextContent(searchResults);

  return searchResultsTexts;
}
