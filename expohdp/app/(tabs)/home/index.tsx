import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { Camera, Siren, Folder, Share2, Mic, ClipboardList, Rabbit, Lock } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { useAppTheme } from '@shared/context/ThemeProvider';
import { ScreenCustom } from '@shared/components/ScreenCustom';

export default function HomeScreen() {
  const router = useRouter();
  const { theme, setTheme, getColor } = useAppTheme();

  // Mock temporal de Auth mientras integrás el context
  const isAuthenticated = false;
  const user = {
    firstName: null
  };

  // Dynamic colors from theme
  const primaryColor = getColor('text-primary');
  const primaryFgColor = getColor('text-primary-fg');
  const fgColor = getColor('text-fg');
  const fgMutedColor = getColor('text-fg-muted');
  const cardBgColor = getColor('bg-card');
  const borderColor = getColor('border-border');
  const popoverBgColor = getColor('bg-popover');

  // Status colors
  const successColor = getColor('text-success');
  const successBgColor = getColor('bg-success');
  const successBorderColor = getColor('border-success');
  const errorColor = getColor('text-error');
  const errorBgColor = getColor('bg-error');
  const errorBorderColor = getColor('border-error');
  const warningColor = getColor('text-warning');
  const warningBgColor = getColor('bg-warning');
  const warningBorderColor = getColor('border-warning');

  const handleProtectedAction = (screenPath: string) => {
    if (!isAuthenticated) {
      router.push('/profile');
      return;
    }
    router.push(screenPath as any);
  };

  return (
    <ScreenCustom safeTop>
      <ScrollView
        className="flex-1 px-4 pt-2"
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View className="flex-row justify-between items-center py-3">
          <View>
            <View className="flex-row items-center gap-2">
              <Rabbit color={primaryColor} size={28} />
              <Text className="text-xl font-bold" style={{ color: fgColor }}>
                {isAuthenticated ? `Hola, ${user?.firstName || 'Usuario'}` : 'Modo Invitado'}
              </Text>
            </View>
            <Text className="text-sm mt-0.5" style={{ color: fgMutedColor }}>
              {isAuthenticated ? 'Bienvenido de nuevo' : 'Inicia sesión para sincronizar tus datos'}
            </Text>
          </View>

          {/* Avatar / Login Button */}
          <TouchableOpacity
            onPress={() => router.push('/profile')}
            className="w-11 h-11 rounded-full bg-primary items-center justify-center active:opacity-80"
          >
            {isAuthenticated ? (
              <Text className="text-primary-fg font-bold text-lg">
                {(user?.firstName?.[0] || 'U').toUpperCase()}
              </Text>
            ) : (
              <Lock color={primaryFgColor} size={20} />
            )}
          </TouchableOpacity>
        </View>

        {/* Quick theme switcher */}
        <TouchableOpacity
          onPress={() => setTheme(theme === 'theme-dark' ? 'theme-light' : theme === 'theme-light' ? 'theme-violet' : 'theme-dark')}
          className="rounded-xl p-2.5 my-2 flex-row justify-between items-center border"
          style={{
            backgroundColor: cardBgColor,
            borderColor: borderColor,
          }}
        >
          <Text className="text-xs font-semibold" style={{ color: fgMutedColor }}>
            Tema actual: <Text className="font-bold" style={{ color: primaryColor }}>{theme}</Text>
          </Text>
          <Text className="text-xs font-bold" style={{ color: primaryColor }}>
            Cambiar Tema
          </Text>
        </TouchableOpacity>

        {/* Promotional banner if not logged in */}
        {!isAuthenticated && (
          <TouchableOpacity
            onPress={() => router.push('/profile')}
            className="rounded-2xl p-4 my-2 flex-row justify-between items-center border"
            style={{
              backgroundColor: cardBgColor,
              borderColor: borderColor,
            }}
          >
            <View className="flex-1 mr-2">
              <Text className="font-semibold text-sm" style={{ color: fgColor }}>
                Sesión no iniciada
              </Text>
              <Text className="text-xs mt-1" style={{ color: fgMutedColor }}>
                Inicia sesión para respaldar tu evidencia en la nube.
              </Text>
            </View>
            <View className="bg-primary px-3 py-1.5 rounded-xl">
              <Text className="text-primary-fg text-xs font-bold">Ingresar</Text>
            </View>
          </TouchableOpacity>
        )}

        {/* Metrics */}
        <View className="flex-row gap-2 my-3">
          <View
            className="flex-1 rounded-2xl p-3 items-center border"
            style={{
              backgroundColor: cardBgColor,
              borderColor: borderColor,
            }}
          >
            <Text className="text-2xl font-bold" style={{ color: fgColor }}>
              {isAuthenticated ? '12' : '-'}
            </Text>
            <Text className="text-xs" style={{ color: fgMutedColor }}>
              Registros
            </Text>
          </View>
          <View
            className="flex-1 rounded-2xl p-3 items-center border"
            style={{
              backgroundColor: cardBgColor,
              borderColor: borderColor,
            }}
          >
            <Text className="text-2xl font-bold" style={{ color: fgColor }}>
              {isAuthenticated ? '4' : '-'}
            </Text>
            <Text className="text-xs" style={{ color: fgMutedColor }}>
              Eventos
            </Text>
          </View>
          <View
            className="flex-1 rounded-2xl p-3 items-center border"
            style={{
              backgroundColor: cardBgColor,
              borderColor: borderColor,
            }}
          >
            <Text className="text-2xl font-bold" style={{ color: fgColor }}>
              {isAuthenticated ? '3' : '-'}
            </Text>
            <Text className="text-xs" style={{ color: fgMutedColor }}>
              Alertas
            </Text>
          </View>
        </View>

        {/* Quick Actions */}
        <View className="flex-row flex-wrap gap-3 mb-5">
          <TouchableOpacity
            onPress={() => handleProtectedAction('/create')}
            className="w-[48%] rounded-2xl p-4 items-center border active:opacity-70"
            style={{
              backgroundColor: cardBgColor,
              borderColor: borderColor,
            }}
          >
            <Camera color={primaryColor} size={28} />
            <Text className="text-xs font-medium mt-2" style={{ color: fgColor }}>
              Nuevo Registro
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => handleProtectedAction('/emergency')}
            className="w-[48%] rounded-2xl p-4 items-center border active:opacity-70"
            style={{
              backgroundColor: cardBgColor,
              borderColor: borderColor,
            }}
          >
            <Siren color={errorColor} size={28} />
            <Text className="text-xs font-medium mt-2" style={{ color: fgColor }}>
              Emergencia
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => handleProtectedAction('/folder')}
            className="w-[48%] rounded-2xl p-4 items-center border active:opacity-70"
            style={{
              backgroundColor: cardBgColor,
              borderColor: borderColor,
            }}
          >
            <Folder color={primaryColor} size={28} />
            <Text className="text-xs font-medium mt-2" style={{ color: fgColor }}>
              Historial
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => handleProtectedAction('/share')}
            className="w-[48%] rounded-2xl p-4 items-center border active:opacity-70"
            style={{
              backgroundColor: cardBgColor,
              borderColor: borderColor,
            }}
          >
            <Share2 color={primaryColor} size={28} />
            <Text className="text-xs font-medium mt-2" style={{ color: fgColor }}>
              Compartir
            </Text>
          </TouchableOpacity>
        </View>

        {/* Recent Activity */}
        <View className="flex-row items-center gap-2 mb-2">
          <ClipboardList color={fgMutedColor} size={20} />
          <Text className="text-lg font-bold" style={{ color: fgColor }}>
            Actividad reciente
          </Text>
        </View>

        <View
          className="rounded-2xl p-4 border mb-6"
          style={{
            backgroundColor: cardBgColor,
            borderColor: borderColor,
          }}
        >
          {/* Activity item 1 */}
          <View className="flex-row items-center gap-3 py-3 border-b border-border">
            <Text className="text-xs w-12" style={{ color: fgMutedColor }}>
              15:30
            </Text>
            <View className="flex-1 flex-row items-center gap-2">
              <Camera color={primaryColor} size={16} />
              <View>
                <Text className="text-sm font-medium" style={{ color: fgColor }}>
                  Foto subida
                </Text>
                <Text className="text-xs" style={{ color: fgMutedColor }}>
                  Evidencia de incidente registrada
                </Text>
              </View>
            </View>
            <Text
              className="text-[10px] px-2 py-1 rounded-full border font-semibold"
              style={{
                backgroundColor: successBgColor,
                color: successColor,
                borderColor: successBorderColor,
              }}
            >
              REGISTRO
            </Text>
          </View>

          {/* Activity item 2 */}
          <View className="flex-row items-center gap-3 py-3 border-b border-border">
            <Text className="text-xs w-12" style={{ color: fgMutedColor }}>
              14:20
            </Text>
            <View className="flex-1 flex-row items-center gap-2">
              <Share2 color={successColor} size={16} />
              <View>
                <Text className="text-sm font-medium" style={{ color: fgColor }}>
                  Link compartido
                </Text>
                <Text className="text-xs" style={{ color: fgMutedColor }}>
                  Historial enviado a contacto
                </Text>
              </View>
            </View>
            <Text
              className="text-[10px] px-2 py-1 rounded-full border font-semibold"
              style={{
                backgroundColor: successBgColor,
                color: successColor,
                borderColor: successBorderColor,
              }}
            >
              COMPARTIDO
            </Text>
          </View>

          {/* Activity item 3 */}
          <View className="flex-row items-center gap-3 py-3">
            <Text className="text-xs w-12" style={{ color: fgMutedColor }}>
              11:05
            </Text>
            <View className="flex-1 flex-row items-center gap-2">
              <Mic color={warningColor} size={16} />
              <View>
                <Text className="text-sm font-medium" style={{ color: fgColor }}>
                  Grabación de audio
                </Text>
                <Text className="text-xs" style={{ color: fgMutedColor }}>
                  Nota de voz guardada (2:30 min)
                </Text>
              </View>
            </View>
            <Text
              className="text-[10px] px-2 py-1 rounded-full border font-semibold"
              style={{
                backgroundColor: warningBgColor,
                color: warningColor,
                borderColor: warningBorderColor,
              }}
            >
              AUDIO
            </Text>
          </View>
        </View>
      </ScrollView>
    </ScreenCustom>
  );
}