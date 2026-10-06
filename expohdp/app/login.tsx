import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, Alert, ScrollView } from 'react-native';
import { Redirect, useRouter } from 'expo-router';
import { ScreenCustom } from '@shared/components/ScreenCustom';
import { useAppTheme } from '@shared/context/ThemeProvider';
import { useAuth } from '@features/auth/context/AuthContext';
import { ArrowLeft, Lock, Mail } from 'lucide-react-native';

export default function LoginScreen() {
  const router = useRouter();
  const { login, user, isLoading } = useAuth();
  const { getVar } = useAppTheme();

  // Solo para props que NO aceptan className
  const contentColor = getVar('--color-content');
  const contentMutedColor = getVar('--color-content-muted');
  const primaryColor = getVar('--color-main-500');
  const primaryFgColor = getVar('--color-content'); // o el que uses como fg sobre main

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

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

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Por favor ingresa tu correo y contraseña');
      return;
    }
    setLoading(true);
    try {
      await login(email, password);
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
          className="w-10 h-10 rounded-full border items-center justify-center mb-6 bg-surface-1 border-border"
        >
          <ArrowLeft color={contentMutedColor} size={20} />
        </TouchableOpacity>

        {/* Header */}
        <Text className="text-3xl font-bold text-content">
          Iniciar Sesión
        </Text>
        <Text className="text-sm mt-1 mb-8 text-content-muted">
          Accede a tu historial y sincronización
        </Text>

        {/* Form */}
        <View className="gap-4">
          {/* Email Field */}
          <View>
            <Text className="text-xs font-semibold mb-2 text-content-muted">
              CORREO ELECTRÓNICO
            </Text>
            <View className="flex-row items-center border rounded-xl px-3 py-3 bg-surface-0 border-border">
              <Mail color={contentMutedColor} size={18} />
              <TextInput
                value={email}
                onChangeText={setEmail}
                placeholder="tu@correo.com"
                placeholderTextColor={contentMutedColor}
                keyboardType="email-address"
                autoCapitalize="none"
                className="flex-1 ml-3 text-sm text-content"
              />
            </View>
          </View>

          {/* Password Field */}
          <View>
            <Text className="text-xs font-semibold mb-2 text-content-muted">
              CONTRASEÑA
            </Text>
            <View className="flex-row items-center border rounded-xl px-3 py-3 bg-surface-1 border-border">
              <Lock color={contentMutedColor} size={18} />
              <TextInput
                value={password}
                onChangeText={setPassword}
                placeholder="••••••••"
                placeholderTextColor={contentMutedColor}
                secureTextEntry
                className="flex-1 ml-3 text-sm text-content"
              />
            </View>
          </View>

          {/* Login Button */}
          <TouchableOpacity
            onPress={handleLogin}
            disabled={loading}
            className="bg-main-500 rounded-xl py-4 items-center mt-4 active:opacity-80"
          >
            {loading ? (
              <ActivityIndicator color={primaryFgColor} />
            ) : (
              <Text className="text-surface-0 font-bold text-base">Ingresar</Text>
            )}
          </TouchableOpacity>
        </View>

        {/* Register Link */}
        <View className="flex-row justify-center mt-8">
          <Text className="text-sm text-content-muted">
            ¿No tienes una cuenta?{' '}
          </Text>
          <TouchableOpacity onPress={() => router.push('/register')}>
            <Text className="font-bold text-sm text-main-500">
              Regístrate
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </ScreenCustom>
  );
}