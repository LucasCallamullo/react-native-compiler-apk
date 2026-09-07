import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, Alert, ScrollView } from 'react-native';
import { ArrowLeft, Lock, Mail } from 'lucide-react-native';
import { useAuth } from '@features/auth/context/AuthContext';

export default function LoginScreen({ navigation }) {
  const { login } = useAuth();
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
      navigation.goBack();
    } catch (error) {
      const msg = error.response?.data?.message || 'Credenciales inválidas o problema de conexión';
      Alert.alert('Error de autenticación', msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView className="flex-1 bg-zinc-950 px-6 pt-12" contentContainerStyle={{ flexGrow: 1 }}>
      <TouchableOpacity 
        onPress={() => navigation.goBack()} 
        className="w-10 h-10 rounded-full bg-zinc-900 border border-zinc-800 items-center justify-center mb-6"
      >
        <ArrowLeft color="#a1a1aa" size={20} />
      </TouchableOpacity>

      <Text className="text-3xl font-bold text-zinc-100">Iniciar Sesión</Text>
      <Text className="text-zinc-400 text-sm mt-1 mb-8">Accede a tu historial y sincronización</Text>

      <View className="gap-4">
        <View>
          <Text className="text-zinc-300 text-xs font-semibold mb-2">CORREO ELECTRÓNICO</Text>
          <View className="flex-row items-center bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-3">
            <Mail color="#71717a" size={18} />
            <TextInput
              value={email}
              onChangeText={setEmail}
              placeholder="tu@correo.com"
              placeholderTextColor="#52525b"
              keyboardType="email-address"
              autoCapitalize="none"
              className="flex-1 ml-3 text-zinc-100 text-sm"
            />
          </View>
        </View>

        <View>
          <Text className="text-zinc-300 text-xs font-semibold mb-2">CONTRASEÑA</Text>
          <View className="flex-row items-center bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-3">
            <Lock color="#71717a" size={18} />
            <TextInput
              value={password}
              onChangeText={setPassword}
              placeholder="••••••••"
              placeholderTextColor="#52525b"
              secureTextEntry
              className="flex-1 ml-3 text-zinc-100 text-sm"
            />
          </View>
        </View>

        <TouchableOpacity 
          onPress={handleLogin}
          disabled={loading}
          className="bg-purple-600 rounded-xl py-4 items-center mt-4 active:bg-purple-700"
        >
          {loading ? (
            <ActivityIndicator color="#ffffff" />
          ) : (
            <Text className="text-white font-bold text-base">Ingresar</Text>
          )}
        </TouchableOpacity>
      </View>

      <View className="flex-row justify-center mt-8">
        <Text className="text-zinc-400 text-sm">¿No tienes una cuenta? </Text>
        <TouchableOpacity onPress={() => navigation.navigate('Register')}>
          <Text className="text-purple-400 font-bold text-sm">Regístrate</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}