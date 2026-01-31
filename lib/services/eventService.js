import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://vardhman-decoration.onrender.com';

const api = axios.create({
    baseURL: API_BASE_URL,
});

export const eventService = {
    getAllEvents: async () => {
        const response = await api.get('/api/v1/get-all-events');
        return response.data;
    },

    getEventDetail: async (id) => {
        const response = await api.get(`/api/v1/get-event-detail/${id}`);
        return response.data;
    },

    getAllOccasions: async () => {
        const response = await api.get('/api/v1/get-all-occasions');
        return response.data;
    },

    getEventsByOccasion: async (occasion) => {
        const response = await api.get(`/api/v1/get-events/${occasion}`);
        return response.data;
    },

    submitInquiry: async (inquiryData) => {
        const response = await api.post('/api/v1/submit-inquiry', inquiryData);
        return response.data;
    },

    createEvent: async (eventData) => {
        // eventData should be a FormData object
        const response = await api.post('/api/v1/create-event', eventData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
        return response.data;
    },

    updateEvent: async (id, eventData) => {
        // eventData should be a FormData object
        const response = await api.put(`/api/v1/update-event/${id}`, eventData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
        return response.data;
    },

    deleteEvent: async (id) => {
        const response = await api.delete(`/api/v1/delete-event/${id}`);
        return response.data;
    },

    async getEventInquiries() {
        const response = await api.get('/api/v1/get-event-inquiries');
        return response.data;
    },

    createOccasion: async (occasionData) => {
        const response = await api.post('/api/v1/create-occasion', occasionData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
        return response.data;
    }
};

export default eventService;
