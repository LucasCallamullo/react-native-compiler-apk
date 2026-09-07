import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { Camera, Siren, Folder, Share2, Mic, ClipboardList, Rabbit, Lock } from 'lucide-react-native';
import { useAuth } from '@features/auth/context/AuthContext';

export default function DashboardScreen({ navigation }) {
  const { isAuthenticated, user } = useAuth();

  const handleProtectedAction = (screenName) => {
    if (!isAuthenticated) {
      navigation.navigate('Login');
      return;
    }
    navigation.navigate(screenName);
  };

  return (
    <ScrollView className="flex-1 bg-zinc-950 px-4 pt-4" showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View className="flex-row justify-between items-center py-3">
        <View>
          <View className="flex-row items-center gap-2">
            <Rabbit color="#a855f7" size={28} />
            <Text className="text-xl font-bold text-zinc-100">
              {isAuthenticated ? `Hola, ${user?.firstName || user?.email || 'Usuario'}` : 'Modo Invitado'}
            </Text>
          </View>
          <Text className="text-sm text-zinc-400">
            {isAuthenticated ? 'Bienvenido de nuevo' : 'Inicia sesión para sincronizar tus datos'}
          </Text>
        </View>

        {/* Botón para acceder a su perfil o iniciar sesión */}
        <TouchableOpacity 
          onPress={() => navigation.navigate(isAuthenticated ? 'Profile' : 'Login')}
          className="w-11 h-11 rounded-full bg-purple-600 items-center justify-center active:opacity-80"
        >
          {isAuthenticated ? (
            <Text className="text-white font-bold text-lg">
              {(user?.firstName?.[0] || user?.email?.[0] || 'U').toUpperCase()}
            </Text>
          ) : (
            <Lock color="#ffffff" size={20} />
          )}
        </TouchableOpacity>
      </View>

      {/* Banner promocional si no está logueado */}
      {!isAuthenticated && (
        <TouchableOpacity
          onPress={() => navigation.navigate('Login')}
          className="bg-purple-950/40 border border-purple-800/60 rounded-2xl p-4 my-2 flex-row justify-between items-center"
        >
          <View className="flex-1 mr-2">
            <Text className="text-purple-200 font-semibold text-sm">Sesión no iniciada</Text>
            <Text className="text-purple-400 text-xs mt-1">Inicia sesión o regístrate para respaldar tu evidencia en la nube.</Text>
          </View>
          <View className="bg-purple-600 px-3 py-1.5 rounded-xl">
            <Text className="text-white text-xs font-bold">Ingresar</Text>
          </View>
        </TouchableOpacity>
      )}

      {/* Métricas */}
      <View className="flex-row gap-2 my-4">
        <View className="flex-1 bg-zinc-900 rounded-2xl p-3 items-center border border-zinc-800">
          <Text className="text-2xl font-bold text-zinc-100">{isAuthenticated ? '12' : '-'}</Text>
          <Text className="text-xs text-zinc-400">Registros</Text>
        </View>
        <View className="flex-1 bg-zinc-900 rounded-2xl p-3 items-center border border-zinc-800">
          <Text className="text-2xl font-bold text-zinc-100">{isAuthenticated ? '4' : '-'}</Text>
          <Text className="text-xs text-zinc-400">Eventos</Text>
        </View>
        <View className="flex-1 bg-zinc-900 rounded-2xl p-3 items-center border border-zinc-800">
          <Text className="text-2xl font-bold text-zinc-100">{isAuthenticated ? '3' : '-'}</Text>
          <Text className="text-xs text-zinc-400">Alertas</Text>
        </View>
      </View>

      {/* Accesos Rápidos */}
      <View className="flex-row flex-wrap gap-3 mb-5">
        <TouchableOpacity 
          onPress={() => handleProtectedAction('NewRecord')}
          className="w-[48%] bg-zinc-900 rounded-2xl p-4 items-center border border-zinc-800 active:bg-zinc-800"
        >
          <Camera color="#a855f7" size={28} />
          <Text className="text-xs font-medium text-zinc-200 mt-2">Nuevo Registro</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          onPress={() => handleProtectedAction('Emergency')}
          className="w-[48%] bg-zinc-900 rounded-2xl p-4 items-center border border-zinc-800 active:bg-zinc-800"
        >
          <Siren color="#ef4444" size={28} />
          <Text className="text-xs font-medium text-zinc-200 mt-2">Emergencia</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          onPress={() => handleProtectedAction('History')}
          className="w-[48%] bg-zinc-900 rounded-2xl p-4 items-center border border-zinc-800 active:bg-zinc-800"
        >
          <Folder color="#a855f7" size={28} />
          <Text className="text-xs font-medium text-zinc-200 mt-2">Historial</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          onPress={() => handleProtectedAction('Share')}
          className="w-[48%] bg-zinc-900 rounded-2xl p-4 items-center border border-zinc-800 active:bg-zinc-800"
        >
          <Share2 color="#a855f7" size={28} />
          <Text className="text-xs font-medium text-zinc-200 mt-2">Compartir</Text>
        </TouchableOpacity>
      </View>

      {/* Actividad Reciente */}
      <View className="flex-row items-center gap-2 mb-2">
        <ClipboardList color="#a1a1aa" size={20} />
        <Text className="text-lg font-bold text-zinc-100">Actividad reciente</Text>
      </View>
      
      <View className="bg-zinc-900 rounded-2xl p-4 border border-zinc-800 mb-6">
        <View className="flex-row items-center gap-3 py-3 border-b border-zinc-800">
          <Text className="text-xs text-zinc-400 w-12">15:30</Text>
          <View className="flex-1 flex-row items-center gap-2">
            <Camera color="#a855f7" size={16} />
            <View>
              <Text className="text-sm font-medium text-zinc-100">Foto subida</Text>
              <Text className="text-xs text-zinc-400">Evidencia de incidente registrada</Text>
            </View>
          </View>
          <Text className="text-[10px] px-2 py-1 rounded-full bg-purple-950 text-purple-300 font-semibold border border-purple-800">
            REGISTRO
          </Text>
        </View>

        <View className="flex-row items-center gap-3 py-3 border-b border-zinc-800">
          <Text className="text-xs text-zinc-400 w-12">14:20</Text>
          <View className="flex-1 flex-row items-center gap-2">
            <Share2 color="#22c55e" size={16} />
            <View>
              <Text className="text-sm font-medium text-zinc-100">Link compartido</Text>
              <Text className="text-xs text-zinc-400">Historial enviado a contacto</Text>
            </View>
          </View>
          <Text className="text-[10px] px-2 py-1 rounded-full bg-emerald-950 text-emerald-300 font-semibold border border-emerald-800">
            COMPARTIDO
          </Text>
        </View>

        <View className="flex-row items-center gap-3 py-3">
          <Text className="text-xs text-zinc-400 w-12">11:05</Text>
          <View className="flex-1 flex-row items-center gap-2">
            <Mic color="#f97316" size={16} />
            <View>
              <Text className="text-sm font-medium text-zinc-100">Grabación de audio</Text>
              <Text className="text-xs text-zinc-400">Nota de voz guardada (2:30 min)</Text>
            </View>
          </View>
          <Text className="text-[10px] px-2 py-1 rounded-full bg-orange-950 text-orange-300 font-semibold border border-orange-800">
            AUDIO
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}