const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// 1. Tell Metro to prioritize browser environments over standard node fields
config.resolver.resolverMainFields = ['browser', 'main', 'react-native'];

// 2. Disable explicit module package export restrictions 
config.resolver.unstable_enablePackageExports = false;

module.exports = config;
