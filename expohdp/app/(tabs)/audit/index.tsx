import { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { ScreenCustom } from '@shared/components/ScreenCustom';
import { useAppTheme, type ThemeVarName } from '@shared/context/ThemeProvider';
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

interface HistoryRecord {
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

const RECORDS: HistoryRecord[] = [
  { id: '1', title: 'Evidencia frente al domicilio', time: 'Hace 2 horas · CABA', type: 'FOTO', icon: Camera },
  { id: '2', title: 'Registro de situación', time: 'Hace 5 horas · Zona Norte', type: 'VIDEO', icon: Video },
  { id: '3', title: 'Nota de voz - Testimonio', time: 'Ayer 21:30 · 2:30 min', type: 'AUDIO', icon: Mic },
  { id: '4', title: 'Descripción de incidente', time: 'Ayer 14:10 · Nota', type: 'NOTA', icon: FileText },
  { id: '5', title: 'Captura de conversación', time: 'Ayer 11:45 · Captura', type: 'CAPTURA', icon: Smartphone },
];

// Mapeo tipo → variable CSS (para íconos)
const typeVarMap: Record<RecordType, ThemeVarName> = {
  FOTO: '--color-main-500',
  VIDEO: '--color-error',
  AUDIO: '--color-warning',
  NOTA: '--color-success',
  CAPTURA: '--color-main-500',
};

// Mapeo tipo → clases Tailwind (para badges)
const typeBadgeMap: Record<RecordType, string> = {
  FOTO: 'bg-main-500 border-main-500 text-surface-0',
  VIDEO: 'bg-error-bg border-error-border text-error-fg',
  AUDIO: 'bg-warning-bg border-warning-border text-warning-fg',
  NOTA: 'bg-success-bg border-success-border text-success-fg',
  CAPTURA: 'bg-main-500 border-main-500 text-surface-0',
};

export default function HistoryScreen() {
  const router = useRouter();
  const { getVar } = useAppTheme();

  // Colores para props nativas (íconos)
  const primaryColor = getVar('--color-main-500');
  const mutedColor = getVar('--color-content-muted');

  // Colores para chips activos (inline style porque son condicionales)
  const chipActiveBg = getVar('--color-main-500');
  const chipActiveFg = getVar('--color-surface-0');

  const [activeFilter, setActiveFilter] = useState('ALL');

  const filteredRecords =
    activeFilter === 'ALL' ? RECORDS : RECORDS.filter((r) => r.type === activeFilter);

  return (
    <ScreenCustom safeTop>
      <ScrollView className="flex-1 px-4" showsVerticalScrollIndicator={false}>
        <View className="flex-row items-center gap-2 mb-3">
          <Folder color={primaryColor} size={24} />
          <Text className="text-xl font-bold text-content">Historial</Text>
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
                    isActive ? 'bg-main-500 border-main-500' : 'bg-surface-1 border-border'
                  }`}
                >
                  <Text
                    className={`text-sm font-medium ${
                      isActive ? 'text-surface-0' : 'text-content-muted'
                    }`}
                  >
                    {filter.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </ScrollView>

        {/* Records List */}
        <View className="rounded-2xl border mb-4 overflow-hidden bg-surface-1 border-border">
          {filteredRecords.map((item, index) => {
            const IconComponent = item.icon;
            const iconColor = getVar(typeVarMap[item.type]);

            return (
              <TouchableOpacity
                key={item.id}
                className={`flex-row items-center gap-3 p-4 bg-surface-1 active:opacity-70 ${
                  index !== filteredRecords.length - 1 ? 'border-b border-border' : ''
                }`}
              >
                <View className="w-12 h-12 rounded-xl items-center justify-center border bg-surface-1 border-border">
                  <IconComponent color={iconColor} size={22} />
                </View>

                <View className="flex-1">
                  <Text className="text-sm font-medium text-content">
                    {item.title}
                  </Text>
                  <Text className="text-xs my-0.5 text-content-muted">
                    {item.time}
                  </Text>
                  <View className="flex-row">
                    <Text
                      className={`text-[10px] px-2 py-0.5 rounded-full font-semibold border ${typeBadgeMap[item.type]}`}
                    >
                      {item.type}
                    </Text>
                  </View>
                </View>

                <ChevronRight color={mutedColor} size={20} />
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Audit Access */}
        <TouchableOpacity
          onPress={() => router.push('/audit/history')}
          className="py-3 rounded-full flex-row items-center justify-center gap-2 mb-6 border bg-main-700 border-main-500 active:opacity-80"
        >
          <ShieldCheck color={primaryColor} size={18} />
          <Text className="font-semibold text-content">Ver auditoría de eventos</Text>
        </TouchableOpacity>
      </ScrollView>
    </ScreenCustom>
  );
}