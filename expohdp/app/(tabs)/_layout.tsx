import { View, ActivityIndicator, Text } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Redirect, Tabs, useRouter, usePathname } from 'expo-router';
import { Home, Folder, PlusCircle, Rabbit, Siren } from 'lucide-react-native';

// My imports
import { useAuth } from '@features/auth/context/AuthContext';
import { useAppTheme } from '@shared/context/ThemeProvider';

const PROTECTED_ROUTES = ['audit', 'records', 'emergency', 'profile'] as const;

export default function TabsLayout() {
  const router = useRouter();
  const pathname = usePathname();
  const { getVar } = useAppTheme();
  const insets = useSafeAreaInsets();
  const { user, isLoading } = useAuth();

  // Colores resueltos para props nativas (tab bar, header, íconos)
  const activeColor = getVar('--color-main-500');     // ACTIVE TAB

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

  const tabBarHeight = 64 + insets.bottom;

  // THIS FORM IS TO DO IT A PERSONAL NAVBAR
  return (
    <View className="flex-1 bg-surface-0">

      <Tabs
        screenOptions={{
          headerShown: false,
          sceneStyle: { backgroundColor: getVar('--color-surface-0') },

          tabBarStyle: {
            backgroundColor: getVar('--color-surface-1'),
            borderTopColor: getVar('--color-border'),
            height: tabBarHeight,
            paddingBottom: insets.bottom > 0 ? insets.bottom : 16,
            paddingTop: 8,
          },
          tabBarActiveTintColor: activeColor,
          tabBarInactiveTintColor: getVar('--color-content-muted'),
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
          name="profile_tab"
          options={{
            title: 'Perfil',
            tabBarIcon: ({ color, size }) => <Rabbit size={size} color={color} />,
          }}
          listeners={requireAuth()}
        />
      </Tabs>

    </View>
  );
}