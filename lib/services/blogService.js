import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://e-commerce-decor-backend.onrender.com';

const api = axios.create({
    baseURL: API_BASE_URL,
});

// No token interceptor - all requests are public

export const blogService = {
    getAllBlogPosts: async (params = {}) => {
        const response = await api.get('/api/v1/blog/all', { params });
        return response.data;
    },

    getBlogPost: async (slug) => {
        const response = await api.get(`/api/v1/blog/post/${slug}`);
        return response.data;
    },

    createBlog: async (blogData) => {
        const response = await api.post('/api/v1/admin/blog/create', blogData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    },

    deleteBlog: async (id) => {
        const response = await api.delete(`/api/v1/admin/blog/delete/${id}`);
        return response.data;
    },

    updateBlog: async (id, blogData) => {
        const response = await api.put(`/api/v1/admin/blog/update/${id}`, blogData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    }
};

export default blogService;
