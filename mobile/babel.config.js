module.exports = function (api) {
  api.cache(true);
  return {
    presets: [
      ["babel-preset-expo", { jsxImportSource: "nativewind" }],
      "nativewind/babel",
    ],
    plugins: [
      [
        'module-resolver',
        {
          root: ['./'],
          alias: {
            '@features': './src/features',
            '@shared': './src/shared',
          },
        },
      ],
      "react-native-reanimated/plugin", // Siempre debe ir al final
    ],
  };
};