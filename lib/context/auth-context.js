'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { authService } from '../services/authService';
import { useToast } from '../../hooks/use-toast';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    const { toast } = useToast();

    useEffect(() => {
        // Check for token on mount
        const storedToken = localStorage.getItem('token');
        const storedUser = localStorage.getItem('user'); // If we store user object

        if (storedToken) {
            setToken(storedToken);
            if (storedUser) {
                try {
                    setUser(JSON.parse(storedUser));
                } catch (e) {
                    console.error("Failed to parse user", e);
                }
            }
            // Optionally fetch fresh user data
            // fetchUser(); 
        }
        setLoading(false);
    }, []);

    const login = async (credentials) => {
        try {
            const data = await authService.loginWithPassword(credentials);
            handleAuthSuccess(data);
            return data;
        } catch (error) {
            throw error;
        }
    };

    const loginWithOTP = async (otpData) => {
        try {
            const data = await authService.loginWithOTP(otpData);
            handleAuthSuccess(data);
            return data;
        } catch (error) {
            throw error;
        }
    };

    const register = async (userData) => {
        try {
            const data = await authService.register(userData);
            // Usually register might not auto-login, but if it does:
            if (data.token) {
                handleAuthSuccess(data);
            }
            return data;
        } catch (error) {
            throw error;
        }
    };

    const handleAuthSuccess = (data) => {
        const { token, user } = data;
        setToken(token);
        setUser(user);
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        localStorage.setItem('isUserLoggedIn', 'true'); // For legacy support
        localStorage.setItem('userRole', user?.role || 'user');
    };

    const logout = () => {
        setToken(null);
        setUser(null);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('isUserLoggedIn');
        localStorage.removeItem('userRole');
        // Keep userName and userMobile for guest bookings
        // localStorage.removeItem('userName');
        // localStorage.removeItem('userMobile');

        router.push('/');
        toast({
            title: "Session Cleared",
            description: "Your session has been cleared.",
        });
    };

    const requestOTP = async (mobile) => {
        return await authService.requestOTP(mobile);
    }

    return (
        <AuthContext.Provider value={{ user, token, loading, login, logout, register, requestOTP, loginWithOTP }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
