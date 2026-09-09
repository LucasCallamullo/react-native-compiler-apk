import { View, Text, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { ScreenCustom } from '@shared/components/ScreenCustom';
import { useAppTheme } from '@shared/context/ThemeProvider';
import {
  Siren,
  MapPin,
  Share2,
  PhoneCall,
  UserPlus,
  AlertTriangle,
  ArrowLeft,
} from 'lucide-react-native';

// Types
interface Contact {
  id: string;
  name: string;
  phone: string;
  initial: string;
}

// Mock data - replace with actual contacts from your app
const CONTACTS: Contact[] = [
  { id: '1', name: 'Juan Pérez', phone: '+54 11 2345-6789', initial: 'J' },
  { id: '2', name: 'María García', phone: '+54 11 3456-7890', initial: 'M' },
  { id: '3', name: 'Luis Fernández', phone: '+54 11 4567-8901', initial: 'L' },
];

export default function EmergencyScreen() {
  const router = useRouter();
  const { getColor } = useAppTheme();

  // Dynamic colors from theme
  const fgColor = getColor('text-fg');
  const fgMutedColor = getColor('text-fg-muted');
  const cardBgColor = getColor('bg-card');
  const borderColor = getColor('border-border');
  const primaryColor = getColor('text-primary');
  const primaryFgColor = getColor('text-primary-fg');

  // Status colors
  const errorColor = getColor('text-error');
  const errorBgColor = getColor('bg-error');
  const errorBorderColor = getColor('border-error');
  const successColor = getColor('text-success');
  const successBgColor = getColor('bg-success');
  const successBorderColor = getColor('border-success');
  const purpleLightColor = getColor('bg-purple-light');
  const purpleBgColor = getColor('bg-purple-bg');
  const purpleBorderColor = getColor('border-purple');

  const triggerEmergency = () => {
    Alert.alert(
      '🚨 Alerta enviada',
      'Se ha notificado a todos tus contactos con tu ubicación en tiempo real.'
    );
  };

  return (
    <ScreenCustom safeTop>
      <ScrollView className="flex-1 px-4" showsVerticalScrollIndicator={false}>
        {/* Header with back button */}
        <View className="flex-row items-center gap-3 mb-1">
          <TouchableOpacity
            onPress={() => router.back()}
            className="w-10 h-10 rounded-full border items-center justify-center active:opacity-70"
            style={{
              backgroundColor: cardBgColor,
              borderColor: borderColor,
            }}
          >
            <ArrowLeft color={fgColor} size={20} />
          </TouchableOpacity>
          <View className="flex-row items-center gap-2">
            <AlertTriangle color={errorColor} size={24} />
            <Text className="text-xl font-bold" style={{ color: fgColor }}>
              Emergencias
            </Text>
          </View>
        </View>

        <Text className="text-sm mb-4" style={{ color: fgMutedColor }}>
          Contactos de emergencia y ubicación en tiempo real
        </Text>

        {/* Panic Button */}
        <TouchableOpacity
          onPress={triggerEmergency}
          className="py-4 rounded-2xl items-center justify-center flex-row gap-2 border mb-5 active:opacity-80"
          style={{
            backgroundColor: errorBgColor,
            borderColor: errorBorderColor,
          }}
        >
          <Siren color="#ffffff" size={24} />
          <Text className="text-primary font-bold text-base">
            ¡EMERGENCIA! (Llamar a todos)
          </Text>
        </TouchableOpacity>

        {/* GPS Card */}
        <View
          className="rounded-2xl p-4 flex-row items-center justify-between mb-5 border"
          style={{
            backgroundColor: successBgColor,
            borderColor: successBorderColor,
          }}
        >
          <View className="flex-1 pr-2">
            <View className="flex-row items-center gap-1.5 mb-1">
              <MapPin color={successColor} size={16} />
              <Text className="font-semibold text-sm" style={{ color: successColor }}>
                Ubicación en tiempo real
              </Text>
            </View>
            <Text className="text-xs" style={{ color: fgColor }}>
              -34.6037, -58.3816 · CABA
            </Text>
            <Text className="text-[10px] mt-1" style={{ color: successColor }}>
              Actualizando cada 5 segundos
            </Text>
          </View>
          <TouchableOpacity
            className="px-3 py-2 rounded-full flex-row items-center gap-1 active:opacity-80"
            style={{ backgroundColor: successColor }}
          >
            <Share2 color="#ffffff" size={14} />
            <Text className="text-white text-xs font-semibold">Compartir</Text>
          </TouchableOpacity>
        </View>

        {/* Emergency Contacts */}
        <Text className="text-base font-bold mb-3" style={{ color: fgColor }}>
          Contactos de emergencia
        </Text>

        <View className="gap-3 mb-5">
          {CONTACTS.map((contact) => (
            <View
              key={contact.id}
              className="flex-row items-center rounded-2xl p-3 border"
              style={{
                backgroundColor: cardBgColor,
                borderColor: borderColor,
              }}
            >
              <View
                className="w-10 h-10 rounded-full items-center justify-center mr-3 border"
                style={{
                  backgroundColor: cardBgColor,
                  borderColor: borderColor,
                }}
              >
                <Text className="font-bold" style={{ color: primaryColor }}>
                  {contact.initial}
                </Text>
              </View>
              <View className="flex-1">
                <Text className="font-medium" style={{ color: fgColor }}>
                  {contact.name}
                </Text>
                <Text className="text-xs" style={{ color: fgMutedColor }}>
                  {contact.phone}
                </Text>
              </View>
              <TouchableOpacity className="bg-primary px-3 py-2 rounded-full flex-row items-center gap-1.5 active:opacity-80">
                <PhoneCall color={primaryFgColor} size={14} />
                <Text className="text-primary-fg font-semibold text-xs">Llamar</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>

        {/* Add Contact Button */}
        <TouchableOpacity
          className="py-3 rounded-full flex-row items-center justify-center gap-2 mb-6 active:opacity-80 border"
          style={{
            backgroundColor: purpleBgColor,
            borderColor: purpleBorderColor,
          }}
        >
          <UserPlus color={purpleLightColor} size={18} />
          <Text className="font-semibold" style={{ color: purpleLightColor }}>
            Agregar contacto de emergencia
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </ScreenCustom>
  );
}