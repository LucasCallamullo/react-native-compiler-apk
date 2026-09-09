import React from 'react';
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

  // Resuelvo dinámicamente los colores para los íconos de Lucide
  const primaryColor = getColor('text-primary');
  const fgMutedColor = getColor('text-fg-muted');

  const handleProtectedAction = (screenPath: string) => {
    if (!isAuthenticated) {
      router.push('/profile'); // Redirige a profile/login si no está autenticado
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
              <Text className="text-xl font-bold text-fg">
                {isAuthenticated ? `Hola, ${user?.firstName || 'Usuario'}` : 'Modo Invitado'}
              </Text>
            </View>
            <Text className="text-sm text-fg-muted mt-0.5">
              {isAuthenticated ? 'Bienvenido de nuevo' : 'Inicia sesión para sincronizar tus datos'}
            </Text>
          </View>

          {/* Botón Avatar / Login */}
          <TouchableOpacity 
            onPress={() => router.push('/profile')}
            className="w-11 h-11 rounded-full bg-primary items-center justify-center active:opacity-80"
          >
            {isAuthenticated ? (
              <Text className="text-primary-fg font-bold text-lg">
                {(user?.firstName?.[0] || 'U').toUpperCase()}
              </Text>
            ) : (
              <Lock color={getColor('text-primary-fg')} size={20} />
            )}
          </TouchableOpacity>
        </View>

        {/* Botón rápido para probar el cambio de tema en vivo */}
        <TouchableOpacity
          onPress={() => setTheme(theme === 'theme-dark' ? 'theme-light' : theme === 'theme-light' ? 'theme-violet' : 'theme-dark')}
          className="bg-card border border-border rounded-xl p-2.5 my-2 flex-row justify-between items-center"
        >
          <Text className="text-xs font-semibold text-fg-muted">Tema actual: <Text className="text-primary">{theme}</Text></Text>
          <Text className="text-xs font-bold text-secondary">Cambiar Tema</Text>
        </TouchableOpacity>

        {/* Banner promocional si no está logueado */}
        {!isAuthenticated && (
          <TouchableOpacity
            onPress={() => router.push('/profile')}
            className="bg-card border border-primary/40 rounded-2xl p-4 my-2 flex-row justify-between items-center"
          >
            <View className="flex-1 mr-2">
              <Text className="text-fg font-semibold text-sm">Sesión no iniciada</Text>
              <Text className="text-fg-muted text-xs mt-1">Inicia sesión para respaldar tu evidencia en la nube.</Text>
            </View>
            <View className="bg-primary px-3 py-1.5 rounded-xl">
              <Text className="text-primary-fg text-xs font-bold">Ingresar</Text>
            </View>
          </TouchableOpacity>
        )}

        {/* Métricas */}
        <View className="flex-row gap-2 my-3">
          <View className="flex-1 bg-card rounded-2xl p-3 items-center border border-border">
            <Text className="text-2xl font-bold text-fg">{isAuthenticated ? '12' : '-'}</Text>
            <Text className="text-xs text-fg-muted">Registros</Text>
          </View>
          <View className="flex-1 bg-card rounded-2xl p-3 items-center border border-border">
            <Text className="text-2xl font-bold text-fg">{isAuthenticated ? '4' : '-'}</Text>
            <Text className="text-xs text-fg-muted">Eventos</Text>
          </View>
          <View className="flex-1 bg-card rounded-2xl p-3 items-center border border-border">
            <Text className="text-2xl font-bold text-fg">{isAuthenticated ? '3' : '-'}</Text>
            <Text className="text-xs text-fg-muted">Alertas</Text>
          </View>
        </View>

        {/* Accesos Rápidos */}
        <View className="flex-row flex-wrap gap-3 mb-5">
          <TouchableOpacity 
            onPress={() => handleProtectedAction('/create')}
            className="w-[48%] bg-card rounded-2xl p-4 items-center border border-border active:bg-popover"
          >
            <Camera color={primaryColor} size={28} />
            <Text className="text-xs font-medium text-fg mt-2">Nuevo Registro</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            onPress={() => handleProtectedAction('/emergency')}
            className="w-[48%] bg-card rounded-2xl p-4 items-center border border-border active:bg-popover"
          >
            <Siren color="#ef4444" size={28} />
            <Text className="text-xs font-medium text-fg mt-2">Emergencia</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            onPress={() => handleProtectedAction('/folder')}
            className="w-[48%] bg-card rounded-2xl p-4 items-center border border-border active:bg-popover"
          >
            <Folder color={primaryColor} size={28} />
            <Text className="text-xs font-medium text-fg mt-2">Historial</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            onPress={() => handleProtectedAction('/share')}
            className="w-[48%] bg-card rounded-2xl p-4 items-center border border-border active:bg-popover"
          >
            <Share2 color={primaryColor} size={28} />
            <Text className="text-xs font-medium text-fg mt-2">Compartir</Text>
          </TouchableOpacity>
        </View>

        {/* Actividad Reciente */}
        <View className="flex-row items-center gap-2 mb-2">
          <ClipboardList color={fgMutedColor} size={20} />
          <Text className="text-lg font-bold text-fg">Actividad reciente</Text>
        </View>
        
        <View className="bg-card rounded-2xl p-4 border border-border mb-6">
          <View className="flex-row items-center gap-3 py-3 border-b border-border">
            <Text className="text-xs text-fg-muted w-12">15:30</Text>
            <View className="flex-1 flex-row items-center gap-2">
              <Camera color={primaryColor} size={16} />
              <View>
                <Text className="text-sm font-medium text-fg">Foto subida</Text>
                <Text className="text-xs text-fg-muted">Evidencia de incidente registrada</Text>
              </View>
            </View>
            <Text className="text-[10px] px-2 py-1 rounded-full bg-primary/20 text-primary font-semibold border border-primary/30">
              REGISTRO
            </Text>
          </View>

          <View className="flex-row items-center gap-3 py-3 border-b border-border">
            <Text className="text-xs text-fg-muted w-12">14:20</Text>
            <View className="flex-1 flex-row items-center gap-2">
              <Share2 color="#22c55e" size={16} />
              <View>
                <Text className="text-sm font-medium text-fg">Link compartido</Text>
                <Text className="text-xs text-fg-muted">Historial enviado a contacto</Text>
              </View>
            </View>
            <Text className="text-[10px] px-2 py-1 rounded-full bg-emerald-950/60 text-emerald-400 font-semibold border border-emerald-800">
              COMPARTIDO
            </Text>
          </View>

          <View className="flex-row items-center gap-3 py-3">
            <Text className="text-xs text-fg-muted w-12">11:05</Text>
            <View className="flex-1 flex-row items-center gap-2">
              <Mic color="#f97316" size={16} />
              <View>
                <Text className="text-sm font-medium text-fg">Grabación de audio</Text>
                <Text className="text-xs text-fg-muted">Nota de voz guardada (2:30 min)</Text>
              </View>
            </View>
            <Text className="text-[10px] px-2 py-1 rounded-full bg-orange-950/60 text-orange-400 font-semibold border border-orange-800">
              AUDIO
            </Text>
          </View>
        </View>
      </ScrollView>
    </ScreenCustom>
  );
}