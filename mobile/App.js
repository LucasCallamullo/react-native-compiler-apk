import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import CalculatorScreen from './src/features/calculator/screens/CalculatorScreen';
import HomeScreen from './src/features/home/screens/HomeScreen';

import './global.css';

export default function App() {
  const [isUnlocked, setIsUnlocked] = useState(false);

  return (
    <SafeAreaProvider>
      <StatusBar style="light" />
      <SafeAreaView className="flex-1 bg-zinc-900">
        {isUnlocked ? (
          <HomeScreen onLock={() => setIsUnlocked(false)} />
        ) : (
          <CalculatorScreen onUnlock={() => setIsUnlocked(true)} />
        )}
      </SafeAreaView>
    </SafeAreaProvider>
  );
}