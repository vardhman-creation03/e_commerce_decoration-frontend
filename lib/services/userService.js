import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://e-commerce-decor-backend.onrender.com';

const api = axios.create({
    baseURL: API_BASE_URL,
});

// No token interceptor - all requests are public

export const userService = {
    // Get bookings by contact (mobile or email) - Public
    getBookingsByContact: async (mobile, email) => {
        const params = {};
        if (mobile) params.mobile = mobile;
        if (email) params.email = email;
        const response = await api.get('/api/v1/bookings/contact', { params });
        return response.data;
    },

    // Get booking by booking ID - Public
    getBookingById: async (bookingId) => {
        const response = await api.get(`/api/v1/bookings/${bookingId}`);
        return response.data;
    },

    // Admin functions - Public (no auth required)
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
        const response = await api.delete('/api/v1/admin/deleteProfile', {
            data: data
        });
        return response.data;
    }
};

export default userService;
