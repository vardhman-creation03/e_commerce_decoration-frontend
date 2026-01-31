'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { Search, Calendar, User, ArrowRight, Tag, Clock, Loader2, Sparkles } from 'lucide-react';
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
      staggerChildren: 0.08,
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
  Graduation: 'Graduation',
  Retirement: 'Retirement',
  Corporate: 'Corporate',
  Other: 'Other',
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

      const blogList = Array.isArray(data) ? data : (data?.blogs || data?.data || []);
      const paginationData = data?.pagination || {
        currentPage: data?.currentPage || currentPage,
        totalPages: data?.totalPages || 1,
        totalPosts: data?.totalPosts || blogList.length,
        hasNextPage: data?.hasNextPage || false,
        hasPrevPage: data?.hasPrevPage || false
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
      graduation: 'Graduation',
      retirement: 'Retirement',
      corporate: 'Corporate',
      other: 'Other',
    };
    return displayMap[category?.toLowerCase()] || category || 'Other';
  };

  const featuredBlog = blogs.length > 0 ? blogs[0] : null;
  const regularBlogs = blogs.length > 1 ? blogs.slice(1) : blogs;

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-green-50/10 to-white">
      <main>
        {/* Hero Section */}
        <motion.section
          initial="hidden"
          animate="visible"
          variants={fadeIn}
          className="pt-12 pb-16 border-b border-gray-100"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-4xl mx-auto">
              <motion.div
                variants={slideUp}
                className="inline-flex items-center gap-2 bg-green-50 text-green-600 px-4 py-2 rounded-full text-sm font-semibold mb-4"
              >
                <Sparkles className="w-4 h-4" />
                <span>Inspiration & Ideas</span>
              </motion.div>

              <motion.h1
                variants={slideUp}
                className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-4"
              >
                Decoration Blog
              </motion.h1>

              <motion.p
                variants={slideUp}
                className="text-lg text-gray-600 mb-8"
              >
                Discover inspiration, tips, and ideas for your next celebration
              </motion.p>

              <motion.div variants={slideUp} className="relative max-w-2xl mx-auto">
                <Search className="absolute left-5 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search blogs..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-14 pr-4 py-6 text-base rounded-2xl border-2 border-gray-200 focus:border-green-500 focus:ring-green-500"
                />
                {searching && (
                  <div className="absolute right-5 top-1/2 transform -translate-y-1/2">
                    <Loader2 className="h-5 w-5 animate-spin text-gray-400" />
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
          className="bg-white border-b border-gray-100 sticky top-0 z-10 backdrop-blur-sm bg-white/95"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-2 overflow-x-auto py-4 scrollbar-hide">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => handleCategoryChange(category)}
                  className={`px-5 py-2.5 rounded-full text-sm font-semibold whitespace-nowrap transition-all ${selectedCategory === category
                      ? 'bg-green-500 text-white shadow-md'
                      : 'bg-white border-2 border-gray-200 text-gray-700 hover:border-green-300'
                    }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </motion.section>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-xl mb-6"
            >
              {error}
            </motion.div>
          )}

          {loading && blogs.length === 0 ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="h-8 w-8 animate-spin text-green-500" />
              <span className="ml-2 text-gray-600">Loading blogs...</span>
            </div>
          ) : blogs.length === 0 ? (
            <motion.div
              initial="hidden"
              animate="visible"
              variants={fadeIn}
              className="text-center py-16"
            >
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
                <Search className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">No blogs found</h3>
              <p className="text-gray-600">
                Try adjusting your search or filters
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
                  className="mb-16"
                >
                  <Link href={getBlogLink(featuredBlog)}>
                    <div className="bg-white border-2 border-gray-100 rounded-2xl overflow-hidden hover:border-green-300 hover:shadow-xl transition-all cursor-pointer group">
                      <div className="grid md:grid-cols-2 gap-0">
                        <div className="relative h-64 md:h-auto overflow-hidden">
                          <Image
                            src={getBlogImage(featuredBlog)}
                            alt={featuredBlog.title || 'Blog post'}
                            fill
                            className="object-cover group-hover:scale-110 transition-transform duration-500"
                            sizes="(max-width: 768px) 100vw, 50vw"
                          />
                          <div className="absolute top-4 left-4">
                            <span className="bg-green-500 text-white px-3 py-1.5 rounded-full text-xs font-semibold">
                              Featured
                            </span>
                          </div>
                        </div>
                        <div className="p-8 md:p-12 flex flex-col justify-center">
                          <div className="flex items-center gap-4 mb-4 text-sm text-gray-500 flex-wrap">
                            <span className="flex items-center gap-1.5 bg-green-50 text-green-600 px-3 py-1 rounded-full font-semibold">
                              <Tag className="h-3.5 w-3.5" />
                              {getCategoryDisplayName(featuredBlog.category)}
                            </span>
                            {featuredBlog.publishedAt && (
                              <span className="flex items-center gap-1.5">
                                <Calendar className="h-4 w-4" />
                                {formatDate(featuredBlog.publishedAt)}
                              </span>
                            )}
                            <span className="flex items-center gap-1.5">
                              <Clock className="h-4 w-4" />
                              {getReadingTime(featuredBlog)}
                            </span>
                          </div>
                          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 group-hover:text-green-600 transition-colors">
                            {featuredBlog.title || 'Untitled'}
                          </h2>
                          <p className="text-gray-600 mb-6 leading-relaxed line-clamp-3">
                            {featuredBlog.excerpt || featuredBlog.content?.substring(0, 200) || 'No excerpt available.'}
                          </p>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2 text-sm text-gray-500">
                              <User className="h-4 w-4" />
                              <span>{featuredBlog.author || 'Vardhman Decoration'}</span>
                            </div>
                            <Button
                              variant="ghost"
                              className="rounded-full group-hover:bg-green-50 group-hover:text-green-600"
                            >
                              Read More
                              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
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
                  <div className="flex items-center justify-between mb-8">
                    <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
                      Latest Articles
                      {pagination.totalPosts > 0 && (
                        <span className="text-sm font-medium text-gray-500 ml-3">
                          ({pagination.totalPosts})
                        </span>
                      )}
                    </h2>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {regularBlogs.map((blog, index) => (
                      <motion.article
                        key={blog._id || blog.id || index}
                        variants={slideUp}
                        whileHover={{ y: -4 }}
                        transition={{ duration: 0.2, ease: 'easeOut' }}
                      >
                        <Link href={getBlogLink(blog)}>
                          <div className="bg-white border-2 border-gray-100 rounded-2xl overflow-hidden hover:border-green-300 hover:shadow-xl transition-all cursor-pointer group h-full flex flex-col">
                            <div className="relative h-48 overflow-hidden">
                              <Image
                                src={getBlogImage(blog)}
                                alt={blog.title || 'Blog post'}
                                fill
                                className="object-cover group-hover:scale-110 transition-transform duration-500"
                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                              />
                            </div>
                            <div className="p-6 flex flex-col flex-1">
                              <div className="flex items-center gap-3 mb-3 text-xs text-gray-500">
                                <span className="flex items-center gap-1.5 bg-green-50 text-green-600 px-2.5 py-1 rounded-full font-semibold">
                                  <Tag className="h-3 w-3" />
                                  {getCategoryDisplayName(blog.category)}
                                </span>
                                <span className="flex items-center gap-1.5">
                                  <Clock className="h-3 w-3" />
                                  {getReadingTime(blog)}
                                </span>
                              </div>
                              <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-green-600 transition-colors line-clamp-2">
                                {blog.title || 'Untitled'}
                              </h3>
                              <p className="text-gray-600 text-sm mb-4 line-clamp-3 flex-1">
                                {blog.excerpt || blog.content?.substring(0, 150) || 'No excerpt available.'}
                              </p>
                              <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                                <div className="flex items-center gap-2 text-xs text-gray-500">
                                  <Calendar className="h-3 w-3" />
                                  <span>
                                    {formatDate(blog.publishedAt || blog.createdAt)}
                                  </span>
                                </div>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="rounded-full text-xs group-hover:bg-green-50 group-hover:text-green-600"
                                >
                                  Read
                                  <ArrowRight className="ml-1 h-3 w-3 group-hover:translate-x-1 transition-transform" />
                                </Button>
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
                  className="flex items-center justify-between mt-12 pt-8 border-t border-gray-200"
                >
                  <p className="text-sm text-gray-600">
                    Page <span className="font-semibold text-gray-900">{pagination.currentPage}</span> of <span className="font-semibold text-gray-900">{pagination.totalPages}</span>
                  </p>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                      disabled={!pagination.hasPrevPage || loading}
                      className="rounded-full border-2"
                    >
                      Previous
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setCurrentPage((prev) => Math.min(pagination.totalPages, prev + 1))}
                      disabled={!pagination.hasNextPage || loading}
                      className="rounded-full border-2"
                    >
                      Next
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
