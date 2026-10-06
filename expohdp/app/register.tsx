import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, Alert, ScrollView } from 'react-native';
import { Redirect, useRouter } from 'expo-router';
import { ScreenCustom } from '@shared/components/ScreenCustom';
import { useAppTheme } from '@shared/context/ThemeProvider';
import { useAuth } from '@features/auth/context/AuthContext';
import { ArrowLeft, Mail, Lock, User, CreditCard, Phone } from 'lucide-react-native';

export default function RegisterScreen() {
  const router = useRouter();
  const { register, user, isLoading } = useAuth();
  const { getVar } = useAppTheme();

  // Solo para props que NO aceptan className
  const contentMutedColor = getVar('--color-content-muted');
  const primaryColor = getVar('--color-main-500');
  const mainFgColor = getVar('--color-content'); // o --color-main-fg si lo agregas

  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    dni: '',
    phone: '',
  });

  // ============================================
  // GUEST-ONLY GUARD
  // ============================================
  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-surface-0">
        <ActivityIndicator size="large" color={primaryColor} />
      </View>
    );
  }

  if (user) {
    return <Redirect href="/(tabs)/home" />;
  }

  const handleChange = (key: string, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleRegister = async () => {
    if (!form.email || !form.password || !form.firstName || !form.lastName || !form.dni) {
      Alert.alert('Campos incompletos', 'Por favor completa todos los campos requeridos.');
      return;
    }

    setLoading(true);
    try {
      await register(form);
    } catch (error: any) {
      const msg = error.response?.data?.message || 'Ocurrió un error al registrar la cuenta.';
      Alert.alert('Error', msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScreenCustom safeTop>
      <ScrollView
        className="flex-1 px-6 pt-4"
        contentContainerStyle={{ flexGrow: 1, paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Back Button */}
        <TouchableOpacity
          onPress={() => router.back()}
          className="w-10 h-10 rounded-full border items-center justify-center mb-6 bg-surface-1 border-border"
        >
          <ArrowLeft color={contentMutedColor} size={20} />
        </TouchableOpacity>

        {/* Header */}
        <Text className="text-3xl font-bold text-content">
          Crear Cuenta
        </Text>
        <Text className="text-sm mt-1 mb-6 text-content-muted">
          Regístrate para respaldar tu información
        </Text>

        <View className="gap-4">
          {/* First Name & Last Name */}
          <View className="flex-row gap-3">
            <View className="flex-1">
              <Text className="text-xs font-semibold mb-2 text-content-muted">
                NOMBRE
              </Text>
              <View className="flex-row items-center border rounded-xl px-3 py-3 bg-surface-1 border-border">
                <User color={contentMutedColor} size={18} />
                <TextInput
                  value={form.firstName}
                  onChangeText={(val) => handleChange('firstName', val)}
                  placeholder="Test"
                  placeholderTextColor={contentMutedColor}
                  className="flex-1 ml-2 text-sm text-content"
                />
              </View>
            </View>
            <View className="flex-1">
              <Text className="text-xs font-semibold mb-2 text-content-muted">
                APELLIDO
              </Text>
              <View className="flex-row items-center border rounded-xl px-3 py-3 bg-surface-1 border-border">
                <User color={contentMutedColor} size={18} />
                <TextInput
                  value={form.lastName}
                  onChangeText={(val) => handleChange('lastName', val)}
                  placeholder="User"
                  placeholderTextColor={contentMutedColor}
                  className="flex-1 ml-2 text-sm text-content"
                />
              </View>
            </View>
          </View>

          {/* Email */}
          <View>
            <Text className="text-xs font-semibold mb-2 text-content-muted">
              CORREO ELECTRÓNICO
            </Text>
            <View className="flex-row items-center border rounded-xl px-3 py-3 bg-surface-1 border-border">
              <Mail color={contentMutedColor} size={18} />
              <TextInput
                value={form.email}
                onChangeText={(val) => handleChange('email', val)}
                placeholder="test@mail.com"
                placeholderTextColor={contentMutedColor}
                keyboardType="email-address"
                autoCapitalize="none"
                className="flex-1 ml-3 text-sm text-content"
              />
            </View>
          </View>

          {/* Password */}
          <View>
            <Text className="text-xs font-semibold mb-2 text-content-muted">
              CONTRASEÑA
            </Text>
            <View className="flex-row items-center border rounded-xl px-3 py-3 bg-surface-1 border-border">
              <Lock color={contentMutedColor} size={18} />
              <TextInput
                value={form.password}
                onChangeText={(val) => handleChange('password', val)}
                placeholder="••••••••"
                placeholderTextColor={contentMutedColor}
                secureTextEntry
                className="flex-1 ml-3 text-sm text-content"
              />
            </View>
          </View>

          {/* DNI & Phone */}
          <View className="flex-row gap-3">
            <View className="flex-1">
              <Text className="text-xs font-semibold mb-2 text-content-muted">
                DNI
              </Text>
              <View className="flex-row items-center border rounded-xl px-3 py-3 bg-surface-1 border-border">
                <CreditCard color={contentMutedColor} size={18} />
                <TextInput
                  value={form.dni}
                  onChangeText={(val) => handleChange('dni', val)}
                  placeholder="11112222"
                  placeholderTextColor={contentMutedColor}
                  keyboardType="numeric"
                  className="flex-1 ml-2 text-sm text-content"
                />
              </View>
            </View>
            <View className="flex-1">
              <Text className="text-xs font-semibold mb-2 text-content-muted">
                TELÉFONO
              </Text>
              <View className="flex-row items-center border rounded-xl px-3 py-3 bg-surface-1 border-border">
                <Phone color={contentMutedColor} size={18} />
                <TextInput
                  value={form.phone}
                  onChangeText={(val) => handleChange('phone', val)}
                  placeholder="1234567890"
                  placeholderTextColor={contentMutedColor}
                  keyboardType="phone-pad"
                  className="flex-1 ml-2 text-sm text-content"
                />
              </View>
            </View>
          </View>

          {/* Register Button */}
          <TouchableOpacity
            onPress={handleRegister}
            disabled={loading}
            className="bg-main-500 rounded-xl py-4 items-center mt-4 active:opacity-80"
          >
            {loading ? (
              <ActivityIndicator color={mainFgColor} />
            ) : (
              <Text className="text-surface-0 font-bold text-base">Registrarse</Text>
            )}
          </TouchableOpacity>

          {/* Login Link */}
          <View className="flex-row justify-center mt-4">
            <Text className="text-sm text-content-muted">
              ¿Ya tienes cuenta?{' '}
            </Text>
            <TouchableOpacity onPress={() => router.push('/login')}>
              <Text className="font-bold text-sm text-main-500">
                Inicia sesión
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </ScreenCustom>
  );
}