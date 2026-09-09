import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { ScreenCustom } from '@shared/components/ScreenCustom';
import { useAppTheme } from '@shared/context/ThemeProvider';
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

// Badge color mapping
const badgeColorMap: Record<string, string> = {
  OK: 'bg-success border-success text-success',
  URGENTE: 'bg-error border-error text-error',
  AUDIO: 'bg-warning border-warning text-warning',
  '⏳ EN PROCESO': 'bg-warning border-warning text-warning',
};

// Icon color mapping
const iconColorMap: Record<string, string> = {
  Lock: 'text-info',
  Camera: 'text-primary',
  Share2: 'text-success',
  Siren: 'text-error',
  Mic: 'text-warning',
  MapPin: 'text-warning',
};

export default function AuditScreen() {
  const router = useRouter();
  const { getColor } = useAppTheme();

  // Dynamic colors from theme
  const fgColor = getColor('text-fg');
  const fgMutedColor = getColor('text-fg-muted');
  const cardBgColor = getColor('bg-card');
  const borderColor = getColor('border-border');
  const primaryColor = getColor('text-primary');
  const primaryFgColor = getColor('text-primary-fg');

  // Get icon color based on icon name
  const getIconColor = (iconName: string): string => {
    const colorKey = iconColorMap[iconName] || 'text-primary';
    return getColor(colorKey as any);
  };

  // Get badge classes based on badge text
  const getBadgeClasses = (badgeText: string): string => {
    return badgeColorMap[badgeText] || 'bg-primary border-primary text-primary-fg';
  };

  return (
    <ScreenCustom safeTop>
      <ScrollView className="flex-1 px-4" showsVerticalScrollIndicator={false}>
        <View className="flex-row items-center gap-2 mb-1">
          <ShieldCheck color={primaryColor} size={24} />
          <Text className="text-xl font-bold" style={{ color: fgColor }}>
            Auditoría de Eventos
          </Text>
        </View>
        <Text className="text-sm mb-4" style={{ color: fgMutedColor }}>
          Registro de todas las acciones realizadas en la app
        </Text>

        {/* Events List */}
        <View
          className="rounded-2xl border mb-5 overflow-hidden"
          style={{
            backgroundColor: cardBgColor,
            borderColor: borderColor,
          }}
        >
          {AUDIT_EVENTS.map((event, index) => {
            const IconComponent = event.icon;
            const iconColor = getIconColor(event.icon.name);
            const badgeClasses = getBadgeClasses(event.badgeText);

            return (
              <View
                key={event.id}
                className={`flex-row gap-3 p-4 items-start ${
                  index !== AUDIT_EVENTS.length - 1 ? 'border-b border-border' : ''
                }`}
                style={{
                  backgroundColor: cardBgColor,
                }}
              >
                <View
                  className="p-2 rounded-xl border mt-0.5"
                  style={{
                    backgroundColor: cardBgColor,
                    borderColor: borderColor,
                  }}
                >
                  <IconComponent color={iconColor} size={20} />
                </View>

                <View className="flex-1">
                  <Text className="text-sm font-medium" style={{ color: fgColor }}>
                    {event.title}
                  </Text>
                  <Text className="text-xs my-0.5" style={{ color: fgMutedColor }}>
                    {event.details}
                  </Text>
                  <Text className="text-[11px]" style={{ color: fgMutedColor }}>
                    {event.timestamp}
                  </Text>
                </View>

                <View
                  className={`px-2.5 py-1 rounded-full border ${badgeClasses}`}
                >
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
            className="flex-1 py-3 rounded-full flex-row items-center justify-center gap-2 border active:opacity-70"
            style={{
              backgroundColor: cardBgColor,
              borderColor: borderColor,
            }}
          >
            <ArrowLeft color={fgColor} size={18} />
            <Text className="font-semibold" style={{ color: fgColor }}>
              Volver
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            className="flex-2 py-3 rounded-full flex-row items-center justify-center gap-2 active:opacity-80"
            style={{ backgroundColor: primaryColor }}
          >
            <Download color={primaryFgColor} size={18} />
            <Text className="text-primary-fg font-semibold">Exportar auditoría</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </ScreenCustom>
  );
}