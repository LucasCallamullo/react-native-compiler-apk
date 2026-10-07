import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { ScreenCustom } from '@shared/components/ScreenCustom';
import { useAppTheme, type ThemeVarName } from '@shared/context/ThemeProvider';
import {
  Lock,
  Camera,
  Share2,
  Siren,
  Mic,
  MapPin,
  ArrowLeft,
  Download,
  ShieldCheck,
} from 'lucide-react-native';

// Types
interface AuditEvent {
  id: string;
  icon: React.ComponentType<{ color: string; size: number }>;
  title: string;
  details: string;
  timestamp: string;
  badgeText: string;
}

const AUDIT_EVENTS: AuditEvent[] = [
  {
    id: '1',
    icon: Lock,
    title: 'Inicio de sesión',
    details: 'Usuario: ana@demo.com · IP: 192.168.1.10',
    timestamp: 'Hoy 09:15 · COMPLETADO',
    badgeText: 'OK',
  },
  {
    id: '2',
    icon: Camera,
    title: 'Registro guardado',
    details: 'Foto subida · ID: #F-2026-001',
    timestamp: 'Hoy 10:30 · COMPLETADO',
    badgeText: 'OK',
  },
  {
    id: '3',
    icon: Share2,
    title: 'Link compartido',
    details: 'Historial enviado a contacto: Juan',
    timestamp: 'Hoy 11:05 · COMPLETADO',
    badgeText: 'OK',
  },
  {
    id: '4',
    icon: Siren,
    title: 'Alerta de emergencia',
    details: 'Ubicación enviada a contactos de emergencia',
    timestamp: 'Ayer 23:45 · COMPLETADO',
    badgeText: 'URGENTE',
  },
  {
    id: '5',
    icon: Mic,
    title: 'Grabación de audio',
    details: 'Nota de voz guardada · Duración: 2:30 min',
    timestamp: 'Ayer 21:30 · COMPLETADO',
    badgeText: 'AUDIO',
  },
  {
    id: '6',
    icon: MapPin,
    title: 'Ubicación compartida',
    details: 'En tiempo real · Contacto: María',
    timestamp: 'Ayer 16:45 · IN_PROGRESS',
    badgeText: '⏳ EN PROCESO',
  },
];

// Mapeo por nombre de ícono → variable CSS
const iconVarMap: Record<string, ThemeVarName> = {
  Lock: '--color-info',
  Camera: '--color-main-500',
  Share2: '--color-success',
  Siren: '--color-error',
  Mic: '--color-warning',
  MapPin: '--color-warning',
};

// Mapeo por badge → clases Tailwind
const badgeClassMap: Record<string, string> = {
  OK: 'bg-success-bg border-success-border text-success-fg',
  URGENTE: 'bg-error-bg border-error-border text-error-fg',
  AUDIO: 'bg-warning-bg border-warning-border text-warning-fg',
  '⏳ EN PROCESO': 'bg-warning-bg border-warning-border text-warning-fg',
};

export default function AuditScreen() {
  const router = useRouter();
  const { getVar } = useAppTheme();

  // Colores para props nativas (íconos)
  const contentColor = getVar('--color-content');
  const primaryColor = getVar('--color-main-500');

  return (
    <ScreenCustom safeTop>
      <ScrollView className="flex-1 px-4" showsVerticalScrollIndicator={false}>
        <View className="flex-row items-center gap-2 mb-1">
          <ShieldCheck color={primaryColor} size={24} />
          <Text className="text-xl font-bold text-content">
            Auditoría de Eventos
          </Text>
        </View>
        <Text className="text-sm mb-4 text-content-muted">
          Registro de todas las acciones realizadas en la app
        </Text>

        {/* Events List */}
        <View className="rounded-2xl border mb-5 overflow-hidden bg-surface-1 border-border">
          {AUDIT_EVENTS.map((event, index) => {
            const IconComponent = event.icon;
            const iconVar = iconVarMap[event.icon.name] ?? '--color-main-500';
            const iconColor = getVar(iconVar);
            const badgeClasses =
              badgeClassMap[event.badgeText] ??
              'bg-main-500 border-main-500 text-surface-0';

            return (
              <View
                key={event.id}
                className={`flex-row gap-3 p-4 items-start bg-surface-1 ${
                  index !== AUDIT_EVENTS.length - 1 ? 'border-b border-border' : ''
                }`}
              >
                <View className="p-2 rounded-xl border mt-0.5 bg-surface-1 border-border">
                  <IconComponent color={iconColor} size={20} />
                </View>

                <View className="flex-1">
                  <Text className="text-sm font-medium text-content">
                    {event.title}
                  </Text>
                  <Text className="text-xs my-0.5 text-content-muted">
                    {event.details}
                  </Text>
                  <Text className="text-[11px] text-content-muted">
                    {event.timestamp}
                  </Text>
                </View>

                <View className={`px-2.5 py-1 rounded-full border ${badgeClasses}`}>
                  <Text className="text-[10px] font-semibold">{event.badgeText}</Text>
                </View>
              </View>
            );
          })}
        </View>

        {/* Action Buttons */}
        <View className="flex-row gap-3 mb-6">
          <TouchableOpacity
            onPress={() => router.back()}
            className="flex-1 py-3 rounded-full flex-row items-center justify-center gap-2 border active:opacity-70 bg-surface-1 border-border"
          >
            <ArrowLeft color={contentColor} size={18} />
            <Text className="font-semibold text-content">Volver</Text>
          </TouchableOpacity>

          <TouchableOpacity className="flex-2 py-3 rounded-full flex-row items-center justify-center gap-2 active:opacity-80 bg-main-500">
            <Download color={contentColor} size={18} />
            <Text className="text-surface-0 font-semibold">Exportar auditoría</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </ScreenCustom>
  );
}