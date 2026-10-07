// src/features/contact/screens/ContactEditScreen.tsx
import { useMemo, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { ScreenCustom } from '@shared/components/ScreenCustom';
import { useAppTheme } from '@shared/context/ThemeProvider';
import {
  ArrowLeft,
  User,
  Mail,
  Phone,
  Save,
  Trash2,
  UserCog,
} from 'lucide-react-native';
import {
  useUpdateContact,
  useDeleteContact,
} from '@features/contact/hooks/contactHooks';
import type {
  Contact,
  UpdateContactRequest,
} from '@features/contact/types/contactTypes';

interface FormState {
  name: string;
  email: string;
  phone: string;
}

export default function ContactEditScreen() {
  const router = useRouter();
  const { getVar } = useAppTheme();

  // Colores para props nativas (íconos, TextInput)
  const primaryColor = getVar('--color-main-500');
  const mutedColor = getVar('--color-content-muted');
  const contentColor = getVar('--color-content');
  const errorColor = getVar('--color-error');

  // 👇 params que vienen del router.push del listado
  const params = useLocalSearchParams<{ id: string; contact?: string }>();

  // 👇 parseamos el contacto que viene serializado
  const initialContact: Contact | null = useMemo(() => {
    if (!params.contact) return null;
    try {
      return JSON.parse(params.contact) as Contact;
    } catch {
      return null;
    }
  }, [params.contact]);

  // ⚠️ fallback: si no vino el contacto por params (deep link, reload),
  // podés usar useContactById(params.id) acá.
  // Por ahora devolvemos un placeholder para que no rompa.
  if (!initialContact) {
    return (
      <ScreenCustom safeTop>
        <View className="flex-1 items-center justify-center">
          <Text className="text-content">Contacto no encontrado.</Text>
          <TouchableOpacity
            onPress={() => router.back()}
            className="mt-4 px-4 py-2 rounded-xl bg-main-500"
          >
            <Text className="text-white font-semibold">Volver</Text>
          </TouchableOpacity>
        </View>
      </ScreenCustom>
    );
  }

  const [form, setForm] = useState<FormState>({
    name: initialContact.name ?? '',
    email: initialContact.email ?? '',
    phone: initialContact.phone ?? '',
  });

  const handleChange = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  // Detecta cambios reales contra el estado original
  const isDirty =
    form.name.trim() !== (initialContact.name ?? '') ||
    form.email.trim() !== (initialContact.email ?? '') ||
    form.phone.trim() !== (initialContact.phone ?? '');

  const isFormValid =
    form.name.trim().length > 0 && form.phone.trim().length > 0;

  const updateContact = useUpdateContact();
  const deleteContact = useDeleteContact();

  const handleSave = async () => {
    if (!isFormValid) {
      Alert.alert('Campos incompletos', 'Nombre y teléfono son obligatorios.');
      return;
    }
    if (!isDirty) return;

    try {
      const payload: UpdateContactRequest = {
        name: form.name.trim(),
        phone: form.phone.trim(),
        email: form.email.trim() || undefined,
      };
      await updateContact.mutateAsync({ id: initialContact.id, payload });
      router.back();
    } catch (error: any) {
      const msg =
        error.response?.data?.message || 'No se pudo actualizar el contacto.';
      Alert.alert('Error', msg);
    }
  };

  const handleDelete = () => {
    Alert.alert(
      'Eliminar contacto',
      `¿Seguro que querés eliminar a ${initialContact.name}? Esta acción no se puede deshacer.`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteContact.mutateAsync(initialContact.id);
              router.back();
            } catch (error: any) {
              const msg =
                error.response?.data?.message ||
                'No se pudo eliminar el contacto.';
              Alert.alert('Error', msg);
            }
          },
        },
      ]
    );
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
            <ArrowLeft color={contentColor} size={20} />
          </TouchableOpacity>

          <View className="flex-1 flex-row gap-2 items-center ms-2">
            <UserCog color={primaryColor} size={20} />
            <Text className="text-content text-lg font-bold">
              Editar Contacto
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

          {/* Guardar */}
          <TouchableOpacity
            onPress={handleSave}
            disabled={!isDirty || !isFormValid || updateContact.isPending}
            className={`w-full py-4 rounded-2xl border border-main-300
              flex-row items-center justify-center gap-2 mb-3 bg-main-700 active:opacity-80
              ${!isDirty || !isFormValid || updateContact.isPending ? 'opacity-40' : ''}`}
          >
            <Save color={getVar('--color-white')} size={20} />
            <Text className="text-white font-bold text-lg">
              {updateContact.isPending ? 'Guardando...' : 'Guardar cambios'}
            </Text>
          </TouchableOpacity>

          {/* Eliminar */}
          <TouchableOpacity
            onPress={handleDelete}
            disabled={deleteContact.isPending}
            className={`w-full py-4 rounded-2xl border border-error-border
              flex-row items-center justify-center gap-2 mb-4 bg-error-bg active:opacity-80
              ${deleteContact.isPending ? 'opacity-40' : ''}`}
          >
            <Trash2 color={errorColor} size={20} />
            <Text className="text-error-fg font-bold text-lg">
              {deleteContact.isPending ? 'Eliminando...' : 'Eliminar contacto'}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </ScreenCustom>
  );
}