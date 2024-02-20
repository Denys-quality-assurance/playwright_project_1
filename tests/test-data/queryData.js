export const queryDataGeneral = [
  {
    query: 'Google', // for En language testing (Home page search, Custom Search Engine)
  },
  {
    query: 'cat', // for En language testing (Search by Picture testing)
  },
  {
    query: '@ at', // for Keywords with Special Characters testing
  },
  {
    query: 'playwright test', // for En language Multi-Word Keywords testing
  },
  {
    query: '100 km h', // for Alphanumeric Keywords testing
  },
  {
    query:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer viverra malesuada augue, eget sollicitudin est hendrerit id. Nullam dui sapien, dignissim sit amet sapien eu, vehicula convallis elit. Cras in feugiat libero, et iaculis enim. Nam et sodales lorem. Proin in tortor placerat, elementum mi a, rhoncus eros. Morbi sed aliquam diam. Suspendisse consectetur lectus vitae ipsum condimentum tincidunt. Suspendisse fermentum tincidunt tellus. Sed tincidunt sapien sit amet nisi fermentum condimentum. Praesent fringilla volutpat luctus.', // for Search by a large valid string testing
  },
  {
    query: 'Плэйрайт', // for Rus language
  },
  {
    query: '今天', // for Chinese language
  },
];

export const queryDataCaseInsensitive = [
  {
    query: 'GoOGlE', // for En language testing
  },
  {
    query: 'CAT', // for En language testing
  },
  {
    query: '@ AT', // for Keywords with Special Characters testing
  },
  {
    query: 'PlayWright TeSt', // for En language Multi-Word Keywords testing
  },
  {
    query: 'ПлэйрайТ', // for Cyr language testing
  },
];

export const queryDataEmptyResults = [
  {
    query: 'asfastawjerwerwfdsrtuiujhgrese', // for 1 Keyword testing
  },
  {
    query: 'asfastawjerwer wfdsrtuiujhgrese', // for Multi-Word Keywords testing
  },
];

export const queryDataAutoSuggestion = [
  {
    query: 'Goog', // for En language testing
    autoSuggestion: 'google maps',
  },
  {
    query: 'бег трус', // for Cyr language Multi-Word Keywords testing
    autoSuggestion: 'бег трусцой это',
  },
];

export const queryDataMisspelled = [
  {
    query: 'Gogle', // for En language testing
    correctedQuery: 'Google',
  },
  {
    query: 'plawright teting', // for En language Multi-Word Keywords testing
    correctedQuery: 'playwright testing',
  },
  {
    query: 'новоти', // for Cyr language testing
    correctedQuery: 'новости',
  },
  {
    query: 'свужие новоти', // for Cyr language Multi-Word Keywords testing
    correctedQuery: 'свежие новости',
  },
];
