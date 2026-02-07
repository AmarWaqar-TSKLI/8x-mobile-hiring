const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");
const path = require("path");

const config = getDefaultConfig(__dirname);

// Force a single copy of three.js to prevent "Multiple instances" warning
config.resolver = {
  ...config.resolver,
  extraNodeModules: {
    ...config.resolver?.extraNodeModules,
    three: path.resolve(__dirname, "node_modules/three"),
  },
};

module.exports = withNativeWind(config, { input: "./global.css" });
