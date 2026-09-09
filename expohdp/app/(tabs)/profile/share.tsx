import { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Switch, TextInput } from 'react-native';
import { useRouter } from 'expo-router';
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
  ArrowLeft,
} from 'lucide-react-native';

export default function ShareScreen() {
  const router = useRouter();
  const { getColor } = useAppTheme();

  // Dynamic colors from theme
  const fgColor = getColor('text-fg');
  const fgMutedColor = getColor('text-fg-muted');
  const cardBgColor = getColor('bg-card');
  const borderColor = getColor('border-border');
  const primaryColor = getColor('text-primary');
  const primaryFgColor = getColor('text-primary-fg');

  // Status colors
  const warningColor = getColor('text-warning');
  const warningBgColor = getColor('bg-warning');
  const warningBorderColor = getColor('border-warning');
  const successColor = getColor('text-success');
  const successBgColor = getColor('bg-success');
  const successBorderColor = getColor('border-success');
  const purpleLightColor = getColor('bg-purple-light');
  const purpleBgColor = getColor('bg-purple-bg');
  const purpleBorderColor = getColor('border-purple');

  // State
  const [includeLocation, setIncludeLocation] = useState(true);
  const [includeMedia, setIncludeMedia] = useState(true);
  const [protectPassword, setProtectPassword] = useState(false);
  const [viewsLimit, setViewsLimit] = useState('10');

  return (
    <ScreenCustom safeTop>
      <ScrollView className="flex-1 px-4" showsVerticalScrollIndicator={false}>
        {/* Header with back button */}
        <View className="flex-row items-center gap-3 mb-1">
          <TouchableOpacity
            onPress={() => router.back()}
            className="w-10 h-10 rounded-full border items-center justify-center active:opacity-70"
            style={{
              backgroundColor: cardBgColor,
              borderColor: borderColor,
            }}
          >
            <ArrowLeft color={fgColor} size={20} />
          </TouchableOpacity>
          <View className="flex-row items-center gap-2">
            <Share2 color={primaryColor} size={24} />
            <Text className="text-xl font-bold" style={{ color: fgColor }}>
              Compartir Historial
            </Text>
          </View>
        </View>

        <Text className="text-sm mb-4 ml-13" style={{ color: fgMutedColor }}>
          Generá un link temporal para compartir tu evidencia
        </Text>

        {/* Link Container */}
        <View
          className="rounded-2xl p-4 items-center border border-dashed mb-5"
          style={{
            backgroundColor: cardBgColor,
            borderColor: borderColor,
          }}
        >
          <View
            className="p-3 rounded-full border mb-2"
            style={{
              backgroundColor: purpleBgColor,
              borderColor: purpleBorderColor,
            }}
          >
            <Lock color={purpleLightColor} size={28} />
          </View>
          <Text className="text-xs font-medium text-center mb-1" style={{ color: primaryColor }}>
            https://safeguard.app/share/abc123xyz
          </Text>

          <View className="flex-row items-center justify-center gap-2 mt-2 mb-3">
            <Hourglass color={purpleLightColor} size={16} />
            <Text className="text-[10px]" style={{ color: fgMutedColor }}>
              Expira: 24/08/2026 15:30
            </Text>
          </View>

          <TouchableOpacity className="w-full bg-primary py-2.5 rounded-full flex-row items-center justify-center gap-2 active:opacity-80">
            <Copy color="#ffffff" size={16} />
            <Text className="text-primary-fg font-semibold text-xs">Copiar link</Text>
          </TouchableOpacity>
        </View>

        {/* Settings */}
        <View
          className="rounded-2xl p-4 border mb-5"
          style={{
            backgroundColor: cardBgColor,
            borderColor: borderColor,
          }}
        >
          <View className="flex-row items-center justify-between py-3 border-b border-border">
            <View className="flex-row items-center gap-2.5">
              <MapPin color={fgMutedColor} size={18} />
              <Text className="text-sm" style={{ color: fgColor }}>
                Incluir ubicación
              </Text>
            </View>
            <Switch
              value={includeLocation}
              onValueChange={setIncludeLocation}
              trackColor={{ false: borderColor, true: primaryColor }}
              thumbColor={includeLocation ? purpleLightColor : fgMutedColor}
            />
          </View>

          <View className="flex-row items-center justify-between py-3 border-b border-border">
            <View className="flex-row items-center gap-2.5">
              <Image color={fgMutedColor} size={18} />
              <Text className="text-sm" style={{ color: fgColor }}>
                Incluir fotos/videos
              </Text>
            </View>
            <Switch
              value={includeMedia}
              onValueChange={setIncludeMedia}
              trackColor={{ false: borderColor, true: primaryColor }}
              thumbColor={includeMedia ? purpleLightColor : fgMutedColor}
            />
          </View>

          <View className="flex-row items-center justify-between py-3 border-b border-border">
            <View className="flex-row items-center gap-2.5">
              <KeyRound color={fgMutedColor} size={18} />
              <Text className="text-sm" style={{ color: fgColor }}>
                Proteger con contraseña
              </Text>
            </View>
            <Switch
              value={protectPassword}
              onValueChange={setProtectPassword}
              trackColor={{ false: borderColor, true: primaryColor }}
              thumbColor={protectPassword ? purpleLightColor : fgMutedColor}
            />
          </View>

          <View className="flex-row items-center justify-between pt-3">
            <View className="flex-row items-center gap-2.5">
              <Eye color={fgMutedColor} size={18} />
              <Text className="text-sm" style={{ color: fgColor }}>
                Limitar vistas (0 = ilimitado)
              </Text>
            </View>
            <TextInput
              keyboardType="numeric"
              value={viewsLimit}
              onChangeText={setViewsLimit}
              placeholderTextColor={fgMutedColor}
              className="w-14 p-1.5 border rounded-xl text-center text-sm font-semibold"
              style={{
                backgroundColor: cardBgColor,
                borderColor: borderColor,
                color: fgColor,
              }}
            />
          </View>
        </View>

        {/* Main Button */}
        <TouchableOpacity className="w-full bg-primary py-3.5 rounded-full flex-row items-center justify-center gap-2 mb-4 active:opacity-80">
          <Send color="#ffffff" size={18} />
          <Text className="text-primary-fg font-semibold">Generar y compartir</Text>
        </TouchableOpacity>

        {/* Warning */}
        <View
          className="p-3.5 rounded-2xl border flex-row items-start gap-2.5 mb-6"
          style={{
            backgroundColor: warningBgColor,
            borderColor: warningBorderColor,
          }}
        >
          <AlertTriangle color={warningColor} size={18} className="mt-0.5" />
          <Text className="text-xs flex-1 leading-4" style={{ color: warningColor }}>
            Este link es temporal y caducará automáticamente. Solo las personas con el link
            podrán ver el contenido.
          </Text>
        </View>
      </ScrollView>
    </ScreenCustom>
  );
}