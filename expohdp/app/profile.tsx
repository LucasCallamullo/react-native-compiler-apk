import { View, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { User, ArrowLeft } from 'lucide-react-native';

export default function ProfileScreen() {
  const router = useRouter();

  return (
    <View className="flex-1 items-center justify-center gap-5 bg-bg">
      <User size={48} className="text-secondary" />
      <Text className="text-2xl font-bold text-fg">
        Pantalla de Perfil
      </Text>
      
      <TouchableOpacity 
        className="flex-row items-center bg-primary px-6 py-3 rounded-lg"
        onPress={() => router.back()}
      >
        <ArrowLeft size={18} className="text-primary-fg" />
        <Text className="text-primary-fg font-semibold ml-2">Volver</Text>
      </TouchableOpacity>
    </View>
  );
}