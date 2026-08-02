// shims/createThumbnailStub.js
// Stub for react-native-create-thumbnail when the native TurboModule
// 'StreamVideoThumbnail' is not compiled into the binary (e.g. Expo Go).
// Video thumbnails will simply not generate; everything else works fine.
module.exports = {
    createThumbnail: () => Promise.resolve({ path: '', size: 0, mime: '', width: 0, height: 0 }),
};
