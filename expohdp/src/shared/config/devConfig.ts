// src/shared/config/devConfig.ts
import * as SecureStore from 'expo-secure-store';

// ============================================
// BACKENDS
// ============================================
export const BACKENDS = {
  lucas: 'https://perm-reformist-unmoving.ngrok-free.dev/api',
  tomy: 'https://myself-lazy-simply.ngrok-free.dev/',
} as const;

export type BackendKey = keyof typeof BACKENDS;

// ============================================
// STORAGE KEYS (SecureStore no acepta ":")
// ============================================
const KEY_USE_MOCK = 'app.use-mock';
const KEY_BACKEND = 'app.backend';

// ============================================
// IN-MEMORY STATE
// ============================================
let _useMock = false;
let _backend: BackendKey = 'tomy'; // default

// ============================================
// INIT
// ============================================
export const initDevConfig = async () => {
  const [storedMock, storedBackend] = await Promise.all([
    SecureStore.getItemAsync(KEY_USE_MOCK),
    SecureStore.getItemAsync(KEY_BACKEND),
  ]);

  if (storedMock !== null) _useMock = storedMock === 'true';
  if (storedBackend === 'lucas' || storedBackend === 'tomy') {
    _backend = storedBackend;
  }
};

// ============================================
// MOCK FLAG
// ============================================
export const getUseMock = () => _useMock;

export const setUseMock = async (value: boolean) => {
  _useMock = value;
  await SecureStore.setItemAsync(KEY_USE_MOCK, String(value));
  return value;
};

export const toggleUseMock = async () => setUseMock(!_useMock);

// ============================================
// BACKEND
// ============================================
export const getBackend = (): BackendKey => _backend;

export const getApiBaseUrl = (): string => BACKENDS[_backend];

export const setBackend = async (value: BackendKey) => {
  _backend = value;
  await SecureStore.setItemAsync(KEY_BACKEND, value);
  return value;
};

export const toggleBackend = async () => {
  const next: BackendKey = _backend === 'tomy' ? 'lucas' : 'tomy';
  return setBackend(next);
};