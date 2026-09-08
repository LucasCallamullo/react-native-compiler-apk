import "./global.css"

import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { Home, User, Settings } from 'lucide-react-native';


export default function App() {
  return (
    <View className="flex-1 items-center justify-center bg-white">
      <Text className="text-red-500 text-xl font-bold">
        ¡Nativewind está funcionando!
      </Text>
      <Home size={24} color="#000" />
      <Text className="mt-4">¡Icono instalado!</Text>
    </View>
      
  );
}

