import { Stack } from 'expo-router';
import '../global.css';

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen 
        name="index" 
        options={{ 
          title: 'Inicio',
          headerStyle: { backgroundColor: '#3b82f6' },
          headerTintColor: '#ffffff',
        }} 
      />
      <Stack.Screen 
        name="profile" 
        options={{ 
          title: 'Perfil',
          headerStyle: { backgroundColor: '#8b5cf6' },
          headerTintColor: '#ffffff',
        }} 
      />
      <Stack.Screen 
        name="settings" 
        options={{ 
          title: 'Configuración',
          headerStyle: { backgroundColor: '#22c55e' },
          headerTintColor: '#ffffff',
        }} 
      />
    </Stack>
  );
}