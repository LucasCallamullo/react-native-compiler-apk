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
import { useAuth } from '@features/auth/context/AuthContext';

const mockUser = {
  firstName: 'María',
  lastName: 'González',
  dni: '40.123.456',
  phone: '+54 9 11 1234-5678',
  email: 'maria.gonzalez@email.com',
};

export default function ProfileScreen() {
  const router = useRouter();
  const { logout } = useAuth();
  const { getVar } = useAppTheme();

  // Colores para props nativas (íconos)
  const primaryColor = getVar('--color-main-500');
  const mutedColor = getVar('--color-content-muted');
  const infoColor = getVar('--color-info');
  const successColor = getVar('--color-success');
  const errorColor = getVar('--color-error');
  const warningColor = getVar('--color-warning');
  const white = '#ffffff';

  const handlePhoneCall = (number: string) => {
    Linking.openURL(`tel:${number}`);
  };

  const handleWhatsapp = () => {
    Linking.openURL('https://wa.me/5491112345678');
  };

  const handleLogout = async () => {
    await logout();
    router.replace('/calculator');
  };

  return (
    <ScreenCustom safeTop>
      <ScrollView className="flex-1 px-4" showsVerticalScrollIndicator={false}>
        {/* Profile Header Card */}
        <View className="rounded-3xl p-5 border flex-row items-center gap-4 mb-4 bg-surface-1 border-border">
          <View className="w-16 h-16 rounded-full bg-main-500 items-center justify-center">
            <Text className="text-main-fg font-bold text-2xl">
              {(mockUser?.firstName?.[0] || mockUser?.email?.[0] || 'U').toUpperCase()}
            </Text>
          </View>
          <View className="flex-1">
            <View className="flex-row items-center gap-1.5">
              <Text className="text-xl font-bold text-content">
                {mockUser?.firstName
                  ? `${mockUser.firstName} ${mockUser.lastName || ''}`
                  : 'Usuario'}
              </Text>
              <CheckCircle2 color={infoColor} size={18} />
            </View>
            <Text className="text-xs mt-0.5 text-content-muted">Usuario verificado</Text>
            <View className="self-start mt-2 px-2.5 py-0.5 rounded-full border bg-success-bg border-success-border">
              <Text className="text-[10px] font-semibold text-success-fg">Activo</Text>
            </View>
          </View>
        </View>

        {/* Personal Data Section */}
        <View className="rounded-2xl p-4 border mb-4 bg-surface-1 border-border">
          <View className="flex-row items-center gap-2 mb-3 pb-2 border-b border-border">
            <IdCard color={mutedColor} size={18} />
            <Text className="text-xs font-semibold uppercase tracking-wider text-content-muted">
              Datos personales
            </Text>
          </View>

          <View className="space-y-3">
            <View className="flex-row justify-between items-center py-1.5 border-b border-border">
              <View className="flex-row items-center gap-2">
                <User color={mutedColor} size={16} />
                <Text className="text-sm text-content-muted">Nombre</Text>
              </View>
              <Text className="text-sm font-medium text-content">
                {mockUser?.firstName || '-'}
              </Text>
            </View>

            <View className="flex-row justify-between items-center py-1.5 border-b border-border">
              <View className="flex-row items-center gap-2">
                <User color={mutedColor} size={16} />
                <Text className="text-sm text-content-muted">Apellido</Text>
              </View>
              <Text className="text-sm font-medium text-content">
                {mockUser?.lastName || '-'}
              </Text>
            </View>

            <View className="flex-row justify-between items-center py-1.5 border-b border-border">
              <View className="flex-row items-center gap-2">
                <IdCard color={mutedColor} size={16} />
                <Text className="text-sm text-content-muted">DNI</Text>
              </View>
              <Text className="text-sm font-medium text-content">
                {mockUser?.dni || '-'}
              </Text>
            </View>

            <View className="flex-row justify-between items-center py-1.5 border-b border-border">
              <View className="flex-row items-center gap-2">
                <Phone color={mutedColor} size={16} />
                <Text className="text-sm text-content-muted">Teléfono</Text>
              </View>
              <Text className="text-sm font-medium text-content">
                {mockUser?.phone || '-'}
              </Text>
            </View>

            <View className="flex-row justify-between items-center py-1.5">
              <View className="flex-row items-center gap-2">
                <Mail color={mutedColor} size={16} />
                <Text className="text-sm text-content-muted">Email</Text>
              </View>
              <Text className="text-sm font-medium text-content">
                {mockUser?.email || '-'}
              </Text>
            </View>
          </View>
        </View>

        {/* Share History Button */}
        <TouchableOpacity
          onPress={() => router.push('/history/share')}
          className="w-full bg-main-500 py-3.5 px-4 rounded-2xl flex-row items-center justify-between mb-3"
          style={{
            shadowColor: primaryColor,
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.3,
            shadowRadius: 8,
            elevation: 4,
          }}
        >
          <View className="flex-row items-center gap-3">
            <Share2 color={white} size={20} />
            <Text className="text-main-fg font-semibold text-base">
              Compartir Historial
            </Text>
          </View>
          <ChevronRight color={white} size={18} />
        </TouchableOpacity>

        {/* Camouflage Button */}
        <TouchableOpacity
          onPress={() => router.push('/profile/config')}
          className="w-full py-3.5 px-4 rounded-2xl flex-row items-center justify-between border mb-5 bg-surface-1 border-border"
        >
          <View className="flex-row items-center gap-3">
            <EyeOff color={primaryColor} size={20} />
            <Text className="font-semibold text-base text-content">
              Camuflaje y Apariencia
            </Text>
          </View>
          <ChevronRight color={mutedColor} size={18} />
        </TouchableOpacity>

        {/* Gender Violence Section */}
        <View className="rounded-2xl p-4 border-l-4 border-error border-y border-r mb-4 bg-surface-1">
          <View className="flex-row items-start gap-3">
            <View className="p-2 rounded-full border bg-error-bg border-error-border">
              <AlertTriangle color={errorColor} size={20} />
            </View>
            <View className="flex-1">
              <Text className="font-bold text-base text-content">
                Información sobre Violencia de Género
              </Text>
              <Text className="text-xs mt-1 leading-relaxed text-content-muted">
                Si estás atravesando una situación de violencia, recordá que no
                estás sola. Podés acceder a recursos y líneas de ayuda
                disponibles las 24 horas.
              </Text>
            </View>
          </View>

          <View className="flex-row gap-2 mt-4">
            <TouchableOpacity
              onPress={() => router.push('/(tabs)/emergency')}
              className="flex-1 py-2.5 rounded-xl flex-row items-center justify-center gap-2 border bg-error-bg border-error-border"
            >
              <Gavel color={errorColor} size={16} />
              <Text className="font-medium text-xs text-error-fg">Denunciar</Text>
            </TouchableOpacity>

            <TouchableOpacity className="flex-1 py-2.5 rounded-xl flex-row items-center justify-center gap-2 border bg-info-bg border-info-border">
              <Info color={infoColor} size={16} />
              <Text className="font-medium text-xs text-info-fg">Más info</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Help Lines Section */}
        <View className="rounded-2xl p-4 border mb-4 bg-surface-1 border-border">
          <View className="flex-row items-center gap-2 mb-3">
            <Phone color={successColor} size={18} />
            <Text className="font-bold text-sm text-content">
              Líneas de ayuda (Argentina)
            </Text>
          </View>

          <View className="space-y-2">
            <TouchableOpacity
              onPress={() => handlePhoneCall('144')}
              className="flex-row items-center justify-between p-3 rounded-xl border active:opacity-70 bg-surface-1 border-border"
            >
              <Text className="text-xs text-content">Línea 144</Text>
              <Text className="text-[10px] px-2 py-0.5 rounded-full border font-semibold bg-success-bg 
              text-success-fg border-success-border">
                Nacional
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => handlePhoneCall('911')}
              className="flex-row items-center justify-between p-3 rounded-xl border active:opacity-70 bg-surface-1 border-border"
            >
              <Text className="text-xs text-content">Emergencias 911</Text>
              <Text className="text-[10px] px-2 py-0.5 rounded-full border font-semibold bg-error-bg 
              text-error-fg border-error-border">
                Urgencia
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleWhatsapp}
              className="flex-row items-center justify-between p-3 rounded-xl border active:opacity-70 bg-surface-1 border-border"
            >
              <Text className="text-xs text-content">
                WhatsApp +54 9 11 1234-5678
              </Text>
              <Text className="text-[10px] px-2 py-0.5 rounded-full border font-semibold bg-info-bg text-info-fg border-info-border">
                Chat
              </Text>
            </TouchableOpacity>
          </View>

          <View className="mt-3 p-3 rounded-xl border flex-row items-start gap-2 bg-surface-1 border-border">
            <Lightbulb color={warningColor} size={16} />
            <Text className="text-[11px] flex-1 leading-normal text-content-muted">
              Estas líneas son gratuitas, confidenciales y están disponibles las
              24 horas, los 365 días del año.
            </Text>
          </View>
        </View>

        {/* Procedure Guide */}
        <View className="rounded-2xl p-4 border mb-4 bg-surface-1 border-border">
          <Text className="font-bold text-xs mb-2 text-main-500">
            ¿Cómo proseguir con una denuncia?
          </Text>

          <View className="space-y-1.5">
            <Text className="p-2 rounded-lg text-xs border bg-surface-1 text-content border-border">
              1. Comunicate al <Text className="font-bold text-main-500">144</Text> o al{' '}
              <Text className="font-bold text-main-500">911</Text>.
            </Text>
            <Text className="p-2 rounded-lg text-xs border bg-surface-1 text-content border-border">
              2. Acercate a una{' '}
              <Text className="font-bold text-main-500">Comisaría de la Mujer</Text> más
              cercana.
            </Text>
            <Text className="p-2 rounded-lg text-xs border bg-surface-1 text-content border-border">
              3. Podés solicitar{' '}
              <Text className="font-bold text-main-500">asesoramiento legal</Text>{' '}
              gratuito en el Ministerio de Justicia.
            </Text>
          </View>

          <View className="mt-3 border-l-2 p-2.5 rounded-r-lg flex-row items-center gap-2 bg-surface-1 border-warning">
            <ShieldAlert color={warningColor} size={16} />
            <Text className="text-[11px] flex-1 text-content-muted">
              Recordá: tu seguridad es lo más importante. No dudes en pedir ayuda.
            </Text>
          </View>
        </View>

        {/* Logout Button */}
        <TouchableOpacity
          onPress={handleLogout}
          className="w-full border py-3 rounded-2xl flex-row items-center justify-center gap-2 mb-8 bg-surface-1 border-border"
        >
          <LogOut color={errorColor} size={18} />
          <Text className="font-medium text-sm text-error-fg">Cerrar Sesión</Text>
        </TouchableOpacity>
      </ScrollView>
    </ScreenCustom>
  );
}