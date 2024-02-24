import { getOperationAriaLabel } from '../../utilities/calculatorHelper';

export default class GoogleHomeCalculatorPage {
  constructor(page, isMobile) {
    this.page = page;
    this.isMobile = isMobile; // type of device is mobile
    this.selectors = {
      cookiesModal: `#CXQnmb`, // Cookies consent modal
      rejectAllCookiesButton: `button#W0wltc`, // Reject all cookies button
      searchInputTextArea: `textarea[name=q]`, // Search query imput area
      calculatorScreen: `.tyYmIf >> .BRpYC`, // The main screen of the calculator
      changeToEnglishModal: `#Rzn5id`, // Change to English modal
      changeToEnglishButton: `text="Change to English"`, // Change to English button
      operationsButtons: `.XRsWPe.MEdqYd[role="button"]`, // One of operation buttons of the calculator
      equalsButton: `.XRsWPe.UUhRt[role="button"][aria-label="equals"]`, // "Equals" button of the calculator
      digitsAndDotButtons: `.XRsWPe.AOvabd[role="button"]`, // One of digits or dot buttons of the calculator
      resultArea: `#cwos`, // Area of the operations result of the calculator
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

  // Wait for the search response
  async waitForSearchResponse() {
    return this.page.waitForResponse('/search?q=**');
  }

  // Change to English if it's needed
  async changeToEnglishIfAsked() {
    if (await this.page.isVisible(this.selectors.changeToEnglishModal)) {
      try {
        await this.page.waitForSelector(this.selectors.changeToEnglishButton);
        await this.clickOrTap(this.selectors.changeToEnglishButton);
        await this.page.waitForSelector(this.selectors.changeToEnglishModal, { state: 'hidden' });
      } catch (error) {
        console.error(`Failed to change to English: ${error.message}`);
      }
    }
  }

  // Click or tap digits on the calculator
  async clickOrTapDigits(digits) {
    try {
      for (const digit of digits) {
        if (digit === '-') {
          await this.clickOrTapOperation('minus');
        } else {
          // Construct unique locator for digit button
          const digitLocator = `${this.selectors.digitsAndDotButtons}:has-text("${digit}")`;
          await this.page.waitForSelector(digitLocator);
          // Click or Tap the locator with the digit in text
          await this.clickOrTap(digitLocator);
        }
      }
    } catch (error) {
      console.error(`Failed to click or tap digit on the calculator: ${error.message}`);
    }
  }

  // Click or tap operation on the calculator
  async clickOrTapOperation(operationName) {
    try {
      // Convert operation name to corresponding aria-label
      const operationAriaLabel = getOperationAriaLabel(operationName);
      // Construct unique locator for operation button
      const operationLocator = `${this.selectors.operationsButtons}[aria-label="${operationAriaLabel}"]`;
      await this.page.waitForSelector(operationLocator);
      // Click or Tap the locator with the digit in text
      await this.clickOrTap(operationLocator);
    } catch (error) {
      console.error(`Failed to click or tap operation on the calculator: ${error.message}`);
    }
  }

  // Get the text of the result
  async getResultText() {
    try {
      await this.page.waitForSelector(this.selectors.resultArea);
      const resultAreaElement = await this.page.$(this.selectors.resultArea);
      // Get text content from resultArea
      const resultAreaText = await resultAreaElement.innerText();
      return resultAreaText;
    } catch (error) {
      console.error(`Failed to get the text of the result: ${error.message}`);
    }
  }
}
