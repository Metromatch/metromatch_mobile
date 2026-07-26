// // metro.config.js
// // Learn more: https://docs.expo.dev/guides/customizing-metro
// const { getDefaultConfig } = require('expo/metro-config');
// const path = require('path');

// /** @type {import('expo/metro-config').MetroConfig} */
// const config = getDefaultConfig(__dirname);

// // On web, stream-chat-expo tries to import a native-only module
// // (codegenNativeComponent) through its shimmer view.
// // We replace it with an empty stub so the web bundle succeeds.
// const STREAM_SHIMMER_NATIVE = path.resolve(
//     __dirname,
//     'node_modules/stream-chat-expo/src/native/StreamShimmerViewNativeComponent.ts',
// );

// const originalResolver = config.resolver;
// config.resolver = {
//     ...originalResolver,
//     resolveRequest: (context, moduleName, platform) => {
//         // Only stub out the problematic native module on web
//         if (
//             platform === 'web' &&
//             (moduleName === 'react-native/Libraries/Utilities/codegenNativeComponent' ||
//                 context.originModulePath === STREAM_SHIMMER_NATIVE ||
//                 moduleName.endsWith('StreamShimmerViewNativeComponent') ||
//                 moduleName.endsWith('NativeShimmerView'))
//         ) {
//             return {
//                 filePath: path.resolve(__dirname, 'shims/streamShimmerStub.js'),
//                 type: 'sourceFile',
//             };
//         }
//         // Fall back to default resolution
//         return context.resolveRequest(context, moduleName, platform);
//     },
// };

// module.exports = config;
