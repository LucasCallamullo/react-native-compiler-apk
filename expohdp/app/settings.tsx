import { View, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Settings, ArrowLeft, ArrowRight } from 'lucide-react-native';

export default function SettingsScreen() {
  const router = useRouter();

  return (
    <View className="flex-1 items-center justify-center bg-white gap-5">
      <Settings size={48} color="#22c55e" />
      <Text className="text-2xl font-bold text-gray-800">
        Pantalla de Configuración
      </Text>
      
      <TouchableOpacity 
        className="flex-row items-center bg-blue-500 px-6 py-3 rounded-lg"
        onPress={() => router.back()}
      >
        <ArrowLeft size={18} color="white" />
        <Text className="text-white font-semibold ml-2">Volver</Text>
      </TouchableOpacity>

      <TouchableOpacity 
        className="flex-row items-center bg-blue-500 px-6 py-3 rounded-lg"
        onPress={() => router.push('/profile')}
      >
        <Text className="text-white font-semibold mr-2">Ir a Perfil</Text>
        <ArrowRight size={18} color="white" />
      </TouchableOpacity>
    </View>
  );
}