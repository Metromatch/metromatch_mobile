// shims/nativeStreamVideoThumbnailStub.js
// Stub for stream-chat-expo's NativeStreamVideoThumbnail.
// TurboModuleRegistry.getEnforcing('StreamVideoThumbnail') throws in Expo Go
// because the native binary doesn't include this module.
// We use .get() instead (returns null) and expose a no-op implementation
// so video thumbnail generation silently does nothing.

const { TurboModuleRegistry } = require('react-native');

// Use .get() which returns null instead of throwing
const NativeStreamVideoThumbnail = TurboModuleRegistry.get('StreamVideoThumbnail') ?? {
    createVideoThumbnails: (_urls) => Promise.resolve([]),
};

module.exports = NativeStreamVideoThumbnail;
module.exports.default = NativeStreamVideoThumbnail;
