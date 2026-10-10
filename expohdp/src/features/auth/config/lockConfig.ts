// src/shared/config/lockConfig.ts
import * as SecureStore from 'expo-secure-store';

const KEY_LOCK_CODE = 'app.lock-code';
const DEFAULT_LOCK_CODE = '911';

/**
 * Devuelve el código de desbloqueo actual, o el default si
 * nunca se configuró uno custom.
 */
export async function getLockCode(): Promise<string> {
  try {
    const stored = await SecureStore.getItemAsync(KEY_LOCK_CODE);
    return stored ?? DEFAULT_LOCK_CODE;
  } catch {
    return DEFAULT_LOCK_CODE;
  }
}

/**
 * Persiste un nuevo código de desbloqueo.
 * Valida el formato antes de guardar.
 */
export async function setLockCode(code: string): Promise<void> {
  const trimmed = code.trim();
  if (!isValidLockCode(trimmed)) {
    throw new Error('Invalid lock code format');
  }
  await SecureStore.setItemAsync(KEY_LOCK_CODE, trimmed);
}

/**
 * Resetea al default (911). Útil para "restaurar valores".
 */
export async function resetLockCode(): Promise<void> {
  await SecureStore.deleteItemAsync(KEY_LOCK_CODE);
}

/**
 * Solo permite: dígitos, + - * / =
 * Mínimo 1, máximo 20 caracteres.
 */
export function isValidLockCode(code: string): boolean {
  if (!code || code.length < 1 || code.length > 20) return false;
  return /^[0-9+\-*/=]+$/.test(code);
}

export const DEFAULT_LOCK = DEFAULT_LOCK_CODE;