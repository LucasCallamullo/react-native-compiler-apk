import { View, TouchableOpacity } from 'react-native';
import { Redirect, Tabs, useRouter, useSegments } from 'expo-router';
import { Home, Folder, PlusCircle, User, Rabbit, Calculator, Siren } from 'lucide-react-native';
import { useAppTheme } from '@shared/context/ThemeProvider';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { DraggableLockButton } from '@shared/components/DraggableLockButton';

import { useAuth } from '@features/auth/context/AuthContext';
import { ActivityIndicator, Text } from 'react-native';
import { useEffect } from 'react';

export default function TabsLayout() {
  const router = useRouter();
  const segments = useSegments();
  const { getColor } = useAppTheme();
  const insets = useSafeAreaInsets();
  const { user, isLoading } = useAuth();

  // Dynamic colors from theme
  const cardColor = getColor('bg-card');
  const fgColor = getColor('text-fg');
  const borderColor = getColor('border-border');
  const activeColor = getColor('text-primary');
  const inactiveColor = getColor('text-fg-muted');

  // ============================================
  // PROTECTED ROUTES: List of tabs that require authentication
  // ============================================
  const PROTECTED_ROUTES = ['audit', 'records', 'emergency', 'profile'];

  // Get current tab from segments
  const currentTab = segments[segments.length - 1];

  // Check if current tab requires authentication
  const isProtectedRoute = PROTECTED_ROUTES.includes(currentTab);

  // ============================================
  // PROTECTION LOGIC: Redirect if needed
  // ============================================
  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-bg">
        <ActivityIndicator size="large" color={activeColor} />
        <Text className="text-fg mt-4">Cargando...</Text>
      </View>
    );
  }

  // If current tab is protected and user is not authenticated, redirect to login
  if (isProtectedRoute && !user) {
    return <Redirect href="/login" />;
  }

  /**
   * Locks the app by replacing the current view with the calculator facade
   */
  const handleLockApp = (): void => {
    router.replace('/calculator');
  };

  // Dynamic positioning for the floating button above the TabBar
  const tabBarHeight = 64 + insets.bottom;
  const floatingButtonBottom = tabBarHeight + 16;

  return (
    <View className="flex-1 bg-bg">
      <Tabs
        screenOptions={{
          headerShown: false,
          headerStyle: {
            backgroundColor: cardColor,
          },
          headerTintColor: fgColor,
          headerTitleStyle: {
            fontWeight: '600',
          },
          tabBarStyle: {
            backgroundColor: cardColor,
            borderTopColor: borderColor,
            height: tabBarHeight,
            paddingBottom: insets.bottom > 0 ? insets.bottom : 16,
            paddingTop: 8,
          },
          tabBarActiveTintColor: activeColor,
          tabBarInactiveTintColor: inactiveColor,
          tabBarLabelStyle: {
            fontSize: 11,
            fontWeight: '500',
          },
        }}
      >
        {/* ✅ PUBLIC TAB - Always accessible */}
        <Tabs.Screen
          name="home"
          options={{
            title: 'Inicio',
            tabBarIcon: ({ color, size }) => <Home size={size} color={color} />,
          }}
        />

        {/* 🔒 PROTECTED TABS - Require authentication */}
        <Tabs.Screen
          name="audit"
          options={{
            title: 'Historial',
            tabBarIcon: ({ color, size }) => <Folder size={size} color={color} />,
          }}
        />

        <Tabs.Screen
          name="records"
          options={{
            title: 'Record',
            tabBarIcon: ({ color, size }) => <PlusCircle size={size} color={color} />,
          }}
        />

        <Tabs.Screen
          name="emergency"
          options={{
            title: 'Emergencia',
            tabBarIcon: ({ color, size }) => <Siren size={size} color={color} />,
          }}
        />

        <Tabs.Screen
          name="profile"
          options={{
            title: 'Perfil',
            tabBarIcon: ({ color, size }) => <Rabbit size={size} color={color} />,
          }}
        />
      </Tabs>

      {/* Floating Lock Button */}
      <DraggableLockButton
        onPress={handleLockApp}
        iconColor={activeColor}
        initialBottom={floatingButtonBottom}
      />
    </View>
  );
}