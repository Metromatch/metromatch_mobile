import AsyncStorage from "@react-native-async-storage/async-storage"
import * as SecureStore from 'expo-secure-store';
import * as Application from 'expo-application';

import * as Device from 'expo-device';
import { Platform } from "react-native";

type UserProperties = {
  email: string,
  roles: string[],
  isLoggedIn: boolean,
}
type TokenProperties = {
  token: string,
  refreshToken: string,
};

export const storeUserDetails = (data: UserProperties) => {
  return AsyncStorage.setItem('user', JSON.stringify(data));
};

export const loadUserDetails = async () => {
  const userDetails = await AsyncStorage.getItem('user');
  if (userDetails) return JSON.parse(userDetails);
};

export const clearUserDetails = () => {
  return AsyncStorage.removeItem('user');
};

export const storeTokenDetails = (data: TokenProperties) => {
  return SecureStore.setItem('tokenDetails', JSON.stringify(data));
};

export const loadTokenDetails = () => {
  const tokenDetails = SecureStore.getItem('tokenDetails');
  if (tokenDetails) return JSON.parse(tokenDetails);
};

export const clearTokenDetails = () => {
  return SecureStore.deleteItemAsync('tokenDetails');
}

export const getDeviceDetails = async () => {
  let deviceId = null;
  const IS_IOS = Platform.OS === 'ios';
  const IS_ANDROID = Platform.OS === 'android';

  if (IS_ANDROID) {
    deviceId = Application.getAndroidId();
  }
  if (IS_IOS) {
    deviceId = await Application.getIosIdForVendorAsync();
  }

  return ({
    deviceId,
    deviceName: `${Device.brand || Device.manufacturer} ${Device.deviceName || Device.modelName} ${Device.osName}`,
  })
}

export const validateTokenDetails = (expirationTimestamp: number) => {
  const currentTimestamp = Date.now();
  return expirationTimestamp > currentTimestamp;
}
