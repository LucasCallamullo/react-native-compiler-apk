import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ThemeProvider, useAppTheme } from '@shared/context/ThemeProvider';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useRouter } from 'expo-router';

import '../global.css';
import { useColorScheme } from 'react-native';

export { useAppTheme } from '@shared/context/ThemeProvider';

function RootLayoutContent() {
  const router = useRouter();
  const { theme, getColor } = useAppTheme();
  const systemTheme = useColorScheme();
  
  const isDarkTheme = theme === 'theme-dark' || theme === 'theme-violet' || 
                      (theme === 'theme-light' ? false : systemTheme === 'dark');

  // Resolve dynamic colors for stack screens
  const bgColor = getColor('bg-bg');
  const fgColor = getColor('text-fg');

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
            backgroundColor: bgColor,
          },
          headerTintColor: fgColor,
          headerTitleStyle: {
            fontWeight: '600',
          },
          // Ensures stack screens respect the theme background
          contentStyle: {
            backgroundColor: bgColor,
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
          <RootLayoutContent />
        </ThemeProvider>
      </GestureHandlerRootView>
    </SafeAreaProvider>
  );
}