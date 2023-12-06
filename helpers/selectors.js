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

  // Logout page
  SUBMIT_BUTTON: '[data-id="sign-in-form__submit-btn"]', // Submit button on logout page

  // Profile page
  FOLLOW_BUTTON: '.pvs-profile-actions__action[aria-label*="Follow "]', // Follow button to follow new profile
  UNFOLLOW_BUTTON: '.pvs-profile-actions__action[aria-label*="Following"]', // Unollow button to follow new profile

  // Unfollow modal
  UNFOLLOW_BUTTON_MODAL: '.artdeco-button--primary.artdeco-modal__confirm-dialog-btn', // Unollow button on the unfollow modal
};

module.exports = SELECTORS;
