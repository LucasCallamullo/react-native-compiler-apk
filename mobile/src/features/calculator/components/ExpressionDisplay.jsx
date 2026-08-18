// ExpressionDisplay.jsx
import React from 'react';
import { View, Text } from 'react-native';

const ExpressionDisplay = ({ expression }) => {
  return (
    <View className="h-12 justify-end items-end px-6 bg-zinc-900">
      <Text className="text-zinc-500 text-2xl font-normal" numberOfLines={1}>
        {expression}
      </Text>
    </View>
  );
};

export default ExpressionDisplay;