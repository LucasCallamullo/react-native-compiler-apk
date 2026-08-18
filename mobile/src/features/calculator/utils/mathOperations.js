export const add = (a, b) => a + b;
export const subtract = (a, b) => a - b;
export const multiply = (a, b) => a * b;
export const divide = (a, b) => (b === 0 ? 'Error' : a / b);

export const calculate = (num1, operator, num2) => {
  switch (operator) {
    case '+':
      return add(num1, num2);
    case '-':
      return subtract(num1, num2);
    case '×':
      return multiply(num1, num2);
    case '÷':
      return divide(num1, num2);
    default:
      return num2;
  }
};