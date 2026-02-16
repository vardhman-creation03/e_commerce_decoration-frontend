import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

const api = axios.create({
    baseURL: API_BASE_URL,
});

// No token interceptor - uses sessionId instead

// Helper to get or create sessionId
const getSessionId = () => {
    if (typeof window === 'undefined') return null;
    
    let sessionId = localStorage.getItem('sessionId');
    if (!sessionId) {
        // Generate a unique session ID
        sessionId = 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
        localStorage.setItem('sessionId', sessionId);
    }
    return sessionId;
};

export const cartService = {
    // Get user cart by sessionId
    getCart: async () => {
        const sessionId = getSessionId();
        const response = await api.get('/api/v1/cart', { params: { sessionId } });
        return response.data;
    },

    // Add item to cart
    addToCart: async (cartData) => {
        const sessionId = getSessionId();
        const response = await api.post('/api/v1/cart/add', { ...cartData, sessionId });
        return response.data;
    },

    // Update cart item
    updateCartItem: async (itemId, updateData) => {
        const sessionId = getSessionId();
        const response = await api.put(`/api/v1/cart/item/${itemId}`, { ...updateData, sessionId });
        return response.data;
    },

    // Remove item from cart
    removeFromCart: async (itemId) => {
        const sessionId = getSessionId();
        const response = await api.delete(`/api/v1/cart/item/${itemId}`, { data: { sessionId } });
        return response.data;
    },

    // Clear cart
    clearCart: async () => {
        const sessionId = getSessionId();
        const response = await api.delete('/api/v1/cart/clear', { data: { sessionId } });
        return response.data;
    },

    // Convert cart to booking (checkout)
    checkoutCart: async (checkoutData) => {
        const sessionId = getSessionId();
        const response = await api.post('/api/v1/cart/checkout', { ...checkoutData, sessionId });
        return response.data;
    },
};

export default cartService;
