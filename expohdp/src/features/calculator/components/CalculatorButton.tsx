import React from 'react';
import { TouchableOpacity, Text, View } from 'react-native';

// ============================================
// TYPES & INTERFACES
// ============================================

export type ButtonType = 'number' | 'operator' | 'clear' | 'equals';

export interface CalculatorButtonProps {
  /**
   * Text/Symbol rendered inside the button (e.g., '7', '+', 'C').
   */
  label: string;
  /**
   * Callback fired when the button is pressed.
   */
  onPress: () => void;
  /**
   * Button category type that determines theme styling.
   * @default 'number'
   */
  type?: ButtonType;
  /**
   * If true, expands the button width to occupy two grid columns (used for '0').
   * @default false
   */
  spanTwo?: boolean;
}

// ============================================
// COMPONENT
// ============================================

export default function CalculatorButton({
  label,
  onPress,
  type = 'number',
  spanTwo = false,
}: CalculatorButtonProps) {
  /**
   * Resolves background colors and active press states based on button type
   */
  const getButtonStyles = (): string => {
    switch (type) {
      case 'equals':
        return 'bg-primary active:opacity-80';
      case 'operator':
        return 'bg-secondary active:opacity-80';
      case 'clear':
        return 'bg-accent border border-border active:opacity-70';
      case 'number':
      default:
        return 'bg-popover active:bg-accent';
    }
  };

  /**
   * Resolves text colors based on button type
   */
  const getTextStyles = (): string => {
    switch (type) {
      case 'equals':
        return 'text-primary-fg font-bold';
      case 'operator':
        return 'text-secondary-fg font-semibold';
      case 'clear':
        return 'text-fg-muted font-medium';
      case 'number':
      default:
        return 'text-fg font-medium';
    }
  };

  return (
    <View className={spanTwo ? 'w-1/2 p-1.5' : 'w-1/4 p-1.5'}>
      <TouchableOpacity
        className={`w-full ${
          spanTwo
            ? 'h-20 px-8 items-start justify-center'
            : 'aspect-square justify-center items-center'
        } rounded-full ${getButtonStyles()}`}
        onPress={onPress}
        activeOpacity={0.7}
      >
        <Text className={`text-3xl ${getTextStyles()}`}>{label}</Text>
      </TouchableOpacity>
    </View>
  );
}