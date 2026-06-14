import { useAuthStore } from '@/store/authStore';
import axios from 'axios';
import { Alert } from 'react-native';

const http = axios.create({
  baseURL: "http://localhost:3000",
  timeout: 10_000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    'Access-Control-Allow-Origin': '*',
  },
});

http.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    Alert.alert("Error", error?.response?.data?.message || "Something went wrong");
    return Promise.reject(error)
  }
);


export default http;