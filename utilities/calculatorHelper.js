export function getNumberSequence(number) {
  // Convert the number to a digit sequence
  return number.toString().split('');
}

export function getOperationName(operation) {
  // Mapping between operation name and its button aria-label
  const operationMap = {
    multiply: 'multiply',
    // add more if needed
  };
  return operationMap[operation];
}

export function calculateRealResult(firstNumber, secondNumber, operation) {
  switch (operation) {
    case 'multiply':
      return firstNumber * secondNumber;
    // more cases according to your operations
  }
}
