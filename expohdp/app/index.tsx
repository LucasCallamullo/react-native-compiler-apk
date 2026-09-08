import { View, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Home, Moon, Sun, Sparkles, User, Settings } from 'lucide-react-native';
import { useAppTheme } from './_layout';

import { Redirect } from 'expo-router';

export default function Index() {
  return <Redirect href="/home" />;
}
/*
export default function HomeScreen() {
  const router = useRouter();
  const { theme, setTheme, getColor } = useAppTheme();

  return (
    <View className="flex-1 items-center justify-center gap-5 bg-bg">
      <Home size={48} color={getColor('text-primary')} />
      
      <Text className="text-2xl font-bold text-fg">
        ¡Temas con NativeWind!
      </Text>

      <TouchableOpacity
        className="flex-row items-center bg-primary px-6 py-3 rounded-lg"
        onPress={() => router.push('/profile')}
      >
        <User size={20} color={getColor('text-primary')} />
        <Text className="text-primary-fg font-semibold ml-2">
          Ir a Perfil
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        className="flex-row items-center bg-secondary px-6 py-3 rounded-lg"
        onPress={() => router.push('/settings')}
      >
        <Settings size={20} color={getColor('text-secondary-fg')} />
        <Text className="text-secondary-fg font-semibold ml-2">
          Ir a Configuración
        </Text>
      </TouchableOpacity>

      <View className="flex-row gap-3 mt-4">
        <TouchableOpacity 
          className="bg-card px-4 py-2 rounded-lg border border-border flex-row items-center gap-2"
          onPress={() => setTheme('theme-dark')}
        >
          <Moon size={20} color={getColor('text-fg')} />
          <Text className="text-fg">Dark</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          className="bg-card px-4 py-2 rounded-lg border border-border flex-row items-center gap-2"
          onPress={() => setTheme('theme-light')}
        >
          <Sun size={20} color={getColor('text-fg')} />
          <Text className="text-fg">Light</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          className="bg-card px-4 py-2 rounded-lg border border-border flex-row items-center gap-2"
          onPress={() => setTheme('theme-violet')}
        >
          <Sparkles size={20} color={getColor('text-fg')} />
          <Text className="text-fg">Violet</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
} */