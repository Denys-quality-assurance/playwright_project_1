const SELECTORS = {
  // Login page selectors
  LOGIN_EMAIL: '#username', // Email input field on the login page
  LOGIN_PASSWORD: '#password', // Password input field on the login page
  LOGIN_BUTTON: '.login__form_action_container button', // Sign-in button on the login page

  // Main page selectors
  AVATAR_ICON_MAIN: '.global-nav__primary-link-me-menu-trigger', // Avatar icon in the main page header
  AVATAR_ICON: '.feed-identity-module__member-photo', // Avatar icon in the main page
  SEARCH_BOX: 'input.search-global-typeahead__input', // Search input box on the main page

  // My profile page selectors
  ADD_PHOTO_BUTTON: '.pv-top-card__edit-photo-button', // Add profile photo on the main page
  EDIT_PHOTO_BUTTON: '.profile-photo-edit__edit-btn', // Edit profile photo on the main page

  // Search results page selector
  SEARCH_RESULTS: '.reusable-search__entity-result-list', // Search results list container

  // Dropdown user menu selectors
  SIGNOUT_BUTTON_USER_MENU: '.global-nav__secondary-link.mv1', // Sign-out button in the dropdown user menu

  // Logout page selectors
  SUBMIT_BUTTON: '[data-id="sign-in-form__submit-btn"]', // Submit button on logout page

  // Another profile page selectors
  FOLLOW_BUTTON: '.pvs-profile-actions__action[aria-label*="Follow "]', // Follow button to follow new profile
  UNFOLLOW_BUTTON: '.pvs-profile-actions__action[aria-label*="Following"]', // Unollow button to follow new profile

  // Unfollow modal selectors
  UNFOLLOW_CONFIRMATION_BUTTON: '.artdeco-button--primary.artdeco-modal__confirm-dialog-btn', // Unollow button on the unfollow modal

  // Add photo modal selectors
  UPLOAD_PHOTO_BUTTON: '.image-selector__file-upload-input', // Upload profile photo button on the Add photo modal

  // Edit photo modal selectors
  SAVE_PHOTO_BUTTON: '.profile-photo-cropper__apply-action', // Save profile photo button on the Edit photo modal

  // Profile photo modal selectors
  DELETE_PHOTO_BUTTON: '.fr', // Delete profile photo button on the Profile photo modal

  // Delete profile photo modal
  DELETE_PHOTO_CONFIRMATION_BUTTON: '[data-test-dialog-primary-btn=""]',

  // Any modal
  MODAL: '.image-selector-modal', // Any modal
};

module.exports = SELECTORS;
