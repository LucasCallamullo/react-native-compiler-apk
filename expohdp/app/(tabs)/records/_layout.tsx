import { Stack } from 'expo-router';
import { useAppTheme } from '@shared/context/ThemeProvider';

export default function RecordsLayout() {
  const { getVar } = useAppTheme();

  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: getVar('--color-surface-1'),
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
          title: 'Registros',
          headerShown: false,
        }}
      />
    </Stack>
  );
}