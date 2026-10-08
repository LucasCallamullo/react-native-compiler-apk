// src/features/auth/utils/parseUserFormError.ts
import { parseApiError, type ParsedApiError } from '@shared/utils/parseApiError';
import type { FormErrors } from './validateUserForm';

export interface ParsedUserFormError {
  /** Errores mapeados a campos específicos del form */
  formErrors: FormErrors;
  /** Mensaje general para mostrar en Alert */
  generalMessage?: string;
  /** Info normalizada del error, por si la screen la necesita */
  api: ParsedApiError;
}

/**
 * Adapta un error de API al shape del UserEditForm.
 *
 * Delega el parseo del ErrorResponse a parseApiError (shared),
 * y luego mapea el mensaje a los campos del form de auth.
 */
export function parseUserFormError(error: unknown): ParsedUserFormError {
  const api = parseApiError(error);

  // Sin respuesta del backend → solo mensaje general
  if (api.isNetworkError || !api.isBackendError) {
    return { formErrors: {}, generalMessage: api.message, api };
  }

  // 409 Conflict → email o DNI duplicado
  if (api.status === 409) {
    const fieldErrors = inferConflictField(api.message);
    if (fieldErrors) return { formErrors: fieldErrors, api };
    return { formErrors: {}, generalMessage: api.message, api };
  }

  // 400 Bad Request → errores de validación concatenados
  if (api.status === 400) {
    const formErrors = parseValidationDetail(api.message);
    if (Object.keys(formErrors).length > 0) return { formErrors, api };
    return { formErrors: {}, generalMessage: api.message, api };
  }

  // Cualquier otro status → mensaje general
  return { formErrors: {}, generalMessage: api.message, api };
}

// ============================================
// HELPERS ESPECÍFICOS DEL FORM DE AUTH
// ============================================

/**
 * Infiere el campo afectado a partir del detail de un 409.
 * El backend sabe qué campo colisionó pero no lo expone
 * estructuradamente, así que inferimos del texto.
 */
function inferConflictField(detail: string): FormErrors | null {
  const lower = detail.toLowerCase();
  if (lower.includes('email')) return { email: detail };
  if (lower.includes('dni')) return { dni: detail };
  return null;
}

/**
 * Parsea el detail de un 400. El backend concatena todos los
 * mensajes de validación con ", " (ver GlobalExceptionHandler
 * → handleValidationExceptions), así que puede haber varios.
 *
 * Mapea mensajes conocidos del UserRequestDTO a campos del form.
 */
function parseValidationDetail(detail: string): FormErrors {
  const errors: FormErrors = {};
  const messages = detail.split(', ').map((m) => m.trim());

  for (const msg of messages) {
    const lower = msg.toLowerCase();
    if (lower.includes('first name')) errors.firstName = msg;
    else if (lower.includes('last name')) errors.lastName = msg;
    else if (lower.includes('email')) errors.email = msg;
    else if (lower.includes('dni')) errors.dni = msg;
    else if (lower.includes('phone')) errors.phone = msg;
    // password lo ignoramos — no está en el form de edit
  }

  return errors;
}