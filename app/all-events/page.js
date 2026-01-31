"use client";

import { useState, useMemo, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Star,
  Search,
  SlidersHorizontal,
  ArrowRight,
  X,
  ChevronLeft,
  ChevronRight,
  Sparkles,
} from "lucide-react";

import { useDispatch, useSelector } from "react-redux";
import { getAllEvents } from "../store/eventSlice";

// Categories
const categories = [
  { label: "All", value: "all" },
  { label: "Birthday", value: "birthday" },
  { label: "Baby Shower", value: "baby shower" },
  { label: "Anniversary", value: "anniversary" },
  { label: "Welcome Baby", value: "welcome baby" },
  { label: "Ring Ceremony", value: "ring ceremony" },
  { label: "Car Decoration", value: "car decoration" },
  { label: "Kankotri Lekhan", value: "kankotri lekhan" },
  { label: "First Night", value: "first night" },
];

// Items per page
const ITEMS_PER_PAGE = 12;

function AllEventsPageContent() {
  const dispatch = useDispatch();
  const searchParams = useSearchParams();
  const categoryQuery = searchParams.get("category");

  const { events, loading, error } = useSelector((state) => state.events);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  /* Sync URL category */
  useEffect(() => {
    if (categoryQuery) {
      setSelectedCategory(categoryQuery.toLowerCase());
    } else {
      setSelectedCategory("all");
    }
  }, [categoryQuery]);

  /* Fetch Events */
  useEffect(() => {
    dispatch(getAllEvents());
  }, [dispatch]);

  /* Filter Logic */
  const filteredEvents = useMemo(() => {
    if (!events || events.length === 0) return [];

    return events.filter((event) => {
      const titleMatch = event.title
        ?.toLowerCase()
        .includes(searchQuery.toLowerCase());

      const categoryMatch =
        selectedCategory === "all" ||
        event.occasion?.toLowerCase().includes(selectedCategory);

      return titleMatch && categoryMatch;
    });
  }, [events, searchQuery, selectedCategory]);

  /* Pagination Logic */
  const totalPages = Math.ceil(filteredEvents.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentEvents = filteredEvents.slice(startIndex, endIndex);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedCategory]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-white via-green-50/10 to-white">
      {/* HERO SECTION */}
      <section className="pt-12 pb-16 border-b border-gray-100">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-4xl mx-auto"
          >
            <div className="inline-flex items-center gap-2 bg-green-50 text-green-600 px-4 py-2 rounded-full text-sm font-semibold mb-4">
              <Sparkles className="w-4 h-4" />
              <span>Explore Our Collections</span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-4">
              Event Decoration Designs
            </h1>
            <p className="text-lg text-gray-600 mb-8">
              Discover stunning decoration themes for every special occasion
            </p>

            {/* Search Bar */}
            <div className="relative max-w-2xl mx-auto">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search for themes, occasions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full border-2 border-gray-200 rounded-2xl py-4 pl-14 pr-6 text-base focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all shadow-sm"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* FILTERS & RESULTS */}
      <section className="py-10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* Filter Bar */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
            {/* Categories */}
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide w-full md:w-auto">
              {categories.map((cat) => (
                <button
                  key={cat.value}
                  onClick={() => setSelectedCategory(cat.value)}
                  className={`px-5 py-2.5 rounded-full text-sm font-semibold whitespace-nowrap transition-all ${selectedCategory === cat.value
                      ? "bg-green-500 text-white shadow-md"
                      : "bg-white border-2 border-gray-200 text-gray-700 hover:border-green-300"
                    }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            {/* Results Count */}
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600 font-medium">
                {filteredEvents.length} {filteredEvents.length === 1 ? "Event" : "Events"}
              </span>
            </div>
          </div>

          {/* EVENTS GRID */}
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="bg-gray-100 rounded-2xl aspect-[3/4]" />
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="text-center py-20">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
                <X className="w-8 h-8 text-red-500" />
              </div>
              <p className="text-red-500 font-medium">{error}</p>
            </div>
          ) : currentEvents.length === 0 ? (
            <div className="text-center py-20">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
                <Search className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">No events found</h3>
              <p className="text-gray-600">Try adjusting your search or filters</p>
            </div>
          ) : (
            <>
              {/* Grid View */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {currentEvents.map((item, idx) => (
                  <motion.div
                    key={item._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                  >
                    <Link
                      href={`/events/view-detail?id=${item._id}`}
                      className="group block bg-white rounded-2xl overflow-hidden border-2 border-gray-100 hover:border-green-300 hover:shadow-xl transition-all"
                    >
                      {/* Image */}
                      <div className="relative aspect-[3/4] overflow-hidden bg-gray-100">
                        <Image
                          src={item.images?.[0] || "/placeholder.svg"}
                          alt={item.title}
                          fill
                          className="object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                        {/* Occasion Badge */}
                        <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-semibold text-gray-700">
                          {item.occasion}
                        </div>
                        {/* Discount Badge */}
                        {item.originalPrice && item.originalPrice > item.price && (
                          <div className="absolute top-3 right-3 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                            {Math.round(((item.originalPrice - item.price) / item.originalPrice) * 100)}% OFF
                          </div>
                        )}
                      </div>

                      {/* Content */}
                      <div className="p-5">
                        {/* Rating */}
                        <div className="flex items-center gap-1 mb-2">
                          <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                          <span className="text-sm font-semibold text-gray-900">
                            {item.rating || 4.5}
                          </span>
                          <span className="text-sm text-gray-400">
                            ({item.totalReviews || 0})
                          </span>
                        </div>

                        {/* Title */}
                        <h3 className="text-lg font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-green-600 transition-colors">
                          {item.title}
                        </h3>

                        {/* Price & CTA */}
                        <div className="flex justify-between items-center pt-3 border-t border-gray-100">
                          <div>
                            <p className="text-2xl font-bold text-gray-900">
                              ₹{item.price?.toLocaleString()}
                            </p>
                            {item.originalPrice && (
                              <p className="text-sm text-gray-400 line-through">
                                ₹{item.originalPrice?.toLocaleString()}
                              </p>
                            )}
                          </div>
                          <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center text-white group-hover:bg-green-600 transition-colors">
                            <ArrowRight className="w-5 h-5" />
                          </div>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>

              {/* PAGINATION */}
              {totalPages > 1 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-12 flex flex-col items-center gap-6"
                >
                  <div className="flex justify-center items-center gap-2">
                    {/* Previous Button */}
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="p-2 rounded-xl border-2 border-gray-200 hover:border-green-500 hover:bg-green-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>

                    {/* Page Numbers */}
                    <div className="flex gap-2">
                      {[...Array(totalPages)].map((_, idx) => {
                        const pageNum = idx + 1;
                        // Show first, last, current, and adjacent pages
                        if (
                          pageNum === 1 ||
                          pageNum === totalPages ||
                          (pageNum >= currentPage - 1 && pageNum <= currentPage + 1)
                        ) {
                          return (
                            <button
                              key={pageNum}
                              onClick={() => handlePageChange(pageNum)}
                              className={`w-10 h-10 rounded-xl font-semibold transition-all ${currentPage === pageNum
                                  ? "bg-green-500 text-white shadow-md"
                                  : "border-2 border-gray-200 hover:border-green-500 hover:bg-green-50"
                                }`}
                            >
                              {pageNum}
                            </button>
                          );
                        } else if (
                          pageNum === currentPage - 2 ||
                          pageNum === currentPage + 2
                        ) {
                          return (
                            <span key={pageNum} className="w-10 h-10 flex items-center justify-center text-gray-400">
                              ...
                            </span>
                          );
                        }
                        return null;
                      })}
                    </div>

                    {/* Next Button */}
                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className="p-2 rounded-xl border-2 border-gray-200 hover:border-green-500 hover:bg-green-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Page Info */}
                  <div className="text-sm text-gray-600">
                    Showing <span className="font-semibold text-gray-900">{startIndex + 1}-{Math.min(endIndex, filteredEvents.length)}</span> of{" "}
                    <span className="font-semibold text-gray-900">{filteredEvents.length}</span> events
                  </div>
                </motion.div>
              )}
            </>
          )}
        </div>
      </section>

      {/* MOBILE FILTER */}
      <AnimatePresence>
        {isFilterOpen && (
          <>
            <motion.div
              className="fixed inset-0 bg-black/40 z-50"
              onClick={() => setIsFilterOpen(false)}
            />
            <motion.div
              className="fixed right-0 top-0 w-full max-w-sm h-full bg-white z-60 p-8"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
            >
              <div className="flex justify-between mb-8">
                <h2 className="text-xl">Filters</h2>
                <X onClick={() => setIsFilterOpen(false)} />
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </main>
  );
}

export default function AllEventsPage() {
  return (
    <Suspense
      fallback={
        <div className="h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Loading events...</p>
          </div>
        </div>
      }
    >
      <AllEventsPageContent />
    </Suspense>
  );
}
