import { expect } from '@playwright/test';
import test from '../hooks/testWithAfterEachHooks.mjs';
import GoogleHomeCalculatorPage from './pages/googleHomeCalculatorPage';
import { mathOperation } from './test-data/mathOperation';
import { getCharacterSequence, calculateExpectedResultText } from '../utilities/calculatorHelper';

test.describe(`Google calculator`, () => {
  let page; // Page instance
  let googleHomeCalculatorPage; // Page object instance

  // Navigate to Home page, reject all Cookies and search the 'calculator' query
  test.beforeEach(
    `Navigate to Home page, reject all Cookies and search the 'calculator' query`,
    async ({ sharedContext }) => {
      page = await sharedContext.newPage();
      const isMobile = sharedContext._options.isMobile || false; // type of device is mobile
      googleHomeCalculatorPage = new GoogleHomeCalculatorPage(page, isMobile);
      await googleHomeCalculatorPage.navigateAndRejectCookies();
      await googleHomeCalculatorPage.searchForQueryByEnter('calculator');
    }
  );

  test(`Google calculator is visiable on the Home page`, async () => {
    // Check if the Google calculator is visiable
    const calculatorLocator = page.locator(googleHomeCalculatorPage.selectors.calculatorScreen);
    await expect(calculatorLocator).toBeVisible();
  });

  mathOperation.forEach((mathOperation) => {
    test(`Perform "${mathOperation.operationName}" operation for ${mathOperation.firstNumber} and ${mathOperation.secondNumber} @only-desktop`, async () => {
      // Change to English if it's needed
      await googleHomeCalculatorPage.changeToEnglishIfAsked();
      // Click or tap the 1st number
      await googleHomeCalculatorPage.typeNumbers(getCharacterSequence(mathOperation.firstNumber));
      // Click or tap the orertion button
      await googleHomeCalculatorPage.clickOrTapOperation(mathOperation.operationName);
      // Click or tap the 2nd number
      await googleHomeCalculatorPage.typeNumbers(getCharacterSequence(mathOperation.secondNumber));
      // Click or tap the "equals" button
      await googleHomeCalculatorPage.clickOrTap(googleHomeCalculatorPage.selectors.equalsButton);
      // Waiting for result to appear
      await page.waitForLoadState('networkidle');
      // Get the text of the result
      const resultAreaText = await googleHomeCalculatorPage.getResultText();
      // Caclucate result of the math operation with the numbers
      const extectedResultText =
        mathOperation.expectedResult ||
        calculateExpectedResultText(mathOperation.firstNumber, mathOperation.secondNumber, mathOperation.operationName);
      // Check if the actual result of the mathematical operation is equal to the expected result
      expect(resultAreaText).toBe(extectedResultText, `The actual result of the mathematical operation is unexpected`);
    });
  });
});
