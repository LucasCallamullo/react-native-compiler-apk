import { VariableContextProvider } from 'nativewind';
import { ReactNode, useState, createContext, useContext } from 'react';

// ============================================
// TYPES
// ============================================
type ThemeType = 'theme-dark' | 'theme-light' | 'theme-violet';

interface ThemeProviderProps {
  children: ReactNode;
}

// ============================================
// THEME VARIABLES MAPPING
// ============================================
const themeVariables = {
  'theme-dark': {
    // Backgrounds & Layering
    '--color-bg': '#09090b',
    '--color-card': '#18181b',
    '--color-popover': '#27272a',

    // Typography & Legibility
    '--color-fg': '#f4f4f5',
    '--color-fg-muted': '#a1a1aa',

    // Brand & Accent Colors
    '--color-primary': '#a855f7',
    '--color-primary-fg': '#ffffff',
    '--color-secondary': '#8b5cf6',
    '--color-secondary-fg': '#ffffff',
    '--color-accent': '#27272a',

    // Borders & Form Inputs
    '--color-border': '#27272a',
    '--color-input': '#27272a',

    // Status & Semantic Colors
    '--color-success': '#4ade80',
    '--color-success-bg': '#052e16',
    '--color-success-border': '#166534',
    '--color-success-fg': '#86efac',

    '--color-error': '#f87171',
    '--color-error-bg': '#450a0a',
    '--color-error-border': '#991b1b',
    '--color-error-fg': '#fca5a5',

    '--color-warning': '#fbbf24',
    '--color-warning-bg': '#451a03',
    '--color-warning-border': '#92400e',
    '--color-warning-fg': '#fcd34d',

    '--color-info': '#60a5fa',
    '--color-info-bg': '#172554',
    '--color-info-border': '#1e3a8a',
    '--color-info-fg': '#93c5fd',

    '--color-purple-light': '#c084fc',
    '--color-purple-bg': '#2e1065',
    '--color-purple-border': '#581c87',

    // Zinc Colors
    '--color-zinc-800': '#27272a',
    '--color-zinc-900': '#18181b',
    '--color-zinc-950': '#09090b',
  },

  'theme-light': {
    // Backgrounds & Layering
    '--color-bg': '#ffffff',
    '--color-card': '#f4f4f5',
    '--color-popover': '#ffffff',

    // Typography & Legibility
    '--color-fg': '#18181b',
    '--color-fg-muted': '#71717a',

    // Brand & Accent Colors
    '--color-primary': '#7c3aed',
    '--color-primary-fg': '#ffffff',
    '--color-secondary': '#6d28d9',
    '--color-secondary-fg': '#ffffff',
    '--color-accent': '#e4e4e7',

    // Borders & Form Inputs
    '--color-border': '#e4e4e7',
    '--color-input': '#e4e4e7',

    // Status & Semantic Colors
    '--color-success': '#16a34a',
    '--color-success-bg': '#dcfce7',
    '--color-success-border': '#86efac',
    '--color-success-fg': '#14532d',

    '--color-error': '#dc2626',
    '--color-error-bg': '#fee2e2',
    '--color-error-border': '#fca5a5',
    '--color-error-fg': '#7f1d1d',

    '--color-warning': '#d97706',
    '--color-warning-bg': '#fef3c7',
    '--color-warning-border': '#fcd34d',
    '--color-warning-fg': '#78350f',

    '--color-info': '#2563eb',
    '--color-info-bg': '#dbeafe',
    '--color-info-border': '#93c5fd',
    '--color-info-fg': '#1e3a8a',

    '--color-purple-light': '#7c3aed',
    '--color-purple-bg': '#f5f3ff',
    '--color-purple-border': '#c4b5fd',

    // Zinc Colors
    '--color-zinc-800': '#d4d4d8',
    '--color-zinc-900': '#e4e4e7',
    '--color-zinc-950': '#f4f4f5',
  },

  'theme-violet': {
    // Backgrounds & Layering
    '--color-bg': '#1e0b36',
    '--color-card': '#2e1065',
    '--color-popover': '#581c87',

    // Typography & Legibility
    '--color-fg': '#faf5ff',
    '--color-fg-muted': '#d8b4fe',

    // Brand & Accent Colors
    '--color-primary': '#ec4899',
    '--color-primary-fg': '#ffffff',
    '--color-secondary': '#d946ef',
    '--color-secondary-fg': '#ffffff',
    '--color-accent': '#4c1d95',

    // Borders & Form Inputs
    '--color-border': '#581c87',
    '--color-input': '#581c87',

    // Status & Semantic Colors
    '--color-success': '#4ade80',
    '--color-success-bg': '#052e16',
    '--color-success-border': '#166534',
    '--color-success-fg': '#86efac',

    '--color-error': '#f87171',
    '--color-error-bg': '#450a0a',
    '--color-error-border': '#991b1b',
    '--color-error-fg': '#fca5a5',

    '--color-warning': '#fbbf24',
    '--color-warning-bg': '#451a03',
    '--color-warning-border': '#92400e',
    '--color-warning-fg': '#fcd34d',

    '--color-info': '#60a5fa',
    '--color-info-bg': '#172554',
    '--color-info-border': '#1e3a8a',
    '--color-info-fg': '#93c5fd',

    '--color-purple-light': '#d8b4fe',
    '--color-purple-bg': '#3b0764',
    '--color-purple-border': '#7e22ce',

    // Zinc Colors
    '--color-zinc-800': '#3b0764',
    '--color-zinc-900': '#4c1d95',
    '--color-zinc-950': '#1e0b36',
  },
};

