import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { 
  Siren, 
  MapPin, 
  Share2, 
  PhoneCall, 
  UserPlus, 
  AlertTriangle 
} from 'lucide-react-native';

const CONTACTS = [
  { id: '1', name: 'Juan Pérez', phone: '+54 11 2345-6789', initial: 'J' },
  { id: '2', name: 'María García', phone: '+54 11 3456-7890', initial: 'M' },
  { id: '3', name: 'Luis Fernández', phone: '+54 11 4567-8901', initial: 'L' },
];

export default function EmergencyScreen({ navigation }) {
  const triggerEmergency = () => {
    Alert.alert(
      '🚨 Alerta enviada',
      'Se ha notificado a todos tus contactos con tu ubicación en tiempo real.'
    );
  };

  return (
    <ScrollView className="flex-1 bg-zinc-950 px-4 pt-4" showsVerticalScrollIndicator={false}>
      <View className="flex-row items-center gap-2 mb-1">
        <AlertTriangle color="#ef4444" size={24} />
        <Text className="text-xl font-bold text-zinc-100">Emergencias</Text>
      </View>
      <Text className="text-sm text-zinc-400 mb-4">
        Contactos de emergencia y ubicación en tiempo real
      </Text>

      {/* Botón de Pánico */}
      <TouchableOpacity
        onPress={triggerEmergency}
        className="bg-red-600 py-4 rounded-2xl items-center justify-center flex-row gap-2 border border-red-500 mb-5 active:bg-red-700 shadow-lg shadow-red-950"
      >
        <Siren color="#ffffff" size={24} />
        <Text className="text-white font-bold text-base">
          ¡EMERGENCIA! (Llamar a todos)
        </Text>
      </TouchableOpacity>

      {/* Tarjeta de GPS */}
      <View className="bg-emerald-950/40 border border-emerald-800/80 rounded-2xl p-4 flex-row items-center justify-between mb-5">
        <View className="flex-1 pr-2">
          <View className="flex-row items-center gap-1.5 mb-1">
            <MapPin color="#34d399" size={16} />
            <Text className="font-semibold text-emerald-400 text-sm">
              Ubicación en tiempo real
            </Text>
          </View>
          <Text className="text-xs text-emerald-200/80">-34.6037, -58.3816 · CABA</Text>
          <Text className="text-[10px] text-emerald-400/60 mt-1">
            Actualizando cada 5 segundos
          </Text>
        </View>
        <TouchableOpacity className="bg-emerald-600 px-3 py-2 rounded-full flex-row items-center gap-1 active:bg-emerald-700">
          <Share2 color="#ffffff" size={14} />
          <Text className="text-white text-xs font-semibold">Compartir</Text>
        </TouchableOpacity>
      </View>

      {/* Contactos */}
      <Text className="text-base font-bold text-zinc-100 mb-3">
        Contactos de emergencia
      </Text>
      <View className="gap-3 mb-5">
        {CONTACTS.map((item) => (
          <View
            key={item.id}
            className="flex-row items-center bg-zinc-900 rounded-2xl p-3 border border-zinc-800"
          >
            <View className="w-10 h-10 rounded-full bg-zinc-800 items-center justify-center mr-3 border border-zinc-700">
              <Text className="font-bold text-purple-400">{item.initial}</Text>
            </View>
            <View className="flex-1">
              <Text className="font-medium text-zinc-100">{item.name}</Text>
              <Text className="text-xs text-zinc-400">{item.phone}</Text>
            </View>
            <TouchableOpacity className="bg-purple-600 px-3 py-2 rounded-full flex-row items-center gap-1.5 active:bg-purple-700">
              <PhoneCall color="#ffffff" size={14} />
              <Text className="text-white font-semibold text-xs">Llamar</Text>
            </TouchableOpacity>
          </View>
        ))}
      </View>

      <TouchableOpacity className="border border-purple-500/40 bg-purple-950/30 py-3 rounded-full flex-row items-center justify-center gap-2 mb-6 active:bg-purple-900/40">
        <UserPlus color="#c084fc" size={18} />
        <Text className="text-purple-300 font-semibold">
          Agregar contacto de emergencia
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}