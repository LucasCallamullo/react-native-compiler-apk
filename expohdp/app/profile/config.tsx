// src/features/settings/screens/ConfigScreen.tsx
import { useMemo, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { ScreenCustom } from '@shared/components/ScreenCustom';
import { AppTextInput } from '@shared/components/custom/AppTextInput';
import { useAppTheme, type ThemeType } from '@shared/context/ThemeProvider';
import {
  ArrowLeft,
  Palette,
  Lock,
  RotateCcw,
  Save,
  Check,
  UserCog
} from 'lucide-react-native';

import { useLockCode } from '@features/auth/hooks/useLockCode';
import { DEFAULT_LOCK } from '@features/auth/config/lockConfig';

// Ajustá este array si tenés más temas
const THEMES: { id: ThemeType; label: string; swatch: string }[] = [
  { id: 'theme-dark',  label: 'Dark',  swatch: '#000000' },
  { id: 'theme-light', label: 'Light', swatch: '#ffffff' },
  { id: 'theme-pink',  label: 'Pink',  swatch: '#ec4899' },
  { id: 'theme-blue',  label: 'Blue',  swatch: '#3b82f6' },
];

export default function ConfigScreen() {
  const router = useRouter();
  const { theme, setTheme, getVar } = useAppTheme();

  const contentColor = getVar('--color-content');
  const primaryColor = getVar('--color-main-500');
  const mutedColor = getVar('--color-content-muted');
  const successColor = getVar('--color-success');

  // Lock code
  const { code, isLoading, isSaving, save, reset, isValid } = useLockCode();
  const [draftCode, setDraftCode] = useState<string | null>(null);

  // El input controlado: si el user no tocó nada, muestra el código actual
  const inputValue = draftCode ?? code;
  const isDirty = draftCode !== null && draftCode.trim() !== code;
  const isValidDraft = isValid(inputValue.trim());

  const handleSaveCode = async () => {
    const trimmed = inputValue.trim();
    if (!isValidDraft) {
      Alert.alert(
        'Código inválido',
        'Solo se permiten números y los símbolos + - * / =. Entre 1 y 20 caracteres.'
      );
      return;
    }
    try {
      await save(trimmed);
      setDraftCode(null);
      Alert.alert('Listo', 'Código de desbloqueo actualizado.');
    } catch {
      Alert.alert('Error', 'No se pudo guardar el código.');
    }
  };

  const handleReset = () => {
    Alert.alert(
      'Restaurar código',
      `¿Volver al código por defecto (${DEFAULT_LOCK})?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Restaurar',
          style: 'destructive',
          onPress: async () => {
            await reset();
            setDraftCode(null);
            Alert.alert('Listo', 'Código restaurado al valor por defecto.');
          },
        },
      ]
    );
  };

  return (
    <ScreenCustom safeTop>
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* HEADER */}
        <View className="flex-row items-center gap-4 py-2 mb-4">
          <TouchableOpacity
            onPress={() => router.back()}
            className="w-11 h-11 rounded-full items-center justify-center border bg-surface-1 border-border me-4"
          >
            <ArrowLeft color={contentColor} size={22} />
          </TouchableOpacity>
          <UserCog color={contentColor} size={22} />
          <Text className="text-3xl font-bold text-content">Configuración</Text>
        </View>

        {/* ============================================
            SECCIÓN: TEMA
            ============================================ */}
        <View className="mb-6">
          <View className="flex-row items-center gap-2 mb-3">
            <Palette color={primaryColor} size={21} />
            <Text className="text-xl font-semibold tracking-wider text-content-muted">
              Tema
            </Text>
          </View>

          <View className="rounded-2xl border bg-surface-1 border-border overflow-hidden">
            {THEMES.map((t, index) => {
              const isSelected = theme === t.id;
              return (
                <TouchableOpacity
                  key={t.id}
                  onPress={() => setTheme(t.id)}
                  className={`flex-row items-center justify-between px-4 py-3.5 active:opacity-70 ${
                    index !== THEMES.length - 1 ? 'border-b border-border' : ''
                  }`}
                >
                  <View className="flex-row items-center gap-3">
                    <View
                      className="w-6 h-6 rounded-full border border-border"
                      style={{ backgroundColor: t.swatch }}
                    />
                    <Text className="text-base text-content">{t.label}</Text>
                  </View>
                  {isSelected && <Check color={successColor} size={19} />}
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* ============================================
            SECCIÓN: CÓDIGO DE DESBLOQUEO
            ============================================ */}
        <View className="mb-6">
          <View className="flex-row items-center gap-2 mb-3 mt-2">
            <Lock color={primaryColor} size={21} />
            <Text className="text-xl font-semibold tracking-wider text-content-muted">
              Código de Desbloqueo
            </Text>
          </View>

          <View className="rounded-2xl p-4 border bg-surface-1 border-border">
            <Text className="text-base mb-3 text-content-muted">
              Es el código que se ingresa en la calculadora para desbloquear la app.
              Solo se permiten números y los símbolos {'+ - * / ='}.
            </Text>

            {isLoading ? (
              <ActivityIndicator color={primaryColor} />
            ) : (
              <View className="flex-row items-center border rounded-xl px-3 py-3 
                bg-surface-0 border-border">
                <AppTextInput
                  value={inputValue}
                  onChangeText={setDraftCode}
                  placeholder={DEFAULT_LOCK}
                  keyboardType="default"
                  autoCapitalize="none"
                  autoCorrect={false}
                  style={{ flex: 1, fontSize: 18, letterSpacing: 2 }}
                />
              </View>
            )}

            {!isValidDraft && inputValue.length > 0 && (
              <Text className="text-sm mt-2 text-error-fg">
                Solo números y {'+ - * / ='}, entre 1 y 20 caracteres.
              </Text>
            )}

            {/* Acciones */}
            <View className="flex-row gap-2 mt-4">
              <TouchableOpacity
                onPress={handleSaveCode}
                disabled={!isDirty || !isValidDraft || isSaving}
                className={`flex-1 py-3 rounded-xl border border-main-300
                  flex-row items-center justify-center gap-2 bg-main-700 active:opacity-80
                  ${(!isDirty || !isValidDraft || isSaving) ? 'opacity-40' : ''}`}
              >
                <Save color="#ffffff" size={18} />
                <Text className="text-white font-semibold text-base">
                  {isSaving ? 'Guardando...' : 'Guardar'}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleReset}
                disabled={isSaving || code === DEFAULT_LOCK}
                className={`px-4 py-3 rounded-xl border border-border
                  flex-row items-center justify-center gap-2 bg-surface-2 active:opacity-80
                  ${(isSaving || code === DEFAULT_LOCK) ? 'opacity-40' : ''}`}
              >
                <RotateCcw color={mutedColor} size={18} />
                <Text className="text-content font-semibold text-base">Reset</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    </ScreenCustom>
  );
}