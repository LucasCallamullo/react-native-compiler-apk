// metro.config.js
const { getDefaultConfig } = require('expo/metro-config');
const { withNativewind } = require('nativewind/metro');

const config = getDefaultConfig(__dirname);

// 1. Alias de módulos (aplicados al config base)
config.resolver.extraNodeModules = {
  '@features': `${__dirname}/src/features`,
  '@shared': `${__dirname}/src/shared`,
};

// 2. Una sola llamada a withNativewind, con todo adentro
module.exports = withNativewind(config, {
  inlineVariables: {
    exclude: [
      // Superficies
      '--color-surface-0',
      '--color-surface-1',
      '--color-surface-2',
      '--color-surface-3',
      // Texto
      '--color-content',
      '--color-content-muted',
      // Marca
      '--color-main-300',
      '--color-main-500',
      '--color-main-700',
      '--color-main-fg',
      // Bordes
      '--color-border',
      // Estados
      '--color-success',
      '--color-success-bg',
      '--color-success-fg',
      '--color-success-border',
      '--color-error',
      '--color-error-bg',
      '--color-error-fg',
      '--color-error-border',
      '--color-warning',
      '--color-warning-bg',
      '--color-warning-fg',
      '--color-warning-border',
      '--color-info',
      '--color-info-bg',
      '--color-info-fg',
      '--color-info-border',
    ],
  },
});