// ============================================
// MAP: Clase Tailwind → Variable CSS
// ============================================
const classToVarMap = {
  // Text colors
  'text-fg': '--color-fg',
  'text-fg-muted': '--color-fg-muted',
  'text-primary': '--color-primary',
  'text-primary-fg': '--color-primary-fg',
  'text-secondary': '--color-secondary',
  'text-secondary-fg': '--color-secondary-fg',
  'text-success': '--color-success',
  'text-success-fg': '--color-success-fg',
  'text-error': '--color-error',
  'text-error-fg': '--color-error-fg',
  'text-warning': '--color-warning',
  'text-warning-fg': '--color-warning-fg',
  'text-info': '--color-info',
  'text-info-fg': '--color-info-fg',

  // Background colors
  'bg-bg': '--color-bg',
  'bg-card': '--color-card',
  'bg-popover': '--color-popover',
  'bg-primary': '--color-primary',
  'bg-primary-fg': '--color-primary-fg',
  'bg-secondary': '--color-secondary',
  'bg-secondary-fg': '--color-secondary-fg',
  'bg-accent': '--color-accent',
  'bg-input': '--color-input',
  'bg-success': '--color-success-bg',
  'bg-success-fg': '--color-success-fg',
  'bg-error': '--color-error-bg',
  'bg-error-fg': '--color-error-fg',
  'bg-warning': '--color-warning-bg',
  'bg-warning-fg': '--color-warning-fg',
  'bg-info': '--color-info-bg',
  'bg-info-fg': '--color-info-fg',
  'bg-purple-light': '--color-purple-light',
  'bg-purple-bg': '--color-purple-bg',
  'bg-purple-border': '--color-purple-border',

  // Border colors
  'border-border': '--color-border',
  'border-primary': '--color-primary',
  'border-secondary': '--color-secondary',
  'border-success': '--color-success-border',
  'border-error': '--color-error-border',
  'border-warning': '--color-warning-border',
  'border-info': '--color-info-border',
  'border-purple': '--color-purple-border',

  // Zinc colors
  'bg-zinc-800': '--color-zinc-800',
  'bg-zinc-900': '--color-zinc-900',
  'bg-zinc-950': '--color-zinc-950',
};

type TailwindClass = keyof typeof classToVarMap;

// ============================================
// CONTEXT
// ============================================
const ThemeContext = createContext<{
  theme: ThemeType;
  setTheme: (theme: ThemeType) => void;
  getColor: (className: TailwindClass) => string;
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
  const [theme, setTheme] = useState<ThemeType>('theme-dark');

  const getColor = (className: TailwindClass): string => {
    const varName = classToVarMap[className];
    return themeVariables[theme][varName as keyof typeof themeVariables['theme-dark']];
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme, getColor }}>
      <VariableContextProvider value={themeVariables[theme]}>
        {children}
      </VariableContextProvider>
    </ThemeContext.Provider>
  );
} 