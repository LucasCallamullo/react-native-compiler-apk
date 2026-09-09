import React from 'react';
import { View, Text } from 'react-native';

// ============================================
// TYPES & INTERFACES
// ============================================

export interface ExpressionDisplayProps {
  /**
   * The active mathematical expression or formula string to render.
   * e.g., "12 + 5 ="
   */
  expression: string;
}

// ============================================
// COMPONENT
// ============================================

export default function ExpressionDisplay({ expression }: ExpressionDisplayProps) {
  return (
    <View className="h-12 justify-end items-end px-6 bg-card">
      <Text 
        className="text-fg-muted text-2xl font-normal" 
        numberOfLines={1}
        adjustsFontSizeToFit
      >
        {expression}
      </Text>
    </View>
  );
}