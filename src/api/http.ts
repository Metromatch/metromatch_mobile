import { useAuthStore } from '@/store/authStore';
import axios from 'axios';
import { Alert } from 'react-native';

const http = axios.create({
  baseURL: "https://metromatchindia.vercel.app",
  timeout: 10_000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    'Access-Control-Allow-Origin': '*',
  },
});

http.interceptors.request.use(
  (config,) => {
    const token = useAuthStore.getState().authConfiguration?.accessToken;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.log('error', error.response.data.message)
    Alert.alert("Error", error?.response?.data?.message || "Something went wrong");
    return Promise.reject(error)
  }
);


export default http;