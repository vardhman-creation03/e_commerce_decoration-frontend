'use client';

import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { User } from 'lucide-react';
import { useAuth } from '@/lib/context/auth-context';

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

export default function Dashboard() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="border-b border-gray-100 bg-gradient-to-b from-green-50/30 to-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeIn}
            className="max-w-3xl mx-auto"
          >
            <div className="space-y-4">
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-light text-gray-900 leading-tight tracking-tight">
                Welcome back, {user?.name || 'User'}
              </h1>
              <p className="text-base sm:text-lg text-gray-600 font-light max-w-xl leading-relaxed">
                Manage your account and view your event inquiries.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-3xl mx-auto space-y-8">
            <Card className="border border-gray-200 rounded-none">
                <CardHeader className="pb-2 border-b border-gray-100">
                  <CardTitle className="text-xl font-light text-gray-900">
                    Profile Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-6 space-y-4">
                  <div className="flex items-center gap-4">
                     <div className="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center">
                        <User className="h-6 w-6 text-green-600"/>
                     </div>
                     <div>
                        <p className="text-sm text-gray-500 font-light">Full Name</p>
                        <p className="text-lg font-medium text-gray-900">{user?.name || 'N/A'}</p>
                     </div>
                  </div>
                   <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center">
                        <span className="text-green-600 font-bold">@</span>
                     </div>
                     <div>
                        <p className="text-sm text-gray-500 font-light">Email Address</p>
                         <p className="text-lg font-medium text-gray-900">{user?.email || 'N/A'}</p>
                     </div>
                  </div>
                </CardContent>
            </Card>
        </div>
      </div>
    </div>
  );
}