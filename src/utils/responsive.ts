import { Dimensions, PixelRatio } from 'react-native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

export const responsiveWidth = (percent: number = 90): number => {
  const ratio = percent / 100;
  const newSize = SCREEN_WIDTH * ratio;
  return Math.round(PixelRatio.roundToNearestPixel(newSize));
};

const pixelRatio = PixelRatio.get();
const screenArea = SCREEN_WIDTH * SCREEN_HEIGHT;
const smallestDimension = Math.min(SCREEN_WIDTH, SCREEN_HEIGHT);
const getDeviceCategory = () => {
  if (smallestDimension >= 768 || screenArea >= 500000) {
    return 'tablet';
  }

  // For phones, use smallest dimension as primary factor
  if (smallestDimension >= 414) return 'large-phone';   // iPhone Pro Max, large Android
  if (smallestDimension >= 390) return 'standard-phone'; // iPhone 14, Pixel 7
  if (smallestDimension >= 360) return 'medium-phone';   // Common Android size
  if (smallestDimension >= 320) return 'small-phone';    // iPhone SE, compact Android
  return 'tiny-phone'; // Very small devices
};

export const SCALING_CONSTANTS = {
  'tablet': 1.2,
  'large-phone': 1.0,
  'standard-phone': 1.0,
  'medium-phone': 0.9,
  'small-phone': 0.8,
  'tiny-phone': 0.7,
}

export const responsiveSize = (size: number): number => {

  const deviceCategory = getDeviceCategory();

  let scaleFactor = SCALING_CONSTANTS[deviceCategory];

  if (pixelRatio >= 3.5) {
    scaleFactor *= 1.02; // Slightly larger for very high DPI screens
  } else if (pixelRatio <= 2) {
    scaleFactor *= 0.98; // Slightly smaller for low DPI screens
  }

  const scaledSize = size * scaleFactor;

  return Math.round(PixelRatio.roundToNearestPixel(scaledSize));
};



export const spacing = {
  xs: responsiveSize(4),
  sm: responsiveSize(8),
  md: responsiveSize(16),
  lg: responsiveSize(24),
  xl: responsiveSize(32),
  xxl: responsiveSize(48),
};

export const getDeviceType = () => {
  const pixelDensity = PixelRatio.get();
  const deviceWidth = SCREEN_WIDTH * pixelDensity;
  const deviceHeight = SCREEN_HEIGHT * pixelDensity;
  const aspectRatio = deviceHeight / deviceWidth;

  if (Math.min(deviceWidth, deviceHeight) >= 1000) {
    return 'tablet';
  } else if (aspectRatio < 1.6) {
    return 'wide-phone'; // Like iPhone 14 Pro Max landscape-ish ratio
  } else {
    return 'phone';
  }
};


export default {
  responsiveSize,
  spacing,
  getDeviceType,
};