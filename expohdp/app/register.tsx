import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, Alert, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { ScreenCustom } from '@shared/components/ScreenCustom';
import { useAppTheme } from '@shared/context/ThemeProvider';
import { useAuth } from '@features/auth/context/AuthContext';
import { ArrowLeft, Mail, Lock, User, CreditCard, Phone } from 'lucide-react-native';

export default function RegisterScreen() {
  const router = useRouter();
  const { register } = useAuth();
  const { getColor } = useAppTheme();

  // Dynamic colors from theme
  const fgColor = getColor('text-fg');
  const fgMutedColor = getColor('text-fg-muted');
  const cardBgColor = getColor('bg-card');
  const borderColor = getColor('border-border');
  const primaryColor = getColor('text-primary');
  const primaryFgColor = getColor('text-primary-fg');

  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    dni: '',
    phone: '',
  });

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
      Alert.alert('Cuenta creada', 'Registro exitoso. Ahora puedes iniciar sesión.', [
        { text: 'OK', onPress: () => router.replace('/login') },
      ]);
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
          className="w-10 h-10 rounded-full border items-center justify-center mb-6"
          style={{
            backgroundColor: cardBgColor,
            borderColor: borderColor,
          }}
        >
          <ArrowLeft color={fgMutedColor} size={20} />
        </TouchableOpacity>

        {/* Header */}
        <Text className="text-3xl font-bold" style={{ color: fgColor }}>
          Crear Cuenta
        </Text>
        <Text className="text-sm mt-1 mb-6" style={{ color: fgMutedColor }}>
          Regístrate para respaldar tu información
        </Text>

        <View className="gap-4">
          {/* First Name & Last Name */}
          <View className="flex-row gap-3">
            <View className="flex-1">
              <Text className="text-xs font-semibold mb-2" style={{ color: fgMutedColor }}>
                NOMBRE
              </Text>
              <View
                className="flex-row items-center border rounded-xl px-3 py-3"
                style={{
                  backgroundColor: cardBgColor,
                  borderColor: borderColor,
                }}
              >
                <User color={fgMutedColor} size={18} />
                <TextInput
                  value={form.firstName}
                  onChangeText={(val) => handleChange('firstName', val)}
                  placeholder="Test"
                  placeholderTextColor={fgMutedColor}
                  className="flex-1 ml-2 text-sm"
                  style={{ color: fgColor }}
                />
              </View>
            </View>
            <View className="flex-1">
              <Text className="text-xs font-semibold mb-2" style={{ color: fgMutedColor }}>
                APELLIDO
              </Text>
              <View
                className="flex-row items-center border rounded-xl px-3 py-3"
                style={{
                  backgroundColor: cardBgColor,
                  borderColor: borderColor,
                }}
              >
                <User color={fgMutedColor} size={18} />
                <TextInput
                  value={form.lastName}
                  onChangeText={(val) => handleChange('lastName', val)}
                  placeholder="User"
                  placeholderTextColor={fgMutedColor}
                  className="flex-1 ml-2 text-sm"
                  style={{ color: fgColor }}
                />
              </View>
            </View>
          </View>

          {/* Email */}
          <View>
            <Text className="text-xs font-semibold mb-2" style={{ color: fgMutedColor }}>
              CORREO ELECTRÓNICO
            </Text>
            <View
              className="flex-row items-center border rounded-xl px-3 py-3"
              style={{
                backgroundColor: cardBgColor,
                borderColor: borderColor,
              }}
            >
              <Mail color={fgMutedColor} size={18} />
              <TextInput
                value={form.email}
                onChangeText={(val) => handleChange('email', val)}
                placeholder="test@mail.com"
                placeholderTextColor={fgMutedColor}
                keyboardType="email-address"
                autoCapitalize="none"
                className="flex-1 ml-3 text-sm"
                style={{ color: fgColor }}
              />
            </View>
          </View>

          {/* Password */}
          <View>
            <Text className="text-xs font-semibold mb-2" style={{ color: fgMutedColor }}>
              CONTRASEÑA
            </Text>
            <View
              className="flex-row items-center border rounded-xl px-3 py-3"
              style={{
                backgroundColor: cardBgColor,
                borderColor: borderColor,
              }}
            >
              <Lock color={fgMutedColor} size={18} />
              <TextInput
                value={form.password}
                onChangeText={(val) => handleChange('password', val)}
                placeholder="••••••••"
                placeholderTextColor={fgMutedColor}
                secureTextEntry
                className="flex-1 ml-3 text-sm"
                style={{ color: fgColor }}
              />
            </View>
          </View>

          {/* DNI & Phone */}
          <View className="flex-row gap-3">
            <View className="flex-1">
              <Text className="text-xs font-semibold mb-2" style={{ color: fgMutedColor }}>
                DNI
              </Text>
              <View
                className="flex-row items-center border rounded-xl px-3 py-3"
                style={{
                  backgroundColor: cardBgColor,
                  borderColor: borderColor,
                }}
              >
                <CreditCard color={fgMutedColor} size={18} />
                <TextInput
                  value={form.dni}
                  onChangeText={(val) => handleChange('dni', val)}
                  placeholder="11112222"
                  placeholderTextColor={fgMutedColor}
                  keyboardType="numeric"
                  className="flex-1 ml-2 text-sm"
                  style={{ color: fgColor }}
                />
              </View>
            </View>
            <View className="flex-1">
              <Text className="text-xs font-semibold mb-2" style={{ color: fgMutedColor }}>
                TELÉFONO
              </Text>
              <View
                className="flex-row items-center border rounded-xl px-3 py-3"
                style={{
                  backgroundColor: cardBgColor,
                  borderColor: borderColor,
                }}
              >
                <Phone color={fgMutedColor} size={18} />
                <TextInput
                  value={form.phone}
                  onChangeText={(val) => handleChange('phone', val)}
                  placeholder="1234567890"
                  placeholderTextColor={fgMutedColor}
                  keyboardType="phone-pad"
                  className="flex-1 ml-2 text-sm"
                  style={{ color: fgColor }}
                />
              </View>
            </View>
          </View>

          {/* Register Button */}
          <TouchableOpacity
            onPress={handleRegister}
            disabled={loading}
            className="bg-primary rounded-xl py-4 items-center mt-4 active:opacity-80"
          >
            {loading ? (
              <ActivityIndicator color={primaryFgColor} />
            ) : (
              <Text className="text-primary-fg font-bold text-base">Registrarse</Text>
            )}
          </TouchableOpacity>

          {/* Login Link */}
          <View className="flex-row justify-center mt-4">
            <Text className="text-sm" style={{ color: fgMutedColor }}>
              ¿Ya tienes cuenta?{' '}
            </Text>
            <TouchableOpacity onPress={() => router.push('/login')}> 
              <Text className="font-bold text-sm" style={{ color: primaryColor }}>
                Inicia sesión
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </ScreenCustom>
  );
}