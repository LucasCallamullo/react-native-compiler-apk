// Display.jsx
import React from 'react';
import { View, Text } from 'react-native';

const Display = ({ value }) => {
  return (
    <View className="flex-1 justify-end items-end px-6 pb-4 bg-zinc-900">
      <Text className="text-white text-7xl font-light" numberOfLines={1} adjustsFontSizeToFit>
        {value}
      </Text>
    </View>
  );
};

export default Display;