import axios, { AxiosError } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

// Get base URL - can be overridden via environment or use default
const getBaseURL = () => {
    // Check if there's an environment variable or config override
    // For now, use the default API URL
    return 'http://mvperp.org:82/api';
};

export const api = axios.create({
    baseURL: getBaseURL(),
    timeout: 60000,
    headers: {
        'Content-Type': 'application/json',
    },
});

api.interceptors.request.use(
    async (config) => {
        try {
            const token = await AsyncStorage.getItem('IdToken');
            if (token && config && config.headers) {
                config.headers['Authorization'] = `Bearer ${token}`;
            }
        } catch (e) {
            // ignore
        }
        return config;
    },
    error => {
        return Promise.reject(error);
    },
);

api.interceptors.response.use(
    response => response,
    (error: AxiosError) => {
        // Enhanced error logging for network issues
        if (error.code === 'ERR_NETWORK' || error.message === 'Network Error') {
            console.warn('Network Error Details:', {
                message: error.message,
                code: error.code,
                baseURL: api.defaults.baseURL,
                platform: Platform.OS,
                config: error.config ? {
                    url: error.config.url,
                    method: error.config.method,
                } : null,
            });
            
            // Provide more helpful error message
            const networkError = new Error(
                `Network connection failed. Please check your internet connection and ensure the API server is accessible.`
            ) as AxiosError;
            networkError.code = error.code;
            networkError.config = error.config;
            networkError.request = error.request;
            return Promise.reject(networkError);
        }
        return Promise.reject(error);
    },
);
