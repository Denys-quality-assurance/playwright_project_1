/*
 * Google Calculator Test Suite:
 * This suite of tests is designed to validate the functionality of the Google Calculator.
 *
 * The suite begins by setting up a page instance and Google Calculator page object instance.
 * It then navigates to the homepage, rejects all cookies, and searches for the 'calculator' query.
 * The first test verifies if the Google Calculator is visible on the Home page.
 * Subsequent tests perform various mathematical operations in the calculator using data from 'mathOperation' object.
 * Each operation includes entering the numbers, clicking the operation button, clicking the 'equals' button,
 * and then comparing the actual result with the expected result.
 *
 * Helper methods for calculator interactions are present in the GoogleCalculatorPage class.
 * Util functions like splitStringToCharArray and selectProvidedOrCalculatedExpectedResult from calculatorHelper
 * are used for data manipulation.
 *
 */

import { expect } from '@playwright/test';
import test from '../../../hooks/testWithAfterEachHooks.mjs';
import GoogleCalculatorPage from '../../pages/googleCalculatorPage';
import { mathOperation } from '../../test-data/googleCalculator/mathOperation';
import {
  splitStringToCharArray,
  selectProvidedOrCalculatedExpectedResult,
} from '../../../utilities/googleCalculator/calculatorHelper';

const testStatus = {
  SKIPPED: 'skipped',
};

test.describe(`Google calculator`, () => {
  // Test should be failed when the condition is true: there is at least 1 unfixed bug
  test.fail(
    ({ shouldFailTest }) => shouldFailTest,
    `Test marked as "should fail" due to the presence of unfixed bug(s)`
  );
  // Test should be skipped when the condition is true: flag skipTestsWithKnownBugs is 'true' and there is at least 1 unfixed bug
  test.skip(
    ({ shouldSkipTest }) => shouldSkipTest,
    `Test skipped due to the presence of unfixed bug(s)`
  );

  let page; // Page instance
  let googleCalculatorPage; // Page object instance

  // Navigate to Home page, reject all Cookies and search the 'calculator' query
  test.beforeEach(
    `Navigate to Home page, reject all Cookies and search the 'calculator' query`,
    async ({ sharedContext }, testInfo) => {
      // Prepare the test only if the test is not skipped
      if (testInfo.expectedStatus !== testStatus.SKIPPED) {
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
