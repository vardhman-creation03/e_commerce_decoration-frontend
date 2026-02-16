// ==========================================
// AUTH SERVICE - Simplified (No Authentication)
// ==========================================
// All authentication removed - everything is public
// This file is kept for backward compatibility but contains no auth functions

import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://e-commerce-decor-backend.onrender.com';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// No token interceptor - all requests are public

export const authService = {
    // All auth functions removed - not needed for public website
};

export default authService;
