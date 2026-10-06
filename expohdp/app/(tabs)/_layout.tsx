import { View } from 'react-native';
import { Redirect, Tabs, useRouter, usePathname } from 'expo-router';
import { Home, Folder, PlusCircle, Rabbit, Siren } from 'lucide-react-native';
import { useAppTheme } from '@shared/context/ThemeProvider';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { DraggableLockButton } from '@shared/components/DraggableLockButton';

import { useAuth } from '@features/auth/context/AuthContext';
import { ActivityIndicator, Text } from 'react-native';

const PROTECTED_ROUTES = ['audit', 'records', 'emergency', 'profile'] as const;

export default function TabsLayout() {
  const router = useRouter();
  const pathname = usePathname();
  const { getVar } = useAppTheme();
  const insets = useSafeAreaInsets();
  const { user, isLoading } = useAuth();

  // Colores resueltos para props nativas (tab bar, header, íconos)
  const surfaceColor = getVar('--color-surface-1');   // fondo de la tab bar
  const contentColor = getVar('--color-content');     // texto activo
  const mutedColor = getVar('--color-content-muted'); // texto inactivo
  const borderColor = getVar('--color-border');
  const activeColor = getVar('--color-main-500');     // tab activa

  // ============================================
  // LAYER 2: Declarative guard
  // ============================================
  const currentTab = pathname.split('/').filter(Boolean).pop() ?? '';
  const isProtectedRoute = (PROTECTED_ROUTES as readonly string[]).includes(currentTab);

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-surface-0">
        <ActivityIndicator size="large" color={activeColor} />
        <Text className="text-content mt-4">Cargando...</Text>
      </View>
    );
  }

  if (!user && isProtectedRoute) {
    return <Redirect href="/login" />;
  }

  // ============================================
  // LAYER 1: Imperative tabPress interceptor
  // ============================================
  const requireAuth = () => ({
    tabPress: (e: any) => {
      if (!user) {
        e.preventDefault();
        router.replace('/login');
      }
    },
  });

  const handleLockApp = (): void => {
    router.replace('/calculator');
  };

  const tabBarHeight = 64 + insets.bottom;
  const floatingButtonBottom = tabBarHeight + 16;

  return (
    <View className="flex-1 bg-surface-0">
      <Tabs
        screenOptions={{
          headerShown: false,
          headerStyle: { backgroundColor: surfaceColor },
          headerTintColor: contentColor,
          headerTitleStyle: { fontWeight: '600' },
          tabBarStyle: {
            backgroundColor: surfaceColor,
            borderTopColor: borderColor,
            height: tabBarHeight,
            paddingBottom: insets.bottom > 0 ? insets.bottom : 16,
            paddingTop: 8,
          },
          tabBarActiveTintColor: activeColor,
          tabBarInactiveTintColor: mutedColor,
          tabBarLabelStyle: { fontSize: 11, fontWeight: '500' },
        }}
      >
        <Tabs.Screen
          name="home"
          options={{
            title: 'Inicio',
            tabBarIcon: ({ color, size }) => <Home size={size} color={color} />,
          }}
        />

        <Tabs.Screen
          name="audit"
          options={{
            title: 'Historial',
            tabBarIcon: ({ color, size }) => <Folder size={size} color={color} />,
          }}
          listeners={requireAuth()}
        />

        <Tabs.Screen
          name="records"
          options={{
            title: 'Registros',
            tabBarIcon: ({ color, size }) => <PlusCircle size={size} color={color} />,
          }}
          listeners={requireAuth()}
        />

        <Tabs.Screen
          name="emergency"
          options={{
            title: 'Emergencia',
            tabBarIcon: ({ color, size }) => <Siren size={size} color={color} />,
          }}
          listeners={requireAuth()}
        />

        <Tabs.Screen
          name="profile"
          options={{
            title: 'Perfil',
            tabBarIcon: ({ color, size }) => <Rabbit size={size} color={color} />,
          }}
          listeners={requireAuth()}
        />
      </Tabs>

      <DraggableLockButton
        onPress={handleLockApp}
        iconColor={activeColor}
        initialBottom={floatingButtonBottom}
      />
    </View>
  );
}