import { View, Text, ScrollView, TouchableOpacity, Linking } from 'react-native';
import { useRouter } from 'expo-router';
import { ScreenCustom } from '@shared/components/ScreenCustom';
import { useAppTheme } from '@shared/context/ThemeProvider';
import {
  User,
  Mail,
  Phone,
  IdCard,
  Share2,
  AlertTriangle,
  Gavel,
  Info,
  ShieldAlert,
  ChevronRight,
  LogOut,
  CheckCircle2,
  Lightbulb,
  EyeOff,
} from 'lucide-react-native';

// Mock user data - replace with your actual auth hook
const mockUser = {
  firstName: 'María',
  lastName: 'González',
  dni: '40.123.456',
  phone: '+54 9 11 1234-5678',
  email: 'maria.gonzalez@email.com',
};

export default function ProfileScreen() {
  const router = useRouter();
  const { getColor } = useAppTheme();

  // Get dynamic colors from theme
  const primaryColor = getColor('text-primary');
  const primaryFgColor = getColor('text-primary-fg');
  const fgColor = getColor('text-fg');
  const fgMutedColor = getColor('text-fg-muted');
  const cardBgColor = getColor('bg-card');
  const borderColor = getColor('border-border');

  // Status colors
  const successColor = getColor('text-success');
  const successBgColor = getColor('bg-success');
  const successBorderColor = getColor('border-success');
  const errorColor = getColor('text-error');
  const errorBgColor = getColor('bg-error');
  const errorBorderColor = getColor('border-error');
  const warningColor = getColor('text-warning');
  const infoColor = getColor('text-info');
  const infoBgColor = getColor('bg-info');
  const infoBorderColor = getColor('border-info');

  const handlePhoneCall = (number: string) => {
    Linking.openURL(`tel:${number}`);
  };

  const handleWhatsapp = () => {
    Linking.openURL('https://wa.me/5491112345678');
  };

  return (
    <ScreenCustom safeTop>
      <ScrollView className="flex-1 px-4" showsVerticalScrollIndicator={false}>
        {/* Profile Header Card */}
        <View
          className="rounded-3xl p-5 border flex-row items-center gap-4 mb-4"
          style={{
            backgroundColor: cardBgColor,
            borderColor: borderColor,
          }}
        >
          <View className="w-16 h-16 rounded-full bg-primary items-center justify-center">
            <Text className="text-primary-fg font-bold text-2xl">
              {(mockUser?.firstName?.[0] || mockUser?.email?.[0] || 'U').toUpperCase()}
            </Text>
          </View>
          <View className="flex-1">
            <View className="flex-row items-center gap-1.5">
              <Text className="text-xl font-bold" style={{ color: fgColor }}>
                {mockUser?.firstName
                  ? `${mockUser.firstName} ${mockUser.lastName || ''}`
                  : 'Usuario'}
              </Text>
              <CheckCircle2 color={infoColor} size={18} />
            </View>
            <Text className="text-xs mt-0.5" style={{ color: fgMutedColor }}>
              Usuario verificado
            </Text>
            <View
              className="self-start mt-2 px-2.5 py-0.5 rounded-full border"
              style={{
                backgroundColor: successBgColor,
                borderColor: successBorderColor,
              }}
            >
              <Text
                className="text-[10px] font-semibold"
                style={{ color: successColor }}
              >
                Activo
              </Text>
            </View>
          </View>
        </View>

        {/* Personal Data Section */}
        <View
          className="rounded-2xl p-4 border mb-4"
          style={{
            backgroundColor: cardBgColor,
            borderColor: borderColor,
          }}
        >
          <View className="flex-row items-center gap-2 mb-3 pb-2 border-b border-border">
            <IdCard color={fgMutedColor} size={18} />
            <Text
              className="text-xs font-semibold uppercase tracking-wider"
              style={{ color: fgMutedColor }}
            >
              Datos personales
            </Text>
          </View>

          <View className="space-y-3">
            <View className="flex-row justify-between items-center py-1.5 border-b border-border/50">
              <View className="flex-row items-center gap-2">
                <User color={fgMutedColor} size={16} />
                <Text className="text-sm" style={{ color: fgMutedColor }}>
                  Nombre
                </Text>
              </View>
              <Text className="text-sm font-medium" style={{ color: fgColor }}>
                {mockUser?.firstName || '-'}
              </Text>
            </View>

            <View className="flex-row justify-between items-center py-1.5 border-b border-border/50">
              <View className="flex-row items-center gap-2">
                <User color={fgMutedColor} size={16} />
                <Text className="text-sm" style={{ color: fgMutedColor }}>
                  Apellido
                </Text>
              </View>
              <Text className="text-sm font-medium" style={{ color: fgColor }}>
                {mockUser?.lastName || '-'}
              </Text>
            </View>

            <View className="flex-row justify-between items-center py-1.5 border-b border-border/50">
              <View className="flex-row items-center gap-2">
                <IdCard color={fgMutedColor} size={16} />
                <Text className="text-sm" style={{ color: fgMutedColor }}>
                  DNI
                </Text>
              </View>
              <Text className="text-sm font-medium" style={{ color: fgColor }}>
                {mockUser?.dni || '-'}
              </Text>
            </View>

            <View className="flex-row justify-between items-center py-1.5 border-b border-border/50">
              <View className="flex-row items-center gap-2">
                <Phone color={fgMutedColor} size={16} />
                <Text className="text-sm" style={{ color: fgMutedColor }}>
                  Teléfono
                </Text>
              </View>
              <Text className="text-sm font-medium" style={{ color: fgColor }}>
                {mockUser?.phone || '-'}
              </Text>
            </View>

            <View className="flex-row justify-between items-center py-1.5">
              <View className="flex-row items-center gap-2">
                <Mail color={fgMutedColor} size={16} />
                <Text className="text-sm" style={{ color: fgMutedColor }}>
                  Email
                </Text>
              </View>
              <Text className="text-sm font-medium" style={{ color: fgColor }}>
                {mockUser?.email || '-'}
              </Text>
            </View>
          </View>
        </View>

        {/* Share History Button */}
        <TouchableOpacity
          onPress={() => router.push('/(tabs)/profile/share')}
          className="w-full bg-primary py-3.5 px-4 rounded-2xl flex-row items-center justify-between mb-3"
          style={{
            shadowColor: primaryColor,
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.3,
            shadowRadius: 8,
            elevation: 4,
          }}
        >
          <View className="flex-row items-center gap-3">
            <Share2 color="#ffffff" size={20} />
            <Text className="text-primary-fg font-semibold text-base">
              Compartir Historial
            </Text>
          </View>
          <ChevronRight color="#e9d5ff" size={18} />
        </TouchableOpacity>

        {/* Camouflage Button */}
        <TouchableOpacity
          onPress={() => router.push('/(tabs)/profile/config')}
          className="w-full py-3.5 px-4 rounded-2xl flex-row items-center justify-between border mb-5"
          style={{
            backgroundColor: cardBgColor,
            borderColor: borderColor,
          }}
        >
          <View className="flex-row items-center gap-3">
            <EyeOff color={primaryColor} size={20} />
            <Text className="font-semibold text-base" style={{ color: fgColor }}>
              Camuflaje y Apariencia
            </Text>
          </View>
          <ChevronRight color={fgMutedColor} size={18} />
        </TouchableOpacity>

        {/* Gender Violence Section */}
        <View
          className="rounded-2xl p-4 border-l-4 border-error border-y border-r mb-4"
          style={{
            backgroundColor: cardBgColor,
            borderColor: borderColor,
          }}
        >
          <View className="flex-row items-start gap-3">
            <View
              className="p-2 rounded-full border"
              style={{
                backgroundColor: errorBgColor,
                borderColor: errorBorderColor,
              }}
            >
              <AlertTriangle color={errorColor} size={20} />
            </View>
            <View className="flex-1">
              <Text className="font-bold text-base" style={{ color: fgColor }}>
                Información sobre Violencia de Género
              </Text>
              <Text className="text-xs mt-1 leading-relaxed" style={{ color: fgMutedColor }}>
                Si estás atravesando una situación de violencia, recordá que no
                estás sola. Podés acceder a recursos y líneas de ayuda
                disponibles las 24 horas.
              </Text>
            </View>
          </View>

          <View className="flex-row gap-2 mt-4">
            <TouchableOpacity
              onPress={() => router.push('/(tabs)/emergency')}
              className="flex-1 py-2.5 rounded-xl flex-row items-center justify-center gap-2 border"
              style={{
                backgroundColor: errorBgColor,
                borderColor: errorBorderColor,
              }}
            >
              <Gavel color={errorColor} size={16} />
              <Text className="font-medium text-xs" style={{ color: errorColor }}>
                Denunciar
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              className="flex-1 py-2.5 rounded-xl flex-row items-center justify-center gap-2 border"
              style={{
                backgroundColor: infoBgColor,
                borderColor: infoBorderColor,
              }}
            >
              <Info color={infoColor} size={16} />
              <Text className="font-medium text-xs" style={{ color: infoColor }}>
                Más info
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Help Lines Section */}
        <View
          className="rounded-2xl p-4 border mb-4"
          style={{
            backgroundColor: cardBgColor,
            borderColor: borderColor,
          }}
        >
          <View className="flex-row items-center gap-2 mb-3">
            <Phone color={successColor} size={18} />
            <Text className="font-bold text-sm" style={{ color: fgColor }}>
              Líneas de ayuda (Argentina)
            </Text>
          </View>

          <View className="space-y-2">
            <TouchableOpacity
              onPress={() => handlePhoneCall('144')}
              className="flex-row items-center justify-between p-3 rounded-xl border active:opacity-70"
              style={{
                backgroundColor: cardBgColor,
                borderColor: borderColor,
              }}
            >
              <Text className="text-xs" style={{ color: fgColor }}>
                Línea 144
              </Text>
              <Text
                className="text-[10px] px-2 py-0.5 rounded-full border font-semibold"
                style={{
                  backgroundColor: successBgColor,
                  color: successColor,
                  borderColor: successBorderColor,
                }}
              >
                Nacional
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => handlePhoneCall('911')}
              className="flex-row items-center justify-between p-3 rounded-xl border active:opacity-70"
              style={{
                backgroundColor: cardBgColor,
                borderColor: borderColor,
              }}
            >
              <Text className="text-xs" style={{ color: fgColor }}>
                Emergencias 911
              </Text>
              <Text
                className="text-[10px] px-2 py-0.5 rounded-full border font-semibold"
                style={{
                  backgroundColor: errorBgColor,
                  color: errorColor,
                  borderColor: errorBorderColor,
                }}
              >
                Urgencia
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleWhatsapp}
              className="flex-row items-center justify-between p-3 rounded-xl border active:opacity-70"
              style={{
                backgroundColor: cardBgColor,
                borderColor: borderColor,
              }}
            >
              <Text className="text-xs" style={{ color: fgColor }}>
                WhatsApp +54 9 11 1234-5678
              </Text>
              <Text
                className="text-[10px] px-2 py-0.5 rounded-full border font-semibold"
                style={{
                  backgroundColor: infoBgColor,
                  color: infoColor,
                  borderColor: infoBorderColor,
                }}
              >
                Chat
              </Text>
            </TouchableOpacity>
          </View>

          <View
            className="mt-3 p-3 rounded-xl border flex-row items-start gap-2"
            style={{
              backgroundColor: cardBgColor,
              borderColor: borderColor,
            }}
          >
            <Lightbulb color={warningColor} size={16} />
            <Text className="text-[11px] flex-1 leading-normal" style={{ color: fgMutedColor }}>
              Estas líneas son gratuitas, confidenciales y están disponibles las
              24 horas, los 365 días del año.
            </Text>
          </View>
        </View>

        {/* Procedure Guide */}
        <View
          className="rounded-2xl p-4 border mb-4"
          style={{
            backgroundColor: cardBgColor,
            borderColor: borderColor,
          }}
        >
          <Text className="font-bold text-xs mb-2" style={{ color: primaryColor }}>
            ¿Cómo proseguir con una denuncia?
          </Text>

          <View className="space-y-1.5">
            <Text
              className="p-2 rounded-lg text-xs border"
              style={{
                backgroundColor: cardBgColor,
                color: fgColor,
                borderColor: borderColor,
              }}
            >
              1. Comunicate al{' '}
              <Text className="font-bold" style={{ color: primaryColor }}>
                144
              </Text>{' '}
              o al{' '}
              <Text className="font-bold" style={{ color: primaryColor }}>
                911
              </Text>
              .
            </Text>
            <Text
              className="p-2 rounded-lg text-xs border"
              style={{
                backgroundColor: cardBgColor,
                color: fgColor,
                borderColor: borderColor,
              }}
            >
              2. Acercate a una{' '}
              <Text className="font-bold" style={{ color: primaryColor }}>
                Comisaría de la Mujer
              </Text>{' '}
              más cercana.
            </Text>
            <Text
              className="p-2 rounded-lg text-xs border"
              style={{
                backgroundColor: cardBgColor,
                color: fgColor,
                borderColor: borderColor,
              }}
            >
              3. Podés solicitar{' '}
              <Text className="font-bold" style={{ color: primaryColor }}>
                asesoramiento legal
              </Text>{' '}
              gratuito en el Ministerio de Justicia.
            </Text>
          </View>

          <View
            className="mt-3 border-l-2 p-2.5 rounded-r-lg flex-row items-center gap-2"
            style={{
              backgroundColor: cardBgColor,
              borderColor: warningColor,
            }}
          >
            <ShieldAlert color={warningColor} size={16} />
            <Text className="text-[11px] flex-1" style={{ color: fgMutedColor }}>
              Recordá: tu seguridad es lo más importante. No dudes en pedir ayuda.
            </Text>
          </View>
        </View>

        {/* Logout Button */}
        <TouchableOpacity
          onPress={async () => {
            // Replace with actual logout logic
            // await logout();
            router.replace('/calculator');
          }}
          className="w-full border py-3 rounded-2xl flex-row items-center justify-center gap-2 mb-8"
          style={{
            backgroundColor: cardBgColor,
            borderColor: borderColor,
          }}
        >
          <LogOut color={errorColor} size={18} />
          <Text className="font-medium text-sm" style={{ color: errorColor }}>
            Cerrar Sesión
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </ScreenCustom>
  );
}