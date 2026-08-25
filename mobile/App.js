import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import CalculatorScreen from './src/features/calculator/screens/CalculatorScreen';
import HomeTabs from './src/features/home/navigation/HomeTabs';

import './global.css';

const Stack = createNativeStackNavigator();

export default function App() {

  return (
    <SafeAreaProvider>
      <StatusBar style="light" />
      <SafeAreaView className="flex-1 bg-zinc-900">
        <NavigationContainer>
          <Stack.Navigator 
            screenOptions={{ 
              headerShown: false,
              animation: 'fade', // Transición suave entre la calculadora y el workspace
              contentStyle: { backgroundColor: '#09090b' } // bg-zinc-950
            }}
          >
            {/* Pantalla 1: Calculadora Fachada */}
            <Stack.Screen name="Calculator" component={CalculatorScreen} />
            
            {/* Pantalla 2: Workspace con Bottom Tabs */}
            <Stack.Screen name="HomeWorkspace" component={HomeTabs} />
          </Stack.Navigator>
        </NavigationContainer>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
