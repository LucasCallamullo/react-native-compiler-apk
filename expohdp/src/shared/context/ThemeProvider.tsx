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
    '--color-bg': '#09090b',
    '--color-card': '#18181b',
    '--color-popover': '#27272a',
    '--color-fg': '#f4f4f5',
    '--color-fg-muted': '#a1a1aa',
    '--color-primary': '#a855f7',
    '--color-primary-fg': '#ffffff',
    '--color-secondary': '#8b5cf6',
    '--color-secondary-fg': '#ffffff',
    '--color-accent': '#27272a',
    '--color-border': '#27272a',
    '--color-input': '#27272a',
  },
  'theme-light': {
    '--color-bg': '#ffffff',
    '--color-card': '#f4f4f5',
    '--color-popover': '#ffffff',
    '--color-fg': '#18181b',
    '--color-fg-muted': '#71717a',
    '--color-primary': '#9333ea',
    '--color-primary-fg': '#ffffff',
    '--color-secondary': '#7c3aed',
    '--color-secondary-fg': '#ffffff',
    '--color-accent': '#e4e4e7',
    '--color-border': '#e4e4e7',
    '--color-input': '#e4e4e7',
  },
  'theme-violet': {
    '--color-bg': '#1e0b36',
    '--color-card': '#2e1065',
    '--color-popover': '#581c87',
    '--color-fg': '#faf5ff',
    '--color-fg-muted': '#d8b4fe',
    '--color-primary': '#ec4899',
    '--color-primary-fg': '#ffffff',
    '--color-secondary': '#d946ef',
    '--color-secondary-fg': '#ffffff',
    '--color-accent': '#4c1d95',
    '--color-border': '#581c87',
    '--color-input': '#581c87',
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
  
  // Border colors
  'border-border': '--color-border',
  'border-primary': '--color-primary',
  'border-secondary': '--color-secondary',
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