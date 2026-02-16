'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { Search, Calendar, User, ArrowRight, Tag, Clock, Loader2, Sparkles, TrendingUp } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { blogService } from '@/lib/services/blogService';

// Animation variants
const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const slideUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
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

// Category mapping
const categoryMap = {
  All: null,
  Birthday: 'Birthday',
  Anniversary: 'Anniversary',
  Wedding: 'Wedding',
  Engagement: 'Engagement',
  'Baby Shower': 'Baby Shower',
};

const categories = Object.keys(categoryMap);

export default function BlogsPage() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searching, setSearching] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalPosts: 0,
    hasNextPage: false,
    hasPrevPage: false
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTimeout, setSearchTimeout] = useState(null);
  const limit = 12;

  const fetchBlogs = useCallback(async (isSearch = false) => {
    try {
      if (isSearch) {
        setSearching(true);
      } else {
        setLoading(true);
      }
      setError(null);

      const params = {
        page: currentPage,
        limit,
      };

      if (searchQuery.trim()) {
        params.keyword = searchQuery.trim();
      }
      if (selectedCategory !== 'All') {
        params.category = categoryMap[selectedCategory] || selectedCategory;
      }

      const data = await blogService.getAllBlogPosts(params);

      // Handle API response structure: { success, message, blogPosts, pagination }
      const blogList = Array.isArray(data) 
        ? data 
        : (data?.blogPosts || data?.blogs || data?.data || []);
      
      const paginationData = data?.pagination || {
        currentPage: data?.currentPage || data?.pagination?.currentPage || currentPage,
        totalPages: data?.totalPages || data?.pagination?.totalPages || 1,
        totalPosts: data?.totalPosts || data?.pagination?.totalPosts || blogList.length,
        limit: data?.limit || data?.pagination?.limit || limit,
        hasNextPage: data?.hasNextPage !== undefined ? data.hasNextPage : (data?.pagination?.hasNextPage || false),
        hasPrevPage: data?.hasPrevPage !== undefined ? data.hasPrevPage : (data?.pagination?.hasPrevPage || false)
      };

      setBlogs(blogList);
      setPagination(paginationData);

    } catch (err) {
      console.error("Error fetching blogs", err);
      setError("Failed to load blog posts.");
    } finally {
      setLoading(false);
      setSearching(false);
    }
  }, [searchQuery, selectedCategory, currentPage]);

  useEffect(() => {
    if (!searchTimeout) {
      fetchBlogs();
    }
  }, [selectedCategory, currentPage]);

  useEffect(() => {
    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }

    if (searchQuery.trim()) {
      const timeout = setTimeout(() => {
        setCurrentPage(1);
        fetchBlogs(true);
      }, 500);
      setSearchTimeout(timeout);
    } else if (searchQuery === '' && searchTimeout) {
      setCurrentPage(1);
      fetchBlogs();
    }

    return () => {
      if (searchTimeout) {
        clearTimeout(searchTimeout);
      }
    };
  }, [searchQuery]);

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    setCurrentPage(1);
    setSearchQuery('');
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return dateString;
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    } catch {
      return dateString;
    }
  };

  const getReadingTime = (blog) => {
    return blog.readingTime ? `${blog.readingTime} min read` : '5 min read';
  };

  const getBlogImage = (blog) => {
    if (blog.featuredImage) return blog.featuredImage;
    if (blog.images && Array.isArray(blog.images) && blog.images.length > 0) return blog.images[0];
    return '/placeholder.svg?height=400&width=600';
  };

  const getBlogLink = (blog) => {
    return blog.slug ? `/blogs/${blog.slug}` : `/blogs/${blog._id || blog.id}`;
  };

  const getCategoryDisplayName = (category) => {
    const displayMap = {
      birthday: 'Birthday',
      anniversary: 'Anniversary',
      wedding: 'Wedding',
      engagement: 'Engagement',
      'baby shower': 'Baby Shower',
    };
    return displayMap[category?.toLowerCase()] || category || 'Decor Tips';
  };

  const featuredBlog = blogs.length > 0 ? blogs[0] : null;
  const regularBlogs = blogs.length > 1 ? blogs.slice(1) : blogs;

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50/30 via-white to-green-50/20">
      <main>
        {/* Hero Section */}
        <motion.section
          initial="hidden"
          animate="visible"
          variants={fadeIn}
          className="relative pt-12 pb-16 overflow-hidden"
        >
          {/* Decorative background elements */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-green-200/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-emerald-200/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/3" />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="text-center max-w-4xl mx-auto">
              <motion.div
                variants={slideUp}
                className="inline-flex items-center gap-2 bg-white border-2 border-green-100 text-green-600 px-5 py-2.5 rounded-full text-sm font-bold mb-6 shadow-sm"
              >
                <Sparkles className="w-4 h-4" />
                <span>Decoration Ideas & Inspiration</span>
              </motion.div>

              <motion.h1
                variants={slideUp}
                className="text-5xl sm:text-6xl lg:text-7xl font-bold text-gray-900 mb-6 leading-tight"
              >
                Event Decoration
                <br />
                <span className="gradient-text">Blog & Tips</span>
              </motion.h1>

              <motion.p
                variants={slideUp}
                className="text-lg sm:text-xl text-gray-600 mb-10 leading-relaxed max-w-3xl mx-auto"
              >
                Discover expert tips, creative ideas, and the latest trends to make your celebrations unforgettable
              </motion.p>

              <motion.div variants={slideUp} className="relative max-w-2xl mx-auto">
                <Search className="absolute left-5 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search decoration ideas, tips, and inspiration..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-14 pr-14 py-7 text-base rounded-2xl border-2 border-gray-200 focus:border-green-500 focus:ring-green-500 shadow-sm"
                />
                {searching && (
                  <div className="absolute right-5 top-1/2 transform -translate-y-1/2">
                    <Loader2 className="h-5 w-5 animate-spin text-green-500" />
                  </div>
                )}
              </motion.div>
            </div>
          </div>
        </motion.section>

        {/* Category Filter */}
        <motion.section
          initial="hidden"
          animate="visible"
          variants={slideUp}
          className="bg-white/80 backdrop-blur-md border-y border-gray-200 sticky top-0 z-20 shadow-sm"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-center gap-3 overflow-x-auto py-5 scrollbar-hide">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => handleCategoryChange(category)}
                  className={`px-6 py-3 rounded-full text-sm font-bold whitespace-nowrap transition-all duration-300 ${selectedCategory === category
                      ? 'bg-green-500 text-white shadow-lg shadow-green-500/30 scale-105'
                      : 'bg-white border-2 border-gray-200 text-gray-700 hover:border-green-300 hover:shadow-md'
                    }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </motion.section>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-red-50 border-2 border-red-200 text-red-800 px-6 py-4 rounded-2xl mb-8 text-center font-semibold"
            >
              {error}
            </motion.div>
          )}

          {loading && blogs.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20">
              <Loader2 className="h-10 w-10 animate-spin text-green-500 mb-4" />
              <span className="text-gray-600 font-medium">Loading amazing content...</span>
            </div>
          ) : blogs.length === 0 ? (
            <motion.div
              initial="hidden"
              animate="visible"
              variants={fadeIn}
              className="text-center py-20"
            >
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-100 rounded-full mb-6">
                <Search className="w-10 h-10 text-gray-400" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">No blogs found</h3>
              <p className="text-gray-600 text-lg">
                Try adjusting your search or browse different categories
              </p>
            </motion.div>
          ) : (
            <>
              {featuredBlog && (
                <motion.section
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: '-100px' }}
                  variants={fadeIn}
                  className="mb-20"
                >
                  <div className="flex items-center gap-2 mb-6">
                    <TrendingUp className="w-5 h-5 text-green-600" />
                    <h2 className="text-lg font-bold text-gray-900 uppercase tracking-wider">Featured Article</h2>
                  </div>

                  <Link href={getBlogLink(featuredBlog)}>
                    <div className="bg-white border-2 border-gray-200 rounded-3xl overflow-hidden hover:border-green-400 hover:shadow-2xl transition-all duration-500 cursor-pointer group">
                      <div className="grid lg:grid-cols-2 gap-0">
                        <div className="relative h-80 lg:h-auto overflow-hidden">
                          <Image
                            src={getBlogImage(featuredBlog)}
                            alt={featuredBlog.title || 'Blog post'}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-700"
                            sizes="(max-width: 1024px) 100vw, 50vw"
                            priority
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                          <div className="absolute top-6 left-6">
                            <span className="bg-green-500 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg">
                              ⭐ Featured
                            </span>
                          </div>
                        </div>
                        <div className="p-8 lg:p-12 flex flex-col justify-center">
                          <div className="flex items-center gap-3 mb-5 flex-wrap">
                            <span className="flex items-center gap-2 bg-green-50 text-green-600 px-4 py-2 rounded-full font-bold text-sm">
                              <Tag className="h-4 w-4" />
                              {getCategoryDisplayName(featuredBlog.category)}
                            </span>
                            {featuredBlog.publishedAt && (
                              <span className="flex items-center gap-2 text-gray-500 text-sm">
                                <Calendar className="h-4 w-4" />
                                {formatDate(featuredBlog.publishedAt)}
                              </span>
                            )}
                            <span className="flex items-center gap-2 text-gray-500 text-sm">
                              <Clock className="h-4 w-4" />
                              {getReadingTime(featuredBlog)}
                            </span>
                          </div>
                          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-5 group-hover:text-green-600 transition-colors leading-tight">
                            {featuredBlog.title || 'Untitled'}
                          </h2>
                          <p className="text-gray-600 mb-8 leading-relaxed text-lg line-clamp-3">
                            {featuredBlog.excerpt || featuredBlog.content?.substring(0, 200) || 'Discover amazing decoration ideas and tips for your next event.'}
                          </p>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3 text-sm text-gray-600">
                              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                                <User className="h-5 w-5 text-green-600" />
                              </div>
                              <span className="font-semibold">{featuredBlog.author || 'Vardhman Decoration'}</span>
                            </div>
                            <Button
                              className="rounded-full bg-green-500 hover:bg-green-600 text-white px-6 py-6 font-bold shadow-lg shadow-green-500/30 group-hover:shadow-xl group-hover:shadow-green-500/40"
                            >
                              Read Article
                              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.section>
              )}

              {regularBlogs.length > 0 && (
                <motion.section
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: '-50px' }}
                  variants={staggerContainer}
                >
                  <div className="flex items-center justify-between mb-10">
                    <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
                      Latest Articles
                      {pagination.totalPosts > 0 && (
                        <span className="text-base font-medium text-gray-500 ml-4">
                          ({pagination.totalPosts} {pagination.totalPosts === 1 ? 'post' : 'posts'})
                        </span>
                      )}
                    </h2>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {regularBlogs.map((blog, index) => (
                      <motion.article
                        key={blog._id || blog.id || index}
                        variants={slideUp}
                        whileHover={{ y: -8 }}
                        transition={{ duration: 0.3, ease: 'easeOut' }}
                      >
                        <Link href={getBlogLink(blog)}>
                          <div className="bg-white border-2 border-gray-200 rounded-3xl overflow-hidden hover:border-green-400 hover:shadow-2xl transition-all duration-500 cursor-pointer group h-full flex flex-col">
                            <div className="relative h-56 overflow-hidden">
                              <Image
                                src={getBlogImage(blog)}
                                alt={blog.title || 'Blog post'}
                                fill
                                className="object-cover group-hover:scale-110 transition-transform duration-700"
                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                            </div>
                            <div className="p-6 flex flex-col flex-1">
                              <div className="flex items-center gap-3 mb-4">
                                <span className="flex items-center gap-1.5 bg-green-50 text-green-600 px-3 py-1.5 rounded-full font-bold text-xs">
                                  <Tag className="h-3 w-3" />
                                  {getCategoryDisplayName(blog.category)}
                                </span>
                                <span className="flex items-center gap-1.5 text-gray-500 text-xs">
                                  <Clock className="h-3 w-3" />
                                  {getReadingTime(blog)}
                                </span>
                              </div>
                              <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-green-600 transition-colors line-clamp-2 leading-tight">
                                {blog.title || 'Untitled'}
                              </h3>
                              <p className="text-gray-600 text-sm mb-5 line-clamp-3 flex-1 leading-relaxed">
                                {blog.excerpt || blog.content?.substring(0, 150) || 'Discover creative decoration ideas for your special occasions.'}
                              </p>
                              <div className="flex items-center justify-between pt-4 border-t-2 border-gray-100">
                                <div className="flex items-center gap-2 text-xs text-gray-500">
                                  <Calendar className="h-3.5 w-3.5" />
                                  <span className="font-medium">
                                    {formatDate(blog.publishedAt || blog.createdAt)}
                                  </span>
                                </div>
                                <div className="flex items-center gap-2 text-green-600 font-bold text-sm group-hover:gap-3 transition-all">
                                  <span>Read More</span>
                                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                                </div>
                              </div>
                            </div>
                          </div>
                        </Link>
                      </motion.article>
                    ))}
                  </div>
                </motion.section>
              )}

              {/* Pagination */}
              {pagination.totalPages > 1 && (
                <motion.div
                  initial="hidden"
                  animate="visible"
                  variants={fadeIn}
                  className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-16 pt-10 border-t-2 border-gray-200"
                >
                  <p className="text-sm text-gray-600 font-medium">
                    Showing page <span className="font-bold text-gray-900 text-base">{pagination.currentPage}</span> of <span className="font-bold text-gray-900 text-base">{pagination.totalPages}</span>
                  </p>
                  <div className="flex gap-3">
                    <Button
                      variant="outline"
                      onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                      disabled={!pagination.hasPrevPage || loading}
                      className="rounded-full border-2 border-gray-300 hover:border-green-500 hover:bg-green-50 hover:text-green-600 px-6 py-6 font-bold disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      ← Previous
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setCurrentPage((prev) => Math.min(pagination.totalPages, prev + 1))}
                      disabled={!pagination.hasNextPage || loading}
                      className="rounded-full border-2 border-gray-300 hover:border-green-500 hover:bg-green-50 hover:text-green-600 px-6 py-6 font-bold disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Next →
                    </Button>
                  </div>
                </motion.div>
              )}
            </>
          )}
        </div>
      </main>
    </div>
  );
}
