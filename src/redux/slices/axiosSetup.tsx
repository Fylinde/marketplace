import axios, { InternalAxiosRequestConfig } from 'axios';
import store from '../store';

const setupAxiosInterceptors = () => {
  axios.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
      const token = store.getState().auth.access_token;
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );
};

export default setupAxiosInterceptors;
