// src/features/profile/screens/ProfileScreen.jsx
import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Linking } from 'react-native';
import { 
  User, 
  Mail, 
  Phone, 
  IdCard, 
  Share2, 
  AlertTriangle, 
  Gavel, 
  Info, 
  ShieldAlert, 
  ChevronRight, 
  LogOut,
  CheckCircle2,
  Lightbulb,
  EyeOff
} from 'lucide-react-native';
import { useAuth } from '@features/auth/context/AuthContext';

export default function ProfileScreen({ navigation }) {
  const { user, logout } = useAuth();

  const handlePhoneCall = (number) => {
    Linking.openURL(`tel:${number}`);
  };

  const handleWhatsapp = () => {
    Linking.openURL('https://wa.me/5491112345678');
  };

  return (
    <ScrollView className="flex-1 bg-zinc-950 px-4 pt-4" showsVerticalScrollIndicator={false}>
      
      {/* Tarjeta Perfil / Header */}
      <View className="bg-zinc-900 rounded-3xl p-5 border border-zinc-800 flex-row items-center gap-4 mb-4">
        <View className="w-16 h-16 rounded-full bg-purple-600 items-center justify-center">
          <Text className="text-white font-bold text-2xl">
            {(user?.firstName?.[0] || user?.email?.[0] || 'U').toUpperCase()}
          </Text>
        </View>
        <View className="flex-1">
          <View className="flex-row items-center gap-1.5">
            <Text className="text-xl font-bold text-zinc-100">
              {user?.firstName ? `${user.firstName} ${user.lastName || ''}` : 'Usuario'}
            </Text>
            <CheckCircle2 color="#3b82f6" size={18} />
          </View>
          <Text className="text-xs text-zinc-400 mt-0.5">Usuario verificado</Text>
          <View className="self-start mt-2 bg-emerald-950/80 border border-emerald-800 px-2.5 py-0.5 rounded-full">
            <Text className="text-[10px] font-semibold text-emerald-400">Activo</Text>
          </View>
        </View>
      </View>

      {/* Datos Personales */}
      <View className="bg-zinc-900 rounded-2xl p-4 border border-zinc-800 mb-4">
        <View className="flex-row items-center gap-2 mb-3 pb-2 border-b border-zinc-800">
          <IdCard color="#a1a1aa" size={18} />
          <Text className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
            Datos personales
          </Text>
        </View>

        <View className="space-y-3">
          <View className="flex-row justify-between items-center py-1.5 border-b border-zinc-800/50">
            <View className="flex-row items-center gap-2">
              <User color="#71717a" size={16} />
              <Text className="text-zinc-400 text-sm">Nombre</Text>
            </View>
            <Text className="text-zinc-200 text-sm font-medium">{user?.firstName || '-'}</Text>
          </View>

          <View className="flex-row justify-between items-center py-1.5 border-b border-zinc-800/50">
            <View className="flex-row items-center gap-2">
              <User color="#71717a" size={16} />
              <Text className="text-zinc-400 text-sm">Apellido</Text>
            </View>
            <Text className="text-zinc-200 text-sm font-medium">{user?.lastName || '-'}</Text>
          </View>

          <View className="flex-row justify-between items-center py-1.5 border-b border-zinc-800/50">
            <View className="flex-row items-center gap-2">
              <IdCard color="#71717a" size={16} />
              <Text className="text-zinc-400 text-sm">DNI</Text>
            </View>
            <Text className="text-zinc-200 text-sm font-medium">{user?.dni || '-'}</Text>
          </View>

          <View className="flex-row justify-between items-center py-1.5 border-b border-zinc-800/50">
            <View className="flex-row items-center gap-2">
              <Phone color="#71717a" size={16} />
              <Text className="text-zinc-400 text-sm">Teléfono</Text>
            </View>
            <Text className="text-zinc-200 text-sm font-medium">{user?.phone || '-'}</Text>
          </View>

          <View className="flex-row justify-between items-center py-1.5">
            <View className="flex-row items-center gap-2">
              <Mail color="#71717a" size={16} />
              <Text className="text-zinc-400 text-sm">Email</Text>
            </View>
            <Text className="text-zinc-200 text-sm font-medium">{user?.email || '-'}</Text>
          </View>
        </View>
      </View>

      {/* Botón Compartir Historial */}
      <TouchableOpacity 
        onPress={() => navigation.navigate('Share')}
        className="w-full bg-purple-600 active:bg-purple-700 py-3.5 px-4 rounded-2xl flex-row items-center justify-between mb-3 shadow-lg shadow-purple-950"
      >
        <View className="flex-row items-center gap-3">
          <Share2 color="#ffffff" size={20} />
          <Text className="text-white font-semibold text-base">Compartir Historial</Text>
        </View>
        <ChevronRight color="#e9d5ff" size={18} />
      </TouchableOpacity>

      {/* Botón Camuflaje de la App */}
      <TouchableOpacity 
        onPress={() => navigation.navigate('ConfigApp')}
        className="w-full bg-zinc-900 active:bg-zinc-800 py-3.5 px-4 rounded-2xl flex-row items-center justify-between border border-zinc-800 mb-5"
      >
        <View className="flex-row items-center gap-3">
          <EyeOff color="#c084fc" size={20} />
          <Text className="text-zinc-100 font-semibold text-base">Camuflaje y Apariencia</Text>
        </View>
        <ChevronRight color="#71717a" size={18} />
      </TouchableOpacity>

      {/* Sección Violencia de Género */}
      <View className="bg-zinc-900 rounded-2xl p-4 border-l-4 border-red-500 border-y border-r border-zinc-800 mb-4">
        <View className="flex-row items-start gap-3">
          <View className="bg-red-950/80 p-2 rounded-full border border-red-900">
            <AlertTriangle color="#ef4444" size={20} />
          </View>
          <View className="flex-1">
            <Text className="font-bold text-zinc-100 text-base">Información sobre Violencia de Género</Text>
            <Text className="text-xs text-zinc-400 mt-1 leading-relaxed">
              Si estás atravesando una situación de violencia, recordá que no estás sola. Podés acceder a recursos y líneas de ayuda disponibles las 24 horas.
            </Text>
          </View>
        </View>

        <View className="flex-row gap-2 mt-4">
          <TouchableOpacity 
            onPress={() => navigation.navigate('Emergency')}
            className="flex-1 bg-red-950/40 border border-red-900/60 py-2.5 rounded-xl flex-row items-center justify-center gap-2 active:bg-red-900/40"
          >
            <Gavel color="#fca5a5" size={16} />
            <Text className="text-red-300 font-medium text-xs">Denunciar</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            className="flex-1 bg-blue-950/40 border border-blue-900/60 py-2.5 rounded-xl flex-row items-center justify-center gap-2 active:bg-blue-900/40"
          >
            <Info color="#93c5fd" size={16} />
            <Text className="text-blue-300 font-medium text-xs">Más info</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Líneas de Ayuda (Argentina) */}
      <View className="bg-zinc-900 rounded-2xl p-4 border border-zinc-800 mb-4">
        <View className="flex-row items-center gap-2 mb-3">
          <Phone color="#22c55e" size={18} />
          <Text className="font-bold text-zinc-100 text-sm">Líneas de ayuda (Argentina)</Text>
        </View>

        <View className="space-y-2">
          <TouchableOpacity 
            onPress={() => handlePhoneCall('144')}
            className="flex-row items-center justify-between bg-zinc-950/80 p-3 rounded-xl border border-zinc-800/80 active:bg-zinc-800"
          >
            <Text className="text-xs text-zinc-200">Línea 144</Text>
            <Text className="text-[10px] bg-emerald-950 text-emerald-300 px-2 py-0.5 rounded-full border border-emerald-800 font-semibold">
              Nacional
            </Text>
          </TouchableOpacity>

          <TouchableOpacity 
            onPress={() => handlePhoneCall('911')}
            className="flex-row items-center justify-between bg-zinc-950/80 p-3 rounded-xl border border-zinc-800/80 active:bg-zinc-800"
          >
            <Text className="text-xs text-zinc-200">Emergencias 911</Text>
            <Text className="text-[10px] bg-red-950 text-red-300 px-2 py-0.5 rounded-full border border-red-800 font-semibold">
              Urgencia
            </Text>
          </TouchableOpacity>

          <TouchableOpacity 
            onPress={handleWhatsapp}
            className="flex-row items-center justify-between bg-zinc-950/80 p-3 rounded-xl border border-zinc-800/80 active:bg-zinc-800"
          >
            <Text className="text-xs text-zinc-200">WhatsApp +54 9 11 1234-5678</Text>
            <Text className="text-[10px] bg-blue-950 text-blue-300 px-2 py-0.5 rounded-full border border-blue-800 font-semibold">
              Chat
            </Text>
          </TouchableOpacity>
        </View>

        <View className="mt-3 text-xs bg-zinc-950/50 p-3 rounded-xl border border-zinc-800/50 flex-row items-start gap-2">
          <Lightbulb color="#eab308" size={16} />
          <Text className="text-[11px] text-zinc-400 flex-1 leading-normal">
            Estas líneas son gratuitas, confidenciales y están disponibles las 24 horas, los 365 días del año.
          </Text>
        </View>
      </View>

      {/* Guía de procedimiento */}
      <View className="bg-purple-950/20 rounded-2xl p-4 border border-purple-900/40 mb-4">
        <Text className="font-bold text-purple-200 text-xs mb-2">¿Cómo proseguir con una denuncia?</Text>
        
        <View className="space-y-1.5 text-xs text-zinc-300">
          <Text className="bg-zinc-900/60 p-2 rounded-lg text-zinc-300 text-xs border border-zinc-800/60">
            1. Comunicate al <Text className="font-bold text-purple-300">144</Text> o al <Text className="font-bold text-purple-300">911</Text>.
          </Text>
          <Text className="bg-zinc-900/60 p-2 rounded-lg text-zinc-300 text-xs border border-zinc-800/60">
            2. Acercate a una <Text className="font-bold text-purple-300">Comisaría de la Mujer</Text> más cercana.
          </Text>
          <Text className="bg-zinc-900/60 p-2 rounded-lg text-zinc-300 text-xs border border-zinc-800/60">
            3. Podés solicitar <Text className="font-bold text-purple-300">asesoramiento legal</Text> gratuito en el Ministerio de Justicia.
          </Text>
        </View>

        <View className="mt-3 bg-amber-950/30 border-l-2 border-amber-500 p-2.5 rounded-r-lg flex-row items-center gap-2">
          <ShieldAlert color="#f59e0b" size={16} />
          <Text className="text-[11px] text-amber-200 flex-1">
            Recordá: tu seguridad es lo más importante. No dudes en pedir ayuda.
          </Text>
        </View>
      </View>

      {/* Cierre de Sesión */}
      <TouchableOpacity 
        onPress={async () => {
          await logout();
          navigation.replace('HomeWorkspace');
        }}
        className="w-full bg-zinc-900 border border-zinc-800 py-3 rounded-2xl flex-row items-center justify-center gap-2 mb-8 active:bg-zinc-800"
      >
        <LogOut color="#ef4444" size={18} />
        <Text className="text-red-400 font-medium text-sm">Cerrar Sesión</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}