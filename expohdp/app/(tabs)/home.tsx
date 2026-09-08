import { View, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useAppTheme } from '@shared/context/ThemeProvider';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function HomeScreen() {
  const router = useRouter();
  const { theme, setTheme } = useAppTheme();
  const insets = useSafeAreaInsets();

  return (
    <View className="flex-1 items-center justify-center gap-5 bg-bg">
      <Text className="text-2xl font-bold text-fg">Pantalla de Inicio</Text>
      
      <TouchableOpacity 
        className="bg-primary px-6 py-3 rounded-lg"
        onPress={() => router.push('/profile')}
      >
        <Text className="text-primary-fg font-semibold">Ir a Perfil</Text>
      </TouchableOpacity>

      <TouchableOpacity 
        className="bg-secondary px-6 py-3 rounded-lg"
        onPress={() => setTheme(theme === 'theme-dark' ? 'theme-light' : 'theme-dark')}
      >
        <Text className="text-secondary-fg font-semibold">
          Cambiar tema: {theme}
        </Text>
      </TouchableOpacity>
    </View>
  );
}