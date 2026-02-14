'use client';

import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { User, Calendar, Clock, ArrowRight, Sparkles, MapPin, CheckCircle } from 'lucide-react';
import { useAuth } from '@/lib/context/auth-context';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useDispatch, useSelector } from 'react-redux';
import { getUserDashboardStats } from '../store/userSlice';

// Animation variants
const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

export default function Dashboard() {
  const { user } = useAuth();
  const dispatch = useDispatch();
  const { dashboardStats, dashboardLoading } = useSelector((state) => state.user);

  useEffect(() => {
    dispatch(getUserDashboardStats());
  }, [dispatch]);

  const stats = [
    { 
      label: "Total Events", 
      value: dashboardStats?.stats?.totalEvents || "0", 
      icon: Calendar, 
      color: "text-blue-600", 
      bg: "bg-blue-50" 
    },
    { 
      label: "Upcoming", 
      value: dashboardStats?.stats?.upcomingEvents || "0", 
      icon: Clock, 
      color: "text-orange-600", 
      bg: "bg-orange-50" 
    },
    { 
      label: "Completed", 
      value: dashboardStats?.stats?.completedEvents || "0", 
      icon: CheckCircle, 
      color: "text-green-600", 
      bg: "bg-green-50" 
    },
  ];

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50/30 font-sans">
      {/* Premium Hero Section */}
      <section className="relative overflow-hidden bg-white pb-12 pt-20 lg:pt-28">
        <div className="absolute inset-0 bg-gradient-to-b from-green-50/50 via-white to-white" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-green-100/30 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
        
        <div className="container relative mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="flex flex-col md:flex-row items-center justify-between gap-8"
          >
            <motion.div variants={fadeIn} className="text-center md:text-left space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-100/50 text-green-700 text-xs font-semibold uppercase tracking-wider mb-4 border border-green-200">
                <Sparkles className="w-3 h-3" /> User Dashboard
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 tracking-tight">
                Hello, {user?.name?.split(' ')[0] || 'User'}!
              </h1>
              <p className="text-lg text-gray-500 max-w-lg font-light">
                Here's an overview of your event planning journey with us.
              </p>
            </motion.div>
            
            <motion.div variants={fadeIn} className="flex gap-4">
               <Link href="/all-events">
                    <Button className="rounded-full bg-green-600 hover:bg-green-700 text-white shadow-lg shadow-green-200 px-8 h-12 text-base">
                        Explore Events
                    </Button>
               </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 -mt-8 relative z-10">
        <motion.div 
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12"
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
        >
            {stats.map((stat, index) => (
                <motion.div key={index} variants={fadeIn}>
                    <Card className="border-none shadow-lg shadow-gray-100/50 bg-white rounded-3xl overflow-hidden hover:shadow-xl transition-shadow duration-300">
                        <CardContent className="p-6 flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-500 mb-1">{stat.label}</p>
                                {/* ✅ Fixed: Changed h3 to p for stats value (not a heading) */}
                                <p className="text-3xl font-bold text-gray-900" aria-label={`${stat.value} ${stat.label}`}>
                                  {dashboardLoading ? (
                                    <div className="h-8 w-16 bg-gray-100 animate-pulse rounded" />
                                  ) : (
                                    stat.value
                                  )}
                                </p>
                            </div>
                            <div className={`h-12 w-12 rounded-2xl ${stat.bg} ${stat.color} flex items-center justify-center`}>
                                <stat.icon className="h-6 w-6" />
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>
            ))}
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Profile Overview */}
            <div className="lg:col-span-1">
                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }} className="h-full">
                    <Card className="border-none shadow-lg shadow-gray-100 bg-white rounded-3xl overflow-hidden h-full">
                        <CardHeader className="bg-gray-50/50 border-b border-gray-100 p-6">
                             <CardTitle className="text-xl font-bold text-gray-900">My Profile</CardTitle>
                        </CardHeader>
                        <CardContent className="p-6 space-y-6">
                            <div className="flex flex-col items-center justify-center text-center">
                                <div className="h-24 w-24 bg-green-100 rounded-full flex items-center justify-center mb-4 border-4 border-white shadow-md text-3xl font-bold text-green-600">
                                    {user?.name?.charAt(0) || "U"}
                                </div>
                                <h3 className="text-lg font-bold text-gray-900">{user?.name || "Guest User"}</h3>
                                <p className="text-gray-500">{user?.email || "No email provided"}</p>
                            </div>
                            
                            <div className="space-y-3 pt-4 border-t border-gray-100">
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-500">Member Since</span>
                                    <span className="font-medium text-gray-900">
                                      {dashboardStats?.memberSince ? formatDate(dashboardStats.memberSince) : "N/A"}
                                    </span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-500">Account Type</span>
                                    <span className="font-medium text-gray-900">{user?.role || "Personal"}</span>
                                </div>
                            </div>
                            
                            <Link href="/profile" className="block">
                                <Button variant="outline" className="w-full rounded-xl border-gray-200 hover:bg-green-50 hover:text-green-600 hover:border-green-200">
                                    Manage Profile
                                </Button>
                            </Link>
                        </CardContent>
                    </Card>
                </motion.div>
            </div>
            
            {/* Recent Activity */}
            <div className="lg:col-span-2">
                 <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 }} className="h-full">
                    <Card className="border-none shadow-lg shadow-gray-100 bg-white rounded-3xl overflow-hidden h-full flex flex-col">
                        <CardHeader className="bg-white border-b border-gray-100 p-6 flex flex-row items-center justify-between sticky top-0">
                             <div>
                                <CardTitle className="text-xl font-bold text-gray-900">Recent Activity</CardTitle>
                                <CardDescription>Track the status of your event requests</CardDescription>
                             </div>
                             <Link href="/events">
                                <Button variant="ghost" size="sm" className="text-green-600 hover:text-green-700 hover:bg-green-50 rounded-full">
                                    View All <ArrowRight className="ml-1 w-4 h-4" />
                                </Button>
                             </Link>
                        </CardHeader>
                        <CardContent className="p-0 flex-1 bg-gray-50/30">
                            {dashboardLoading ? (
                                <div className="p-8 space-y-4">
                                    {[1, 2, 3].map((i) => (
                                        <div key={i} className="h-20 bg-gray-200 animate-pulse rounded-2xl" />
                                    ))}
                                </div>
                            ) : dashboardStats?.recentActivity && dashboardStats.recentActivity.length > 0 ? (
                                <div className="divide-y divide-gray-100">
                                    {dashboardStats.recentActivity.map((activity) => (
                                        <div key={activity._id} className="p-6 hover:bg-white transition-colors duration-200 flex items-start gap-4">
                                            <div className={`mt-1 h-10 w-10 rounded-full flex items-center justify-center shrink-0 ${activity.type === 'Booking' ? 'bg-blue-100 text-blue-600' : 'bg-purple-100 text-purple-600'}`}>
                                                {activity.type === 'Booking' ? <Calendar className="h-5 w-5" /> : <Sparkles className="h-5 w-5" />}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex justify-between items-start">
                                                     <div>
                                                        <h4 className="text-base font-semibold text-gray-900 truncate pr-4">{activity.title}</h4>
                                                        <p className="text-sm text-gray-500 flex items-center gap-2 mt-1">
                                                            <Clock className="w-3 h-3" /> {formatDate(activity.date)}
                                                            {activity.details && (
                                                                <>
                                                                    <span className="w-1 h-1 rounded-full bg-gray-300" />
                                                                    <MapPin className="w-3 h-3" /> {activity.details}
                                                                </>
                                                            )}
                                                        </p>
                                                     </div>
                                                     <div className={`px-3 py-1 rounded-full text-xs font-medium uppercase tracking-wide ${
                                                         activity.status.toLowerCase() === 'completed' ? 'bg-green-100 text-green-700' :
                                                         activity.status.toLowerCase() === 'confirmed' ? 'bg-blue-100 text-blue-700' :
                                                         'bg-yellow-100 text-yellow-700'
                                                     }`}>
                                                         {activity.status}
                                                     </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="flex flex-col items-center justify-center min-h-[300px]">
                                    <div className="h-16 w-16 bg-white rounded-full shadow-sm flex items-center justify-center mx-auto mb-4">
                                        <Calendar className="h-8 w-8 text-gray-300" />
                                    </div>
                                    {/* ✅ Fixed: Changed h4 to h2 for proper heading hierarchy */}
                                    {/* ✅ Fixed: Changed to h3 since it's under CardTitle (which acts as h2) */}
                                    <h3 className="text-lg font-bold text-gray-900 mb-2">No Recent Activity</h3>
                                    <p className="text-gray-500 mb-6 text-sm">You haven't made any event inquiries yet.</p>
                                    <Link href="/all-events">
                                        <Button className="rounded-full bg-white border border-gray-200 text-gray-900 hover:bg-gray-50 shadow-sm">
                                            Browse Services
                                        </Button>
                                    </Link>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </motion.div>
            </div>
        </div>
      </div>
    </div>
  );
}