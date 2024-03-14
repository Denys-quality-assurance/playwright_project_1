import { expect } from '@playwright/test';
import test from '../../../hooks/testWithAfterEachHooks.mjs';
import GoogleCalculatorPage from '../../pages/googleCalculatorPage';
import { mathOperation } from '../../test-data/googleCalculator/mathOperation';
import {
  splitStringToCharArray,
  selectProvidedOrCalculatedExpectedResult,
} from '../../../utilities/googleCalculator/calculatorHelper';

test.describe(`Google calculator`, () => {
  let page; // Page instance
  let googleCalculatorPage; // Page object instance

  // Navigate to Home page, reject all Cookies and search the 'calculator' query
  test.beforeEach(
    `Navigate to Home page, reject all Cookies and search the 'calculator' query`,
    async ({ sharedContext }, testInfo) => {
      if (testInfo.expectedStatus !== 'skipped') {
        page = await sharedContext.newPage();
        const isMobile = sharedContext._options.isMobile || false; // type of device is mobile
        googleCalculatorPage = new GoogleCalculatorPage(page, isMobile);
        await googleCalculatorPage.goToHomeAndRejectCookies();
        await googleCalculatorPage.searchForQueryByEnter('calculator');
        await page.waitForSelector(googleCalculatorPage.selectors.searchResult);
      }
    }
  );

  test(`TEST-28: Google calculator is visiable on the Home page`, async () => {
    // Check if the Google calculator is visiable
    const calculatorLocator = page.locator(
      googleCalculatorPage.selectors.calculatorScreen
    );
    await expect(calculatorLocator).toBeVisible();
  });

  mathOperation.forEach((mathOperation) => {
    test(`TEST-29: Perform "${mathOperation.operationName}" operation for ${mathOperation.firstNumber} and ${mathOperation.secondNumber} @only-desktop`, async () => {
      // Change to English if it's needed
      await googleCalculatorPage.changeToEnglishIfAsked();
      // Click or tap the 1st number
      await googleCalculatorPage.enterNumberSequence(
        splitStringToCharArray(mathOperation.firstNumber)
      );
      // Click or tap the orertion button
      await googleCalculatorPage.clickOrTapOperation(
        mathOperation.operationName
      );
      // Click or tap the 2nd number
      await googleCalculatorPage.enterNumberSequence(
        splitStringToCharArray(mathOperation.secondNumber)
      );
      // Click or tap the "equals" button
      await googleCalculatorPage.clickOrTap(
        googleCalculatorPage.selectors.equalsButton
      );
      // Get the text of the result
      const resultAreaText = await googleCalculatorPage.getResultText();
      // Caclucate result of the math operation with the numbers
      const extectedResultText =
        selectProvidedOrCalculatedExpectedResult(mathOperation);

      // Check if the actual result of the mathematical operation is equal to the expected result
      expect(
        resultAreaText,
        `The actual result of the mathematical operation is unexpected`
      ).toBe(extectedResultText);
    });
  });
});
