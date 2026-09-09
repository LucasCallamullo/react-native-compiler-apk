// ============================================
// TYPES
// ============================================
export type Operator = '+' | '-' | '×' | '÷';

// ============================================
// HELPER FUNCTIONS
// ============================================
export const add = (a: number, b: number): number => a + b;

export const subtract = (a: number, b: number): number => a - b;

export const multiply = (a: number, b: number): number => a * b;

export const divide = (a: number, b: number): string | number => 
  b === 0 ? 'Error' : a / b;

// ============================================
// MAIN CALCULATE FUNCTION
// ============================================
export const calculate = (
  num1: number, 
  operator: Operator | string, 
  num2: number
): number | string => {
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