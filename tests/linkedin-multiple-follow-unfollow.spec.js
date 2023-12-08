const { credentials } = require('../helpers/credentials');
const {
  launchBrowserWithPage,
  loginToLinkedIn,
  followMultipleProfiles,
  unfollowMultipleProfiles,
  closeBrowser,
} = require('../helpers/playwrightHelpers');

(async () => {
  let browser;
  try {
    // Create a browser instance, open a new page, and login
    const { browser: newBrowser, page } = await launchBrowserWithPage();
    browser = newBrowser;
    await loginToLinkedIn(page);

    // Define an array of LinkedIn profile links you want to fallow to.
    const profileLinks = [
      'https://www.linkedin.com/in/denys-matolikov/',
      'https://www.linkedin.com/in/elon-musk-usa-373aa128b/',
      'https://www.linkedin.com/in/denys-matolikov/',
    ];

    // Follow multiple profiles
    await followMultipleProfiles(page, profileLinks);
    // Unfollow multiple profiles
    await unfollowMultipleProfiles(page, profileLinks);
  } catch (err) {
    console.error('Error occurred:', err);
  } finally {
    // Closing the browser instance
    await closeBrowser(browser);
  }
})();
