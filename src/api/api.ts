import axios from 'axios';

export const api = axios.create({
    baseURL: 'http://mvperp.org:82/api',
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
});

