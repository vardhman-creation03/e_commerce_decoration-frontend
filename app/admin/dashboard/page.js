'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import AdminSidebar from '@/components/adminSidebar';
import AdminHeader from '@/components/adminHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Users,
  Calendar,
  MessageSquare,
  ShoppingBag,
  TrendingUp,
  Clock,
  CheckCircle
} from 'lucide-react';
import eventService from '@/lib/services/eventService';
import userService from '@/lib/services/userService';
import { contactService } from '@/lib/services/contactService';
import { bookingService } from '@/lib/services/bookingService';

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const StatCard = ({ title, value, icon: Icon, color, loading }) => (
  <Card className="border-l-4 shadow-sm" style={{ borderLeftColor: color }}>
    <CardContent className="p-6 flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-gray-500 uppercase">{title}</p>
        <h3 className="text-2xl font-bold text-gray-900 mt-1">
          {loading ? '...' : value}
        </h3>
      </div>
      <div className={`p-3 rounded-full opacity-10`} style={{ backgroundColor: color }}>
        <Icon className="h-6 w-6 text-black" />
      </div>
    </CardContent>
  </Card>
);

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    users: 0,
    events: 0,
    inquiries: 0,
    bookings: 0
  });
  const [recentBookings, setRecentBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Parallel fetching
        const [eventsData, usersData, inquiriesData, bookingsData] = await Promise.all([
          eventService.getAllEvents(),
          userService.getAllCustomers({ limit: 1 }), // efficient count if possible, but list works
          contactService.getAllContacts(),
          bookingService.getAllBookings()
        ]);

        const eventCount = Array.isArray(eventsData) ? eventsData.length : (eventsData.total || eventsData.data?.length || 0);
        const userCount = usersData.meta ? usersData.meta.total : (Array.isArray(usersData) ? usersData.length : (usersData.data?.length || 0));
        const inquiryCount = Array.isArray(inquiriesData) ? inquiriesData.length : (inquiriesData.userComplains?.length || 0);

        const bookings = bookingsData.bookings || [];
        const bookingCount = bookings.length;

        setStats({
          events: eventCount,
          users: userCount,
          inquiries: inquiryCount,
          bookings: bookingCount
        });

        setRecentBookings(bookings.slice(0, 5)); // Top 5 recent

      } catch (error) {
        console.error("Dashboard fetch error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <AdminSidebar />
      <div className="flex-1 flex flex-col lg:ml-0">
        <AdminHeader />
        <main className="flex-1 p-6 overflow-y-auto">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeIn}
            className="max-w-7xl mx-auto space-y-8"
          >
            <div>
              <h1 className="text-3xl font-light text-gray-900 mb-2">Dashboard</h1>
              <p className="text-gray-600 font-light">Overview of your business performance.</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard
                title="Total Users"
                value={stats.users}
                icon={Users}
                color="#3b82f6"
                loading={loading}
              />
              <StatCard
                title="Active Events"
                value={stats.events}
                icon={Calendar}
                color="#10b981"
                loading={loading}
              />
              <StatCard
                title="Total Bookings"
                value={stats.bookings}
                icon={ShoppingBag}
                color="#8b5cf6"
                loading={loading}
              />
              <StatCard
                title="Inquiries"
                value={stats.inquiries}
                icon={MessageSquare}
                color="#f59e0b"
                loading={loading}
              />
            </div>

            {/* Recent Bookings Section */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                <h2 className="text-lg font-semibold text-gray-900">Recent Bookings</h2>
                <button className="text-blue-600 text-sm hover:underline">View All</button>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Booking ID</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Event</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {loading ? (
                      <tr><td colSpan="6" className="px-6 py-4 text-center">Loading...</td></tr>
                    ) : recentBookings.length === 0 ? (
                      <tr><td colSpan="6" className="px-6 py-4 text-center">No recent bookings.</td></tr>
                    ) : (
                      recentBookings.map((booking) => (
                        <tr key={booking._id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {booking.bookingId}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {booking.user?.fullName || 'N/A'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {booking.event?.title || 'N/A'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {new Date(booking.bookingDate).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            ₹{booking.totalAmount}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${booking.bookingStatus === 'Confirmed' ? 'bg-green-100 text-green-800' :
                                booking.bookingStatus === 'Cancelled' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'
                              }`}>
                              {booking.bookingStatus}
                            </span>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

          </motion.div>
        </main>
      </div>
    </div>
  );
}
