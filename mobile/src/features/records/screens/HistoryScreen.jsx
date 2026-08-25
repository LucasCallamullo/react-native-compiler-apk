import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { 
  Folder, 
  Camera, 
  Video, 
  Mic, 
  FileText, 
  Smartphone, 
  ChevronRight, 
  ShieldCheck 
} from 'lucide-react-native';

const FILTERS = [
  { id: 'ALL', label: 'Todos' },
  { id: 'PHOTO', label: 'Fotos' },
  { id: 'VIDEO', label: 'Videos' },
  { id: 'AUDIO', label: 'Audios' },
  { id: 'NOTE', label: 'Notas' },
];

const RECORDS = [
  {
    id: '1',
    title: 'Evidencia frente al domicilio',
    time: 'Hace 2 horas · CABA',
    type: 'FOTO',
    icon: Camera,
    iconColor: '#a855f7',
    badgeColor: 'bg-purple-950 text-purple-300 border-purple-800',
  },
  {
    id: '2',
    title: 'Registro de situación',
    time: 'Hace 5 horas · Zona Norte',
    type: 'VIDEO',
    icon: Video,
    iconColor: '#ef4444',
    badgeColor: 'bg-red-950 text-red-300 border-red-800',
  },
  {
    id: '3',
    title: 'Nota de voz - Testimonio',
    time: 'Ayer 21:30 · 2:30 min',
    type: 'AUDIO',
    icon: Mic,
    iconColor: '#f97316',
    badgeColor: 'bg-orange-950 text-orange-300 border-orange-800',
  },
  {
    id: '4',
    title: 'Descripción de incidente',
    time: 'Ayer 14:10 · Nota',
    type: 'NOTA',
    icon: FileText,
    iconColor: '#22c55e',
    badgeColor: 'bg-emerald-950 text-emerald-300 border-emerald-800',
  },
  {
    id: '5',
    title: 'Captura de conversación',
    time: 'Ayer 11:45 · Captura',
    type: 'CAPTURA',
    icon: Smartphone,
    iconColor: '#a855f7',
    badgeColor: 'bg-purple-950 text-purple-300 border-purple-800',
  },
];

export default function HistoryScreen({ navigation }) {
  const [activeFilter, setActiveFilter] = useState('ALL');

  return (
    <ScrollView className="flex-1 bg-zinc-950 px-4 pt-4" showsVerticalScrollIndicator={false}>
      <View className="flex-row items-center gap-2 mb-3">
        <Folder color="#a855f7" size={24} />
        <Text className="text-xl font-bold text-zinc-100">Historial</Text>
      </View>

      {/* Chips de Filtros */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row mb-4">
        <View className="flex-row gap-2 pr-4">
          {FILTERS.map((filter) => (
            <TouchableOpacity
              key={filter.id}
              onPress={() => setActiveFilter(filter.id)}
              className={`px-4 py-1.5 rounded-full border ${
                activeFilter === filter.id
                  ? 'bg-purple-600 border-purple-600'
                  : 'border-zinc-800 bg-zinc-900'
              }`}
            >
              <Text
                className={`text-sm font-medium ${
                  activeFilter === filter.id ? 'text-white' : 'text-zinc-400'
                }`}
              >
                {filter.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {/* Lista de Evidencias */}
      <View className="bg-zinc-900 rounded-2xl border border-zinc-800 mb-4 overflow-hidden">
        {RECORDS.map((item, index) => {
          const IconComponent = item.icon;
          return (
            <TouchableOpacity
              key={item.id}
              className={`flex-row items-center gap-3 p-4 active:bg-zinc-800/60 ${
                index !== RECORDS.length - 1 ? 'border-b border-zinc-800' : ''
              }`}
            >
              <View className="w-12 h-12 rounded-xl bg-zinc-950 items-center justify-center border border-zinc-800">
                <IconComponent color={item.iconColor} size={22} />
              </View>

              <View className="flex-1">
                <Text className="text-sm font-medium text-zinc-100">{item.title}</Text>
                <Text className="text-xs text-zinc-400 my-0.5">{item.time}</Text>
                <View className="flex-row">
                  <Text
                    className={`text-[10px] px-2 py-0.5 rounded-full font-semibold border ${item.badgeColor}`}
                  >
                    {item.type}
                  </Text>
                </View>
              </View>

              <ChevronRight color="#52525b" size={20} />
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Acceso a auditoría */}
      <TouchableOpacity 
        onPress={() => navigation?.navigate('Auditoria')}
        className="border border-purple-500/40 bg-purple-950/30 py-3 rounded-full flex-row items-center justify-center gap-2 mb-6 active:bg-purple-900/40"
      >
        <ShieldCheck color="#c084fc" size={18} />
        <Text className="text-purple-300 font-semibold">Ver auditoría de eventos</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}