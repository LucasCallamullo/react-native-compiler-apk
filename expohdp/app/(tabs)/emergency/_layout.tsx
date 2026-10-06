import { Stack } from 'expo-router';
import { useAppTheme } from '@shared/context/ThemeProvider';

export default function EmergencyLayout() {
  const { getVar } = useAppTheme();

  return (
    <Stack
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
      <Stack.Screen
        name="index"
        options={{
          title: 'Emergencia',
          headerShown: false,
        }}
      />

      <Stack.Screen 
        name="new_contact" 
        options={{ 
          title: 'Nuevo Contacto',
          headerShown: false,
        }} 
      />
    </Stack>
  );
}