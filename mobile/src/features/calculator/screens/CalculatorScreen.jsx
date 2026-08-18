import React from 'react';
import { View } from 'react-native';
import Display from '../components/Display';
import ExpressionDisplay from '../components/ExpressionDisplay';
import Keypad from '../components/Keypad';
import { useCalculator } from '../hooks/useCalculator';

const CalculatorScreen = ({ onUnlock }) => {
  const {
    display,
    expression,
    inputDigit,
    inputDecimal,
    clear,
    handleOperator,
    handleEquals,
    handlePercentage,
    toggleSign,
  } = useCalculator({
    secretCode: '911',
    onSecretCode: onUnlock,
  });

  const handleKeyPress = (button) => {
    switch (button.action) {
      case 'digit':
        inputDigit(button.label);
        break;
      case 'decimal':
        inputDecimal();
        break;
      case 'clear':
        clear();
        break;
      case 'operator':
        handleOperator(button.label);
        break;
      case 'equals':
        handleEquals();
        break;
      case 'percentage':
        handlePercentage();
        break;
      case 'toggleSign':
        toggleSign();
        break;
      default:
        break;
    }
  };

  return (
    <View className="flex-1 justify-end bg-zinc-900">
      <ExpressionDisplay expression={expression} />
      <Display value={display} />
      <Keypad onPress={handleKeyPress} />
    </View>
  );
};

export default CalculatorScreen;