import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://vardhman-decoration.onrender.com';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add a request interceptor to include token
api.interceptors.request.use(
    (config) => {
        const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

export const authService = {
    loginWithPassword: async (credentials) => {
        const response = await api.post('/api/v1/verify-user', credentials);
        return response.data;
    },

    requestOTP: async (mobile) => {
        const response = await api.post('/api/v1/send-otp', { mobile });
        return response.data;
    },

    loginWithOTP: async (data) => {
        const response = await api.post('/api/v1/verify-user', data);
        return response.data;
    },

    register: async (userData) => {
        const response = await api.post('/api/v1/user-register', userData);
        return response.data;
    },

    getCurrentUser: async () => {
        const response = await api.get('/api/v1/getUserprofile');
        return response.data;
    },
};

export default authService;
