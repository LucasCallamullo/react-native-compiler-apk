import React from 'react';
import { View } from 'react-native';
import Display from '../components/Display';
import ExpressionDisplay from '../components/ExpressionDisplay';
import Keypad from '../components/Keypad';
import { useCalculator } from '../hooks/useCalculator';

const CalculatorScreen = ({ navigation }) => {
  
  const handleUnlock = () => {
    // Redirige al workspace de pestañas y borra la calculadora del stack
    // para que no vuelva atrás si el usuario presiona el botón físico de Android
    navigation.reset({
      index: 0,
      routes: [{ name: 'HomeWorkspace' }],
    });
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
    secretCode: '911',
    onSecretCode: handleUnlock,
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
    <View className="flex-1 justify-end bg-zinc-950">
      <ExpressionDisplay expression={expression} />
      <Display value={display} />
      <Keypad onPress={handleKeyPress} />
    </View>
  );
};

export default CalculatorScreen;