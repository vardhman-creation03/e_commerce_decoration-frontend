"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Link from "next/link";
import { motion } from "framer-motion";
import { ChevronRight, Home, Loader2 } from "lucide-react";

import {
  getEventDetail,
  clearSelectedEvent,
} from "../../../store/eventSlice";

import ProductGallery from "./ProductGallery";
import ProductDetails from "./ProductDetails";
import ProductIncludes from "./ProductIncludes";
import ProductCustomization from "./ProductCustomization";
import ProductFAQ from "./ProductFAQ";

export default function ProductPageClient({ id }) {
  const dispatch = useDispatch();

  const {
    selectedEvent: product,
    fetchingDetail: isLoading,
    error,
  } = useSelector((state) => state.events);

  useEffect(() => {
    if (id) {
      dispatch(getEventDetail(id));
    }

    return () => {
      dispatch(clearSelectedEvent());
    };
  }, [dispatch, id]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white to-green-50/30 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center space-y-4"
        >
          <Loader2 className="h-12 w-12 text-green-500 animate-spin mx-auto" />
          <p className="text-sm text-gray-500 animate-pulse">Loading event details...</p>
        </motion.div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white to-green-50/30 flex flex-col items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-6 max-w-md"
        >
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto">
            <span className="text-4xl">😕</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-900">Event Not Found</h2>
          <p className="text-gray-600">{error || "The event you're looking for doesn't exist."}</p>
          <Link
            href="/events/all-events"
            className="inline-flex items-center gap-2 bg-green-500 text-white px-8 py-3 rounded-full font-semibold hover:bg-green-600 transition-all shadow-lg hover:shadow-xl"
          >
            Explore Events
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-b from-white via-green-50/20 to-white min-h-screen">
      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Breadcrumbs */}
        <motion.nav
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2 mb-8 text-sm text-gray-500"
        >
          <Link href="/" className="hover:text-green-600 transition-colors flex items-center gap-1">
            <Home className="w-4 h-4" />
            <span>Home</span>
          </Link>
          <ChevronRight className="w-4 h-4" />
          <Link href="/events/all-events" className="hover:text-green-600 transition-colors">
            Events
          </Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-gray-900 font-medium line-clamp-1">{product.title}</span>
        </motion.nav>

        {/* Product Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 mb-16">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <ProductGallery images={product.images || []} />
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <ProductDetails product={product} />
          </motion.div>
        </div>
      </main>

      {/* Package Includes Section */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="bg-white border-y border-gray-100 py-12"
      >
        <ProductIncludes includes={product.includes || []} />
      </motion.section>

      {/* Customization Options Section */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="py-12 bg-gradient-to-b from-white to-green-50/20"
      >
        <ProductCustomization />
      </motion.section>

      {/* FAQ Section */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="py-12"
      >
        <ProductFAQ />
      </motion.section>

      {/* Sticky Bottom Bar (Mobile) */}
      <motion.div
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        className="lg:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-lg border-t border-gray-200 p-4 z-50 flex items-center justify-between shadow-lg"
      >
        <div className="flex flex-col">
          <span className="text-xs text-gray-500 font-medium">Starting at</span>
          <span className="text-2xl font-bold text-gray-900">₹{product.price?.toLocaleString()}</span>
        </div>

        <button
          onClick={() => {
            const el = document.getElementById("inquiry-form");
            if (el) el.scrollIntoView({ behavior: "smooth" });
          }}
          className="bg-green-500 text-white px-6 py-3 rounded-full text-sm font-semibold hover:bg-green-600 transition-all shadow-md hover:shadow-lg"
        >
          Book Now
        </button>
      </motion.div>
    </div>
  );
}
