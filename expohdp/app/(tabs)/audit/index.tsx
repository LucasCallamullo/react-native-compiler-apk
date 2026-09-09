import { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { ScreenCustom } from '@shared/components/ScreenCustom';
import { useAppTheme } from '@shared/context/ThemeProvider';
import {
  Folder,
  Camera,
  Video,
  Mic,
  FileText,
  Smartphone,
  ChevronRight,
  ShieldCheck,
} from 'lucide-react-native';

// Types
interface Filter {
  id: string;
  label: string;
}

type RecordType = 'FOTO' | 'VIDEO' | 'AUDIO' | 'NOTA' | 'CAPTURA';

interface Record {
  id: string;
  title: string;
  time: string;
  type: RecordType;
  icon: React.ComponentType<{ color: string; size: number }>;
}

const FILTERS: Filter[] = [
  { id: 'ALL', label: 'Todos' },
  { id: 'PHOTO', label: 'Fotos' },
  { id: 'VIDEO', label: 'Videos' },
  { id: 'AUDIO', label: 'Audios' },
  { id: 'NOTE', label: 'Notas' },
];

const RECORDS: Record[] = [
  {
    id: '1',
    title: 'Evidencia frente al domicilio',
    time: 'Hace 2 horas · CABA',
    type: 'FOTO',
    icon: Camera,
  },
  {
    id: '2',
    title: 'Registro de situación',
    time: 'Hace 5 horas · Zona Norte',
    type: 'VIDEO',
    icon: Video,
  },
  {
    id: '3',
    title: 'Nota de voz - Testimonio',
    time: 'Ayer 21:30 · 2:30 min',
    type: 'AUDIO',
    icon: Mic,
  },
  {
    id: '4',
    title: 'Descripción de incidente',
    time: 'Ayer 14:10 · Nota',
    type: 'NOTA',
    icon: FileText,
  },
  {
    id: '5',
    title: 'Captura de conversación',
    time: 'Ayer 11:45 · Captura',
    type: 'CAPTURA',
    icon: Smartphone,
  },
];

// Color mapping for record types
const typeColorMap = {
  FOTO: 'text-primary',
  VIDEO: 'text-error',
  AUDIO: 'text-warning',
  NOTA: 'text-success',
  CAPTURA: 'text-primary',
};

const typeBadgeMap = {
  FOTO: 'bg-primary border-primary text-primary-fg',
  VIDEO: 'bg-error border-error text-error-fg',
  AUDIO: 'bg-warning border-warning text-warning-fg',
  NOTA: 'bg-success border-success text-success-fg',
  CAPTURA: 'bg-primary border-primary text-primary-fg',
};

export default function HistoryScreen() {
  const router = useRouter();
  const { getColor } = useAppTheme();

  // Dynamic colors from theme
  const fgColor = getColor('text-fg');
  const fgMutedColor = getColor('text-fg-muted');
  const cardBgColor = getColor('bg-card');
  const borderColor = getColor('border-border');
  const primaryColor = getColor('text-primary');
  const primaryFgColor = getColor('text-primary-fg');
  const purpleLightColor = getColor('bg-purple-light');
  const purpleBgColor = getColor('bg-purple-bg');
  const purpleBorderColor = getColor('border-purple');

  // Status colors
  const successColor = getColor('text-success');
  const successBgColor = getColor('bg-success');
  const successBorderColor = getColor('border-success');
  const errorColor = getColor('text-error');
  const errorBgColor = getColor('bg-error');
  const errorBorderColor = getColor('border-error');
  const warningColor = getColor('text-warning');
  const warningBgColor = getColor('bg-warning');
  const warningBorderColor = getColor('border-warning');

  const [activeFilter, setActiveFilter] = useState('ALL');

  // Get color for record type
  const getTypeColor = (type: keyof typeof typeColorMap): string => {
    const colorKey = typeColorMap[type];
    return getColor(colorKey as any);
  };

  // Get badge classes for record type
  const getBadgeClasses = (type: keyof typeof typeBadgeMap): string => {
    return typeBadgeMap[type] || 'bg-primary border-primary text-primary-fg';
  };

  const filteredRecords = activeFilter === 'ALL'
    ? RECORDS
    : RECORDS.filter((r) => r.type === activeFilter);

  return (
    <ScreenCustom safeTop>
      <ScrollView className="flex-1 px-4" showsVerticalScrollIndicator={false}>
        <View className="flex-row items-center gap-2 mb-3">
          <Folder color={primaryColor} size={24} />
          <Text className="text-xl font-bold" style={{ color: fgColor }}>
            Historial
          </Text>
        </View>

        {/* Filter Chips */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row mb-4">
          <View className="flex-row gap-2 pr-4">
            {FILTERS.map((filter) => {
              const isActive = activeFilter === filter.id;
              return (
                <TouchableOpacity
                  key={filter.id}
                  onPress={() => setActiveFilter(filter.id)}
                  className={`px-4 py-1.5 rounded-full border active:opacity-70 ${
                    isActive ? 'bg-primary border-primary' : ''
                  }`}
                  style={{
                    backgroundColor: isActive ? primaryColor : cardBgColor,
                    borderColor: isActive ? primaryColor : borderColor,
                  }}
                >
                  <Text
                    className={`text-sm font-medium ${
                      isActive ? 'text-primary-fg' : ''
                    }`}
                    style={{
                      color: isActive ? primaryFgColor : fgMutedColor,
                    }}
                  >
                    {filter.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </ScrollView>

        {/* Records List */}
        <View
          className="rounded-2xl border mb-4 overflow-hidden"
          style={{
            backgroundColor: cardBgColor,
            borderColor: borderColor,
          }}
        >
          {filteredRecords.map((item, index) => {
            const IconComponent = item.icon;
            const typeColor = getTypeColor(item.type);

            return (
              <TouchableOpacity
                key={item.id}
                className={`flex-row items-center gap-3 p-4 active:opacity-70 ${
                  index !== filteredRecords.length - 1 ? 'border-b border-border' : ''
                }`}
                style={{
                  backgroundColor: cardBgColor,
                }}
              >
                <View
                  className="w-12 h-12 rounded-xl items-center justify-center border"
                  style={{
                    backgroundColor: cardBgColor,
                    borderColor: borderColor,
                  }}
                >
                  <IconComponent color={typeColor} size={22} />
                </View>

                <View className="flex-1">
                  <Text className="text-sm font-medium" style={{ color: fgColor }}>
                    {item.title}
                  </Text>
                  <Text className="text-xs my-0.5" style={{ color: fgMutedColor }}>
                    {item.time}
                  </Text>
                  <View className="flex-row">
                    <Text
                      className={`text-[10px] px-2 py-0.5 rounded-full font-semibold border ${getBadgeClasses(
                        item.type
                      )}`}
                    >
                      {item.type}
                    </Text>
                  </View>
                </View>

                <ChevronRight color={fgMutedColor} size={20} />
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Audit Access */}
        <TouchableOpacity
          onPress={() => router.push('/audit/history')}
          className="py-3 rounded-full flex-row items-center justify-center gap-2 mb-6 border active:opacity-80"
          style={{
            backgroundColor: purpleBgColor,
            borderColor: purpleBorderColor,
          }}
        >
          <ShieldCheck color={purpleLightColor} size={18} />
          <Text className="font-semibold" style={{ color: purpleLightColor }}>
            Ver auditoría de eventos
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </ScreenCustom>
  );
}