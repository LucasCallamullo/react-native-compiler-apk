import { View, TouchableOpacity } from 'react-native';
import { Tabs, useRouter } from 'expo-router';
import { Home, Folder, PlusCircle, User, Rabbit, Calculator, Siren } from 'lucide-react-native';
import { useAppTheme } from '@shared/context/ThemeProvider';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { DraggableLockButton } from '@shared/components/DraggableLockButton';

export default function TabsLayout() {
  const router = useRouter();
  const { getColor } = useAppTheme();
  const insets = useSafeAreaInsets();

  // Mapeo dinámico de colores resueltos desde el ThemeProvider
  const cardColor = getColor('bg-card');
  const fgColor = getColor('text-fg');
  const borderColor = getColor('border-border');
  const activeColor = getColor('text-primary');
  const inactiveColor = getColor('text-fg-muted');

  /**
   * Bloquea la app inmediatamente reemplazando la vista actual 
   * por la fachada de la calculadora
   */
  const handleLockApp = (): void => {
    router.replace('/calculator');
  };

  // Cálculo dinámico para posicionar el botón flotante por encima del TabBar
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

      {/* Botón Flotante Permanente para Bloqueo Rápido */}
      <DraggableLockButton
        onPress={handleLockApp}
        iconColor={activeColor}
        initialBottom={floatingButtonBottom}
      />
    </View>
  );
}