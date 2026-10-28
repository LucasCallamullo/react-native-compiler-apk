import { View, Text, TouchableOpacity, Alert, ActivityIndicator, Linking } from 'react-native';
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
import { LocationIndicator } from '@features/geo/components/LocationIndicator';
import { useLocation } from '@features/geo/hooks/useLocation';
import EditableForm from '@shared/components/custom/EditableForm';
import { useState } from 'react';

import Storage from 'expo-sqlite/kv-store';

export default function EmergencyScreen() {
  const router = useRouter();

  const { theme, setTheme, getVar } = useAppTheme();

  // Colores para props nativas (íconos)
  const errorColor = getVar('--color-error');
  const successColor = getVar('--color-success');

  const triggerEmergency = () => {
    Alert.alert(
      'Alerta enviada',
      'Se ha notificado a todos tus contactos con tu ubicación en tiempo real.'
    );
  };

  // Location — encapsulado en el hook
  const {
    location,
    status: locationStatus,
    isLoading: locationLoading,
    error: locationError,
    request: requestLocation,
    refresh: refreshLocation,
  } = useLocation({ autoRequest: true });

  // Hooks for contact
  const { data: contacts = [], isLoading, error } = useContacts();

  // Message state 
  const [message, setMessage] = useState<string>(() => {
    try {
      return Storage.getItemSync('emergency_default_message') 
        ?? '¡Emergencia! Necesito ayuda. Esta es mi ubicación actual:';
    } catch {
      return '¡Emergencia! Necesito ayuda. Esta es mi ubicación actual:';
    }
  });

  const openWhatsAppWithLocation = (phoneNumber: string) => {
    // 1. Verificar que tenemos ubicación
    if (!location || location.coords.latitude == null || location.coords.longitude == null) {
      Alert.alert('Ubicación no disponible', 'No se pudo obtener tu ubicación actual para compartirla.');
      return;
    }

    const { latitude, longitude } = location.coords;

    // 2. Crear el enlace de Google Maps
    const mapsUrl = `https://www.google.com/maps?q=${latitude},${longitude}`;

    // 3. Componer el mensaje (puedes personalizarlo) - Usa el mensaje editado por el usuario + la ubicación
    const fullMessage = `${message} ${mapsUrl}`;

    // 4. Construir la URL de WhatsApp
    // Limpiar el número de teléfono (quitar espacios, guiones, etc.)
    const cleanPhone = phoneNumber.replace(/[^0-9]/g, '');
    const whatsappUrl = `whatsapp://send?phone=${cleanPhone}&text=${encodeURIComponent(fullMessage)}`;

    // 5. Abrir WhatsApp
    Linking.openURL(whatsappUrl).catch(() => {
      Alert.alert('Error', whatsappUrl || 'No se pudo abrir WhatsApp. Asegúrate de que esté instalado.');
    });
  };









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
      {/* Header */}
      <View className="flex-row items-center gap-3 mb-3">
        <AlertTriangle color={errorColor} size={28} />
        <Text className="text-3xl font-bold text-content">Emergencias</Text>
      </View>

      <Text className="text-lg mb-5 text-content-muted">
        Contactos de emergencia y ubicación en tiempo real
      </Text>

      {/* Panic Button */}
      <TouchableOpacity
        onPress={triggerEmergency}
        className="py-4 rounded-2xl items-center justify-center flex-row gap-2 border mb-5 
          active:opacity-80 bg-error-bg border-error-border"
      >
        <Siren color={errorColor} size={24} />
        <Text className="text-error-fg font-bold text-lg">
          ¡EMERGENCIA! (Llamar a todos)
        </Text>
      </TouchableOpacity>

      {/* GPS Card */}
      {/* Location — toda la lógica vive afuera */}
      <LocationIndicator
        location={location}
        status={locationStatus}
        isLoading={locationLoading}
        error={locationError}
        onRequest={requestLocation}
        onRefresh={refreshLocation}
      />

      <EditableForm value={message} onChangeText={setMessage} />

      {/* Emergency Contacts */}
      <Text className="text-2xl font-bold mb-3 mt-3 text-content">
        Contactos de emergencia
      </Text>

      <View className="gap-3.5 mb-6">
        {contacts.map((contact) => (
          <View
            key={contact.id}
            className="flex-row gap-3 items-center rounded-2xl p-3 border bg-surface-1 border-border"
          >
            <TouchableOpacity
              onPress={() =>
                router.push({
                  pathname: '/contacts/[id]/edit',
                  params: {
                    id: contact.id,
                    // pasamos el contacto serializado para no pegarle al server
                    contact: JSON.stringify(contact),
                  },
                })
              }
              className="w-11 h-11 rounded-full items-center justify-center border 
              bg-surface-1 border-border active:opacity-70"
            >
              <Text className="font-bold text-main-500 text-lg">{contact.initial}</Text>
            </TouchableOpacity>

            <View className="flex-1 gap-1">
              <Text className="font-medium text-content">{contact.name}</Text>
              <Text className="text-sm text-content-muted">{contact.phone}</Text>
            </View>

            <TouchableOpacity 
              onPress={() => openWhatsAppWithLocation(contact.phone)}
              className="px-3 py-2 rounded-full flex-row items-center gap-2 active:opacity-80 bg-success-border"
            >
              <Share2 color={'#ffffff'} size={16} />
              <Text className="text-white text-base font-semibold">WhatsApp</Text>
            </TouchableOpacity>

            <TouchableOpacity className="bg-main-500 border-main-300 px-3 
              py-2 rounded-full flex-row items-center gap-2 active:opacity-80">
              <PhoneCall color={'#ffffff'} size={16} />
              <Text className="text-white font-semibold text-base">Llamar</Text>
            </TouchableOpacity>
          </View>
        ))}
      </View>

      {/* Add Contact Button */}
      <TouchableOpacity
        onPress={() => router.push('/contacts/new')}
        className="py-3 rounded-full flex-row items-center justify-center gap-2.5 mb-6 mt-2 
          active:opacity-80 border bg-main-700 border-main-500"
      >
        <UserPlus color={'#fccee8'} size={20} />
        <Text className="font-semibold text-pink-200 text-lg">
          Agregar contacto de emergencia
        </Text>
      </TouchableOpacity>



      {/* Quick theme switcher 
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
      </TouchableOpacity>   */}
 
    </ScreenCustom>
  );
}