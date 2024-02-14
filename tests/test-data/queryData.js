export const queryDataGeneral = [
  {
    query: 'Google', // for Home page search, for Custom Search Engine testing
  },
  {
    query: 'cat', // for Search by Picture testing
  },
  {
    query: '@ at', // for Search by Keywords with Special Characters testing
  },
  {
    query: 'playwright test', // for Search by Multi-Word Keywords testing
  },
  {
    query: '100 km h', // for Search by Alphanumeric Keywords testing
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
    query: 'GoOGlE',
  },
  {
    query: 'CAT',
  },
  {
    query: '@ AT',
  },
  {
    query: 'PlayWright TeSt',
  },
  {
    query: 'ПлэйрайТ',
  },
];

export const queryDataEmptyResults = [
  {
    query: 'asfastawjerwerwfdsrtuiujhgrese',
  },
  {
    query: 'asfastawjerwer wfdsrtuiujhgrese',
  },
];

export const queryDataMisspelled = [
  {
    query: 'Gogle',
  },
  {
    query: 'Cwat',
  },
];
