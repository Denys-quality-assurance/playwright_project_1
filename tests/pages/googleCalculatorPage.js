/*
 * The `GoogleCalculatorPage` is a Page Object Model that represents the Google Calculator Page.
 * This class extends from the `BasePage` class, encapsulating the structure and behavior of the web page,
 * providing API to interact with the page.
 *
 * This class provides methods to input number sequence (including negative), operations and retrieve the result of
 * these operations.
 *
 */

import BasePage from './basePage';
import { mapOperationToAriaLabel } from '../../utilities/googleCalculator/calculatorHelper';

export default class GoogleCalculatorPage extends BasePage {
  constructor(page, isMobile) {
    super(page, isMobile);

    this.selectors = {
      ...this.selectors,

      calculatorScreen: `.tyYmIf >> .BRpYC`, // The main screen of the calculator
      operationsButtons: `.XRsWPe.MEdqYd[role="button"]`, // One of operation buttons of the calculator
      equalsButton: `.XRsWPe.UUhRt[role="button"][aria-label="equals"]`, // "Equals" button of the calculator
      digitsAndDotButtons: `.XRsWPe.AOvabd[role="button"]`, // One of digits or dot buttons of the calculator
      resultArea: `#cwos`, // Area of the operations result of the calculator
      enteredDataArea: `.XH1CIc .vUGUtc`, // Area of the entered data
    };
  }

  // Enter a sequence of numbers (including negative numbers) on the calculator.
  async enterNumberSequence(digits) {
    try {
      // copy digits array
      let digitsArray = [...digits];
      if (digitsArray[0] === '-') {
        // Handle negative numbers
        await this.enterNegativeNumber(digitsArray);
      } else {
        // Click or tap digits on the calculator
        await this.clickOrTapDigits(digitsArray);
      }
    } catch (error) {
      console.error(
        `Failed to click or tap digit on the calculator: ${error.message}`
      );
    }
  }

  // Enter a negative number on the calculator
  async enterNegativeNumber(digits) {
    try {
      // Open the parentheses and put -
      await this.clickOrTapOperation('left parenthesis');
      await this.clickOrTapOperation('minus');
      // Remove the first element ('-') from digits
      const positiveDigits = digits.slice(1);
      // Click or tap digits on the calculator
      await this.clickOrTapDigits(positiveDigits);
      // Close the parentheses
      await this.clickOrTapOperation('right parenthesis');
    } catch (error) {
      console.error(
        `Failed to click or tap digit on the calculator: ${error.message}`
      );
    }
  }

  // Click or tap digits on the calculator
  async clickOrTapDigits(digits) {
    try {
      // Loop through the specified digits one by one
      for (const digit of digits) {
        // Get locator for the digit button and wait for the button to appear on the UI
        const digitLocator = `${this.selectors.digitsAndDotButtons}:has-text("${digit}")`;
        await this.page.waitForSelector(digitLocator);
        // Click or Tap on the digit button
        await this.clickOrTap(digitLocator);
      }
    } catch (error) {
      console.error(
        `Failed to click or tap digit on the calculator: ${error.message}`
      );
    }
  }

  // Click or tap operation on the calculator
  async clickOrTapOperation(operationName) {
    try {
      // Map operation name to its corresponding button aria-label
      const operationAriaLabel = mapOperationToAriaLabel(operationName);
      // Get locator for the operation button and wait for the button to appear on the UI
      const operationLocator = `${this.selectors.operationsButtons}[aria-label="${operationAriaLabel}"]`;
      await this.page.waitForSelector(operationLocator);
      // Click or Tap the operation button
      await this.clickOrTap(operationLocator);
    } catch (error) {
      console.error(
        `Failed to click or tap operation on the calculator: ${error.message}`
      );
    }
  }

  // Get the text of the result
  async getResultText() {
    try {
      // Wait for the entered data and result areas to appear on the UI
      await this.page.waitForSelector(this.selectors.enteredDataArea);
      const resultAreaLocator = await this.getLocator(
        this.selectors.resultArea
      );
      // Get text content from resultArea
      return await resultAreaLocator.innerText();
    } catch (error) {
      console.error(`Failed to get the text of the result: ${error.message}`);
    }
  }
}
