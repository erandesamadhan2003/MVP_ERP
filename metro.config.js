// const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');

// /**
//  * Metro configuration
//  * https://reactnative.dev/docs/metro
//  *
//  * @type {import('@react-native/metro-config').MetroConfig}
//  */
// const config = {};

// module.exports = mergeConfig(getDefaultConfig(__dirname), config);

const { getDefaultConfig, mergeConfig } = require("@react-native/metro-config");
const { withNativewind } = require("nativewind/metro");

// Create metro base config
const config = {};

// Merge default metro config with user config
const mergedConfig = mergeConfig(getDefaultConfig(__dirname), config);

// Wrap it with NativeWind config
module.exports = withNativewind(mergedConfig, { input: "./global.css" });


// const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');
// const { withNativewind } = require('nativewind/metro');

// /**
//  * Metro configuration
//  * https://reactnative.dev/docs/metro
//  *
//  * @type {import('@react-native/metro-config').MetroConfig}
//  */
// const config = {};

// module.exports = withNativewind(
//     mergeConfig(getDefaultConfig(__dirname), config),
//     { input: './global.css' }
// );