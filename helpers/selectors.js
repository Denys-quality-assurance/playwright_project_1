const SELECTORS = {
  // Login page selectors
  LOGIN_EMAIL: '#username', // Email input field on the login page
  LOGIN_PASSWORD: '#password', // Password input field on the login page
  LOGIN_BUTTON: '.login__form_action_container button', // Sign-in button on the login page

  // Main page selectors
  AVATAR_ICON: '.global-nav__primary-link-me-menu-trigger', // Avatar icon in the main page header
  SEARCH_BOX: 'input.search-global-typeahead__input', // Search input box on the main page

  // Search results page selector
  SEARCH_RESULTS: '.reusable-search__entity-result-list', // Search results list container

  // Dropdown user menu selectors
  SIGNOUT_BUTTON_USER_MENU: '.global-nav__secondary-link.mv1', // Sign-out button in the dropdown user menu

  // General purpose submit button
  SUBMIT_BUTTON: '[data-id="sign-in-form__submit-btn"]', // Submit button on logout page
};

module.exports = SELECTORS;
