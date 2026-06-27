const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Clerk's clerk-react internals reference react-dom for web portal utils.
// In React Native there is no DOM, so we point react-dom at an empty shim
// that satisfies the import without pulling in a second copy of React.
config.resolver.extraNodeModules = {
  'react-dom': require.resolve('./src/shims/react-dom-shim.js'),
};

module.exports = config;
