import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, Alert, ScrollView } from 'react-native';
import { ArrowLeft, Mail, Lock, User, CreditCard, Phone } from 'lucide-react-native';
import { useAuth } from '@features/auth/context/AuthContext';

export default function RegisterScreen({ navigation }) {
  const { register } = useAuth();
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    dni: '',
    phone: '',
  });

  const handleChange = (key, value) => {
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
        { text: 'OK', onPress: () => navigation.navigate('Login') },
      ]);
    } catch (error) {
      const msg = error.response?.data?.message || 'Ocurrió un error al registrar la cuenta.';
      Alert.alert('Error', msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView className="flex-1 bg-zinc-950 px-6 pt-12" contentContainerStyle={{ flexGrow: 1, paddingBottom: 40 }}>
      <TouchableOpacity 
        onPress={() => navigation.goBack()} 
        className="w-10 h-10 rounded-full bg-zinc-900 border border-zinc-800 items-center justify-center mb-6"
      >
        <ArrowLeft color="#a1a1aa" size={20} />
      </TouchableOpacity>

      <Text className="text-3xl font-bold text-zinc-100">Crear Cuenta</Text>
      <Text className="text-zinc-400 text-sm mt-1 mb-6">Regístrate para respaldar tu información</Text>

      <View className="gap-4">
        {/* Nombre y Apellido */}
        <View className="flex-row gap-3">
          <View className="flex-1">
            <Text className="text-zinc-300 text-xs font-semibold mb-2">NOMBRE</Text>
            <View className="flex-row items-center bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-3">
              <User color="#71717a" size={18} />
              <TextInput
                value={form.firstName}
                onChangeText={(val) => handleChange('firstName', val)}
                placeholder="Test"
                placeholderTextColor="#52525b"
                className="flex-1 ml-2 text-zinc-100 text-sm"
              />
            </View>
          </View>
          <View className="flex-1">
            <Text className="text-zinc-300 text-xs font-semibold mb-2">APELLIDO</Text>
            <View className="flex-row items-center bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-3">
              <User color="#71717a" size={18} />
              <TextInput
                value={form.lastName}
                onChangeText={(val) => handleChange('lastName', val)}
                placeholder="User"
                placeholderTextColor="#52525b"
                className="flex-1 ml-2 text-zinc-100 text-sm"
              />
            </View>
          </View>
        </View>

        {/* Email */}
        <View>
          <Text className="text-zinc-300 text-xs font-semibold mb-2">CORREO ELECTRÓNICO</Text>
          <View className="flex-row items-center bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-3">
            <Mail color="#71717a" size={18} />
            <TextInput
              value={form.email}
              onChangeText={(val) => handleChange('email', val)}
              placeholder="test@mail.com"
              placeholderTextColor="#52525b"
              keyboardType="email-address"
              autoCapitalize="none"
              className="flex-1 ml-3 text-zinc-100 text-sm"
            />
          </View>
        </View>

        {/* Password */}
        <View>
          <Text className="text-zinc-300 text-xs font-semibold mb-2">CONTRASEÑA</Text>
          <View className="flex-row items-center bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-3">
            <Lock color="#71717a" size={18} />
            <TextInput
              value={form.password}
              onChangeText={(val) => handleChange('password', val)}
              placeholder="••••••••"
              placeholderTextColor="#52525b"
              secureTextEntry
              className="flex-1 ml-3 text-zinc-100 text-sm"
            />
          </View>
        </View>

        {/* DNI y Teléfono */}
        <View className="flex-row gap-3">
          <View className="flex-1">
            <Text className="text-zinc-300 text-xs font-semibold mb-2">DNI</Text>
            <View className="flex-row items-center bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-3">
              <CreditCard color="#71717a" size={18} />
              <TextInput
                value={form.dni}
                onChangeText={(val) => handleChange('dni', val)}
                placeholder="11112222"
                placeholderTextColor="#52525b"
                keyboardType="numeric"
                className="flex-1 ml-2 text-zinc-100 text-sm"
              />
            </View>
          </View>
          <View className="flex-1">
            <Text className="text-zinc-300 text-xs font-semibold mb-2">TELÉFONO</Text>
            <View className="flex-row items-center bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-3">
              <Phone color="#71717a" size={18} />
              <TextInput
                value={form.phone}
                onChangeText={(val) => handleChange('phone', val)}
                placeholder="1234567890"
                placeholderTextColor="#52525b"
                keyboardType="phone-pad"
                className="flex-1 ml-2 text-zinc-100 text-sm"
              />
            </View>
          </View>
        </View>

        <TouchableOpacity 
          onPress={handleRegister}
          disabled={loading}
          className="bg-purple-600 rounded-xl py-4 items-center mt-4 active:bg-purple-700"
        >
          {loading ? (
            <ActivityIndicator color="#ffffff" />
          ) : (
            <Text className="text-white font-bold text-base">Registrarse</Text>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}