import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://vardhman-decoration.onrender.com';

const api = axios.create({
    baseURL: API_BASE_URL,
});

api.interceptors.request.use((config) => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export const userService = {
    getUserProfile: async () => {
        const response = await api.get('/api/v1/getUserprofile');
        return response.data;
    },

    updateUserProfile: async (profileData) => {
        const response = await api.put('/api/v1/updateProfile', profileData);
        return response.data;
    },

    getUserAddress: async () => {
        const response = await api.get('/api/v1/getUserAddress');
        return response.data;
    },

    addUserAddress: async (addressData) => {
        const response = await api.post('/api/v1/addUserAddress', addressData);
        return response.data;
    },

    deleteUserAddress: async (addressId) => {
        const response = await api.delete(`/api/v1/deleteUserAddress/${addressId}`);
        return response.data;
    },

    getAllCustomers: async (params = {}) => {
        const response = await api.get('/api/v1/admin/getAllCustomers', { params });
        return response.data;
    },

    getCustomerProfileById: async (userId) => {
        const response = await api.get('/api/v1/admin/getCustomerProfileById', {
            data: { userId }
        });
        return response.data;
    },

    updateUserStatus: async (data) => {
        const response = await api.put('/api/v1/admin/updateUserStatus', data);
        return response.data;
    },

    deleteCustomerProfile: async (data) => {
        const response = await api.delete('/api/v1/deleteProfile', {
            data: data
        });
        return response.data;
    },

    getUserDashboardStats: async () => {
        const response = await api.get('/api/v1/getUserDashboardStats');
        return response.data;
    }
};

export default userService;
