import { View, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { User, ArrowLeft, ArrowRight } from 'lucide-react-native';

export default function ProfileScreen() {
  const router = useRouter();

  return (
    <View className="flex-1 items-center justify-center bg-white gap-5">
      <User size={48} color="#8b5cf6" />
      <Text className="text-2xl font-bold text-gray-800">
        Pantalla de Perfil
      </Text>
      
      <TouchableOpacity 
        className="flex-row items-center bg-blue-500 px-6 py-3 rounded-lg"
        onPress={() => router.back()}
      >
        <ArrowLeft size={18} color="white" />
        <Text className="text-white font-semibold ml-2">Volver</Text>
      </TouchableOpacity>

      <TouchableOpacity 
        className="flex-row items-center bg-green-500 px-6 py-3 rounded-lg"
        onPress={() => router.push('/settings')}
      >
        <Text className="text-white font-semibold mr-2">Ir a Configuración</Text>
        <ArrowRight size={18} color="white" />
      </TouchableOpacity>
    </View>
  );
}