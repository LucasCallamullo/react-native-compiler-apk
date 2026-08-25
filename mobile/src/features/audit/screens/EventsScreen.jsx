import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { 
  Lock, 
  Camera, 
  Share2, 
  Siren, 
  Mic, 
  MapPin, 
  ArrowLeft, 
  Download, 
  ShieldCheck 
} from 'lucide-react-native';

const AUDIT_EVENTS = [
  {
    id: '1',
    icon: Lock,
    iconColor: '#38bdf8', // sky-400
    title: 'Inicio de sesión',
    details: 'Usuario: ana@demo.com · IP: 192.168.1.10',
    timestamp: 'Hoy 09:15 · COMPLETADO',
    badgeText: 'OK',
    badgeColor: 'bg-emerald-950 text-emerald-300 border-emerald-800',
  },
  {
    id: '2',
    icon: Camera,
    iconColor: '#a855f7', // purple-500
    title: 'Registro guardado',
    details: 'Foto subida · ID: #F-2026-001',
    timestamp: 'Hoy 10:30 · COMPLETADO',
    badgeText: 'OK',
    badgeColor: 'bg-emerald-950 text-emerald-300 border-emerald-800',
  },
  {
    id: '3',
    icon: Share2,
    iconColor: '#22c55e', // green-500
    title: 'Link compartido',
    details: 'Historial enviado a contacto: Juan',
    timestamp: 'Hoy 11:05 · COMPLETADO',
    badgeText: 'OK',
    badgeColor: 'bg-emerald-950 text-emerald-300 border-emerald-800',
  },
  {
    id: '4',
    icon: Siren,
    iconColor: '#ef4444', // red-500
    title: 'Alerta de emergencia',
    details: 'Ubicación enviada a contactos de emergencia',
    timestamp: 'Ayer 23:45 · COMPLETADO',
    badgeText: 'URGENTE',
    badgeColor: 'bg-red-950 text-red-300 border-red-800',
  },
  {
    id: '5',
    icon: Mic,
    iconColor: '#f97316', // orange-500
    title: 'Grabación de audio',
    details: 'Nota de voz guardada · Duración: 2:30 min',
    timestamp: 'Ayer 21:30 · COMPLETADO',
    badgeText: 'AUDIO',
    badgeColor: 'bg-orange-950 text-orange-300 border-orange-800',
  },
  {
    id: '6',
    icon: MapPin,
    iconColor: '#eab308', // yellow-500
    title: 'Ubicación compartida',
    details: 'En tiempo real · Contacto: María',
    timestamp: 'Ayer 16:45 · IN_PROGRESS',
    badgeText: '⏳ EN PROCESO',
    badgeColor: 'bg-amber-950 text-amber-300 border-amber-800',
  },
];

export default function EventsScreen({ navigation }) {
  return (
    <ScrollView className="flex-1 bg-zinc-950 px-4 pt-4" showsVerticalScrollIndicator={false}>
      <View className="flex-row items-center gap-2 mb-1">
        <ShieldCheck color="#a855f7" size={24} />
        <Text className="text-xl font-bold text-zinc-100">Auditoría de Eventos</Text>
      </View>
      <Text className="text-sm text-zinc-400 mb-4">
        Registro de todas las acciones realizadas en la app
      </Text>

      {/* Lista de Eventos */}
      <View className="bg-zinc-900 rounded-2xl border border-zinc-800 mb-5 overflow-hidden">
        {AUDIT_EVENTS.map((event, index) => {
          const IconComponent = event.icon;
          return (
            <View
              key={event.id}
              className={`flex-row gap-3 p-4 items-start ${
                index !== AUDIT_EVENTS.length - 1 ? 'border-b border-zinc-800' : ''
              }`}
            >
              <View className="p-2 rounded-xl bg-zinc-950/60 border border-zinc-800 mt-0.5">
                <IconComponent color={event.iconColor} size={20} />
              </View>

              <View className="flex-1">
                <Text className="text-sm font-medium text-zinc-100">{event.title}</Text>
                <Text className="text-xs text-zinc-400 my-0.5">{event.details}</Text>
                <Text className="text-[11px] text-zinc-500">{event.timestamp}</Text>
              </View>

              <View className={`px-2.5 py-1 rounded-full border ${event.badgeColor}`}>
                <Text className="text-[10px] font-semibold">{event.badgeText}</Text>
              </View>
            </View>
          );
        })}
      </View>

      {/* Botones de Acción */}
      <View className="flex-row gap-3 mb-6">
        <TouchableOpacity
          onPress={() => navigation?.goBack()}
          className="flex-1 border border-zinc-700 bg-zinc-900 py-3 rounded-full flex-row items-center justify-center gap-2 active:bg-zinc-800"
        >
          <ArrowLeft color="#e4e4e7" size={18} />
          <Text className="text-zinc-200 font-semibold">Volver</Text>
        </TouchableOpacity>

        <TouchableOpacity className="flex-[2] bg-purple-600 py-3 rounded-full flex-row items-center justify-center gap-2 active:bg-purple-700">
          <Download color="#ffffff" size={18} />
          <Text className="text-white font-semibold">Exportar auditoría</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}