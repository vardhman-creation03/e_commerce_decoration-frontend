'use client';

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  ArrowRight, Star, Calendar, Users,
  MapPin, Trophy, Sparkles, Heart, Quote,
  CheckCircle2, TrendingUp, Leaf
} from "lucide-react";
import { eventService } from "../lib/services/eventService";
import { blogService } from "../lib/services/blogService";

// --- Animation Variants ---
const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 },
  },
};

export default function Home() {
  const [events, setEvents] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [occasions, setOccasions] = useState([]);
  const [occasionEvents, setOccasionEvents] = useState({}); // Store events per occasion
  const [loading, setLoading] = useState(true);
  const [loadingOccasionEvents, setLoadingOccasionEvents] = useState(true);

  const serviceTags = [
    "Birthday Decoration", "Anniversary Decoration", "Baby Shower Decoration",
    "Car Decoration", "First Night Decoration", "Welcome Baby Decoration",
    "Bon Voyage Decoration", "Wedding Decoration (Haldi, Mehndi, Kankotri)",
    "Naming Ceremony", "Mundan Decoration", "Annaprashan Decoration",
    "Artificial Flower Decoration", "Real Flower Decoration"
  ];

  // Fetch Data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [eventsData, blogsData, occasionsData] = await Promise.allSettled([
          eventService.getAllEvents(),
          blogService.getAllBlogPosts({ page: 1, limit: 3 }),
          eventService.getAllOccasions()
        ]);

        if (eventsData.status === 'fulfilled') {
          const list = Array.isArray(eventsData.value) ? eventsData.value : (eventsData.value?.events || eventsData.value?.data || []);
          setEvents(list.slice(0, 4));
        }
        if (blogsData.status === 'fulfilled') {
          const list = Array.isArray(blogsData.value) ? blogsData.value : (blogsData.value?.blogs || blogsData.value?.data || []);
          setBlogs(list.slice(0, 3));
        }
        if (occasionsData.status === 'fulfilled') {
          const list = Array.isArray(occasionsData.value) ? occasionsData.value : (occasionsData.value?.occasions || occasionsData.value?.data || []);
          setOccasions(list.slice(0, 8));

          // Fetch events for each occasion
          fetchOccasionEvents(list.slice(0, 8));
        }
      } catch (error) {
        console.error("Error fetching home data", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Fetch events for each occasion
  const fetchOccasionEvents = async (occasionsList) => {
    setLoadingOccasionEvents(true);
    try {
      const eventsPromises = occasionsList.map(async (occasion) => {
        try {
          const response = await eventService.getEventsByOccasion(occasion.occasion);
          const eventsList = Array.isArray(response) ? response : (response?.events || response?.data || []);
          return {
            occasion: occasion.occasion,
            events: eventsList.slice(0, 4) // Limit to 4 events per occasion
          };
        } catch (error) {
          console.error(`Error fetching events for ${occasion.occasion}:`, error);
          return {
            occasion: occasion.occasion,
            events: []
          };
        }
      });

      const results = await Promise.all(eventsPromises);

      // Convert array to object for easier lookup
      const eventsMap = {};
      results.forEach(result => {
        eventsMap[result.occasion] = result.events;
      });

      setOccasionEvents(eventsMap);
    } catch (error) {
      console.error("Error fetching occasion events:", error);
    } finally {
      setLoadingOccasionEvents(false);
    }
  };

  const stats = [
    { icon: <Sparkles className="w-5 h-5" />, value: "100+", label: "Events Managed", color: "text-green-500" },
    { icon: <Users className="w-5 h-5" />, value: "80+", label: "Happy Clients", color: "text-emerald-500" },
    { icon: <MapPin className="w-5 h-5" />, value: "2", label: "Cities Covered", color: "text-teal-500" },
    { icon: <Trophy className="w-5 h-5" />, value: "5+", label: "Years Experience", color: "text-green-600" },
  ];

  return (
    <div className="w-full bg-gradient-to-b from-blue-50 via-green-50/30 to-white font-sans text-gray-700 overflow-x-hidden">

      {/* 1. HERO SECTION */}
      <section className="relative py-24 lg:py-32 w-full bg-gradient-to-br from-blue-50 via-green-50/50 to-white">
        <div className="container mx-auto px-4 flex flex-col items-center justify-center text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-5xl mx-auto space-y-8"
          >
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white shadow-sm border border-green-100">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
              <span className="text-xs font-semibold tracking-widest uppercase text-green-600">
                Premium Event Management & Decoration
              </span>
            </div>

            {/* Main Heading */}
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 leading-[1.1] tracking-tight">
              Transform Your <br />
              <span className="gradient-text">
                Special Moments
              </span>
            </h1>

            {/* Subheading */}
            <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Creating unforgettable memories with stunning decorations for birthdays, weddings, baby showers & more across Ahmedabad & Jamnagar.
            </p>

            {/* Service Tags */}
            <div className="flex flex-wrap justify-center gap-2 mt-6 max-w-4xl mx-auto">
              {serviceTags.map((tag, i) => (
                <span
                  key={i}
                  className="text-xs md:text-sm text-gray-700 bg-white px-4 py-2 rounded-full border border-gray-200 hover:border-green-300 hover:shadow-md transition-all duration-300 cursor-default font-medium"
                >
                  {tag}
                </span>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="pt-8 flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                asChild
                size="lg"
                className="rounded-full bg-green-500 text-white hover:bg-green-600 px-10 h-14 text-base font-semibold shadow-lg shadow-green-500/30 hover:shadow-xl hover:shadow-green-500/40 transition-all duration-300"
              >
                <Link href="/all-events" className="flex items-center gap-2">
                  Explore Collections <ArrowRight className="w-5 h-5" />
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="rounded-full border-2 border-green-500 text-green-600 hover:bg-green-50 px-10 h-14 text-base font-semibold"
              >
                <Link href="/contact">Book Consultation</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 2. STATS SECTION */}
      <section className="py-16 bg-white border-y border-gray-200">
        <div className="container mx-auto px-4">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {stats.map((stat, idx) => (
              <motion.div
                key={idx}
                variants={fadeInUp}
                className="flex flex-col items-center justify-center p-6 rounded-2xl bg-gradient-to-br from-gray-50 to-white border border-gray-100 hover:shadow-lg hover:border-green-200 transition-all duration-300"
              >
                <div className={`p-4 bg-white rounded-full shadow-sm mb-4 ${stat.color}`}>
                  {stat.icon}
                </div>
                <h3 className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</h3>
                <p className="text-xs text-gray-500 uppercase tracking-widest font-semibold">{stat.label}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* 3. OCCASIONS SECTION */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <span className="inline-block text-sm font-bold tracking-wider uppercase text-green-600 mb-3">
              Curated Collections
            </span>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Browse by Occasion</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Discover our handpicked decoration themes for every special moment in your life.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {loading ? (
              [...Array(8)].map((_, i) => (
                <div key={i} className="aspect-square bg-gradient-to-br from-gray-100 to-gray-50 rounded-3xl animate-pulse" />
              ))
            ) : (
              occasions.map((item, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                >
                  <Link
                    href={`/all-events`}
                    className="group relative block aspect-square rounded-3xl overflow-hidden bg-gray-100 hover:shadow-2xl transition-all duration-500"
                  >
                    <Image
                      src={item.images?.[0] || item.image || "/placeholder.svg"}
                      alt={item.occasion}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
                    <div className="absolute inset-0 flex flex-col justify-end p-6">
                      <h3 className="text-white text-xl font-bold mb-1">{item.occasion}</h3>
                      <div className="flex items-center gap-2 text-white/80 text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <span>Explore</span>
                        <ArrowRight className="w-4 h-4" />
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))
            )}
          </div>

          <div className="text-center mt-12">
            <Button asChild variant="outline" className="rounded-full border-2 border-gray-900 text-gray-900 hover:bg-gray-900 hover:text-white px-8 h-12 font-semibold">
              <Link href="/all-events" className="flex items-center gap-2">
                View All Categories <ArrowRight className="w-4 h-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* 4. TRENDING EVENTS */}
      <section className="py-24 bg-gradient-to-b from-white to-green-50/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <span className="inline-block text-sm font-bold tracking-wider uppercase text-green-600 mb-3">
              Client Favorites
            </span>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Trending This Season</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Handpicked designs that are stealing the spotlight at recent events.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {loading ? (
              [...Array(4)].map((_, i) => (
                <div key={i} className="aspect-[3/4] bg-gradient-to-br from-gray-100 to-gray-50 rounded-3xl animate-pulse" />
              ))
            ) : (
              events.map((event, idx) => (
                <motion.div
                  key={event._id || idx}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  variants={fadeInUp}
                  transition={{ delay: idx * 0.1 }}
                >
                  <Link href={`/events/view-detail?id=${event._id}`} className="group block">
                    <div className="relative aspect-[3/4] rounded-3xl overflow-hidden bg-gray-100 mb-5 shadow-md group-hover:shadow-2xl transition-all duration-500">
                      <Image
                        src={event.images?.[0] || "/placeholder.svg"}
                        alt={event.title}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-bold text-gray-900 shadow-lg">
                        ₹{event.price}
                      </div>
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 group-hover:text-green-600 transition-colors line-clamp-1 mb-2">
                      {event.title}
                    </h3>
                    <div className="flex items-center gap-2">
                      <div className="flex text-amber-400">
                        <Star className="w-4 h-4 fill-current" />
                      </div>
                      <span className="text-sm font-semibold text-gray-600">{event.rating || 4.8}</span>
                      <span className="text-sm text-gray-400">/ 5</span>
                    </div>
                  </Link>
                </motion.div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* 4.5 EVENTS BY OCCASION */}
      {occasions.length > 0 && (
        <section className="py-24 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <span className="inline-block text-sm font-bold tracking-wider uppercase text-green-600 mb-3">
                Browse by Occasion
              </span>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Events for Every Celebration</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Explore our curated collections designed specifically for your special occasions.
              </p>
            </div>

            {/* Render events for each occasion */}
            {occasions.map((occasion, occasionIdx) => {
              const eventsForOccasion = occasionEvents[occasion.occasion] || [];

              // Skip if no events for this occasion
              if (eventsForOccasion.length === 0 && !loadingOccasionEvents) return null;

              return (
                <div key={occasionIdx} className="mb-20 last:mb-0">
                  {/* Occasion Header */}
                  <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-4">
                      <div className="relative w-16 h-16 rounded-2xl overflow-hidden shadow-lg">
                        <Image
                          src={occasion.images?.[0] || occasion.image || "/placeholder.svg"}
                          alt={occasion.occasion}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <h3 className="text-3xl font-bold text-gray-900">{occasion.occasion}</h3>
                        <p className="text-sm text-gray-500">
                          {eventsForOccasion.length} {eventsForOccasion.length === 1 ? 'design' : 'designs'} available
                        </p>
                      </div>
                    </div>
                    <Button
                      asChild
                      variant="outline"
                      className="rounded-full border-2 border-gray-900 text-gray-900 hover:bg-gray-900 hover:text-white px-6 h-11 font-semibold"
                    >
                      <Link href={`/all-events`} className="flex items-center gap-2">
                        View All <ArrowRight className="w-4 h-4" />
                      </Link>
                    </Button>
                  </div>

                  {/* Events Grid - Horizontal scroll on mobile, grid on desktop */}
                  <div className="lg:grid lg:grid-cols-4 lg:gap-8 -mx-4 lg:mx-0">
                    <div className="flex lg:contents gap-4 sm:gap-6 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide px-4 lg:px-0 lg:overflow-visible lg:gap-8">
                      {loadingOccasionEvents ? (
                        [...Array(4)].map((_, i) => (
                          <div key={i} className="flex-shrink-0 w-[75vw] sm:w-[320px] lg:w-auto aspect-[3/4] bg-gradient-to-br from-gray-100 to-gray-50 rounded-3xl animate-pulse snap-center" />
                        ))
                      ) : (
                        eventsForOccasion.map((event, idx) => (
                          <motion.div
                            key={event._id || idx}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                            variants={fadeInUp}
                            transition={{ delay: idx * 0.1 }}
                            className="flex-shrink-0 w-[75vw] sm:w-[320px] lg:w-auto snap-center"
                          >
                            <Link href={`/events/view-detail?id=${event._id}`} className="group block">
                              <div className="relative aspect-[3/4] rounded-3xl overflow-hidden bg-gray-100 mb-4 shadow-md group-hover:shadow-2xl transition-all duration-500">
                                <Image
                                  src={event.images?.[0] || "/placeholder.svg"}
                                  alt={event.title}
                                  fill
                                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                                />
                                <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-full text-xs sm:text-sm font-bold text-gray-900 shadow-lg">
                                  ₹{event.price?.toLocaleString()}
                                </div>
                                {event.originalPrice && event.originalPrice > event.price && (
                                  <div className="absolute top-3 left-3 bg-red-500 text-white px-2.5 py-1 rounded-full text-xs font-bold shadow-lg">
                                    {Math.round(((event.originalPrice - event.price) / event.originalPrice) * 100)}% OFF
                                  </div>
                                )}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                              </div>
                              <h3 className="text-lg sm:text-xl font-bold text-gray-900 group-hover:text-green-600 transition-colors line-clamp-1 mb-2">
                                {event.title}
                              </h3>
                              <div className="flex items-center gap-2">
                                <div className="flex text-amber-400">
                                  <Star className="w-4 h-4 fill-current" />
                                </div>
                                <span className="text-sm font-semibold text-gray-600">{event.rating || 4.8}</span>
                                <span className="text-sm text-gray-400">/ 5</span>
                              </div>
                            </Link>
                          </motion.div>
                        ))
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* 5. WHY CHOOSE US */}
      <section className="py-24 bg-white relative overflow-hidden">
        {/* Decorative Elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-green-200/30 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-emerald-200/30 rounded-full blur-3xl translate-y-1/2 -translate-x-1/3" />

        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-20">
            <span className="inline-block text-sm font-bold tracking-wider uppercase text-green-600 mb-3">
              Our Promise
            </span>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Why Vardhman Decoration?</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              We don't just decorate spaces, we create unforgettable experiences.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInUp}
              className="p-8 rounded-3xl bg-white border-2 border-green-100 hover:border-green-300 hover:shadow-xl transition-all duration-500 text-center group"
            >
              <div className="w-16 h-16 bg-green-500 rounded-2xl flex items-center justify-center mb-6 text-white mx-auto shadow-lg group-hover:scale-110 transition-transform">
                <Sparkles className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-gray-900">Premium Quality</h3>
              <p className="text-gray-600 leading-relaxed">
                We use only the finest balloons, fresh florals, and premium props to ensure a luxurious look that wows your guests.
              </p>
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInUp}
              transition={{ delay: 0.1 }}
              className="p-8 rounded-3xl bg-white border-2 border-emerald-100 hover:border-emerald-300 hover:shadow-xl transition-all duration-500 text-center group"
            >
              <div className="w-16 h-16 bg-emerald-500 rounded-2xl flex items-center justify-center mb-6 text-white mx-auto shadow-lg group-hover:scale-110 transition-transform">
                <Calendar className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-gray-900">On-Time Setup</h3>
              <p className="text-gray-600 leading-relaxed">
                Punctuality is our hallmark. We ensure your setup is ready and perfect well before your guests arrive.
              </p>
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInUp}
              transition={{ delay: 0.2 }}
              className="p-8 rounded-3xl bg-white border-2 border-teal-100 hover:border-teal-300 hover:shadow-xl transition-all duration-500 text-center group"
            >
              <div className="w-16 h-16 bg-teal-500 rounded-2xl flex items-center justify-center mb-6 text-white mx-auto shadow-lg group-hover:scale-110 transition-transform">
                <Heart className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-gray-900">Customized Themes</h3>
              <p className="text-gray-600 leading-relaxed">
                Every event is unique. Our designs are tailored to reflect your personal style, color preferences, and vision.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 6. TESTIMONIALS */}
      <section className="py-24 bg-gradient-to-b from-green-50/30 to-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-20">
            <span className="inline-block text-sm font-bold tracking-wider uppercase text-green-600 mb-3">
              Testimonials
            </span>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">What Our Clients Say</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Real stories from real people who trusted us with their special moments.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { name: "Priya Patel", role: "Happy Mom", quote: "The birthday decor was absolutely magical! My daughter loved the balloon arch. The team was professional and punctual. Highly recommended!" },
              { name: "Rahul Mehta", role: "Groom", quote: "Professional service for my Haldi ceremony. The floral arrangement was fresh and beautiful. They exceeded our expectations!" },
              { name: "Anjali Shah", role: "Event Planner", quote: "I frequently hire Vardhman for my clients. They always deliver premium quality work on time. A reliable partner!" }
            ].map((item, i) => (
              <motion.div
                key={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeInUp}
                transition={{ delay: i * 0.1 }}
                className="bg-white border-2 border-gray-100 p-8 rounded-3xl relative hover:shadow-xl hover:border-green-200 transition-all duration-300"
              >
                <Quote className="w-10 h-10 text-green-200 mb-6" />
                <p className="text-gray-700 mb-8 leading-relaxed text-lg">"{item.quote}"</p>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-green-500 flex items-center justify-center text-white font-bold text-lg shadow-lg">
                    {item.name[0]}
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900">{item.name}</h4>
                    <span className="text-xs text-gray-500 uppercase tracking-wider font-semibold">{item.role}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. BLOG SECTION */}
      <section className="py-24 bg-white pb-32">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <span className="inline-block text-sm font-bold tracking-wider uppercase text-green-600 mb-3">
              Inspiration & Tips
            </span>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Latest Decoration Ideas</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Expert tips and creative ideas to make your next event truly spectacular.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {loading ? (
              [...Array(3)].map((_, i) => (
                <div key={i} className="h-96 bg-gradient-to-br from-gray-100 to-gray-50 rounded-3xl animate-pulse" />
              ))
            ) : (
              blogs.map((blog, idx) => (
                <motion.div
                  key={idx}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  variants={fadeInUp}
                  transition={{ delay: idx * 0.1 }}
                >
                  <Link href={`/blogs/${blog.slug || blog._id}`} className="group block h-full">
                    <div className="bg-white border-2 border-gray-100 rounded-3xl overflow-hidden h-full hover:shadow-xl hover:border-green-200 transition-all duration-300">
                      <div className="relative aspect-[16/10] bg-gray-100">
                        <Image
                          src={blog.featuredImage || "/placeholder.svg"}
                          alt={blog.title}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      </div>
                      <div className="p-6">
                        <span className="inline-block text-xs font-bold text-green-600 bg-green-50 px-3 py-1 rounded-full uppercase tracking-wider mb-4">
                          {blog.category || "Decor Tips"}
                        </span>
                        <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-green-600 transition-colors line-clamp-2">
                          {blog.title}
                        </h3>
                        <p className="text-gray-600 text-sm line-clamp-2 leading-relaxed">
                          {blog.excerpt || "Discover expert tips and creative ideas for your next event decoration..."}
                        </p>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))
            )}
          </div>
        </div>
      </section>

    </div>
  );
}