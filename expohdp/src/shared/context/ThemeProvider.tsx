import { VariableContextProvider } from 'nativewind';
import { ReactNode, useState, createContext, useContext } from 'react';
import Storage from 'expo-sqlite/kv-store';

// ============================================
// TYPES
// ============================================
export type ThemeType = 'theme-dark' | 'theme-light' | 'theme-pink' | 'theme-blue';

interface ThemeProviderProps {
  children: ReactNode;
}

// ============================================
// THEME VARIABLES
// Claves = nombres de variables CSS (con --)
// Valores = lo que NativeWind inyecta en runtime
// ============================================
const themeVariables: Record<ThemeType, Record<string, string>> = {
  'theme-dark': {
    '--color-surface-0': '#09090b',
    '--color-surface-1': '#18181b',
    '--color-surface-2': '#27272a',
    '--color-surface-3': '#3f3f46',
    '--color-content': '#f4f4f5',
    '--color-content-muted': '#a1a1aa',
    '--color-main-300': '#c084fc',
    '--color-main-500': '#a855f7',
    '--color-main-700': '#7e22ce',
    '--color-border': '#27272a',
    '--color-success': '#4ade80',
    '--color-success-bg': '#052e16',
    '--color-success-fg': '#86efac',
    '--color-success-border': '#166534',
    '--color-error': '#f87171',
    '--color-error-bg': '#450a0a',
    '--color-error-fg': '#fca5a5',
    '--color-error-border': '#991b1b',
    '--color-warning': '#fbbf24',
    '--color-warning-bg': '#451a03',
    '--color-warning-fg': '#fcd34d',
    '--color-warning-border': '#92400e',
    '--color-info': '#60a5fa',
    '--color-info-bg': '#172554',
    '--color-info-fg': '#93c5fd',
    '--color-info-border': '#1e3a8a',
    '--color-white': '#ffffff',
  },

  'theme-light': {
    '--color-surface-0': '#ffffff',
    '--color-surface-1': '#f4f4f5',
    '--color-surface-2': '#e4e4e7',
    '--color-surface-3': '#d4d4d8',
    '--color-content': '#18181b',
    '--color-content-muted': '#71717a',
    '--color-main-300': '#a78bfa',
    '--color-main-500': '#7c3aed',
    '--color-main-700': '#5b21b6',
    '--color-border': '#e4e4e7',
    '--color-success': '#16a34a',
    '--color-success-bg': '#dcfce7',
    '--color-success-fg': '#14532d',
    '--color-success-border': '#86efac',
    '--color-error': '#dc2626',
    '--color-error-bg': '#fee2e2',
    '--color-error-fg': '#7f1d1d',
    '--color-error-border': '#fca5a5',
    '--color-warning': '#d97706',
    '--color-warning-bg': '#fef3c7',
    '--color-warning-fg': '#78350f',
    '--color-warning-border': '#fcd34d',
    '--color-info': '#2563eb',
    '--color-info-bg': '#dbeafe',
    '--color-info-fg': '#1e3a8a',
    '--color-info-border': '#93c5fd',
    '--color-white': '#ffffff',
  },

  'theme-pink': {
    '--color-surface-0': '#1e0b36',
    '--color-surface-1': '#2e1065',
    '--color-surface-2': '#581c87',
    '--color-surface-3': '#6b21a8',
    '--color-content': '#faf5ff',
    '--color-content-muted': '#d8b4fe',
    '--color-main-300': '#f9a8d4',
    '--color-main-500': '#ec4899',
    '--color-main-700': '#be185d',
    '--color-border': '#581c87',
    '--color-success': '#4ade80',
    '--color-success-bg': '#052e16',
    '--color-success-fg': '#86efac',
    '--color-success-border': '#166534',
    '--color-error': '#f87171',
    '--color-error-bg': '#450a0a',
    '--color-error-fg': '#fca5a5',
    '--color-error-border': '#991b1b',
    '--color-warning': '#fbbf24',
    '--color-warning-bg': '#451a03',
    '--color-warning-fg': '#fcd34d',
    '--color-warning-border': '#92400e',
    '--color-info': '#60a5fa',
    '--color-info-bg': '#172554',
    '--color-info-fg': '#93c5fd',
    '--color-info-border': '#1e3a8a',
    '--color-white': '#ffffff',
  },

  'theme-blue': {
    '--color-surface-0': '#0a1128',
    '--color-surface-1': '#0f1e3d',
    '--color-surface-2': '#1e3a5f',
    '--color-surface-3': '#2d4a7c',
    '--color-content': '#eff6ff',
    '--color-content-muted': '#93c5fd',
    '--color-main-300': '#7dd3fc',
    '--color-main-500': '#3b82f6',
    '--color-main-700': '#1d4ed8',
    '--color-border': '#1e3a5f',
    '--color-success': '#4ade80',
    '--color-success-bg': '#052e16',
    '--color-success-fg': '#86efac',
    '--color-success-border': '#166534',
    '--color-error': '#f87171',
    '--color-error-bg': '#450a0a',
    '--color-error-fg': '#fca5a5',
    '--color-error-border': '#991b1b',
    '--color-warning': '#fbbf24',
    '--color-warning-bg': '#451a03',
    '--color-warning-fg': '#fcd34d',
    '--color-warning-border': '#92400e',
    '--color-info': '#60a5fa',
    '--color-info-bg': '#172554',
    '--color-info-fg': '#93c5fd',
    '--color-info-border': '#1e3a8a',
    '--color-white': '#ffffff',
  },
};

