import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

const api = axios.create({
    baseURL: API_BASE_URL,
});

// No token interceptor - all requests are public

export const bookingService = {
    // Create booking (guest booking - no auth required)
    createBooking: async (bookingData) => {
        const response = await api.post('/api/v1/bookings/create', bookingData);
        return response.data;
    },

    // Get bookings by mobile or email (public)
    getMyBookings: async (mobile, email) => {
        const params = {};
        if (mobile) params.mobile = mobile;
        if (email) params.email = email;
        const response = await api.get('/api/v1/bookings/my-bookings', { params });
        return response.data;
    },

    // Get bookings by contact (public)
    getBookingsByContact: async (mobile, email) => {
        const params = {};
        if (mobile) params.mobile = mobile;
        if (email) params.email = email;
        const response = await api.get('/api/v1/bookings/contact', { params });
        return response.data;
    },

    // Download invoice (public)
    downloadInvoice: async (bookingId) => {
        const response = await api.get(`/api/v1/bookings/invoice/${bookingId}`, {
            responseType: 'blob',
        });
        return response.data;
    },

    // Verify online payment (public)
    verifyOnlinePayment: async (paymentData) => {
        const response = await api.post('/api/v1/bookings/verify-payment', paymentData);
        return response.data;
    },

    // Get all bookings (admin - public)
    getAllBookings: async () => {
        const response = await api.get('/api/v1/admin/bookings/all');
        return response.data;
    },

    // Update booking status (admin - public)
    updateBookingStatus: async (id, statusData) => {
        const response = await api.put(`/api/v1/admin/bookings/status/${id}`, statusData);
        return response.data;
    },

    // Create payment order (public)
    createPaymentOrder: async (paymentData) => {
        const response = await api.post('/api/v1/bookings/create-payment-order', paymentData);
        return response.data;
    }
};

export default bookingService;
