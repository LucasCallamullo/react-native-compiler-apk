import React from 'react';
import { View, Text } from 'react-native';

// ============================================
// TYPES & INTERFACES
// ============================================

export interface DisplayProps {
  /**
   * The current main numeric value or operation result to display.
   */
  value: string;
}

// ============================================
// COMPONENT
// ============================================

export default function Display({ value }: DisplayProps) {
  return (
    <View className="flex-1 justify-end items-end px-6 pb-4 bg-card">
      <Text 
        className="text-fg text-7xl font-light" 
        numberOfLines={1} 
        adjustsFontSizeToFit
      >
        {value}
      </Text>
    </View>
  );
}