// src/shared/components/LocationIndicator.tsx
import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { MapPin, RefreshCw, AlertTriangle } from 'lucide-react-native';
import { useAppTheme } from '@shared/context/ThemeProvider';
import type { LocationObject } from 'expo-location';
import type { LocationPermissionStatus } from '@features/geo/hooks/useLocation';

interface LocationIndicatorProps {
  location: LocationObject | null;
  status: LocationPermissionStatus;
  isLoading: boolean;
  error: string | null;
  onRequest: () => void;
  onRefresh?: () => void;
}

export function LocationIndicator({
  location,
  status,
  isLoading,
  error,
  onRequest,
  onRefresh,
}: LocationIndicatorProps) {
  const { getVar } = useAppTheme();
  const successColor = getVar('--color-success');
  const errorColor = getVar('--color-error');
  const mutedColor = getVar('--color-content-muted');
  const primaryColor = getVar('--color-main-500');

  // Estado 1: cargando por primera vez
  if (isLoading && !location && !error) {
    return (
      <View className="rounded-2xl p-3 flex-row items-center gap-3 mb-6 border bg-surface-1 border-border">
        <ActivityIndicator color={primaryColor} />
        <Text className="text-sm text-content-muted">Obteniendo ubicación...</Text>
      </View>
    );
  }

  // Estado 2: error o permiso denegado
  if (error || status === 'denied' || status === 'undetermined') {
    return (
      <TouchableOpacity
        onPress={onRequest}
        disabled={isLoading}
        className="rounded-2xl p-3 flex-row items-center justify-between mb-6 border bg-error-bg border-error-border active:opacity-80"
      >
        <View className="flex-row items-center gap-2 flex-1">
          <AlertTriangle color={errorColor} size={20} />
          <View className="flex-1">
            <Text className="font-medium text-base text-error-fg">
              Ubicación no disponible
            </Text>
            <Text className="text-xs mt-0.5 text-content-muted">
              {error || 'Tocá para habilitar'}
            </Text>
          </View>
        </View>
        {isLoading && <ActivityIndicator color={errorColor} size="small" />}
      </TouchableOpacity>
    );
  }

  // Estado 3: éxito — tenemos coordenadas
  return (
    <View className="rounded-2xl p-3 flex-row items-center justify-between mb-6 border bg-success-bg border-success-border">
      <View className="flex-row items-center gap-2 flex-1">
        <MapPin color={successColor} size={20} />
        <View className="flex-1">
          <Text className="font-medium text-base text-success-fg">
            Ubicación actual
          </Text>
          <Text className="text-xs mt-1 text-content-muted">
            {location
              ? `${location.coords.latitude.toFixed(4)}, ${location.coords.longitude.toFixed(4)}`
              : 'Sin coordenadas'}
          </Text>
        </View>
      </View>

      {onRefresh && (
        <TouchableOpacity
          onPress={onRefresh}
          disabled={isLoading}
          className="w-9 h-9 rounded-full items-center justify-center border bg-surface-1 border-border active:opacity-70"
        >
          {isLoading ? (
            <ActivityIndicator color={successColor} size="small" />
          ) : (
            <RefreshCw color={successColor} size={16} />
          )}
        </TouchableOpacity>
      )}
    </View>
  );
}