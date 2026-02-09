"use client";

import React, { useState, useEffect } from "react";
import { CheckCircle2, AlertCircle, MapPin, Star, ShieldCheck, Clock, Sparkles, Calendar, User, Mail, Phone } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";
import { submitEventInquiry, clearEventSuccessMessage, clearEventError } from "../../../store/eventSlice.jsx";
import { createBooking, clearBookingState } from "../../../store/bookingSlice";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

export default function ProductDetails({ product }) {
  const dispatch = useDispatch();
  const router = useRouter();
  const { toast } = useToast();

  const {
    submittingInquiry: isSubmitting,
    successMessage,
    error,
  } = useSelector((state) => state.events);

  const { loading: isBookingLoading } = useSelector((state) => state.booking || {});

  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    email: "",
    partyDate: "",
    partyTime: "",
    location: product.location ? product.location.split(",")[0].trim() : "Ahmedabad",
  });

  useEffect(() => {
    return () => {
      dispatch(clearEventSuccessMessage());
      dispatch(clearEventError());
      dispatch(clearBookingState());
    };
  }, [dispatch]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(
      submitEventInquiry({
        ...formData,
        eventId: product._id,
        eventName: product.title,
      })
    );
  };

  const handleBooking = async () => {
    if (!formData.fullName || !formData.phone || !formData.email || !formData.partyDate || !formData.partyTime) {
      toast({
        title: "Required Fields",
        description: "Please fill in all fields before booking.",
        variant: "destructive",
      });
      return;
    }

    try {
      const bookingData = {
        eventId: product._id,
        bookingDate: formData.partyDate,
        bookingTime: formData.partyTime,
        eventLocation: formData.location,
        paymentMode: "Online"
      };

      const result = await dispatch(createBooking(bookingData)).unwrap();

      if (result && result.booking) {
        const orderSummary = {
          subtotal: product.price,
          shipping: 0,
          discount: 0,
          total: product.price
        };

        if (typeof window !== "undefined") {
          localStorage.setItem("OrderId", result.booking._id);
          localStorage.setItem("orderSummary", JSON.stringify(orderSummary));
          localStorage.setItem("userMobile", formData.phone);
          // Store event specific info for the payment page
          localStorage.setItem("bookingDetails", JSON.stringify({
            eventName: product.title,
            date: formData.partyDate,
            time: formData.partyTime,
            location: formData.location
          }));
        }

        toast({
          title: "Booking Initiated",
          description: "Redirecting to payment...",
        });

        router.push("/payment");
      }
    } catch (err) {
      toast({
        title: "Booking Failed",
        description: err?.message || err || "Could not create booking. Ensure you are logged in.",
        variant: "destructive",
      });
    }
  };

  const trustBadges = [
    { icon: <ShieldCheck className="w-5 h-5" />, label: "Verified Quality", color: "text-green-600 bg-green-50" },
    { icon: <Clock className="w-5 h-5" />, label: "On-time Setup", color: "text-blue-600 bg-blue-50" },
    { icon: <Sparkles className="w-5 h-5" />, label: "Premium Decor", color: "text-purple-600 bg-purple-50" },
  ];

  return (
    <div className="space-y-8">

      {/* Product Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-4"
      >
        {/* Occasion Badge & Rating */}
        <div className="flex flex-wrap items-center gap-3">
          <span className="inline-flex items-center gap-2 bg-green-500 text-white text-xs font-semibold px-4 py-1.5 rounded-full">
            {product.occasion || "Exclusive"}
          </span>
          {product.rating && product.totalReviews > 0 && (
            <div className="flex items-center gap-1.5 bg-white border border-gray-200 px-3 py-1.5 rounded-full">
              <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
              <span className="text-sm font-semibold text-gray-900">{product.rating}</span>
              <span className="text-xs text-gray-500">({product.totalReviews})</span>
            </div>
          )}
        </div>

        {/* Title */}
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight">
          {product.title}
        </h1>

        {/* Description */}
        <p className="text-gray-600 leading-relaxed">
          {product.description}
        </p>

        {/* Price */}
        <div className="flex items-baseline gap-3">
          <span className="text-4xl font-bold text-gray-900">₹{product.price?.toLocaleString()}</span>
          {product.originalPrice && product.originalPrice > product.price && (
            <>
              <span className="text-xl text-gray-400 line-through">₹{product.originalPrice?.toLocaleString()}</span>
              <span className="bg-red-100 text-red-600 text-sm font-semibold px-2 py-1 rounded">
                {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
              </span>
            </>
          )}
        </div>
      </motion.div>

      {/* Trust Badges */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-3 gap-3"
      >
        {trustBadges.map((badge, idx) => (
          <div
            key={idx}
            className={`flex flex-col items-center text-center gap-2 p-4 rounded-xl ${badge.color} transition-transform hover:scale-105`}
          >
            <div className={badge.color.split(' ')[0]}>{badge.icon}</div>
            <span className="text-xs font-medium text-gray-700">{badge.label}</span>
          </div>
        ))}
      </motion.div>

      {/* Booking Form */}
      <motion.div
        id="inquiry-form"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white border border-gray-200 rounded-2xl p-6 md:p-8 shadow-sm"
      >
        <h2 className="text-xl font-bold text-gray-900 mb-6">Book This Event</h2>

        {/* Success/Error Messages */}
        {successMessage && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 bg-green-50 border border-green-200 text-green-800 p-4 rounded-xl flex items-start gap-3"
          >
            <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
            <span className="text-sm">{successMessage}</span>
          </motion.div>
        )}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 bg-red-50 border border-red-200 text-red-800 p-4 rounded-xl flex items-start gap-3"
          >
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <span className="text-sm">{error}</span>
          </motion.div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Name & Phone */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <User className="w-4 h-4 text-gray-400" />
                Full Name
              </label>
              <input
                name="fullName"
                required
                value={formData.fullName}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                placeholder="Enter your name"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <Phone className="w-4 h-4 text-gray-400" />
                Phone Number
              </label>
              <input
                name="phone"
                required
                value={formData.phone}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                placeholder="Enter phone number"
              />
            </div>
          </div>

          {/* Email */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
              <Mail className="w-4 h-4 text-gray-400" />
              Email Address
            </label>
            <input
              name="email"
              type="email"
              required
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
              placeholder="Enter email address"
            />
          </div>

          {/* Date & Location */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-gray-400" />
                Event Date
              </label>
              <input
                type="date"
                name="partyDate"
                required
                value={formData.partyDate}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-gray-400" />
                City
              </label>
              <select
                name="location"
                value={formData.location}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
              >
                <option>Ahmedabad</option>
                <option>Jamnagar</option>
              </select>
            </div>
          </div>

          {/* Time Slot */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
              <Clock className="w-4 h-4 text-gray-400" />
              Preferred Time
            </label>
            <select
              name="partyTime"
              required
              value={formData.partyTime}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
            >
              <option value="">Select Time Slot</option>
              <option value="morning">Morning (9 AM - 12 PM)</option>
              <option value="afternoon">Afternoon (1 PM - 4 PM)</option>
              <option value="evening">Evening (5 PM - 8 PM)</option>
              <option value="night">Night (9 PM Onwards)</option>
            </select>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <motion.button
              type="submit"
              disabled={isSubmitting}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex-1 bg-green-500 text-white py-4 rounded-xl font-semibold hover:bg-green-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
            >
              {isSubmitting ? "Submitting..." : "Submit Inquiry"}
            </motion.button>

            <motion.button
              type="button"
              onClick={handleBooking}
              disabled={isBookingLoading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex-1 bg-green-600 text-white py-4 rounded-xl font-semibold hover:bg-green-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
            >
              {isBookingLoading ? "Processing..." : "Book Now & Pay"}
            </motion.button>
          </div>
        </form>
      </motion.div>

    </div>
  );
}
