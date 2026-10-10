import React, { useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import Display from '@features/calculator/components/Display';
import ExpressionDisplay from '@features/calculator/components/ExpressionDisplay';
import Keypad, { CalculatorButtonData } from '@features/calculator/components/Keypad';
import { useCalculator } from '@features/calculator/hooks/useCalculator';
import { Operator } from '@features/calculator/utils/mathOperations';

import { getLockCode } from '@features/auth/config/lockConfig';

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

  const [secretCode, setSecretCode] = useState<string | null>(null);

  // Cargar el código una sola vez al montar
  useEffect(() => {
    let mounted = true;
    getLockCode().then((c) => mounted && setSecretCode(c));
    return () => {
      mounted = false;
    };
  }, []);

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
    // No llamamos al hook hasta tener el código (los hooks deben
    // ejecutarse siempre en el mismo orden, así que esto va ANTES)
    secretCode: secretCode ?? '',    // string vacío = nunca matchea
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

  // Mientras carga, mostramos un loader minimalista
  if (secretCode === null) {
    return (
      <View className="flex-1 items-center justify-center bg-surface-0">
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <View 
      className="flex-1 justify-end bg-surface-0"
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
