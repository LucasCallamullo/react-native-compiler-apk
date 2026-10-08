// src/shared/types/commonTypes.ts

// ============================================
// GENERIC API TYPES
// ============================================

/**
 * Success response wrapper from Spring Boot backend.
 * Mirrors ApiResponse<T> on the server.
 */
export interface ApiResponse<T = unknown> {
  timestamp: string;
  status: number;
  detail: string;
  data: T;
  success: boolean;
}

/**
 * Error response wrapper from Spring Boot backend.
 * Mirrors ErrorResponse on the server.
 *
 * Note: no `data` field — that's the structural difference
 * with ApiResponse. Errors carry no payload.
 */
export interface ErrorResponse {
  timestamp: string;
  status: number;
  detail: string;
  path: string;
  success: false;
}

/**
 * Type guard: is this a success response with a payload?
 */
export function isApiSuccess<T>(
  response: ApiResponse<T>
): response is ApiResponse<T> & { data: T } {
  return response.success && response.data !== null;
}

/**
 * Paginated success response wrapper.
 * (Ajustá si tu backend envuelve los paginados distinto.)
 */
export interface PaginatedApiResponse<T = unknown> {
  timestamp: string;
  status: number;
  detail: string;
  data: {
    content: T[];
    totalPages: number;
    totalElements: number;
    size: number;
    number: number;
  } | null;
  success: boolean;
}

export function isPaginatedApiSuccess<T>(
  response: PaginatedApiResponse<T>
): response is PaginatedApiResponse<T> & { data: NonNullable<PaginatedApiResponse<T>['data']> } {
  return response.success && response.data !== null;
}