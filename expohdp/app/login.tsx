import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, Alert, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { ScreenCustom } from '@shared/components/ScreenCustom';
import { useAppTheme } from '@shared/context/ThemeProvider';
import { useAuth } from '@features/auth/context/AuthContext';
import { ArrowLeft, Lock, Mail } from 'lucide-react-native';

export default function LoginScreen() {
  const router = useRouter();
  const { login } = useAuth();
  const { getColor } = useAppTheme();

  // Dynamic colors from theme
  const fgColor = getColor('text-fg');
  const fgMutedColor = getColor('text-fg-muted');
  const cardBgColor = getColor('bg-card');
  const borderColor = getColor('border-border');
  const primaryColor = getColor('text-primary');
  const primaryFgColor = getColor('text-primary-fg');

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Por favor ingresa tu correo y contraseña');
      return;
    }

    setLoading(true);
    try {
      await login(email, password);
      // Redirige a home dentro de tabs (protegido)
      router.replace('/(tabs)/home');
    } catch (error: any) {
      const msg = error.response?.data?.message || 'Credenciales inválidas o problema de conexión';
      Alert.alert('Error de autenticación', msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScreenCustom safeTop>
      <ScrollView
        className="flex-1 px-6 pt-4"
        contentContainerStyle={{ flexGrow: 1 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Back Button */}
        <TouchableOpacity
          onPress={() => router.replace('/(tabs)/home')}
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
          Iniciar Sesión
        </Text>
        <Text className="text-sm mt-1 mb-8" style={{ color: fgMutedColor }}>
          Accede a tu historial y sincronización
        </Text>

        {/* Form */}
        <View className="gap-4">
          {/* Email Field */}
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
                value={email}
                onChangeText={setEmail}
                placeholder="tu@correo.com"
                placeholderTextColor={fgMutedColor}
                keyboardType="email-address"
                autoCapitalize="none"
                className="flex-1 ml-3 text-sm"
                style={{ color: fgColor }}
              />
            </View>
          </View>

          {/* Password Field */}
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
                value={password}
                onChangeText={setPassword}
                placeholder="••••••••"
                placeholderTextColor={fgMutedColor}
                secureTextEntry
                className="flex-1 ml-3 text-sm"
                style={{ color: fgColor }}
              />
            </View>
          </View>

          {/* Login Button */}
          <TouchableOpacity
            onPress={handleLogin}
            disabled={loading}
            className="bg-primary rounded-xl py-4 items-center mt-4 active:opacity-80"
          >
            {loading ? (
              <ActivityIndicator color={primaryFgColor} />
            ) : (
              <Text className="text-primary-fg font-bold text-base">Ingresar</Text>
            )}
          </TouchableOpacity>
        </View>

        {/* Register Link */}
        <View className="flex-row justify-center mt-8">
          <Text className="text-sm" style={{ color: fgMutedColor }}>
            ¿No tienes una cuenta?{' '}
          </Text>
          <TouchableOpacity onPress={() => router.push('/register')}>
            <Text className="font-bold text-sm" style={{ color: primaryColor }}>
              Regístrate
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </ScreenCustom>
  );
}