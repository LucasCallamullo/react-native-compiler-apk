import { useState } from 'react';
import { useRouter } from 'expo-router';
import { View, Text, ScrollView, TouchableOpacity, Switch } from 'react-native';

import { AppTextInput } from '@shared/components/custom/AppTextInput';
import { ScreenCustom } from '@shared/components/ScreenCustom';
import { useAppTheme } from '@shared/context/ThemeProvider';
import {
  Share2,
  Lock,
  Copy,
  MapPin,
  Image,
  KeyRound,
  Eye,
  Send,
  AlertTriangle,
  Hourglass,
} from 'lucide-react-native';

export default function ShareScreen() {
  const router = useRouter();
  const { getVar } = useAppTheme();

  // Colores para props nativas (íconos, Switch)
  const primaryColor = getVar('--color-main-500');
  const mainFgColor = getVar('--color-main-700');
  const mutedColor = getVar('--color-content-muted');
  const borderColor = getVar('--color-border');
  const warningColor = getVar('--color-warning');
  const successColor = getVar('--color-success');
  const successBg = getVar('--color-success-bg');
  const white = '#ffffff';

  // State
  const [includeLocation, setIncludeLocation] = useState(true);
  const [includeMedia, setIncludeMedia] = useState(true);
  const [protectPassword, setProtectPassword] = useState(false);
  const [viewsLimit, setViewsLimit] = useState('10');

  // Helper para el Switch: thumbColor y trackColor
  const switchTrack = { false: borderColor, true: primaryColor };
  const switchThumb = (isOn: boolean) => (isOn ? mainFgColor : mutedColor);

  return (
    <ScreenCustom safeTop>
      <ScrollView className="flex-1 px-4" showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View className="flex-row items-center gap-3 mb-1">
          <Share2 color={primaryColor} size={24} />
          <Text className="text-xl font-bold text-content">Compartir Historial</Text>
        </View>

        <Text className="text-sm mb-4 ml-13 text-content-muted">
          Generá un link temporal para compartir tu evidencia
        </Text>

        {/* Link Container */}
        <View className="rounded-2xl p-4 items-center border border-dashed mb-5 bg-surface-1 border-border">
          <View className="p-3 rounded-full border mb-2 bg-main-700 border-main-500">
            <Lock color={primaryColor} size={28} />
          </View>
          <Text className="text-xs font-medium text-center mb-1 text-main-500">
            https://safeguard.app/share/abc123xyz
          </Text>

          <View className="flex-row items-center justify-center gap-2 mt-2 mb-3">
            <Hourglass color={primaryColor} size={16} />
            <Text className="text-[10px] text-content-muted">
              Expira: 24/08/2026 15:30
            </Text>
          </View>

          <TouchableOpacity className="w-full bg-main-500 py-2.5 rounded-full flex-row items-center justify-center gap-2 active:opacity-80">
            <Copy color={white} size={16} />
            <Text className="text-main-fg font-semibold text-xs">Copiar link</Text>
          </TouchableOpacity>
        </View>

        {/* Settings */}
        <View className="rounded-2xl p-4 border mb-5 bg-surface-1 border-border">
          {/* Incluir ubicación */}
          <View className="flex-row items-center justify-between py-3 border-b border-border">
            <View className="flex-row items-center gap-2.5">
              <MapPin color={mutedColor} size={18} />
              <Text className="text-sm text-content">Incluir ubicación</Text>
            </View>
            <Switch
              value={includeLocation}
              onValueChange={setIncludeLocation}
              trackColor={switchTrack}
              thumbColor={switchThumb(includeLocation)}
            />
          </View>

          {/* Incluir fotos/videos */}
          <View className="flex-row items-center justify-between py-3 border-b border-border">
            <View className="flex-row items-center gap-2.5">
              <Image color={mutedColor} size={18} />
              <Text className="text-sm text-content">Incluir fotos/videos</Text>
            </View>
            <Switch
              value={includeMedia}
              onValueChange={setIncludeMedia}
              trackColor={switchTrack}
              thumbColor={switchThumb(includeMedia)}
            />
          </View>

          {/* Proteger con contraseña */}
          <View className="flex-row items-center justify-between py-3 border-b border-border">
            <View className="flex-row items-center gap-2.5">
              <KeyRound color={mutedColor} size={18} />
              <Text className="text-sm text-content">Proteger con contraseña</Text>
            </View>
            <Switch
              value={protectPassword}
              onValueChange={setProtectPassword}
              trackColor={switchTrack}
              thumbColor={switchThumb(protectPassword)}
            />
          </View>

          {/* Limitar vistas */}
          <View className="flex-row items-center justify-between pt-3">
            <View className="flex-row items-center gap-2.5">
              <Eye color={mutedColor} size={18} />
              <Text className="text-sm text-content">
                Limitar vistas (0 = ilimitado)
              </Text>
            </View>
            <AppTextInput
              keyboardType="numeric"
              value={viewsLimit}
              onChangeText={setViewsLimit}
              style={{
                width: 56,
                paddingVertical: 6,
                paddingHorizontal: 6,
                textAlign: 'center',
                fontWeight: '600',
              }}
            />
          </View>
        </View>

        {/* Main Button */}
        <TouchableOpacity className="w-full bg-main-500 py-3.5 rounded-full flex-row items-center justify-center gap-2 mb-4 active:opacity-80">
          <Send color={white} size={18} />
          <Text className="text-main-fg font-semibold">Generar y compartir</Text>
        </TouchableOpacity>

        {/* Warning */}
        <View className="p-3.5 rounded-2xl border flex-row items-start gap-2.5 mb-6 bg-warning-bg border-warning-border">
          <AlertTriangle color={warningColor} size={18} />
          <Text className="text-xs flex-1 leading-4 text-warning-fg">
            Este link es temporal y caducará automáticamente. Solo las personas con el link
            podrán ver el contenido.
          </Text>
        </View>
      </ScrollView>
    </ScreenCustom>
  );
}