import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const api = axios.create({
    baseURL: 'http://mvperp.org:82/api',
    // Increased timeout to give slower APIs more time before failing
    timeout: 30000,
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
    error => Promise.reject(error),
);
