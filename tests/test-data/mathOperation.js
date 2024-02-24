export const mathOperation = [
  {
    firstNumber: '0',
    secondNumber: '0',
    operationName: 'divide',
    expectedResult: 'Error',
  },
  {
    firstNumber: '-0',
    secondNumber: '-0',
    operationName: 'divide',
    expectedResult: 'Error',
  },
  {
    firstNumber: '-0.0000000001',
    secondNumber: '-0',
    operationName: 'divide',
    expectedResult: '-Infinity',
  },
  {
    firstNumber: '999999999999999',
    secondNumber: '0',
    operationName: 'divide',
    expectedResult: 'Infinity',
  },
  {
    firstNumber: '-999999999999999',
    secondNumber: '0',
    operationName: 'divide',
    expectedResult: '-Infinity',
  },
  {
    firstNumber: '-999999999999999',
    secondNumber: '-0',
    operationName: 'divide',
    expectedResult: '-Infinity',
  },
  {
    firstNumber: '25',
    secondNumber: '5',
    operationName: 'divide',
  },
  {
    firstNumber: '25',
    secondNumber: '-5',
    operationName: 'divide',
  },
  {
    firstNumber: '-250',
    secondNumber: '-5',
    operationName: 'divide',
  },
  {
    firstNumber: '25',
    secondNumber: '2',
    operationName: 'divide',
  },
  {
    firstNumber: '-25',
    secondNumber: '2',
    operationName: 'divide',
  },
  {
    firstNumber: '-250',
    secondNumber: '-2',
    operationName: 'divide',
  },
  {
    firstNumber: '0.1',
    secondNumber: '1000000000',
    operationName: 'divide',
  },
  {
    firstNumber: '0.1',
    secondNumber: '-1000000000',
    operationName: 'divide',
  },
  {
    firstNumber: '-0.1',
    secondNumber: '-1000000000',
    operationName: 'divide',
  },
  {
    firstNumber: '0',
    secondNumber: '0',
    operationName: 'multiply',
  },
  {
    firstNumber: '-0',
    secondNumber: '0.0000000001',
    operationName: 'multiply',
  },
  {
    firstNumber: '-0.0000000001',
    secondNumber: '-0',
    operationName: 'multiply',
  },
  {
    firstNumber: '999999999999999',
    secondNumber: '0',
    operationName: 'multiply',
  },
  {
    firstNumber: '-999999999999999',
    secondNumber: '0',
    operationName: 'multiply',
  },
  {
    firstNumber: '-999999999999999',
    secondNumber: '-0',
    operationName: 'multiply',
  },
  {
    firstNumber: '25',
    secondNumber: '5',
    operationName: 'multiply',
  },
  {
    firstNumber: '25',
    secondNumber: '-5',
    operationName: 'multiply',
  },
  {
    firstNumber: '-250',
    secondNumber: '-5',
    operationName: 'multiply',
  },
  {
    firstNumber: '0.000001',
    secondNumber: '1000000000',
    operationName: 'multiply',
  },
  {
    firstNumber: '0.000001',
    secondNumber: '-1000000000',
    operationName: 'multiply',
  },
  {
    firstNumber: '-0.000001',
    secondNumber: '-1000000000',
    operationName: 'multiply',
  },
];
