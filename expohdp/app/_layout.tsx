import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ThemeProvider, useAppTheme } from '@shared/context/ThemeProvider';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

// app/_layout.tsx
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useEffect, useState } from 'react';

import { initDevConfig } from '@shared/config/devConfig';

import '../global.css';
import { useColorScheme } from 'react-native';
import { AuthProvider } from '@features/auth/context/AuthContext';

export { useAppTheme } from '@shared/context/ThemeProvider';





function RootLayoutContent() {
  const { theme, getVar } = useAppTheme();
  const systemTheme = useColorScheme();
  
  const [ready, setReady] = useState(false);

  useEffect(() => {
    initDevConfig().finally(() => setReady(true));
  }, []); 

  // Note: dejar comentado porque por algun motivo rompe el flujo de screens sino al cambiar
  //? otros datos en otra screen. #yoMeEntiendo
  // if (!ready) return null;
  

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

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60,      // 1 min: data se considera fresca
      retry: 1,                  // 1 reintento en caso de error
      refetchOnWindowFocus: false, // no refetch al volver del background
    },
  },
});

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <GestureHandlerRootView style={{ flex: 1 }}> 

        <QueryClientProvider client={queryClient}>

          <ThemeProvider>
            <AuthProvider> 
              <RootLayoutContent />
            </AuthProvider>
          </ThemeProvider>

        </QueryClientProvider>

      </GestureHandlerRootView>
    </SafeAreaProvider>
  );
}