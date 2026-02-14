'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Lock, Shield, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

// Admin password - should be set in environment variable
// Change this password in your .env.local file: NEXT_PUBLIC_ADMIN_PASSWORD=YourSecurePassword
const ADMIN_PASSWORD = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || 'Vardhman@2024';

const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

function AdminLayoutContent({ children }) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { toast } = useToast();
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isChecking, setIsChecking] = useState(true);
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        // Check if password is in URL or sessionStorage
        const urlPassword = searchParams.get('pwd');
        const decodedUrlPassword = urlPassword ? decodeURIComponent(urlPassword) : null;
        const sessionPassword = typeof window !== 'undefined' ? sessionStorage.getItem('admin_password') : null;

        // If password is in URL and matches, authenticate
        if (ADMIN_PASSWORD && decodedUrlPassword === ADMIN_PASSWORD) {
            // Store in sessionStorage for this session
            if (typeof window !== 'undefined') {
                sessionStorage.setItem('admin_password', ADMIN_PASSWORD);
            }
            setIsAuthenticated(true);
            setIsChecking(false);
        } else if (ADMIN_PASSWORD && sessionPassword === ADMIN_PASSWORD) {
            // Already authenticated in this session
            setIsAuthenticated(true);
            setIsChecking(false);
        } else {
            // Not authenticated - show password form
            setIsAuthenticated(false);
            setIsChecking(false);
        }
    }, [searchParams]);

    const handlePasswordSubmit = (e) => {
        e.preventDefault();
        setIsLoading(true);

        // Simulate a small delay for better UX
        setTimeout(() => {
            if (ADMIN_PASSWORD && password === ADMIN_PASSWORD) {
                // Store in sessionStorage
                if (typeof window !== 'undefined') {
                    sessionStorage.setItem('admin_password', ADMIN_PASSWORD);
                }
                setIsAuthenticated(true);
                toast({
                    title: 'Access Granted',
                    description: 'Welcome to Admin Panel',
                });
                // Update URL with password parameter
                const currentPath = window.location.pathname;
                router.push(`${currentPath}?pwd=${encodeURIComponent(ADMIN_PASSWORD)}`);
            } else {
                toast({
                    title: 'Access Denied',
                    description: 'Incorrect password. Please try again.',
                    variant: 'destructive',
                });
                setPassword('');
            }
            setIsLoading(false);
        }, 300);
    };

    // Show loading state while checking
    if (isChecking) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
                <div className="text-center">
                    <Loader2 className="h-8 w-8 animate-spin text-green-600 mx-auto mb-4" />
                    <p className="text-gray-600">Verifying access...</p>
                </div>
            </div>
        );
    }

    // Show password form if not authenticated
    if (!isAuthenticated) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-green-50/30 to-gray-100 p-4">
                <motion.div
                    initial="hidden"
                    animate="visible"
                    variants={fadeIn}
                    className="w-full max-w-md"
                >
                    <Card className="border-2 border-gray-200 shadow-xl">
                        <CardHeader className="text-center pb-4">
                            <div className="mx-auto mb-4 w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                                <Shield className="h-8 w-8 text-green-600" />
                            </div>
                            <CardTitle className="text-2xl font-bold text-gray-900">
                                Admin Access Required
                            </CardTitle>
                            <CardDescription className="text-base mt-2">
                                Enter the admin password to continue
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handlePasswordSubmit} className="space-y-4">
                                <div className="space-y-2">
                                    <label htmlFor="password" className="text-sm font-medium text-gray-700">
                                        Password
                                    </label>
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                                        <Input
                                            id="password"
                                            type="password"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            placeholder="Enter admin password"
                                            className="pl-10 h-12 text-base"
                                            required
                                            autoFocus
                                        />
                                    </div>
                                </div>
                                <Button
                                    type="submit"
                                    disabled={isLoading || !password}
                                    className="w-full h-12 bg-green-600 hover:bg-green-700 text-white font-semibold text-base"
                                >
                                    {isLoading ? (
                                        <span className="flex items-center gap-2">
                                            <Loader2 className="h-4 w-4 animate-spin" />
                                            Verifying...
                                        </span>
                                    ) : (
                                        'Access Admin Panel'
                                    )}
                                </Button>
                            </form>
                            <div className="mt-6 pt-6 border-t border-gray-200 space-y-2">
                                <p className="text-xs text-center text-gray-500">
                                    🔒 This area is protected. Unauthorized access is prohibited.
                                </p>
                                <p className="text-xs text-center text-gray-400">
                                    💡 Tip: You can also access by adding <code className="bg-gray-100 px-1 py-0.5 rounded">?pwd=YourPassword</code> to the URL
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>
            </div>
        );
    }

    // Render admin content if authenticated
    return <>{children}</>;
}

export default function AdminLayout({ children }) {
    return (
        <Suspense
            fallback={
                <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
                    <div className="text-center">
                        <Loader2 className="h-8 w-8 animate-spin text-green-600 mx-auto mb-4" />
                        <p className="text-gray-600">Loading...</p>
                    </div>
                </div>
            }
        >
            <AdminLayoutContent>{children}</AdminLayoutContent>
        </Suspense>
    );
}
