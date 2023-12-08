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
  ADD_PHOTO_BUTTON: '.pv-top-card__edit-photo-button', // Add profile photo on the profile page
  EDIT_PHOTO_BUTTON: '.profile-photo-edit__edit-btn', // Edit profile photo on the profile page
  MORE_ACTIONS_BUTTON: '.pvs-profile-actions', // More actions in the profile page
  BUILD_RESUME_BUTTON: '.pvs-profile-actions >> [aria-label="Build a resume"]', // Build a Resume button on the DD in the profile page

  // Search results page selector
  SEARCH_RESULTS: '.reusable-search__entity-result-list', // Search results list container

  // Dropdown user menu selectors
  SIGNOUT_BUTTON_USER_MENU: '.global-nav__secondary-link.mv1', // Sign-out button in the dropdown user menu

  // Logout page selectors
  SUBMIT_BUTTON: '[data-id="sign-in-form__submit-btn"]', // Submit button on logout page

  // Another profile page selectors
  FOLLOW_BUTTON: '.pvs-profile-actions__action[aria-label*="Follow "]', // Follow button to follow new profile
  UNFOLLOW_BUTTON: '.pvs-profile-actions__action[aria-label*="Following"]', // Unollow button to follow new profile

  // Add photo modal selectors
  UPLOAD_PHOTO_BUTTON: '.image-selector__file-upload-input', // Upload profile photo button on the Add photo modal

  // Edit photo modal selectors
  SAVE_PHOTO_BUTTON: '.profile-photo-cropper__apply-action', // Save profile photo button on the Edit photo modal

  // Profile photo modal selectors
  DELETE_PHOTO_BUTTON: '.fr', // Delete profile photo button on the Profile photo modal

  // Select a resume modal
  CREATE_RESUME_BUTTON: '.resume-builder-resume-list-modal__new-resume-button', // Create from profile button on the Select a resume modal
  SHOW_OPTIONS_FOR_RESUME_BUTTON: '[aria-label*="Show options for Resume"]', // Show options for Resume button on the Select a resume modal
  DELETE_RESUME_BUTTON: '[aria-label*="Delete Resume"]', // Delete Resume button in DD on the Select a resume modal

  // Choose your desired job title modal
  JOB_TITLE_COMBOBOX: '.resume-builder-desired-title-modal__title-input', // Job title combobox on the Choose your desired job title modal
  JOB_TITLE_COMBOBOX_ITEM: '.basic-typeahead__selectable >> nth=0', // The 1st item in the Job title menu
  APPLY_JOB_TITLE_BUTTON: '.artdeco-modal__actionbar >> .artdeco-button--primary', // Apply button on the Choose your desired job title modal

  // Resume builder page
  DOWNLOAD_RESUME_BUTTON: '.mlA', // Download resume button on the Resume builder page
  VIEW_RESUMES: '[aria-label="View your resumes"]', // View resumes button on the Resume builder page

  // Any modal
  MODAL: '.image-selector-modal', // Any modal
  CONFIRMATION_BUTTON: '.artdeco-button--primary.artdeco-modal__confirm-dialog-btn', // Confirmation button on Any modal
};

module.exports = SELECTORS;
