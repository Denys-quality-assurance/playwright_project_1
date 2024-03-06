import basePage from './basePage';
import { getOperationAriaLabel } from '../../utilities/googleCalculator/calculatorHelper';

export default class GoogleCalculatorPage extends basePage {
  constructor(page, isMobile) {
    super(page, isMobile);

    this.selectors = {
      ...this.selectors,

      calculatorScreen: `.tyYmIf >> .BRpYC`, // The main screen of the calculator
      operationsButtons: `.XRsWPe.MEdqYd[role="button"]`, // One of operation buttons of the calculator
      equalsButton: `.XRsWPe.UUhRt[role="button"][aria-label="equals"]`, // "Equals" button of the calculator
      digitsAndDotButtons: `.XRsWPe.AOvabd[role="button"]`, // One of digits or dot buttons of the calculator
      resultArea: `#cwos`, // Area of the operations result of the calculator
    };
  }

  // Type numbers on the calculator
  async typeNumbers(digits) {
    try {
      // copy digits array
      let digitsArray = [...digits];
      if (digitsArray[0] === '-') {
        // Handle negative numbers
        await this.handleNegativeNumbers(digitsArray);
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

  // Handle negative numbers
  async handleNegativeNumbers(digits) {
    try {
      // Open the parentheses and put -
      await this.clickOrTapOperation('left parenthesis');
      await this.clickOrTapOperation('minus');
      // Remove the first element ('-') from digits
      digits.shift();
      // Click or tap digits on the calculator
      await this.clickOrTapDigits(digits);
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
      for (const digit of digits) {
        // Construct unique locator for digit button
        const digitLocator = `${this.selectors.digitsAndDotButtons}:has-text("${digit}")`;
        await this.page.waitForSelector(digitLocator);
        // Click or Tap the locator with the digit in text
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
      // Convert operation name to corresponding aria-label
      const operationAriaLabel = getOperationAriaLabel(operationName);
      // Construct unique locator for operation button
      const operationLocator = `${this.selectors.operationsButtons}[aria-label="${operationAriaLabel}"]`;
      await this.page.waitForSelector(operationLocator);
      // Click or Tap the locator with the digit in text
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
