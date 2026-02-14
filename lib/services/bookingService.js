import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

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

export const bookingService = {
    createBooking: async (bookingData) => {
        const response = await api.post('/api/v1/bookings/create', bookingData);
        return response.data;
    },

    getMyBookings: async () => {
        const response = await api.get('/api/v1/bookings/my-bookings');
        return response.data;
    },

    downloadInvoice: async (bookingId) => {
        const response = await api.get(`/api/v1/bookings/invoice/${bookingId}`, {
            responseType: 'blob',
        });
        return response.data;
    },

    verifyOnlinePayment: async (paymentData) => {
        const response = await api.post('/api/v1/bookings/verify-payment', paymentData);
        return response.data;
    },

    getAllBookings: async () => {
        const response = await api.get('/api/v1/admin/bookings/all');
        return response.data;
    },

    updateBookingStatus: async (id, statusData) => {
        const response = await api.put(`/api/v1/admin/bookings/status/${id}`, statusData);
        return response.data;
    },

    createPaymentOrder: async (paymentData) => {
        const response = await api.post('/api/v1/bookings/create-payment-order', paymentData);
        return response.data;
    }
};

export default bookingService;
