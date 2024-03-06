export const mathOperation = [
  // divide
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
    firstNumber: '1',
    secondNumber:
      '999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999',
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
  // multiply
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
    firstNumber:
      '999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999',
    secondNumber: '0',
    operationName: 'multiply',
  },
  {
    firstNumber:
      '-999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999',
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
  // minus
  {
    firstNumber: '0',
    secondNumber: '0',
    operationName: 'minus',
  },
  {
    firstNumber: '-0',
    secondNumber: '0.0000000001',
    operationName: 'minus',
  },
  {
    firstNumber: '-0.0000000001',
    secondNumber: '0',
    operationName: 'minus',
  },
  {
    firstNumber:
      '999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999',
    secondNumber: '0',
    operationName: 'minus',
  },
  {
    firstNumber:
      '-999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999',
    secondNumber: '0',
    operationName: 'minus',
  },
  {
    firstNumber: '-9999',
    secondNumber: '0',
    operationName: 'minus',
  },
  {
    firstNumber: '25.233',
    secondNumber: '5.233',
    operationName: 'minus',
  },
  {
    firstNumber: '25.333',
    secondNumber: '5.333',
    operationName: 'minus',
  },
  {
    firstNumber: '-250',
    secondNumber: '5',
    operationName: 'minus',
  },
  {
    firstNumber: '0.001',
    secondNumber: '1000000',
    operationName: 'minus',
  },
  {
    firstNumber: '0.001',
    secondNumber: '100000',
    operationName: 'minus',
  },
  {
    firstNumber: '-0.001',
    secondNumber: '100000',
    operationName: 'minus',
  },
  // plus
  {
    firstNumber: '0',
    secondNumber: '0',
    operationName: 'plus',
  },
  {
    firstNumber: '-0',
    secondNumber: '0.0000000001',
    operationName: 'plus',
  },
  {
    firstNumber: '-0.0000000001',
    secondNumber: '-0',
    operationName: 'plus',
  },
  {
    firstNumber:
      '999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999',
    secondNumber: '0',
    operationName: 'plus',
  },
  {
    firstNumber:
      '-999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999',
    secondNumber: '0',
    operationName: 'plus',
  },
  {
    firstNumber: '-9999',
    secondNumber: '-0',
    operationName: 'plus',
  },
  {
    firstNumber: '25.567',
    secondNumber: '5.003',
    operationName: 'plus',
  },
  {
    firstNumber: '25',
    secondNumber: '-5',
    operationName: 'plus',
  },
  {
    firstNumber: '-250',
    secondNumber: '-5',
    operationName: 'plus',
  },
  {
    firstNumber: '0.001',
    secondNumber: '1000000',
    operationName: 'plus',
  },
  {
    firstNumber: '0.001',
    secondNumber: '-1000000',
    operationName: 'plus',
  },
  {
    firstNumber: '-0.001',
    secondNumber: '-10000',
    operationName: 'plus',
  },
  // X to the power of Y
  {
    firstNumber: '0',
    secondNumber: '0',
    operationName: 'X to the power of Y',
  },
  {
    firstNumber: '-0',
    secondNumber: '0.0000000001',
    operationName: 'X to the power of Y',
  },
  {
    firstNumber: '-0.0000000001',
    secondNumber: '0',
    operationName: 'X to the power of Y',
  },
  {
    firstNumber:
      '999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999',
    secondNumber: '0',
    operationName: 'X to the power of Y',
  },
  {
    firstNumber:
      '-999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999',
    secondNumber: '0',
    operationName: 'X to the power of Y',
  },
  {
    firstNumber: '-999999999999999',
    secondNumber: '0',
    operationName: 'X to the power of Y',
  },
  {
    firstNumber: '25',
    secondNumber: '5',
    operationName: 'X to the power of Y',
  },
  {
    firstNumber: '25',
    secondNumber: '-5',
    operationName: 'X to the power of Y',
  },
  {
    firstNumber: '-250',
    secondNumber: '-5',
    operationName: 'X to the power of Y',
  },
  {
    firstNumber: '0.000001',
    secondNumber: '1000000000',
    operationName: 'X to the power of Y',
  },
  {
    firstNumber: '0.000001',
    secondNumber: '-1000000000',
    operationName: 'X to the power of Y',
  },
  {
    firstNumber: '-0.000001',
    secondNumber: '-1000000000',
    operationName: 'X to the power of Y',
  },
  {
    firstNumber: '16',
    secondNumber: '0.5',
    operationName: 'X to the power of Y',
  },
  {
    firstNumber: '-2',
    secondNumber: '0.1',
    operationName: 'X to the power of Y',
    expectedResult: 'Error',
  },
  {
    firstNumber: '-2',
    secondNumber: '-0.01',
    operationName: 'X to the power of Y',
    expectedResult: 'Error',
  },
];
