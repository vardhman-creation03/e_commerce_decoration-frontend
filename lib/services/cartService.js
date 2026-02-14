import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

const api = axios.create({
    baseURL: API_BASE_URL,
});

// Add token to requests
api.interceptors.request.use((config) => {
    if (typeof window !== 'undefined') {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
    }
    return config;
});

export const cartService = {
    // Get user cart
    getCart: async () => {
        const response = await api.get('/api/v1/cart');
        return response.data;
    },

    // Add item to cart
    addToCart: async (cartData) => {
        const response = await api.post('/api/v1/cart/add', cartData);
        return response.data;
    },

    // Update cart item
    updateCartItem: async (itemId, updateData) => {
        const response = await api.put(`/api/v1/cart/item/${itemId}`, updateData);
        return response.data;
    },

    // Remove item from cart
    removeFromCart: async (itemId) => {
        const response = await api.delete(`/api/v1/cart/item/${itemId}`);
        return response.data;
    },

    // Clear cart
    clearCart: async () => {
        const response = await api.delete('/api/v1/cart/clear');
        return response.data;
    },

    // Convert cart to booking
    checkoutCart: async (paymentMode = 'Online') => {
        const response = await api.post('/api/v1/cart/checkout', { paymentMode });
        return response.data;
    },
};
