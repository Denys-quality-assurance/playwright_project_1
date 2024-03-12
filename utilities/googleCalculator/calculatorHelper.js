/*
 * This module provides utility functions for interacting with and performing mathematical calculations
 *
 */

// Split the string to a character array
export function splitStringToCharArray(string) {
  try {
    // The split('') function splits the string into an array of its individual characters
    return string.split('');
  } catch (error) {
    console.error(
      `Failed to convert the number to a digit sequence: ${error.message}`
    );
  }
}

// Map operation name to its corresponding button aria-label
export function mapOperationToAriaLabel(operation) {
  try {
    // Defines map between the operation name and its corresponding aria-label
    const operationMap = {
      divide: 'divide',
      multiply: 'multiply',
      minus: 'minus',
      plus: 'plus',
      equals: 'equals',
      'left parenthesis': 'left parenthesis',
      'right parenthesis': 'right parenthesis',
      'X to the power of Y': `X to the power of Y`,
    };
    // Get the operation's aria-label from the map
    const ariaLabel = operationMap[operation];
    // If the provided operation does not exist in the map, it will throw an error
    if (!ariaLabel) throw new Error(`Invalid operation: ${operation}`);

    return ariaLabel;
  } catch (error) {
    console.error(
      `Failed while mapping operation name ${operation} to its corresponding button aria-label: ${error.message}`
    );
  }
}

// Caclucate result of the math operation with the numbers
export function calculateExpectedResultText(
  firstNumber,
  secondNumber,
  operation
) {
  try {
    // The switch case evaluates the operation and performs the corresponding mathematical operation
    switch (operation) {
      case 'divide':
        return (Number(firstNumber) / Number(secondNumber)).toString();
      case 'multiply':
        return (Number(firstNumber) * Number(secondNumber)).toString();
      case 'minus':
        return (Number(firstNumber) - Number(secondNumber)).toString();
      case 'plus':
        return (Number(firstNumber) + Number(secondNumber)).toString();
      case 'X to the power of Y':
        return Math.pow(Number(firstNumber), Number(secondNumber)).toString();
      // If an unknown operation value is provided, throws an error
      default:
        throw new Error(`Invalid operation: ${operation}`);
    }
  } catch (error) {
    console.error(
      `Failed to caclucate result of the math operation with the numbers: ${error.message}`
    );
  }
}
