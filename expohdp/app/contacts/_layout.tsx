// app/contacts/_layout.tsx
import { Stack } from 'expo-router';
import { useAppTheme } from '@shared/context/ThemeProvider';

export default function ContactsLayout() {
  const { getVar } = useAppTheme();
  
  return (
    <Stack
      screenOptions={{
        // Re-aplicamos aquí las opciones visuales que queremos para las pantallas de contacts
        contentStyle: { 
          backgroundColor: getVar('--color-surface-0') 
        },
        headerShown: false, // Ya lo tenías, perfecto
      }}
    >
      <Stack.Screen name="new" />
      <Stack.Screen name="[id]/edit" />
      {/* Ejemplo futuro: una lista con header nativo */}
      {/* <Stack.Screen name="index" options={{ headerShown: true, title: 'Contactos' }} /> */}
    </Stack>
  );
}