// src/shared/utils/parseApiError.ts
import type { ErrorResponse } from '@shared/types/commonTypes';

/**
 * Resultado normalizado de cualquier error de API.
 * Agnóstico al dominio: no sabe de forms ni de campos específicos.
 */
export interface ParsedApiError {
  /** HTTP status code, si lo hubo */
  status?: number;
  /** Mensaje crudo del backend (body.detail), o fallback genérico */
  message: string;
  /** true si hubo respuesta del backend (aunque fuera de error) */
  isBackendError: boolean;
  /** true si fue network error / timeout / cancel */
  isNetworkError: boolean;
  /** true si el error fue 401 (session expirada) */
  isUnauthorized: boolean;
  /** Body completo del backend, si vino en el shape esperado */
  raw?: ErrorResponse;
}

/**
 * Normaliza cualquier error (axios, fetch, throw manual)
 * al shape ParsedApiError.
 *
 * No conoce dominios ni campos de formularios. Solo el contrato
 * ErrorResponse del backend.
 */
export function parseApiError(error: unknown): ParsedApiError {
  const response = (error as any)?.response;
  const status: number | undefined = response?.status;
  const body: ErrorResponse | undefined = response?.data;

  // Sin respuesta → network / timeout / cancel
  if (!response) {
    return {
      message: 'No pudimos conectarnos. Revisá tu conexión.',
      isBackendError: false,
      isNetworkError: true,
      isUnauthorized: false,
    };
  }

  // Respuesta con shape ErrorResponse esperado
  if (body && typeof body === 'object' && 'detail' in body) {
    const detail = body.detail ?? '';

    // Fallbacks por status para cuando detail viene vacío
    const fallbackByStatus: Record<number, string> = {
      400: 'Datos inválidos.',
      401: 'Tu sesión expiró. Iniciá sesión de nuevo.',
      403: 'No tenés permisos para esta acción.',
      404: 'El recurso no existe.',
      409: 'Conflicto al guardar los datos.',
      500: 'Ocurrió un error inesperado.',
    };

    return {
      status,
      message: detail || fallbackByStatus[status ?? 0] || 'Ocurrió un error inesperado.',
      isBackendError: true,
      isNetworkError: false,
      isUnauthorized: status === 401,
      raw: body,
    };
  }

  // Respuesta con status pero sin body esperado (HTML de error, proxy, etc.)
  return {
    status,
    message: 'Ocurrió un error inesperado. Intentá de nuevo.',
    isBackendError: false,
    isNetworkError: false,
    isUnauthorized: status === 401,
  };
}