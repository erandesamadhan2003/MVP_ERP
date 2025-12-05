import axios from 'axios';

export const api = axios.create({
    baseURL: 'http://mvperp.org:82/api',
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
});

api.interceptors.request.use(config => {
    // take token from local storage of android 
    // const token = localStorage.getItem('token');
    // if (token) {
    //     config.headers.Authorization = `Bearer ${token}`;
    // }
    return config;
}, error => {
    return Promise.reject(error);
});

api.interceptors.response.use(response => {
    return response;
}, error => {
    return Promise.reject(error);
});