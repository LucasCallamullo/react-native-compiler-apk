// src/features/profile/screens/ConfigAppScreen.jsx
import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { ArrowLeft, ShieldCheck, Calculator, EyeOff, Check } from 'lucide-react-native';
import setAppIcon from 'expo-dynamic-app-icon';

export default function ConfigAppScreen({ navigation }) {
  const [activeIcon, setActiveIcon] = useState('calculator');

  const handleIconChange = async (iconName) => {
    try {
      setActiveIcon(iconName);
      // Cambia el alias activo del lanzador en Android/iOS
      await setAppIcon(iconName);
      Alert.alert(
        "Icono actualizado",
        "El icono y nombre de la aplicación se actualizaron en la pantalla de inicio."
      );
    } catch (error) {
      // Fallback si la librería no está linkeada en entorno Expo Go puro
      Alert.alert(
        "Modo de prueba",
        "El cambio de icono nativo requiere generar la APK con 'expo run:android' o EAS Build."
      );
    }
  };

  return (
    <ScrollView className="flex-1 bg-zinc-950 px-4 pt-4" showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View className="flex-row items-center gap-3 mb-4">
        <TouchableOpacity 
          onPress={() => navigation.goBack()}
          className="w-10 h-10 rounded-full bg-zinc-900 border border-zinc-800 items-center justify-center active:bg-zinc-800"
        >
          <ArrowLeft color="#e4e4e7" size={20} />
        </TouchableOpacity>
        <Text className="text-xl font-bold text-zinc-100">Camuflaje de la App</Text>
      </View>

      <Text className="text-xs text-zinc-400 mb-5 leading-relaxed">
        Elegí la apariencia externa que se mostrará en el menú de aplicaciones de tu teléfono para proteger tu privacidad.
      </Text>

      {/* Opciones de Iconos */}
      <View className="space-y-3 mb-6">
        {/* Opción 1: Modo Calculadora */}
        <TouchableOpacity 
          onPress={() => handleIconChange('calculator')}
          className={`p-4 rounded-2xl border flex-row items-center justify-between ${
            activeIcon === 'calculator' 
              ? 'bg-purple-950/30 border-purple-600' 
              : 'bg-zinc-900 border-zinc-800'
          }`}
        >
          <View className="flex-row items-center gap-3.5">
            <View className="w-12 h-12 rounded-xl bg-zinc-800 border border-zinc-700 items-center justify-center">
              <Calculator color="#c084fc" size={24} />
            </View>
            <View>
              <Text className="text-zinc-100 font-semibold text-sm">Modo Calculadora (Recomendado)</Text>
              <Text className="text-zinc-400 text-xs mt-0.5">Nombre: Calculadora</Text>
            </View>
          </View>
          {activeIcon === 'calculator' && <Check color="#a855f7" size={20} />}
        </TouchableOpacity>

        {/* Opción 2: Modo Oficial */}
        <TouchableOpacity 
          onPress={() => handleIconChange('official')}
          className={`p-4 rounded-2xl border flex-row items-center justify-between ${
            activeIcon === 'official' 
              ? 'bg-purple-950/30 border-purple-600' 
              : 'bg-zinc-900 border-zinc-800'
          }`}
        >
          <View className="flex-row items-center gap-3.5">
            <View className="w-12 h-12 rounded-xl bg-purple-900/50 border border-purple-700 items-center justify-center">
              <ShieldCheck color="#e9d5ff" size={24} />
            </View>
            <View>
              <Text className="text-zinc-100 font-semibold text-sm">Modo Estándar</Text>
              <Text className="text-zinc-400 text-xs mt-0.5">Nombre: Safeguard</Text>
            </View>
          </View>
          {activeIcon === 'official' && <Check color="#a855f7" size={20} />}
        </TouchableOpacity>
      </View>

      {/* Tarjeta de Seguridad Informativa */}
      <View className="bg-zinc-900 p-4 rounded-2xl border border-zinc-800 flex-row items-start gap-3">
        <EyeOff color="#a1a1aa" size={20} className="mt-0.5" />
        <Text className="text-xs text-zinc-400 flex-1 leading-relaxed">
          Al seleccionar el modo calculadora, ni la notificación de la app ni el ícono del sistema revelarán el propósito real de la herramienta.
        </Text>
      </View>
    </ScrollView>
  );
}