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
    <View className="h-25 justify-center items-end px-6 bg-surface-2">
      <Text 
        className="text-content-muted text-4xl font-normal" 
        numberOfLines={1}
        adjustsFontSizeToFit
      >
        {expression}
      </Text>
    </View>
  );
}