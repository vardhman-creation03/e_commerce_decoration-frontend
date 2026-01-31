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

export const contactService = {
    sendContactMessage: async (contactData) => {
        const response = await api.post('/api/v1/sendContactMessage', contactData);
        return response.data;
    },

    getAllContacts: async () => {
        const response = await api.get('/api/v1/getallContact');
        return response.data;
    },

    updateContactStatus: async (id, updateData) => {
        const response = await api.post(`/api/v1/admin/updateContactMessage/${id}`, updateData);
        return response.data;
    }
};

export default contactService;
