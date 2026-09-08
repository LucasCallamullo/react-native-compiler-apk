const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");

// Fetch Expo's default Metro bundler configuration for the current project directory.
const config = getDefaultConfig(__dirname);

// Wrap the Expo Metro configuration with NativeWind's CSS transformer.
// Points directly to the primary Tailwind CSS input file ('./global.css').
module.exports = withNativeWind(config, { input: "./global.css" });