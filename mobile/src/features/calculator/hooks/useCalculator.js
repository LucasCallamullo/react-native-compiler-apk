import { useState } from 'react';
import { calculate } from '../utils/mathOperations';

export const useCalculator = ({ onSecretCode, secretCode = '911' } = {}) => {
  const [display, setDisplay] = useState('0');
  const [expression, setExpression] = useState('');
  const [previousValue, setPreviousValue] = useState(null);
  const [operator, setOperator] = useState(null);
  const [waitingForNewValue, setWaitingForNewValue] = useState(false);

  const checkSecretCode = (valueStr) => {
    // Extrae solo los dígitos para que funcione con "911", "-911", "0.911", etc.
    const cleanDigits = valueStr.replace(/\D/g, '');
    if (cleanDigits === secretCode && onSecretCode) {
      onSecretCode();
    }
  };

  const inputDigit = (digit) => {
    let nextDisplay = '';

    if (waitingForNewValue) {
      nextDisplay = String(digit);
      setWaitingForNewValue(false);
    } else {
      nextDisplay = display === '0' ? String(digit) : display + digit;
    }

    setDisplay(nextDisplay);
    checkSecretCode(nextDisplay);
  };

  const inputDecimal = () => {
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

  const clear = () => {
    setDisplay('0');
    setExpression('');
    setPreviousValue(null);
    setOperator(null);
    setWaitingForNewValue(false);
  };

  const handleOperator = (op) => {
    const currentValue = parseFloat(display);

    setExpression(`${currentValue} ${op}`);

    if (operator && !waitingForNewValue) {
      const result = calculate(previousValue, operator, currentValue);
      setDisplay(String(result));
      setPreviousValue(result);
      setExpression(`${result} ${op}`);
    } else {
      setPreviousValue(currentValue);
    }
    setOperator(op);
    setWaitingForNewValue(true);
  };

  const handleEquals = () => {
    const currentValue = parseFloat(display);
    if (operator && previousValue !== null) {
      const result = calculate(previousValue, operator, currentValue);
      setExpression(`${previousValue} ${operator} ${currentValue} =`);
      setDisplay(String(result));
      setPreviousValue(null);
      setOperator(null);
      setWaitingForNewValue(true);
    }
  };

  const handlePercentage = () => {
    const currentValue = parseFloat(display);
    const result = currentValue / 100;
    setDisplay(String(result));
  };

  const toggleSign = () => {
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