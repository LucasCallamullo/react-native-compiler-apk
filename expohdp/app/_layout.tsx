import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';
import { ThemeProvider, useAppTheme } from '@shared/context/ThemeProvider';
import '../global.css';
import { useColorScheme } from 'react-native';

export { useAppTheme } from '@shared/context/ThemeProvider';

function RootLayoutContent() {
  const { theme } = useAppTheme();
  const systemTheme = useColorScheme();
  
  const isDarkTheme = theme === 'theme-dark' || theme === 'theme-violet' || 
                      (theme === 'theme-light' ? false : systemTheme === 'dark');
  
  return (
    <>
      <StatusBar style={isDarkTheme ? 'light' : 'dark'} />
      <>
        <Stack >
          {/* Tabs como pantalla principal */}
          <Stack.Screen 
            name="(tabs)" 
            options={{ 
              headerShown: false, // Ocultar header para tabs
            }} 
          />
          
          {/* Otras pantallas que no están en tabs */}
          <Stack.Screen 
            name="profile" 
            options={{ 
              title: 'Perfil',
              headerStyle: { backgroundColor: 'var(--color-bg)' },
              headerTintColor: 'var(--color-fg)',
            }} 
          />
          <Stack.Screen 
            name="settings" 
            options={{ 
              title: 'Configuración',
              headerStyle: { backgroundColor: 'var(--color-bg)' },
              headerTintColor: 'var(--color-fg)',
            }} 
          />
        </Stack>
      </>
    </>
  );
}

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <RootLayoutContent />
      </ThemeProvider>
    </SafeAreaProvider>
  );
}