import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Context
import { AuthProvider } from './src/features/auth/context/AuthContext';

// Screens
import CalculatorScreen from './src/features/calculator/screens/CalculatorScreen';
import HomeTabs from './src/features/home/navigation/HomeTabs';
import LoginScreen from './src/features/auth/screens/LoginScreen';
import RegisterScreen from './src/features/auth/screens/RegisterScreen';

import './global.css';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <SafeAreaProvider>
      <StatusBar style="light" />
      <SafeAreaView className="flex-1 bg-zinc-900">
        <AuthProvider>
          <NavigationContainer>
            <Stack.Navigator 
              screenOptions={{ 
                headerShown: false,
                animation: 'fade',
                contentStyle: { backgroundColor: '#09090b' }
              }}
            >
              {/* Pantalla 1: Calculadora Fachada */}
              <Stack.Screen name="Calculator" component={CalculatorScreen} />
              
              {/* Pantalla 2: Workspace Principal con Bottom Tabs */}
              <Stack.Screen name="HomeWorkspace" component={HomeTabs} />

              {/* Pantallas de Autenticación */}
              <Stack.Screen 
                name="Login" 
                component={LoginScreen} 
                options={{ animation: 'slide_from_bottom' }} 
              />
              <Stack.Screen 
                name="Register" 
                component={RegisterScreen} 
                options={{ animation: 'slide_from_right' }} 
              />
            </Stack.Navigator>
          </NavigationContainer>
        </AuthProvider>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}