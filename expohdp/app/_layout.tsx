import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ThemeProvider, useAppTheme } from '@shared/context/ThemeProvider';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import '../global.css';
import { useColorScheme } from 'react-native';
import { AuthProvider } from '@features/auth/context/AuthContext';

export { useAppTheme } from '@shared/context/ThemeProvider';

function RootLayoutContent() {
  const { theme, getVar } = useAppTheme();
  const systemTheme = useColorScheme();
  
  const isDarkTheme =
    theme === 'theme-dark' ||
    theme === 'theme-pink' ||
    theme === 'theme-blue';

  return (
    <>
      {/* Status bar background color for Android */}
      <StatusBar 
        style={isDarkTheme ? 'light' : 'dark'} 
      />
      
      <Stack
        initialRouteName="calculator"
        screenOptions={{
          headerStyle: {
            backgroundColor: getVar('--color-surface-0'),
          },
          headerTintColor: getVar('--color-content'),
          headerTitleStyle: {
            fontWeight: '600',
          },
          contentStyle: {
            backgroundColor: getVar('--color-surface-0'),
          },
        }}
      >
        {/* Initial Screen: Calculator Lock Screen */}
        <Stack.Screen 
          name="calculator" 
          options={{ 
            headerShown: false, 
          }} 
        />

        <Stack.Screen 
          name="login" 
          options={{ 
            headerShown: false, 
          }} 
        />

        <Stack.Screen 
          name="register" 
          options={{ 
            headerShown: false, 
          }} 
        />

        {/* Main Tabs Group */}
        <Stack.Screen 
          name="(tabs)" 
          options={{ 
            headerShown: false, 
          }} 
        />
      </Stack>
    </>
  );
}

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <GestureHandlerRootView style={{ flex: 1 }}> 
        <ThemeProvider>
          <AuthProvider> 
            <RootLayoutContent />
          </AuthProvider>
        </ThemeProvider>
      </GestureHandlerRootView>
    </SafeAreaProvider>
  );
}