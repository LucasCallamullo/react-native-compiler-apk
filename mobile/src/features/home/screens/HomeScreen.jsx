import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import CountrySelector from '../components/CountrySelector';

const HomeScreen = ({ onLock }) => {
  const [currentSection, setCurrentSection] = useState('home');

  const navigationItems = [
    { id: 'countries', label: 'Buscador de Países', description: 'Prueba de API Fetch con Axios', color: 'bg-blue-600' },
    { id: 'vault', label: 'Bóveda de Archivos', description: 'Fotos y documentos ocultos', color: 'bg-indigo-600' },
    { id: 'notes', label: 'Notas Secretas', description: 'Bloc de notas cifrado', color: 'bg-emerald-600' },
    { id: 'passwords', label: 'Gestor de Claves', description: 'Contraseñas guardadas', color: 'bg-amber-600' },
  ];

  return (
    <View className="flex-1 bg-zinc-950 p-4">
      {/* Header */}
      <View className="flex-row justify-between items-center mb-6 pt-2">
        <Text className="text-white text-xl font-bold">App Secreta</Text>
        <TouchableOpacity
          onPress={onLock}
          className="bg-red-600/80 active:bg-red-700 px-3 py-1.5 rounded-lg"
        >
          <Text className="text-white text-xs font-semibold">Bloquear 🔒</Text>
        </TouchableOpacity>
      </View>

      {currentSection === 'home' ? (
        <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
          <Text className="text-zinc-400 text-sm mb-3">
            Módulos disponibles:
          </Text>

          <View className="gap-3">
            {navigationItems.map((item) => (
              <TouchableOpacity
                key={item.id}
                onPress={() => setCurrentSection(item.id)}
                className={`${item.color} p-4 rounded-xl active:opacity-90`}
              >
                <Text className="text-white text-lg font-bold">{item.label}</Text>
                <Text className="text-zinc-200 text-xs mt-1">{item.description}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      ) : (
        <View className="flex-1 justify-between">
          <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
            {currentSection === 'countries' ? (
              <CountrySelector />
            ) : (
              <View className="bg-zinc-900 p-5 rounded-2xl border border-zinc-800">
                <Text className="text-amber-400 text-xs font-bold uppercase tracking-wider mb-1">
                  Sección activa
                </Text>
                <Text className="text-white text-2xl font-bold capitalize mb-2">
                  {currentSection}
                </Text>
                <Text className="text-zinc-400 text-sm">
                  Contenido correspondiente a {currentSection}.
                </Text>
              </View>
            )}
          </ScrollView>

          <TouchableOpacity
            onPress={() => setCurrentSection('home')}
            className="bg-zinc-800 active:bg-zinc-700 py-3 rounded-xl items-center mt-4 mb-2"
          >
            <Text className="text-white font-medium">← Volver al Menú</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

export default HomeScreen;