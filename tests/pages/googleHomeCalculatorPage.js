import { escapeRegexSpecialCharacters } from '../../utilities/regexHelper';

export default class GoogleHomeCalculatorPage {
  constructor(page, isMobile) {
    this.page = page;
    this.isMobile = isMobile; // type of device is mobile
    this.selectors = {
      cookiesModal: `#CXQnmb`, // Cookies consent modal
      rejectAllCookiesButton: `button#W0wltc`, // Reject all cookies button
      searchInputTextArea: `textarea[name=q]`, // Search query imput area
      calculatorScreen: `.tyYmIf >> .BRpYC`, // The main screen of the calculator
    };
  }

  // Click or Tap
  async clickOrTap(elementOrSelector) {
    try {
      if (typeof elementOrSelector === 'string') {
        if (this.isMobile) {
          await this.page.tap(elementOrSelector);
        } else {
          await this.page.click(elementOrSelector);
        }
      } else {
        // elementOrSelector is an ElementHandle
        if (this.isMobile) {
          await elementOrSelector.tap();
        } else {
          await elementOrSelector.click();
        }
      }
    } catch (error) {
      console.error(`Failed to chose click or tap method: ${error.message}`);
    }
  }

  // Navigate to Home page
  async navigateHome() {
    try {
      await this.page.goto('/');
    } catch (error) {
      console.error(`Failed to navigate to Home page: ${error.message}`);
    }
  }

  // Reject all Cookies if it's needed
  async rejectCookiesIfAsked() {
    if (await this.page.isVisible(this.selectors.cookiesModal)) {
      try {
        await this.clickOrTap(this.selectors.rejectAllCookiesButton);
        await this.page.waitForSelector(this.selectors.cookiesModal, { state: 'hidden' });
      } catch (error) {
        console.error(`Failed to reject all Cookies: ${error.message}`);
      }
    }
  }

  // Navigate to page and reject all Cookies if it's needed
  async navigateAndRejectCookies() {
    try {
      await this.navigateHome();
      await this.rejectCookiesIfAsked();
    } catch (error) {
      console.error(`Failed to navigate to page and reject all Cookies: ${error.message}`);
    }
  }

  // Fill Search imput with query
  async fillSearchInput(query) {
    try {
      await this.page.waitForSelector(this.selectors.searchInputTextArea);
      await this.page.fill(this.selectors.searchInputTextArea, query);
    } catch (error) {
      console.error(`Failed to fill Search imput with query: ${error.message}`);
    }
  }

  // Search for query by pressing enter
  async searchForQueryByEnter(query) {
    try {
      // Fill Search imput with query
      await this.fillSearchInput(query);
      // Submit the query by pressing enter
      await this.page.press(this.selectors.searchInputTextArea, 'Enter');
      // Waiting for search result page to appear
      await this.page.waitForLoadState('networkidle');
    } catch (error) {
      console.error(`Failed to search for query by pressing enter: ${error.message}`);
    }
  }
}
