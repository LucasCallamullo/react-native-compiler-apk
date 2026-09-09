import React from 'react';
import { View } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import Display from '@features/calculator/components/Display';
import ExpressionDisplay from '@features/calculator/components/ExpressionDisplay';
import Keypad, { CalculatorButtonData } from '@features/calculator/components/Keypad';
import { useCalculator } from '@features/calculator/hooks/useCalculator';
import { Operator } from '@features/calculator/utils/mathOperations';

export default function CalculatorScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  /**
   * Action triggered upon entering the secret passcode ('911').
   * Replaces the current stack route to prevent returning via back gestures.
   */
  const handleUnlock = (): void => {
    router.replace('/(tabs)/home');
  };

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
    // ! see this for changes on code to enter
    secretCode: '911',
    onSecretCode: handleUnlock,
  });

  /**
   * Handles user interactions from the Keypad component.
   */
  const handleKeyPress = (button: CalculatorButtonData): void => {
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
        handleOperator(button.label as Operator);
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
    <View 
      className="flex-1 justify-end bg-bg"
      style={{ 
        paddingTop: insets.top + 16, 
        paddingBottom: insets.bottom > 0 ? insets.bottom + 32 : 48,
      }}
    >
      <ExpressionDisplay expression={expression} />
      <Display value={display} />
      <Keypad onPress={handleKeyPress} />
    </View>
  );
}
