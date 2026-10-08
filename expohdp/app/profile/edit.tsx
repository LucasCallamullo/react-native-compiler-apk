// app/profile/edit.tsx
import { useMemo, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { ScreenCustom } from '@shared/components/ScreenCustom';
import { AppTextInput } from '@shared/components/custom/AppTextInput';
import { useAppTheme } from '@shared/context/ThemeProvider';
import {
  ArrowLeft,
  User,
  Mail,
  CreditCard,
  Phone,
  Save,
  Trash2,
  UserCog,
} from 'lucide-react-native';
import { useAuth } from '@features/auth/context/AuthContext';
import { useUpdateUser, useDeleteUser } from '@features/auth/hooks/userHooks';
import { validateUserForm, hasErrors, type FormErrors } from '@features/auth/utils/validateUserForm';
import { parseUserFormError } from '@features/auth/utils/parseUserFormError';


interface FormState {
  firstName: string;
  lastName: string;
  email: string;
  dni: string;
  phone: string;
}

export default function UserEditScreen() {
  const router = useRouter();
  const { getVar } = useAppTheme();
  const { user, logout, updateUser: updateUserInContext } = useAuth();

  const primaryColor = getVar('--color-main-500');
  const mutedColor = getVar('--color-content-muted');
  const contentColor = getVar('--color-content');
  const errorColor = getVar('--color-error');

  // Snapshot inicial para comparar cambios
  const initialForm: FormState = useMemo(
    () => ({
      firstName: user?.firstName ?? '',
      lastName: user?.lastName ?? '',
      email: user?.email ?? '',
      dni: user?.dni ?? '',
      phone: user?.phone ?? '',
    }),
    [user]
  );

  const [form, setForm] = useState<FormState>(initialForm);
  const [fieldErrors, setFieldErrors] = useState<FormErrors>({});

  const handleChange = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    // Limpia el error del campo al editarlo
    setFieldErrors((prev) => ({ ...prev, [key]: undefined }));
  };

  // Detecta si hay cambios reales
  const isDirty =
    form.firstName.trim() !== initialForm.firstName.trim() ||
    form.lastName.trim() !== initialForm.lastName.trim() ||
    form.email.trim() !== initialForm.email.trim() ||
    form.dni.trim() !== initialForm.dni.trim() ||
    form.phone.trim() !== initialForm.phone.trim();

  const updateUser = useUpdateUser();
  const deleteUser = useDeleteUser();

  const handleSave = async () => {
    // 1. Validación cliente
    const errors = validateUserForm({
      firstName: form.firstName,
      lastName: form.lastName,
      email: form.email,
      dni: form.dni,
      phone: form.phone || undefined,
    });

    if (hasErrors(errors)) {
      setFieldErrors(errors);
      Alert.alert('Revisá el formulario', 'Hay campos con errores.');
      return;
    }

    if (!user?.id || !isDirty) return;

    // 2. Request
    try {
      const updated = await updateUser.mutateAsync({
        id: user.id,
        payload: {
          firstName: form.firstName.trim(),
          lastName: form.lastName.trim(),
          email: form.email.trim(),
          dni: form.dni.trim(),
          phone: form.phone.trim() || undefined,
        },
      });

      // 3. Actualizar AuthContext con la respuesta del server
      updateUserInContext(updated);

      Alert.alert('Listo', 'Tus datos se actualizaron.');
      router.back();
    } catch (error: any) {

      const parsed = parseUserFormError(error);

      if (Object.keys(parsed.formErrors).length > 0) {
        setFieldErrors(parsed.formErrors);
      }
      if (parsed.generalMessage) {
        Alert.alert('Error', parsed.generalMessage);
      }

      // Opcional: manejar 401 global (logout + redirect)
      if (parsed.api.isUnauthorized) { await logout(); router.replace('/login'); }
    }
  };

  const handleDelete = () => {
    Alert.alert(
      'Eliminar cuenta',
      '¿Estás seguro que querés eliminar tu cuenta?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Continuar',
          style: 'destructive',
          onPress: () => confirmDelete(),
        },
      ]
    );
  };

  const confirmDelete = () => {
    Alert.alert(
      'Confirmación final',
      'Esta acción es permanente y no se puede deshacer. Todos tus datos se eliminarán.',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar definitivamente',
          style: 'destructive',
          onPress: async () => {
            if (!user?.id) return;
            try {
              await deleteUser.mutateAsync(user.id);
              await logout();
              router.replace('/login');
            } catch (error: any) {
              const parsed = parseUserFormError(error);
              Alert.alert(
                'Error',
                parsed.generalMessage || 'No se pudo eliminar la cuenta.'
              );
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
        <View className="flex-row gap-3 py-2 items-center bg-surface-0">
          <TouchableOpacity
            onPress={() => router.back()}
            className="w-12 h-12 rounded-full items-center justify-center border bg-surface-1 border-border"
          >
            <ArrowLeft color={contentColor} size={22} />
          </TouchableOpacity>
          <View className="flex-1 flex-row gap-3 items-center ms-2">
            <UserCog color={primaryColor} size={24} />
            <Text className="text-content text-xl font-bold">Editar perfil</Text>
          </View>
        </View>

        {/* FORM */}
        <View className="pt-3 mt-3">
          {/* First name */}
          <View className="mb-6">
            <Text className="text-base font-semibold mb-2 uppercase tracking-wider text-content-muted">
              Nombre
            </Text>
            <View className="flex-row items-center border rounded-xl px-3 py-3 bg-surface-1 border-border">
              <User color={mutedColor} size={20} />
              <AppTextInput
                value={form.firstName}
                onChangeText={(val) => handleChange('firstName', val)}
                placeholder="Juan"
                autoCapitalize="words"
                style={{ flex: 1, marginLeft: 12 }}
              />
            </View>
            {fieldErrors.firstName && (
              <Text className="text-sm mt-1 text-error-fg">{fieldErrors.firstName}</Text>
            )}
          </View>

          {/* Last name */}
          <View className="mb-6">
            <Text className="text-base font-semibold mb-2 uppercase tracking-wider text-content-muted">
              Apellido
            </Text>
            <View className="flex-row items-center border rounded-xl px-3 py-3 bg-surface-1 border-border">
              <User color={mutedColor} size={20} />
              <AppTextInput
                value={form.lastName}
                onChangeText={(val) => handleChange('lastName', val)}
                placeholder="Pérez"
                autoCapitalize="words"
                style={{ flex: 1, marginLeft: 12 }}
              />
            </View>
            {fieldErrors.lastName && (
              <Text className="text-sm mt-1 text-error-fg">{fieldErrors.lastName}</Text>
            )}
          </View>

          {/* Email */}
          <View className="mb-6">
            <Text className="text-base font-semibold mb-2 uppercase tracking-wider text-content-muted">
              Correo electrónico
            </Text>
            <View className="flex-row items-center border rounded-xl px-3 py-3 bg-surface-1 border-border">
              <Mail color={mutedColor} size={20} />
              <AppTextInput
                value={form.email}
                onChangeText={(val) => handleChange('email', val)}
                placeholder="juan@ejemplo.com"
                keyboardType="email-address"
                autoCapitalize="none"
                style={{ flex: 1, marginLeft: 12 }}
              />
            </View>
            {fieldErrors.email && (
              <Text className="text-sm mt-1 text-error-fg">{fieldErrors.email}</Text>
            )}
          </View>

          {/* DNI */}
          <View className="mb-6">
            <Text className="text-base font-semibold mb-2 uppercase tracking-wider text-content-muted">
              DNI
            </Text>
            <View className="flex-row items-center border rounded-xl px-3 py-3 bg-surface-1 border-border">
              <CreditCard color={mutedColor} size={20} />
              <AppTextInput
                value={form.dni}
                onChangeText={(val) => handleChange('dni', val)}
                placeholder="12345678"
                keyboardType="numeric"
                style={{ flex: 1, marginLeft: 12 }}
              />
            </View>
            {fieldErrors.dni && (
              <Text className="text-sm mt-1 text-error-fg">{fieldErrors.dni}</Text>
            )}
          </View>

          {/* Phone */}
          <View className="mb-8">
            <Text className="text-base font-semibold mb-2 uppercase tracking-wider text-content-muted">
              Teléfono (opcional)
            </Text>
            <View className="flex-row items-center border rounded-xl px-3 py-3 bg-surface-1 border-border">
              <Phone color={mutedColor} size={20} />
              <AppTextInput
                value={form.phone}
                onChangeText={(val) => handleChange('phone', val)}
                placeholder="1123456789"
                keyboardType="phone-pad"
                style={{ flex: 1, marginLeft: 12 }}
              />
            </View>
            {fieldErrors.phone && (
              <Text className="text-sm mt-1 text-error-fg">{fieldErrors.phone}</Text>
            )}
          </View>

          {/* Save */}
          <TouchableOpacity
            onPress={handleSave}
            disabled={!isDirty || updateUser.isPending}
            className={`w-full py-4 rounded-2xl border border-main-300
              flex-row items-center justify-center gap-2 mb-3 bg-main-700 active:opacity-80
              ${(!isDirty || updateUser.isPending) ? 'opacity-40' : ''}`}
          >
            <Save color={getVar('--color-white')} size={20} />
            <Text className="text-white font-bold text-lg">
              {updateUser.isPending ? 'Guardando...' : 'Guardar cambios'}
            </Text>
          </TouchableOpacity>

          {/* Delete */}
          <TouchableOpacity
            onPress={handleDelete}
            disabled={deleteUser.isPending}
            className={`w-full py-4 rounded-2xl border border-error-border
              flex-row items-center justify-center gap-2 mb-4 bg-error-bg active:opacity-80
              ${deleteUser.isPending ? 'opacity-40' : ''}`}
          >
            <Trash2 color={errorColor} size={20} />
            <Text className="text-error-fg font-bold text-lg">
              {deleteUser.isPending ? 'Eliminando...' : 'Eliminar cuenta'}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </ScreenCustom>
  );
}