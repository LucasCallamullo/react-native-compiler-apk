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
} from 'lucide-react-native';

// Types
interface Contact {
  id: string;
  name: string;
  phone: string;
  initial: string;
}

const CONTACTS: Contact[] = [
  { id: '1', name: 'Juan Pérez', phone: '+54 11 2345-6789', initial: 'J' },
  { id: '2', name: 'María García', phone: '+54 11 3456-7890', initial: 'M' },
  { id: '3', name: 'Luis Fernández', phone: '+54 11 4567-8901', initial: 'L' },
];

export default function EmergencyScreen() {
  const router = useRouter();
  const { getVar } = useAppTheme();

  // Colores para props nativas (íconos)
  const errorColor = getVar('--color-error');
  const successColor = getVar('--color-success');
  const primaryColor = getVar('--color-main-500');
  const mainFgColor = getVar('--color-surface-0'); // texto sobre fondos main
  const white = '#ffffff';

  const triggerEmergency = () => {
    Alert.alert(
      '🚨 Alerta enviada',
      'Se ha notificado a todos tus contactos con tu ubicación en tiempo real.'
    );
  };

  return (
    <ScreenCustom safeTop>
      <ScrollView className="flex-1 px-4" showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View className="flex-row items-center gap-2 mb-1">
          <AlertTriangle color={errorColor} size={24} />
          <Text className="text-xl font-bold text-content">Emergencias</Text>
        </View>

        <Text className="text-sm mb-4 text-content-muted">
          Contactos de emergencia y ubicación en tiempo real
        </Text>

        {/* Panic Button */}
        <TouchableOpacity
          onPress={triggerEmergency}
          className="py-4 rounded-2xl items-center justify-center flex-row gap-2 border mb-5 active:opacity-80 bg-error-bg border-error-border"
        >
          <Siren color={errorColor} size={24} />
          <Text className="text-error-fg font-bold text-base">
            ¡EMERGENCIA! (Llamar a todos)
          </Text>
        </TouchableOpacity>

        {/* GPS Card */}
        <View className="rounded-2xl p-4 flex-row items-center justify-between mb-5 border bg-success-bg border-success-border">
          <View className="flex-1 pr-2">
            <View className="flex-row items-center gap-1.5 mb-1">
              <MapPin color={successColor} size={16} />
              <Text className="font-semibold text-sm text-success-fg">
                Ubicación en tiempo real
              </Text>
            </View>
            <Text className="text-xs text-content">
              -34.6037, -58.3816 · CABA
            </Text>
            <Text className="text-[10px] mt-1 text-success-fg">
              Actualizando cada 5 segundos
            </Text>
          </View>
          <TouchableOpacity className="px-3 py-2 rounded-full flex-row items-center gap-1 active:opacity-80 bg-success">
            <Share2 color={white} size={14} />
            <Text className="text-white text-xs font-semibold">Compartir</Text>
          </TouchableOpacity>
        </View>

        {/* Emergency Contacts */}
        <Text className="text-base font-bold mb-3 text-content">
          Contactos de emergencia
        </Text>

        <View className="gap-3 mb-5">
          {CONTACTS.map((contact) => (
            <View
              key={contact.id}
              className="flex-row items-center rounded-2xl p-3 border bg-surface-1 border-border"
            >
              <View className="w-10 h-10 rounded-full items-center justify-center mr-3 border bg-surface-1 border-border">
                <Text className="font-bold text-main-500">
                  {contact.initial}
                </Text>
              </View>
              <View className="flex-1">
                <Text className="font-medium text-content">
                  {contact.name}
                </Text>
                <Text className="text-xs text-content-muted">
                  {contact.phone}
                </Text>
              </View>
              <TouchableOpacity className="bg-main-500 px-3 py-2 rounded-full flex-row items-center gap-1.5 active:opacity-80">
                <PhoneCall color={mainFgColor} size={14} />
                <Text className="text-surface-0 font-semibold text-xs">Llamar</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>

        {/* Add Contact Button */}
        <TouchableOpacity
          onPress={() => router.push('/emergency/new_contact')}
          className="py-3 rounded-full flex-row items-center justify-center gap-2 mb-6 active:opacity-80 border bg-main-700 border-main-500"
        >
          <UserPlus color={primaryColor} size={18} />
          <Text className="font-semibold text-content">
            Agregar contacto de emergencia
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </ScreenCustom>
  );
}