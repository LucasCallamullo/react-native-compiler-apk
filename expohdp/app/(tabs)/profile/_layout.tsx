import { Stack } from 'expo-router';
import { useAppTheme } from '@shared/context/ThemeProvider';

export default function ProfileLayout() {
  const { getColor } = useAppTheme();
  const bgColor = getColor('bg-card');
  const fgColor = getColor('text-fg');

  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: bgColor,
        },
        headerTintColor: fgColor,
        headerTitleStyle: {
          fontWeight: '600',
        },
        contentStyle: {
          backgroundColor: getColor('bg-bg'),
        },
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          title: 'Mi Perfil',
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="share"
        options={{
          title: 'Compartir Historial',
          presentation: 'modal',
        }}
      />
      <Stack.Screen
        name="config"
        options={{
          title: 'Configuración',
        }}
      />
    </Stack>
  );
}