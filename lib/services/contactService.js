import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://e-commerce-decor-backend.onrender.com';

const api = axios.create({
    baseURL: API_BASE_URL,
});

// No token interceptor - all requests are public

export const contactService = {
    sendContactMessage: async (contactData) => {
        const response = await api.post('/api/v1/sendContactMessage', contactData);
        return response.data;
    },

    getAllContacts: async () => {
        const response = await api.get('/api/v1/admin/getallContact');
        return response.data;
    },

    updateContactStatus: async (id, updateData) => {
        const response = await api.post(`/api/v1/admin/updateContactMessage/${id}`, updateData);
        return response.data;
    }
};

export default contactService;
