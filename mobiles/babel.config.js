module.exports = function (api) {
  api.cache(true);
  return {
    presets: [
      ["babel-preset-expo", { jsxImportSource: "nativewind" }],
      "nativewind/babel",
    ],
    plugins: [
      [
        "module-resolver",
        {
          root: ["."],
          alias: {
            //! Always adapt to the aliases in tsconfig.json
            "@features": "./src/features",
            "@shared": "./src/shared",
            "@": "./",
          },
        },
        //! Always at the end of the list
        "react-native-reanimated/plugin", 
      ],
    ],
  };
};