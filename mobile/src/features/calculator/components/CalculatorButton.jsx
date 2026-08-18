import React from 'react';
import { TouchableOpacity, Text, View } from 'react-native';

const CalculatorButton = ({ label, onPress, type = 'number', spanTwo = false }) => {
  const getButtonStyles = () => {
    switch (type) {
      case 'operator':
      case 'equals':
        return 'bg-amber-500 active:bg-amber-400';
      case 'clear':
        return 'bg-zinc-400 active:bg-zinc-300';
      default:
        return 'bg-zinc-800 active:bg-zinc-700';
    }
  };

  const getTextStyles = () => {
    return type === 'clear' ? 'text-black' : 'text-white';
  };

  return (
    <View className={spanTwo ? 'w-1/2 p-1.5' : 'w-1/4 p-1.5'}>
      <TouchableOpacity
        className={`w-full ${
          spanTwo ? 'h-20 px-8 items-start justify-center' : 'aspect-square justify-center items-center'
        } rounded-full ${getButtonStyles()}`}
        onPress={onPress}
        activeOpacity={0.7}
      >
        <Text className={`text-3xl font-medium ${getTextStyles()}`}>{label}</Text>
      </TouchableOpacity>
    </View>
  );
};

export default CalculatorButton;