// src/features/share/screens/ShareScreen.jsx
import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Switch, TextInput } from 'react-native';
import { 
  Share2, 
  Lock, 
  Copy, 
  MapPin, 
  Image, 
  KeyRound, 
  Eye, 
  Send, 
  AlertTriangle,
  Hourglass,
  ArrowLeft 
} from 'lucide-react-native';

export default function ShareScreen({ navigation }) {
  const [includeLocation, setIncludeLocation] = useState(true);
  const [includeMedia, setIncludeMedia] = useState(true);
  const [protectPassword, setProtectPassword] = useState(false);
  const [viewsLimit, setViewsLimit] = useState('10');

  return (
    <ScrollView className="flex-1 bg-zinc-950 px-4 pt-4" showsVerticalScrollIndicator={false}>
      {/* Header con botón de retorno */}
      <View className="flex-row items-center gap-3 mb-1">
        <TouchableOpacity 
          onPress={() => navigation.goBack()}
          className="w-10 h-10 rounded-full bg-zinc-900 border border-zinc-800 items-center justify-center active:bg-zinc-800"
        >
          <ArrowLeft color="#e4e4e7" size={20} />
        </TouchableOpacity>
        <View className="flex-row items-center gap-2">
          <Share2 color="#a855f7" size={24} />
          <Text className="text-xl font-bold text-zinc-100">Compartir Historial</Text>
        </View>
      </View>
      
      <Text className="text-sm text-zinc-400 mb-4 ml-13">
        Generá un link temporal para compartir tu evidencia
      </Text>

      {/* Contenedor del Link */}
      <View className="bg-zinc-900 rounded-2xl p-4 items-center border border-dashed border-zinc-700 mb-5">
        <View className="p-3 rounded-full bg-purple-950/60 border border-purple-800 mb-2">
          <Lock color="#c084fc" size={28} />
        </View>
        <Text className="text-xs font-medium text-purple-400 text-center mb-1">
          https://safeguard.app/share/abc123xyz
        </Text>

        <View className="flex-row items-center justify-center gap-2 mt-2 mb-3">
          <Hourglass color="#c084fc" size={16} />
          <Text className="text-[10px] text-zinc-500">
            Expira: 24/08/2026 15:30
          </Text>
        </View>

        <TouchableOpacity className="w-full bg-purple-600 py-2.5 rounded-full flex-row items-center justify-center gap-2 active:bg-purple-700">
          <Copy color="#ffffff" size={16} />
          <Text className="text-white font-semibold text-xs">Copiar link</Text>
        </TouchableOpacity>
      </View>

      {/* Ajustes */}
      <View className="bg-zinc-900 rounded-2xl p-4 border border-zinc-800 mb-5">
        <View className="flex-row items-center justify-between py-3 border-b border-zinc-800">
          <View className="flex-row items-center gap-2.5">
            <MapPin color="#a1a1aa" size={18} />
            <Text className="text-sm text-zinc-200">Incluir ubicación</Text>
          </View>
          <Switch
            value={includeLocation}
            onValueChange={setIncludeLocation}
            trackColor={{ false: '#27272a', true: '#9333ea' }}
            thumbColor={includeLocation ? '#c084fc' : '#a1a1aa'}
          />
        </View>

        <View className="flex-row items-center justify-between py-3 border-b border-zinc-800">
          <View className="flex-row items-center gap-2.5">
            <Image color="#a1a1aa" size={18} />
            <Text className="text-sm text-zinc-200">Incluir fotos/videos</Text>
          </View>
          <Switch
            value={includeMedia}
            onValueChange={setIncludeMedia}
            trackColor={{ false: '#27272a', true: '#9333ea' }}
            thumbColor={includeMedia ? '#c084fc' : '#a1a1aa'}
          />
        </View>

        <View className="flex-row items-center justify-between py-3 border-b border-zinc-800">
          <View className="flex-row items-center gap-2.5">
            <KeyRound color="#a1a1aa" size={18} />
            <Text className="text-sm text-zinc-200">Proteger con contraseña</Text>
          </View>
          <Switch
            value={protectPassword}
            onValueChange={setProtectPassword}
            trackColor={{ false: '#27272a', true: '#9333ea' }}
            thumbColor={protectPassword ? '#c084fc' : '#a1a1aa'}
          />
        </View>

        <View className="flex-row items-center justify-between pt-3">
          <View className="flex-row items-center gap-2.5">
            <Eye color="#a1a1aa" size={18} />
            <Text className="text-sm text-zinc-200">Limitar vistas (0 = ilimitado)</Text>
          </View>
          <TextInput
            keyboardType="numeric"
            value={viewsLimit}
            onChangeText={setViewsLimit}
            placeholderTextColor="#71717a"
            className="w-14 p-1.5 border border-zinc-700 bg-zinc-950 rounded-xl text-center text-sm font-semibold text-zinc-100"
          />
        </View>
      </View>

      {/* Botón principal */}
      <TouchableOpacity className="w-full bg-purple-600 py-3.5 rounded-full flex-row items-center justify-center gap-2 mb-4 active:bg-purple-700">
        <Send color="#ffffff" size={18} />
        <Text className="text-white font-semibold">Generar y compartir</Text>
      </TouchableOpacity>

      {/* Advertencia */}
      <View className="p-3.5 bg-amber-950/40 rounded-2xl border border-amber-800/80 flex-row items-start gap-2.5 mb-6">
        <AlertTriangle color="#fbbf24" size={18} className="mt-0.5" />
        <Text className="text-xs text-amber-200/90 flex-1 leading-4">
          Este link es temporal y caducará automáticamente. Solo las personas con el link podrán ver el contenido.
        </Text>
      </View>
    </ScrollView>
  );
}