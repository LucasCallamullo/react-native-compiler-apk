import { Tabs } from 'expo-router';
import { Home, Folder, PlusCircle, User, Calculator } from 'lucide-react-native';
import { useAppTheme } from '@shared/context/ThemeProvider';
import { Platform } from 'react-native';

export default function TabsLayout() {
  const { getColor } = useAppTheme();

  return (
    <Tabs
      screenOptions={{
        headerShown: true,
        headerStyle: {
          backgroundColor: 'var(--color-card)',
        },
        headerTintColor: 'var(--color-fg)',
        headerTitleStyle: {
          fontWeight: '600',
        },
        tabBarStyle: {
          backgroundColor: 'var(--color-card)',
          borderTopColor: 'var(--color-border)',
          height: Platform.OS === 'ios' ? 88 : 64,
          paddingBottom: Platform.OS === 'ios' ? 28 : 8,
          paddingTop: 8,
        },
        tabBarActiveTintColor: getColor('text-primary'),
        tabBarInactiveTintColor: getColor('text-fg-muted'),
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
        name="folder"
        options={{
          title: 'Carpetas',
          tabBarIcon: ({ color, size }) => <Folder size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="create"
        options={{
          title: 'Crear',
          tabBarIcon: ({ color, size }) => <PlusCircle size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="user"
        options={{
          title: 'Usuario',
          tabBarIcon: ({ color, size }) => <User size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="calculator"
        options={{
          title: 'Calculadora',
          tabBarIcon: ({ color, size }) => <Calculator size={size} color={color} />,
        }}
      />
    </Tabs>
  );
}