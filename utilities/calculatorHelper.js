// Convert the string to a character sequence
export function getCharacterSequence(string) {
  try {
    return string.split('');
  } catch (error) {
    console.error(`Failed to convert the number to a digit sequence: ${error.message}`);
  }
}

// Mapping between operation name and its button aria-label
export function getOperationAriaLabel(operation) {
  try {
    const operationMap = {
      divide: 'divide',
      multiply: 'multiply',
      minus: 'minus',
      plus: 'plus',
      equals: 'equals',
    };
    return operationMap[operation];
  } catch (error) {
    console.error(`Failed while mapping between operation name and its button aria-label: ${error.message}`);
  }
}

// Caclucate result of the math operation with the numbers
export function calculateExpectedResultText(firstNumber, secondNumber, operation) {
  try {
    switch (operation) {
      case 'divide':
        return (Number(firstNumber) / Number(secondNumber)).toString();
      case 'multiply':
        return (Number(firstNumber) * Number(secondNumber)).toString();
      case 'minus':
        return (Number(firstNumber) - Number(secondNumber)).toString();
      case 'plus':
        return (Number(firstNumber) + Number(secondNumber)).toString();
    }
  } catch (error) {
    console.error(`Failed to caclucate result of the math operation with the numbers: ${error.message}`);
  }
}
