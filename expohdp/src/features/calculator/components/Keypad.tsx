import React from 'react';
import { View } from 'react-native';
import CalculatorButton, { ButtonType } from './CalculatorButton';
import { Operator } from '../utils/mathOperations';

// ============================================
// TYPES & INTERFACES
// ============================================

export type ButtonAction =
  | 'digit'
  | 'decimal'
  | 'clear'
  | 'operator'
  | 'equals'
  | 'percentage'
  | 'toggleSign';

export interface CalculatorButtonData {
  label: string;
  type: ButtonType;
  action: ButtonAction;
  spanTwo?: boolean;
}

interface KeypadProps {
  /**
   * Callback fired when any calculator button is pressed.
   * Receives the complete button configuration object.
   */
  onPress: (button: CalculatorButtonData) => void;
}

// ============================================
// BUTTONS CONFIGURATION
// ============================================

const BUTTONS: CalculatorButtonData[] = [
  { label: 'C', type: 'clear', action: 'clear' },
  { label: '±', type: 'clear', action: 'toggleSign' },
  { label: '%', type: 'clear', action: 'percentage' },
  { label: '÷', type: 'operator', action: 'operator' },
  { label: '7', type: 'number', action: 'digit' },
  { label: '8', type: 'number', action: 'digit' },
  { label: '9', type: 'number', action: 'digit' },
  { label: '×', type: 'operator', action: 'operator' },
  { label: '4', type: 'number', action: 'digit' },
  { label: '5', type: 'number', action: 'digit' },
  { label: '6', type: 'number', action: 'digit' },
  { label: '-', type: 'operator', action: 'operator' },
  { label: '1', type: 'number', action: 'digit' },
  { label: '2', type: 'number', action: 'digit' },
  { label: '3', type: 'number', action: 'digit' },
  { label: '+', type: 'operator', action: 'operator' },
  { label: '0', type: 'number', action: 'digit', spanTwo: true },
  { label: '.', type: 'number', action: 'decimal' },
  { label: '=', type: 'equals', action: 'equals' },
];

// ============================================
// COMPONENT
// ============================================

export default function Keypad({ onPress }: KeypadProps) {
  return (
    <View className="flex-row flex-wrap px-2 pb-6 bg-card border-t border-border">
      {BUTTONS.map((button) => (
        <CalculatorButton
          key={button.label}
          label={button.label}
          type={button.type}
          spanTwo={button.spanTwo}
          onPress={() => onPress(button)}
        />
      ))}
    </View>
  );
}