'use client';

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Calendar,
  Clock,
  MapPin,
  ArrowRight,
  User,
} from "lucide-react";
import { useToast } from "../../hooks/use-toast";
import { useDispatch, useSelector } from "react-redux";
import { getBookingsByContact } from "../store/userSlice";

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

export default function ProfilePage() {
  const dispatch = useDispatch();
  const router = useRouter();
  const { toast } = useToast();
  const { bookings, loading } = useSelector((state) => state.user);

  // Get user info from localStorage
  const userName = typeof window !== 'undefined' ? localStorage.getItem('userName') || 'Guest' : 'Guest';
  const userEmail = typeof window !== 'undefined' ? localStorage.getItem('userEmail') || 'No email provided' : 'No email provided';
  const userMobile = typeof window !== 'undefined' ? localStorage.getItem('userMobile') || '' : '';

  useEffect(() => {
    // Fetch bookings by contact info
    if (userMobile || userEmail) {
      dispatch(getBookingsByContact({ mobile: userMobile, email: userEmail }));
    }
  }, [dispatch, userMobile, userEmail]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50/30 font-sans pt-20">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-white pb-12 pt-8">
        <div className="absolute inset-0 bg-gradient-to-b from-green-50/50 via-white to-white" />
        <div className="container relative mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeIn}
            className="text-center space-y-4"
          >
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 tracking-tight">
              My Bookings
            </h1>
            <p className="text-lg text-gray-500 max-w-lg mx-auto font-light">
              View and manage your event bookings
            </p>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 -mt-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Overview */}
          <div className="lg:col-span-1">
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
              <Card className="border-none shadow-lg shadow-gray-100 bg-white rounded-3xl overflow-hidden h-full">
                <CardHeader className="bg-gray-50/50 border-b border-gray-100 p-6">
                  <CardTitle className="text-xl font-bold text-gray-900">Contact Info</CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-6">
                  <div className="flex flex-col items-center justify-center text-center">
                    <div className="h-24 w-24 bg-green-100 rounded-full flex items-center justify-center mb-4 border-4 border-white shadow-md text-3xl font-bold text-green-600">
                      {userName.charAt(0).toUpperCase() || "G"}
                    </div>
                    <h3 className="text-lg font-bold text-gray-900">{userName}</h3>
                    <p className="text-gray-500">{userEmail}</p>
                    {userMobile && <p className="text-gray-500 text-sm">{userMobile}</p>}
                  </div>
                  
                  <div className="space-y-3 pt-4 border-t border-gray-100">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Account Type</span>
                      <span className="font-medium text-gray-900">Guest</span>
                    </div>
                  </div>
                  
                  <Link href="/all-events" className="block">
                    <Button variant="outline" className="w-full rounded-xl border-gray-200 hover:bg-green-50 hover:text-green-600 hover:border-green-200">
                      Browse Events
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </motion.div>
          </div>
          
          {/* Bookings List */}
          <div className="lg:col-span-2">
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
              <Card className="border-none shadow-lg shadow-gray-100 bg-white rounded-3xl overflow-hidden h-full flex flex-col">
                <CardHeader className="bg-white border-b border-gray-100 p-6 flex flex-row items-center justify-between">
                  <div>
                    <CardTitle className="text-xl font-bold text-gray-900">My Bookings</CardTitle>
                    <CardDescription>All your event bookings</CardDescription>
                  </div>
                  <Link href="/all-events">
                    <Button variant="ghost" size="sm" className="text-green-600 hover:text-green-700 hover:bg-green-50 rounded-full">
                      Book More <ArrowRight className="ml-1 w-4 h-4" />
                    </Button>
                  </Link>
                </CardHeader>
                <CardContent className="p-0 flex-1 bg-gray-50/30">
                  {loading ? (
                    <div className="p-8 space-y-4">
                      {[1, 2, 3].map((i) => (
                        <div key={i} className="h-20 bg-gray-200 animate-pulse rounded-2xl" />
                      ))}
                    </div>
                  ) : bookings && bookings.length > 0 ? (
                    <div className="divide-y divide-gray-100">
                      {bookings.map((booking) => (
                        <div key={booking._id} className="p-6 hover:bg-white transition-colors duration-200 flex items-start gap-4">
                          <div className="mt-1 h-10 w-10 rounded-full flex items-center justify-center shrink-0 bg-blue-100 text-blue-600">
                            <Calendar className="h-5 w-5" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-start">
                              <div>
                                <h4 className="text-base font-semibold text-gray-900 truncate pr-4">
                                  {booking.eventSnapshot?.title || booking.event?.title || 'Event Booking'}
                                </h4>
                                <p className="text-sm text-gray-500 flex items-center gap-2 mt-1">
                                  <Clock className="w-3 h-3" /> {formatDate(booking.bookingDate || booking.createdAt)}
                                  {booking.eventLocation && (
                                    <>
                                      <span className="w-1 h-1 rounded-full bg-gray-300" />
                                      <MapPin className="w-3 h-3" /> {booking.eventLocation}
                                    </>
                                  )}
                                </p>
                                {booking.bookingId && (
                                  <p className="text-xs text-gray-400 mt-1">Booking ID: {booking.bookingId}</p>
                                )}
                              </div>
                              <div className={`px-3 py-1 rounded-full text-xs font-medium uppercase tracking-wide ${
                                booking.bookingStatus?.toLowerCase() === 'completed' ? 'bg-green-100 text-green-700' :
                                booking.bookingStatus?.toLowerCase() === 'confirmed' ? 'bg-blue-100 text-blue-700' :
                                'bg-yellow-100 text-yellow-700'
                              }`}>
                                {booking.bookingStatus || 'Pending'}
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
                      <h3 className="text-lg font-bold text-gray-900 mb-2">No Bookings Yet</h3>
                      <p className="text-gray-500 mb-6 text-sm">You haven't made any event bookings yet.</p>
                      <Link href="/all-events">
                        <Button className="rounded-full bg-white border border-gray-200 text-gray-900 hover:bg-gray-50 shadow-sm">
                          Browse Events
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
