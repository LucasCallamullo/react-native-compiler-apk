import { useState } from 'react';
import { calculate, Operator } from '../utils/mathOperations';

// ============================================
// TYPES & INTERFACES
// ============================================

/**
 * Configuration options for the useCalculator hook.
 */
export interface UseCalculatorOptions {
  /**
   * Callback function executed when the secret code is detected in the display.
   */
  onSecretCode?: () => void;
  /**
   * The secret PIN code sequence to trigger the facade unlock.
   * @default '911'
   */
  secretCode?: string;
}

/**
 * Return type interface for the useCalculator custom hook.
 */
export interface UseCalculatorReturn {
  display: string;
  expression: string;
  inputDigit: (digit: number | string) => void;
  inputDecimal: () => void;
  clear: () => void;
  handleOperator: (op: Operator) => void;
  handleEquals: () => void;
  handlePercentage: () => void;
  toggleSign: () => void;
}

// ============================================
// CUSTOM HOOK
// ============================================

/**
 * Custom hook to manage standard calculator state and arithmetic operations,
 * with built-in hidden passcode trigger capabilities for facade apps.
 *
 * @param options - Hook configuration containing callback and secret code.
 * @returns State properties and handlers for calculator UI rendering.
 */
export const useCalculator = ({
  onSecretCode,
  secretCode = '911',
}: UseCalculatorOptions = {}): UseCalculatorReturn => {
  const [display, setDisplay] = useState<string>('0');
  const [expression, setExpression] = useState<string>('');
  const [previousValue, setPreviousValue] = useState<number | string | null>(null);
  const [operator, setOperator] = useState<Operator | null>(null);
  const [waitingForNewValue, setWaitingForNewValue] = useState<boolean>(false);

  /**
   * Strips non-digit characters and validates against the secret passcode.
   */
  const checkSecretCode = (valueStr: string): void => {
    const cleanDigits = valueStr.replace(/\D/g, '');
    if (cleanDigits === secretCode && onSecretCode) {
      onSecretCode();
    }
  };

  /**
   * Handles digit entries (0-9).
   */
  const inputDigit = (digit: number | string): void => {
    let nextDisplay = '';

    if (waitingForNewValue) {
      nextDisplay = String(digit);
      setWaitingForNewValue(false);
    } else {
      nextDisplay = display === '0' ? String(digit) : display + String(digit);
    }

    setDisplay(nextDisplay);
    checkSecretCode(nextDisplay);
  };

  /**
   * Appends decimal point to current display value.
   */
  const inputDecimal = (): void => {
    let nextDisplay = display;
    if (waitingForNewValue) {
      nextDisplay = '0.';
      setWaitingForNewValue(false);
    } else if (!display.includes('.')) {
      nextDisplay = display + '.';
    }
    setDisplay(nextDisplay);
    checkSecretCode(nextDisplay);
  };

  /**
   * Resets calculator memory and display states to default.
   */
  const clear = (): void => {
    setDisplay('0');
    setExpression('');
    setPreviousValue(null);
    setOperator(null);
    setWaitingForNewValue(false);
  };

  /**
   * Evaluates pending operation and updates operator state.
   */
  const handleOperator = (op: Operator): void => {
    const currentValue = parseFloat(display);

    setExpression(`${currentValue} ${op}`);

    if (operator && !waitingForNewValue && previousValue !== null) {
      const numericPrev = typeof previousValue === 'string' ? parseFloat(previousValue) : previousValue;
      const result = calculate(numericPrev, operator, currentValue);
      
      setDisplay(String(result));
      setPreviousValue(result);
      setExpression(`${result} ${op}`);
    } else {
      setPreviousValue(currentValue);
    }

    setOperator(op);
    setWaitingForNewValue(true);
  };

  /**
   * Computes final arithmetic result on equals action.
   */
  const handleEquals = (): void => {
    const currentValue = parseFloat(display);
    if (operator && previousValue !== null) {
      const numericPrev = typeof previousValue === 'string' ? parseFloat(previousValue) : previousValue;
      const result = calculate(numericPrev, operator, currentValue);

      setExpression(`${previousValue} ${operator} ${currentValue} =`);
      setDisplay(String(result));
      setPreviousValue(null);
      setOperator(null);
      setWaitingForNewValue(true);
    }
  };

  /**
   * Converts current display number to percentage representation.
   */
  const handlePercentage = (): void => {
    const currentValue = parseFloat(display);
    const result = currentValue / 100;
    setDisplay(String(result));
  };

  /**
   * Toggles positive/negative numerical sign.
   */
  const toggleSign = (): void => {
    const currentValue = parseFloat(display);
    const nextDisplay = String(-currentValue);
    setDisplay(nextDisplay);
    checkSecretCode(nextDisplay);
  };

  return {
    display,
    expression,
    inputDigit,
    inputDecimal,
    clear,
    handleOperator,
    handleEquals,
    handlePercentage,
    toggleSign,
  };
};