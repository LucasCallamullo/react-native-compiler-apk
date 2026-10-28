// src/features/geo/hooks/useLocation.ts
import { useCallback, useEffect, useState } from 'react';
import * as Location from 'expo-location';
import type { LocationObject } from 'expo-location';

export type LocationPermissionStatus =
  | 'unknown'
  | 'granted'
  | 'denied'
  | 'undetermined';

export interface UseLocationResult {
  /** Coordenadas actuales, null mientras carga o si falló */
  location: LocationObject | null;
  /** Estado actual de los permisos */
  status: LocationPermissionStatus;
  /** true mientras se pide permiso o se resuelve la posición */
  isLoading: boolean;
  /** Mensaje de error legible, null si no hubo */
  error: string | null;
  /** Pide permiso (si hace falta) y obtiene la ubicación */
  request: () => Promise<void>;
  /** Vuelve a obtener la ubicación sin volver a pedir permiso */
  refresh: () => Promise<void>;
}

export function useLocation(options?: {
  /** Se pide permiso y obtiene la ubicación automáticamente al montar */
  autoRequest?: boolean;
  /** Precisión de la lectura. Default: Balanced */
  accuracy?: Location.Accuracy;
}): UseLocationResult {
  const { autoRequest = true, accuracy = Location.Accuracy.Balanced } = options ?? {};

  const [location, setLocation] = useState<LocationObject | null>(null);
  const [status, setStatus] = useState<LocationPermissionStatus>('unknown');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [permission, requestPermission] = Location.useForegroundPermissions();

  // Sincroniza el status del hook con el del sistema
  useEffect(() => {
    if (permission) setStatus(permission.status as LocationPermissionStatus);
  }, [permission]);

  const fetchPosition = useCallback(async () => {
    try {
      const loc = await Location.getCurrentPositionAsync({ accuracy });
      setLocation(loc);
      setError(null);
    } catch {
      setError('No se pudo obtener la ubicación.');
    }
  }, [accuracy]);

  const request = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      // Pedir permiso si no está concedido
      let currentPermission = permission;
      if (!currentPermission?.granted) {
        currentPermission = await requestPermission();
      }

      if (!currentPermission.granted) {
        setError('Permiso de ubicación denegado.');
        setStatus('denied');
        return;
      }

      setStatus('granted');
      await fetchPosition();
    } finally {
      setIsLoading(false);
    }
  }, [permission, requestPermission, fetchPosition]);

  const refresh = useCallback(async () => {
    if (!permission?.granted) {
      // Si no hay permiso, refresh actúa como request
      await request();
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      await fetchPosition();
    } finally {
      setIsLoading(false);
    }
  }, [permission, request, fetchPosition]);

  // Auto request al montar
  useEffect(() => {
    if (autoRequest) request();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { location, status, isLoading, error, request, refresh };
}