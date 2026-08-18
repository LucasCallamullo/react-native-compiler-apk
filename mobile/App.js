import './global.css';
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { Text, View, TouchableOpacity } from 'react-native';

export default function App() {
  const [showSecondScreen, setShowSecondScreen] = useState(false);

  const goToSecondScreen = () => setShowSecondScreen(true);
  const goBack = () => setShowSecondScreen(false);

  if (!showSecondScreen) {
    return (
      <View className="flex-1 bg-gray-100 items-center justify-center p-5">
        <Text className="text-2xl font-bold text-gray-800 mb-2">
          No se permiten Lucas
        </Text>
        <Text className="text-base text-gray-600 mb-8">
          Versión 0.1 - Prototipo
        </Text>

        <TouchableOpacity
          className="bg-green-600 py-3.5 px-10 rounded-xl my-2 min-w-[200px] items-center active:opacity-80"
          onPress={goToSecondScreen}
        >
          <Text className="color-white text-lg font-bold">Banear Lucas!</Text>
        </TouchableOpacity>

        <StatusBar style="auto" />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-gray-100 items-center justify-center p-5">
      <Text className="text-2xl font-bold text-gray-800 mb-2">
        Cantidad actual de Lucas: 1
      </Text>
      <Text className="text-base text-gray-600 mb-8 text-center">
        Desgraciadamente no te vas a salvar de algún Lucas
      </Text>

      <TouchableOpacity
        className="bg-blue-600 py-3.5 px-10 rounded-xl my-2 min-w-[200px] items-center active:opacity-80"
        onPress={goBack}
      >
        <Text className="color-white text-lg font-bold">Volver</Text>
      </TouchableOpacity>

      <StatusBar style="auto" />
    </View>
  );
}