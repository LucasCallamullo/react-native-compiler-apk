import React, { useState } from 'react';
import { View, Text } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import CalculatorScreen from './src/features/calculator/screens/CalculatorScreen';

import './global.css';

function MainScreen() {
  return (
    <View className="flex-1 justify-center items-center bg-black">
      <Text className="text-white text-2xl font-bold">¡Bienvenido a la App Secreta!</Text>
    </View>
  );
}

export default function App() {
  const [isUnlocked, setIsUnlocked] = useState(false);

  return (
    <SafeAreaProvider>
      <StatusBar style="light" />
      <SafeAreaView className="flex-1 bg-zinc-900">
        {isUnlocked ? (
          <MainScreen />
        ) : (
          <CalculatorScreen onUnlock={() => setIsUnlocked(true)} />
        )}
      </SafeAreaView>
    </SafeAreaProvider>
  );
}