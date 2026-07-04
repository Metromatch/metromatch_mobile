import { useAuthStore } from '@/store/authStore';
import axios from 'axios';
import Toast from 'react-native-toast-message';
import { router } from 'expo-router';
import { clearStore } from '@/utils/authUtils';

const http = axios.create({
  baseURL: "https://metromatchindia.vercel.app",
  timeout: 20_000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

http.interceptors.request.use(
  (config,) => {
    const token = useAuthStore.getState().authConfiguration?.accessToken;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    console.log(token)
    return config;
  },
  (error) => {
    return Promise.reject(error)
  },
);

http.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error?.response?.status === 401) {
      clearStore();
      router.replace('/login');
    } else {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: error?.response?.data?.message || 'Something went wrong',
        position: 'top',
      });
    }
    return Promise.reject(error)
  },
);


export default http;