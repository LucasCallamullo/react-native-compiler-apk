import { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { ScreenCustom } from '@shared/components/ScreenCustom';
import { useAppTheme } from '@shared/context/ThemeProvider';
import { ArrowLeft, UserPlus, User, Mail, Phone, Save } from 'lucide-react-native';
import { useCreateContact } from '@features/contact/hooks/contactHooks';

interface FormState {
  name: string;
  email: string;
  phone: string;
}

const INITIAL_FORM: FormState = {
  name: '',
  email: '',
  phone: '',
};



export default function ContactNewScreen() {
  const router = useRouter();
  const { getVar } = useAppTheme();

  // Colores para props nativas (íconos, TextInput)
  const primaryColor = getVar('--color-main-500');
  const mutedColor = getVar('--color-content-muted');
  const contentColor = getVar('--color-content');

  const [form, setForm] = useState<FormState>(INITIAL_FORM);

  const handleChange = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const createContact = useCreateContact();
  
  const handleSubmit = async () => {
    if (!form.name.trim() || !form.phone.trim()) {
      Alert.alert('Campos incompletos', 'Nombre y teléfono son obligatorios.');
      return;
    }

    try {
      await createContact.mutateAsync({
        name: form.name.trim(),
        phone: form.phone.trim(),
        email: form.email.trim() || undefined,
      });
      router.back();
    } catch (error: any) {
      const msg = error.response?.data?.message || 'No se pudo guardar el contacto.';
      Alert.alert('Error', msg);
    }
  };

  return (
    <ScreenCustom safeTop>
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* HEADER */}
        <View className="flex-row gap-3 py-2 mb-3 items-center bg-surface-0">
          <TouchableOpacity
            onPress={() => router.back()}
            className="w-10 h-10 rounded-full items-center justify-center border bg-surface-1 border-border"
          >
            <ArrowLeft color={contentColor} size={18} />
          </TouchableOpacity>

          <View className="flex-1 flex-row gap-2 items-center ms-2">
            <UserPlus color={primaryColor} size={20} />
            <Text className="text-content text-lg font-bold">
              Agregar Nuevo Contacto
            </Text>
          </View>
        </View>

        {/* FORM */}
        <View className="pt-3">
          {/* Nombre */}
          <View className="mb-6">
            <Text className="text-base font-semibold mb-2 uppercase tracking-wider text-content-muted">
              Nombre completo
            </Text>
            <View className="flex-row items-center border rounded-xl px-3 py-3 bg-surface-1 border-border">
              <User color={mutedColor} size={20} />
              <TextInput
                value={form.name}
                onChangeText={(val) => handleChange('name', val)}
                placeholder="Mara Ayuda"
                placeholderTextColor={mutedColor}
                autoCapitalize="words"
                className="flex-1 ml-3 text-base text-content"
              />
            </View>
          </View>

          {/* Email */}
          <View className="mb-6">
            <Text className="text-base font-semibold mb-2 uppercase tracking-wider text-content-muted">
              Correo electrónico (opcional)
            </Text>
            <View className="flex-row items-center border rounded-xl px-3 py-3 bg-surface-1 border-border">
              <Mail color={mutedColor} size={20} />
              <TextInput
                value={form.email}
                onChangeText={(val) => handleChange('email', val)}
                placeholder="mara_ayuda@gmail.com"
                placeholderTextColor={mutedColor}
                keyboardType="email-address"
                autoCapitalize="none"
                className="flex-1 ml-3 text-base text-content"
              />
            </View>
          </View>

          {/* Teléfono */}
          <View className="mb-8">
            <Text className="text-base font-semibold mb-2 uppercase tracking-wider text-content-muted">
              Teléfono
            </Text>
            <View className="flex-row items-center border rounded-xl px-3 py-3 bg-surface-1 border-border">
              <Phone color={mutedColor} size={20} />
              <TextInput
                value={form.phone}
                onChangeText={(val) => handleChange('phone', val)}
                placeholder="1123456789"
                placeholderTextColor={mutedColor}
                keyboardType="phone-pad"
                className="flex-1 ml-3 text-base text-content"
              />
            </View>
          </View>

          {/* Botón guardar */}
          <TouchableOpacity
            onPress={handleSubmit}
            disabled={createContact.isPending}
            className="w-full py-4 rounded-2xl border border-main-300
            flex-row items-center justify-center gap-2 mb-4 bg-main-700 active:opacity-80"
          >
            <Save color={getVar('--color-white')} size={20} />
            <Text className="text-white font-bold text-lg">
              {createContact.isPending ? 'Guardando...' : 'Guardar Contacto'}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </ScreenCustom>
  );
}