export type ThemeVarName =
  | '--color-surface-0'
  | '--color-surface-1'
  | '--color-surface-2'
  | '--color-surface-3'
  | '--color-content'
  | '--color-content-muted'
  | '--color-main-300'
  | '--color-main-500'
  | '--color-main-700'
  | '--color-border'
  | '--color-success'
  | '--color-success-bg'
  | '--color-success-fg'
  | '--color-success-border'
  | '--color-error'
  | '--color-error-bg'
  | '--color-error-fg'
  | '--color-error-border'
  | '--color-warning'
  | '--color-warning-bg'
  | '--color-warning-fg'
  | '--color-warning-border'
  | '--color-info'
  | '--color-info-bg'
  | '--color-info-fg'
  | '--color-info-border'
  | '--color-white';
  
// ============================================
// CONTEXT
// ============================================
const THEME_STORAGE_KEY = 'app.theme';

const ThemeContext = createContext<{
  theme: ThemeType;
  setTheme: (theme: ThemeType) => void;
  getVar: (name: ThemeVarName) => string;
} | null>(null);

// ============================================
// HOOK: useAppTheme
// ============================================
export function useAppTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useAppTheme must be used within a ThemeProvider');
  }
  return context;
}

// ============================================
// THEME PROVIDER
// ============================================
export function ThemeProvider({ children }: ThemeProviderProps) {
  // Inicialización síncrona: lee el tema guardado antes del primer render.
  // Si no hay nada guardado, cae al default 'theme-dark'.
  const [theme, setThemeState] = useState<ThemeType>(() => {
    try {
      const stored = Storage.getItemSync(THEME_STORAGE_KEY);
      return (stored as ThemeType) ?? 'theme-dark';
    } catch {
      return 'theme-dark';
    }
  });

  // Wrapper de setTheme que persiste en Storage.
  // Mantiene la misma firma que tenías, así el resto del código no cambia.
  const setTheme = (next: ThemeType) => {
    setThemeState(next);
    try {
      Storage.setItemSync(THEME_STORAGE_KEY, next);
    } catch (e) {
      console.warn('[theme] failed to persist', e);
    }
  };

  // const [theme, setTheme] = useState<ThemeType>('theme-dark');
  const getVar = (name: ThemeVarName) => themeVariables[theme][name];

  return (
    <ThemeContext.Provider value={{ theme, setTheme, getVar }}>
      <VariableContextProvider value={themeVariables[theme]}>
        {children}
      </VariableContextProvider>
    </ThemeContext.Provider>
  );
}