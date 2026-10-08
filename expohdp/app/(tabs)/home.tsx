import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { Camera, Siren, Folder, Share2, Mic, ClipboardList, Rabbit, Lock } from 'lucide-react-native';
import { useRouter } from 'expo-router';

import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';

import { useAppTheme } from '@shared/context/ThemeProvider';
import { ScreenCustom } from '@shared/components/ScreenCustom';
import { useAuth } from '@features/auth/context/AuthContext';
import { getUseMock, getBackend, toggleUseMock, toggleBackend, DEV_MODE } from '@shared/config/devConfig';




export default function HomeScreen() {
  const router = useRouter();
  const { theme, setTheme, getVar } = useAppTheme();
  const { user } = useAuth();
  const isAuthenticated = !!user;

  // Colores para props nativas (íconos)
  const primaryColor = getVar('--color-main-500');
  const mainFgColor = getVar('--color-main-700'); // <-- agregar al tema
  const mutedColor = getVar('--color-content-muted');
  const errorColor = getVar('--color-error');
  const successColor = getVar('--color-success');
  const warningColor = getVar('--color-warning');


  // ! THIS IS ONLY FOR TESTING STATES
  const queryClient = useQueryClient();
  const [useMock, setUseMockState] = useState(getUseMock());
  const [backend, setBackendState] = useState(getBackend());

  const handleToggleMock = async () => {
    const next = await toggleUseMock();
    setUseMockState(next);
    queryClient.clear(); // refetchea todo con la nueva fuente
    // Opcional: recargar la app si algún módulo cacheó el valor
    // DevSettings.reload();
  };

  const handleToggleBackend = async () => {
    const next = await toggleBackend();
    setBackendState(next);
    queryClient.clear();
    queryClient.invalidateQueries();
  };



  // + THIS IS FOR PROTECTED SETTINGS
  const handleProtectedAction = (screenPath: string) => {
    if (!isAuthenticated) {
      router.replace('/login');
      return;
    }
    router.push(screenPath as any);
  };

  const goToLogin = () => {
    router.replace('/login');
  };

  return (
    <ScreenCustom safeTop>
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View className="flex-row justify-between items-center py-3">
          <View>
            <View className="flex-row items-center gap-3">
              <Rabbit color={primaryColor} size={32} />
              <Text className="text-2xl font-bold text-content">
                {isAuthenticated ? `Hola, ${user?.firstName || 'Usuario'}` : 'Modo Invitado'}
              </Text>
            </View>
            <Text className="text-base mt-0.5 text-content-muted">
              {isAuthenticated ? 'Bienvenido de nuevo' : 'Inicia sesión para sincronizar tus datos'}
            </Text>
          </View>

          {/* Avatar / Login Button */}
          <TouchableOpacity
            onPress={() => (isAuthenticated ? router.push('/(tabs)/profile_tab') : goToLogin())}
            className="w-12.5 h-12.5 rounded-full bg-main-500 items-center justify-center active:opacity-80"
          >
            {isAuthenticated ? (
              <Text className="text-white font-bold text-xl">
                {(user?.firstName?.[0] || 'U').toUpperCase()}
              </Text>
            ) : (
              <Lock color={getVar('--color-white')} size={28} />
            )}
          </TouchableOpacity>
        </View>

        {/* Quick theme switcher */}
        <TouchableOpacity
          onPress={() =>
            setTheme(
              theme === 'theme-dark'
                ? 'theme-light'
                : theme === 'theme-light'
                ? 'theme-pink'
                : theme === 'theme-pink'
                ? 'theme-blue'
                : 'theme-dark'
            )
          }
          className="rounded-xl p-2.5 my-2 flex-row justify-between items-center border bg-surface-1 border-border"
        >
          <Text className="text-base font-semibold text-content-muted tracking-wider">
            Tema actual: <Text className="font-bold text-main-500">{theme}</Text>
          </Text>
          <Text className="text-base font-bold text-main-500 tracking-wider">Cambiar Tema</Text>
        </TouchableOpacity>

        {/* Promotional banner if not logged in */}
        {!isAuthenticated && (
          <TouchableOpacity
            onPress={goToLogin}
            className="rounded-2xl p-4 my-2 flex-row justify-between items-center border bg-surface-1 border-border"
          >
            <View className="flex-1 mr-2">
              <Text className="font-semibold text-sm text-content">
                Sesión no iniciada
              </Text>
              <Text className="text-base mt-1 text-content-muted">
                Inicia sesión para respaldar tu evidencia en la nube.
              </Text>
            </View>
            <View className="bg-main-500 px-3 py-1.5 rounded-xl">
              <Text className="text-main-fg text-base font-bold">Ingresar</Text>
            </View>
          </TouchableOpacity>
        )}

        {/* Metrics */}
        <View className="flex-row gap-4 my-4">
          <View className="flex-1 rounded-2xl p-3 items-center border bg-surface-1 border-border">
            <Text className="text-2xl font-bold text-content">
              {isAuthenticated ? '12' : '-'}
            </Text>
            <Text className="text-base text-content-muted">Registros</Text>
          </View>
          <View className="flex-1 rounded-2xl p-3 items-center border bg-surface-1 border-border">
            <Text className="text-2xl font-bold text-content">
              {isAuthenticated ? '4' : '-'}
            </Text>
            <Text className="text-base text-content-muted">Eventos</Text>
          </View>
          <View className="flex-1 rounded-2xl p-3 items-center border bg-surface-1 border-border">
            <Text className="text-2xl font-bold text-content">
              {isAuthenticated ? '3' : '-'}
            </Text>
            <Text className="text-base text-content-muted">Alertas</Text>
          </View>
        </View>

        {/* Quick Actions */}
        <View className="flex-row flex-wrap items-center justify-center gap-4 mb-6">
          <TouchableOpacity
            onPress={() => handleProtectedAction('/records')}
            className="w-[47%] rounded-2xl p-4 items-center border bg-surface-1 border-border active:opacity-70"
          >
            <Camera color={primaryColor} size={32} />
            <Text className="text-base font-medium mt-2 text-content">Nuevo Registro</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => handleProtectedAction('/emergency')}
            className="w-[47%] rounded-2xl p-4 items-center border bg-surface-1 border-border active:opacity-70"
          >
            <Siren color={errorColor} size={28} />
            <Text className="text-base font-medium mt-2 text-content">Emergencia</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => handleProtectedAction('/audit')}
            className="w-[47%] rounded-2xl p-4 items-center border bg-surface-1 border-border active:opacity-70"
          >
            <Folder color={primaryColor} size={28} />
            <Text className="text-base font-medium mt-2 text-content">Historial</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => handleProtectedAction('/profile/share')}
            className="w-[47%] rounded-2xl p-4 items-center border bg-surface-1 border-border active:opacity-70"
          >
            <Share2 color={primaryColor} size={28} />
            <Text className="text-base font-medium mt-2 text-content">Compartir</Text>
          </TouchableOpacity>
        </View>

        {/* Recent Activity */}
        <View className="flex-row items-center gap-2 mb-3">
          <ClipboardList color={mutedColor} size={28} />
          <Text className="text-lg font-bold text-content">Actividad reciente</Text>
        </View>

        <View className="rounded-2xl p-4 border mb-6 bg-surface-1 border-border">
          {/* Activity item 1 */}
          <View className="flex-row items-center gap-3 py-3 border-b border-border">
            <Text className="text-xs w-12 text-content-muted">15:30</Text>
            <View className="flex-1 flex-row items-center gap-2">
              <Camera color={primaryColor} size={20} />
              <View>
                <Text className="text-sm font-medium text-content">Foto subida</Text>
                <Text className="text-xs text-content-muted">
                  Evidencia de incidente registrada
                </Text>
              </View>
            </View>
            <Text className="text-[10px] px-2 py-1 rounded-full border font-semibold bg-success-bg text-success-fg border-success-border">
              REGISTRO
            </Text>
          </View>

          {/* Activity item 2 */}
          <View className="flex-row items-center gap-3 py-3 border-b border-border">
            <Text className="text-xs w-12 text-content-muted">14:20</Text>
            <View className="flex-1 flex-row items-center gap-2">
              <Share2 color={successColor} size={20} />
              <View>
                <Text className="text-sm font-medium text-content">Link compartido</Text>
                <Text className="text-xs text-content-muted">
                  Historial enviado a contacto
                </Text>
              </View>
            </View>
            <Text className="text-[10px] px-2 py-1 rounded-full border font-semibold bg-success-bg text-success-fg border-success-border">
              COMPARTIDO
            </Text>
          </View>

          {/* Activity item 3 */}
          <View className="flex-row items-center gap-3 py-3">
            <Text className="text-xs w-12 text-content-muted">11:05</Text>
            <View className="flex-1 flex-row items-center gap-2">
              <Mic color={warningColor} size={20} />
              <View>
                <Text className="text-sm font-medium text-content">
                  Grabación de audio
                </Text>
                <Text className="text-xs text-content-muted">
                  Nota de voz guardada (2:30 min)
                </Text>
              </View>
            </View>
            <Text className="text-[10px] px-2 py-1 rounded-full border font-semibold bg-warning-bg text-warning-fg border-warning-border">
              AUDIO
            </Text>
          </View>
        </View>




        {!DEV_MODE && (
          <> 
            <TouchableOpacity
              onPress={handleToggleMock}
              className="w-full border py-3 rounded-2xl flex-row items-center justify-center gap-2 
                mb-4 bg-surface-1 border-border"
            >
              <Text className="font-medium text-sm text-error-fg">
                Backend: {useMock ? 'MOCK' : 'API'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleToggleBackend}
              disabled={useMock}
              className={`w-full border py-3 rounded-2xl flex-row items-center justify-center gap-2 
                mb-8 bg-surface-1 border-border ${useMock ? 'opacity-40' : ''}`}
            >
              <Text className="font-medium text-sm text-error-fg">
                Server: {backend.toUpperCase()}
              </Text>
            </TouchableOpacity>
          </>
          )}

      </ScrollView>
    </ScreenCustom>
  );
}