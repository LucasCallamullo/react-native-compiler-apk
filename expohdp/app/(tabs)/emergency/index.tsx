import { View, Text, ScrollView, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
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
import { useContacts } from '@features/contact/hooks/contactHooks';


export default function EmergencyScreen() {
  const router = useRouter();

  const { theme, setTheme, getVar } = useAppTheme();

  // Colores para props nativas (íconos)
  const errorColor = getVar('--color-error');
  const successColor = getVar('--color-success');
  const mainFgColor = getVar('--color-surface-0'); // texto sobre fondos main

  const triggerEmergency = () => {
    Alert.alert(
      'Alerta enviada',
      'Se ha notificado a todos tus contactos con tu ubicación en tiempo real.'
    );
  };

  // Hooks for contact
  const { data: contacts = [], isLoading, error } = useContacts();

  if (isLoading) {
    return (
      <ScreenCustom safeTop>
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator />
        </View>
      </ScreenCustom>
    );
  }

  if (error) {
    return (
      <ScreenCustom safeTop>
        <View className="flex-1 items-center justify-center">
          <Text className="text-error-fg">Error al cargar contactos</Text>
        </View>
      </ScreenCustom>
    );
  }


  return (
    <ScreenCustom safeTop>
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View className="flex-row items-center gap-3 mb-3">
          <AlertTriangle color={errorColor} size={28} />
          <Text className="text-3xl font-bold text-content">Emergencias</Text>
        </View>

        <Text className="text-base mb-5 text-content-muted">
          Contactos de emergencia y ubicación en tiempo real
        </Text>

        {/* Panic Button */}
        <TouchableOpacity
          onPress={triggerEmergency}
          className="py-4 rounded-2xl items-center justify-center flex-row gap-2 border mb-5 
            active:opacity-80 bg-error-bg border-error-border"
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
              <Text className="font-semibold text-base text-success">
                Ubicación en tiempo real
              </Text>
            </View>
            <Text className="text-sm text-content">
              -34.6037, -58.3816 · CABA
            </Text>
            <Text className="text-xs mt-1 text-success">
              Actualizando cada 5 segundos
            </Text>
          </View>
          <TouchableOpacity className="px-3 py-2 rounded-full flex-row items-center gap-1 active:opacity-80 bg-success-border">
            <Share2 color={'#ffffff'} size={14} />
            <Text className="text-white text-sm font-semibold">Compartir</Text>
          </TouchableOpacity>
        </View>

        {/* Emergency Contacts */}
        <Text className="text-lg font-bold mb-3 text-content">
          Contactos de emergencia
        </Text>

        <View className="gap-3 mb-5">
          {contacts.map((contact) => (
            
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
              <TouchableOpacity className="bg-main-500 border-main-300 px-3 py-2 rounded-full 
                flex-row items-center gap-1.5 active:opacity-80">
                <PhoneCall color={'#ffffff'} size={15} />
                <Text className="text-white font-semibold text-sm">Llamar</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>

        {/* Add Contact Button */}
        <TouchableOpacity
          onPress={() => router.push('/emergency/new_contact')}
          className="py-3 rounded-full flex-row items-center justify-center gap-2 mb-6 active:opacity-80 
            border bg-main-700 border-main-500"
        >
          <UserPlus color={'#fccee8'} size={18} />
          <Text className="font-semibold text-pink-200">
            Agregar contacto de emergencia
          </Text>
        </TouchableOpacity>



        {/* Quick theme switcher */}
        
        <TouchableOpacity
          onPress={() =>
            setTheme(
              theme === 'theme-dark'
                ? 'theme-light'
                : theme === 'theme-light'
                ? 'theme-pink'
                : theme === 'theme-pink'
                ? 'theme-blue'
                : 'theme-dark'
            )
          }
          className="rounded-xl p-2.5 my-2 flex-row justify-between items-center border bg-surface-1 border-border"
        >
          <Text className="text-xs font-semibold text-content-muted">
            Tema actual: <Text className="font-bold text-main-500">{theme}</Text>
          </Text>
          <Text className="text-xs font-bold text-main-500">Cambiar Tema</Text>
        </TouchableOpacity>

      </ScrollView>
    </ScreenCustom>
  );
}