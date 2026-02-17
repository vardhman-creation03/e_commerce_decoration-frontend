'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import {
  ArrowLeft,
  ArrowRight,
  Calendar,
  User,
  Tag,
  Clock,
  Share2,
  Facebook,
  Twitter,
  Linkedin,
  Loader2,
  ChevronRight,
  Eye,
  Heart,
  BookOpen,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { blogService } from '@/lib/services/blogService';

// Animation variants
const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1]
    }
  },
};

const slideUp = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.7,
      ease: [0.22, 1, 0.36, 1]
    }
  },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.1,
    },
  },
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.5,
      ease: [0.22, 1, 0.36, 1]
    }
  },
};

// Category display mapping
const getCategoryDisplayName = (category) => {
  const displayMap = {
    'decoration tips': 'Tips',
    'event planning': 'Corporate',
    'diy ideas': 'Outdoor',
    'trends': 'Festival',
    'tutorials': 'Baby Shower',
    'inspiration': 'Anniversary',
    'behind the scenes': 'Tips',
    'customer stories': 'Tips',
    'other': 'Tips',
  };
  return displayMap[category?.toLowerCase()] || category || 'Tips';
};

export default function BlogDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  // Extract slug from params - handle both string and array cases
  const slug = Array.isArray(params?.slug) ? params.slug[0] : params?.slug;

  const [selectedBlog, setSelectedBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [relatedBlogs, setRelatedBlogs] = useState([]);

  // Fetch blog detail
  useEffect(() => {
    const fetchBlogDetail = async () => {
      if (!slug) return;
      setLoading(true);
      setError(null);
      try {
        // Decode slug in case it's URL encoded, with error handling
        let decodedSlug = slug;
        try {
          decodedSlug = decodeURIComponent(slug);
        } catch (e) {
          // If decoding fails, use the original slug
          decodedSlug = slug;
        }
        // Trim and clean the slug
        decodedSlug = decodedSlug.trim();

        const result = await blogService.getBlogPost(decodedSlug);

        // Handle API response structure: { success, message, blogPost }
        if (result.success === false) {
          setError(result.message || "The blog post you are looking for does not exist or has been removed.");
          setSelectedBlog(null);
          return;
        }

        // Extract blog data from response
        const blogData = result.blogPost || result.blog || result.data || result;

        if (!blogData || (!blogData._id && !blogData.id)) {
          setError("The blog post you are looking for does not exist or has been removed.");
          setSelectedBlog(null);
          return;
        }

        setSelectedBlog(blogData);
      } catch (err) {
        console.error("Error fetching blog detail:", err);
        const errorMessage = err.response?.data?.message || err.message || "The blog post you are looking for does not exist or has been removed.";
        setError(errorMessage);
        setSelectedBlog(null);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogDetail();
  }, [slug]);

  // Fetch related blogs
  useEffect(() => {
    const fetchRelated = async () => {
      if (!selectedBlog?.category) return;

      try {
        const result = await blogService.getAllBlogPosts({
          category: selectedBlog.category,
          limit: 4
        });
        // Handle API response structure: { success, message, blogPosts, pagination }
        const list = Array.isArray(result)
          ? result
          : (result?.blogPosts || result?.blogs || result?.data || []);
        const filtered = list.filter(b => (b._id || b.id) !== (selectedBlog._id || selectedBlog.id)).slice(0, 3);
        setRelatedBlogs(filtered);
      } catch (err) {
        console.error("Error fetching related blogs:", err);
      }
    };

    if (selectedBlog) {
      fetchRelated();
    }
  }, [selectedBlog]);

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
    if (blog?.readingTime) {
      return `${blog.readingTime} min read`;
    }
    return '5 min read';
  };

  const getBlogImage = (blog) => {
    if (blog?.featuredImage) {
      return blog.featuredImage;
    }
    if (blog?.images && Array.isArray(blog.images) && blog.images.length > 0) {
      return blog.images[0];
    }
    return '/placeholder.svg?height=800&width=1200';
  };

  const getBlogLink = (blog) => {
    if (blog?.slug) {
      return `/blogs/${blog.slug}`;
    }
    return `/blogs/${blog?._id || blog?.id}`;
  };

  // Share functions
  const shareUrl = typeof window !== 'undefined' ? window.location.href : '';
  const shareTitle = selectedBlog?.title || '';

  const shareOnFacebook = () => {
    window.open(
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
      '_blank'
    );
  };

  const shareOnTwitter = () => {
    window.open(
      `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareTitle)}`,
      '_blank'
    );
  };

  const shareOnLinkedIn = () => {
    window.open(
      `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`,
      '_blank'
    );
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      toast({
        title: 'Link copied!',
        description: 'Blog link has been copied to clipboard.',
      });
    } catch (err) {
      toast({
        title: 'Error',
        description: 'Failed to copy link.',
        variant: 'destructive',
      });
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-amber-50/30 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <div className="relative">
            <Loader2 className="h-12 w-12 text-green-500 mx-auto mb-6 animate-spin" />
            <div className="absolute inset-0 border-4 border-green-200 rounded-full animate-pulse" />
          </div>
          <p className="text-gray-700 text-lg font-medium">Loading article...</p>
          <p className="text-gray-500 text-sm mt-2">Please wait a moment</p>
        </motion.div>
      </div>
    );
  }

  // Error state
  if (error || !selectedBlog) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 flex items-center justify-center px-4">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeIn}
          className="text-center max-w-lg"
        >
          <div className="mb-8">
            <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-red-100 to-orange-100 flex items-center justify-center">
              <BookOpen className="h-12 w-12 text-red-500" />
            </div>
            <h1 className="text-5xl font-extrabold text-gray-900 mb-4">404</h1>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Blog Not Found</h2>
          </div>
          <p className="text-gray-600 mb-10 leading-relaxed text-lg">
            {error || 'The blog post you are looking for does not exist or has been removed.'}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={() => router.push('/blogs')}
              className="rounded-full bg-green-600 hover:bg-green-700 text-white px-8 h-12 shadow-lg shadow-green-500/20 transition-all"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Blogs
            </Button>
            <Button
              onClick={() => router.push('/')}
              variant="outline"
              className="rounded-full border-2 px-8 h-12 hover:bg-gray-50"
            >
              Go to Home
            </Button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-green-50/20 to-white">
      {/* Header Section */}
      <motion.section
        initial="hidden"
        animate="visible"
        variants={fadeIn}
        className="relative bg-gradient-to-br from-green-50/80 via-white to-amber-50/60 pt-20 pb-8 md:pt-36 md:pb-20 border-b border-gray-200/50 overflow-hidden"
      >
        {/* Enhanced decorative background elements - Hidden on mobile for cleaner look */}
        <div className="hidden md:block absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-green-200/30 to-transparent rounded-full blur-3xl" />
        <div className="hidden md:block absolute top-20 right-0 w-80 h-80 bg-gradient-to-bl from-amber-200/25 to-transparent rounded-full blur-3xl" />
        <div className="hidden md:block absolute bottom-0 left-1/4 w-72 h-72 bg-gradient-to-tr from-green-100/20 to-transparent rounded-full blur-3xl" />
        
        {/* Animated gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/40 to-white/80" />

        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center z-10">
          {/* Back Button - Enhanced design */}
          <motion.div
            variants={slideUp}
            className="mb-6 md:absolute md:top-0 md:left-4 lg:left-8 md:mb-0 flex justify-start md:justify-center"
          >
            <Button
              onClick={() => router.push('/blogs')}
              variant="outline"
              size="sm"
              className="rounded-full bg-white/90 backdrop-blur-md border border-gray-200 hover:bg-white hover:border-green-400 hover:shadow-md transition-all text-gray-700 group shadow-sm text-sm px-3 h-9 md:px-4 md:h-10"
            >
              <ArrowLeft className="mr-1.5 md:mr-2 h-3.5 w-3.5 md:h-4 md:w-4 group-hover:-translate-x-1 transition-transform" />
              <span className="font-medium text-xs md:text-sm">Back</span>
            </Button>
          </motion.div>

          {/* Category Badge - Enhanced */}
          {selectedBlog.category && (
            <motion.div
              variants={slideUp}
              className="flex justify-center mb-5 md:mb-8"
            >
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 md:px-5 md:py-2 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200/60 md:border-2 shadow-sm md:shadow-md text-green-700 rounded-full text-xs md:text-sm font-bold tracking-wide uppercase backdrop-blur-sm">
                <Tag className="h-3 w-3 md:h-4 md:w-4 text-green-600" />
                {getCategoryDisplayName(selectedBlog.category)}
              </span>
            </motion.div>
          )}

          {/* Title - Enhanced typography */}
          <motion.h1
            variants={slideUp}
            className="text-2xl md:text-5xl lg:text-6xl xl:text-7xl font-extrabold text-gray-900 mb-6 md:mb-10 leading-[1.2] md:leading-[1.15] tracking-tight max-w-5xl mx-auto drop-shadow-sm px-2"
          >
            <span className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent">
              {selectedBlog.title || 'Untitled'}
            </span>
          </motion.h1>

          {/* Meta Information - Enhanced - Stack on mobile */}
          <motion.div
            variants={slideUp}
            className="flex flex-col md:flex-row flex-wrap items-center justify-center gap-2.5 md:gap-4 lg:gap-6 text-gray-700 font-medium text-xs md:text-sm lg:text-base"
          >
            {selectedBlog.author && (
              <div className="flex items-center gap-2 bg-white/80 backdrop-blur-md px-3 py-1.5 md:px-4 md:py-2 rounded-full shadow-sm border border-gray-200/60 hover:border-green-300 transition-all w-full md:w-auto justify-center">
                <div className="w-7 h-7 md:w-9 md:h-9 rounded-full bg-gradient-to-br from-green-100 to-emerald-100 flex items-center justify-center text-green-700 shadow-sm">
                  <User className="h-3 w-3 md:h-4 md:w-4" />
                </div>
                <span className="font-semibold text-xs md:text-sm">{selectedBlog.author}</span>
              </div>
            )}
            {(selectedBlog.publishedAt || selectedBlog.createdAt) && (
              <div className="flex items-center gap-2 bg-white/80 backdrop-blur-md px-3 py-1.5 md:px-4 md:py-2 rounded-full shadow-sm border border-gray-200/60 hover:border-green-300 transition-all w-full md:w-auto justify-center">
                <Calendar className="h-3.5 w-3.5 md:h-4 md:w-4 text-green-600" />
                <span className="font-semibold text-xs md:text-sm">{formatDate(selectedBlog.publishedAt || selectedBlog.createdAt)}</span>
              </div>
            )}
            <div className="hidden md:block w-2 h-2 bg-gradient-to-br from-green-400 to-emerald-400 rounded-full" />
            <div className="flex items-center gap-2 bg-white/80 backdrop-blur-md px-3 py-1.5 md:px-4 md:py-2 rounded-full shadow-sm border border-gray-200/60 hover:border-green-300 transition-all w-full md:w-auto justify-center">
              <Clock className="h-3.5 w-3.5 md:h-4 md:w-4 text-green-600" />
              <span className="font-semibold text-xs md:text-sm">{getReadingTime(selectedBlog)}</span>
            </div>
            {selectedBlog.views !== undefined && (
              <>
                <div className="hidden md:block w-2 h-2 bg-gradient-to-br from-green-400 to-emerald-400 rounded-full" />
                <div className="flex items-center gap-2 bg-white/80 backdrop-blur-md px-3 py-1.5 md:px-4 md:py-2 rounded-full shadow-sm border border-gray-200/60 w-full md:w-auto justify-center">
                  <Eye className="h-3.5 w-3.5 md:h-4 md:w-4 text-green-600" />
                  <span className="font-semibold text-xs md:text-sm">{selectedBlog.views || 0} views</span>
                </div>
              </>
            )}
          </motion.div>
        </div>
      </motion.section>

      {/* Main Content */}
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-20">
        {/* Featured Image - Enhanced */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={scaleIn}
          className="mb-8 md:mb-24 relative z-10 group"
        >
          <div className="relative w-full h-[280px] sm:h-[350px] md:h-[700px] overflow-hidden rounded-2xl md:rounded-3xl shadow-xl md:shadow-2xl ring-1 md:ring-2 ring-gray-900/5 bg-gradient-to-br from-gray-100 to-gray-200 md:-mt-32">
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent z-10" />
            <Image
              src={getBlogImage(selectedBlog)}
              alt={selectedBlog.title || 'Blog post'}
              fill
              className="object-cover transition-transform duration-1000 group-hover:scale-110"
              priority
              sizes="(max-width: 768px) 100vw, 1200px"
            />
            {/* Decorative corner elements - Hidden on mobile */}
            <div className="hidden md:block absolute top-4 right-4 w-16 h-16 bg-white/20 backdrop-blur-md rounded-2xl border border-white/30 z-20" />
            <div className="hidden md:block absolute bottom-4 left-4 w-12 h-12 bg-white/20 backdrop-blur-md rounded-xl border border-white/30 z-20" />
          </div>
        </motion.div>

        {/* Excerpt - Enhanced */}
        {selectedBlog.excerpt && (
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={fadeIn}
            className="mb-10 md:mb-20 max-w-4xl mx-auto"
          >
            <div className="relative">
              <div className="hidden md:block absolute -left-4 top-0 bottom-0 w-1 bg-gradient-to-b from-green-400 to-emerald-400 rounded-full" />
              <p className="text-base md:text-xl lg:text-2xl xl:text-3xl text-gray-800 leading-relaxed font-semibold text-center font-serif italic pl-4 md:pl-8 pr-4 md:pr-8">
                <span className="text-2xl md:text-4xl lg:text-5xl text-green-500/40 font-serif leading-none">"</span>
                <span className="relative">{selectedBlog.excerpt}</span>
                <span className="text-2xl md:text-4xl lg:text-5xl text-green-500/40 font-serif leading-none">"</span>
              </p>
            </div>
          </motion.div>
        )}

        {/* Content - Enhanced typography */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={fadeIn}
          className="prose prose-sm md:prose-lg lg:prose-xl xl:prose-2xl prose-green max-w-none mb-12 md:mb-24 px-1 md:px-2"
        >
          <div
            className="blog-content text-gray-800 leading-relaxed prose-headings:font-extrabold prose-headings:text-gray-900 prose-headings:mt-8 md:prose-headings:mt-12 prose-headings:mb-4 md:prose-headings:mb-6 prose-h1:text-2xl md:prose-h1:text-4xl prose-h2:text-xl md:prose-h2:text-3xl prose-h3:text-lg md:prose-h3:text-2xl prose-p:mb-5 md:prose-p:mb-8 prose-p:text-base md:prose-p:text-lg lg:prose-p:text-xl prose-p:leading-relaxed prose-a:text-green-600 prose-a:font-semibold prose-a:no-underline hover:prose-a:underline prose-a:transition-all prose-strong:text-gray-900 prose-strong:font-bold prose-img:rounded-2xl md:prose-img:rounded-3xl prose-img:shadow-xl md:prose-img:shadow-2xl prose-img:my-6 md:prose-img:my-12 prose-img:ring-1 md:prose-img:ring-2 prose-img:ring-gray-200 prose-ul:my-5 md:prose-ul:my-8 prose-ol:my-5 md:prose-ol:my-8 prose-li:my-2 md:prose-li:my-4 prose-blockquote:border-l-4 prose-blockquote:border-green-400 prose-blockquote:pl-4 md:prose-blockquote:pl-6 prose-blockquote:italic prose-blockquote:text-gray-700 prose-blockquote:bg-green-50/50 prose-blockquote:py-3 md:prose-blockquote:py-4 prose-blockquote:rounded-r-lg prose-blockquote:text-sm md:prose-blockquote:text-base"
            dangerouslySetInnerHTML={{
              __html: selectedBlog.content || '<p>No content available.</p>',
            }}
          />
        </motion.div>

        {/* Additional Images - Enhanced gallery */}
        {selectedBlog.images && Array.isArray(selectedBlog.images) && selectedBlog.images.length > 0 && (
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 lg:gap-8 mb-12 md:mb-20"
          >
            {selectedBlog.images.map((image, index) => (
              <motion.div
                key={index}
                variants={scaleIn}
                className="relative h-64 sm:h-80 md:h-96 lg:h-[450px] overflow-hidden rounded-2xl md:rounded-3xl bg-gradient-to-br from-gray-100 to-gray-200 group shadow-lg md:shadow-xl ring-1 md:ring-2 ring-gray-900/5"
              >
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <Image
                  src={image}
                  alt={`${selectedBlog.title} - Image ${index + 1}`}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
                <div className="absolute bottom-3 md:bottom-4 left-3 md:left-4 right-3 md:right-4 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="bg-white/90 backdrop-blur-md px-3 md:px-4 py-1.5 md:py-2 rounded-full text-xs md:text-sm font-semibold text-gray-900 shadow-lg">
                    Image {index + 1} of {selectedBlog.images.length}
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Tags - Enhanced */}
        {selectedBlog.tags && Array.isArray(selectedBlog.tags) && selectedBlog.tags.length > 0 && (
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={fadeIn}
            className="mb-12 md:mb-20"
          >
            <div className="flex items-center gap-2 md:gap-3 mb-4 md:mb-6">
              <Tag className="h-4 w-4 md:h-5 md:w-5 text-green-600" />
              <h3 className="text-sm md:text-base font-bold text-gray-700 uppercase tracking-wider">Related Tags</h3>
            </div>
            <div className="flex flex-wrap gap-2 md:gap-3">
              {selectedBlog.tags.map((tag, index) => (
                <motion.span
                  key={index}
                  whileHover={{ scale: 1.05, y: -2 }}
                  className="px-3 py-1.5 md:px-5 md:py-2.5 bg-gradient-to-r from-green-50 to-emerald-50 text-green-700 text-xs md:text-sm font-bold rounded-full border border-green-200 md:border-2 hover:border-green-400 hover:shadow-md transition-all cursor-pointer shadow-sm"
                >
                  #{tag}
                </motion.span>
              ))}
            </div>
          </motion.div>
        )}

        {/* Share Section - Enhanced */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={fadeIn}
          className="mb-12 md:mb-20"
        >
          <div className="bg-gradient-to-br from-gray-50 via-white to-green-50/30 rounded-2xl md:rounded-3xl p-6 md:p-8 lg:p-12 text-center border border-gray-200/60 md:border-2 shadow-lg md:shadow-xl">
            <div className="mb-5 md:mb-6">
              <div className="w-12 h-12 md:w-16 md:h-16 mx-auto mb-3 md:mb-4 rounded-full bg-gradient-to-br from-green-100 to-emerald-100 flex items-center justify-center">
                <Heart className="h-6 w-6 md:h-8 md:w-8 text-green-600 fill-green-600" />
              </div>
              <h3 className="text-xl md:text-2xl lg:text-3xl font-extrabold text-gray-900 mb-2 md:mb-3">Love this article?</h3>
              <p className="text-gray-600 mb-6 md:mb-10 max-w-lg mx-auto text-sm md:text-base lg:text-lg">
                Share the inspiration with your friends and family on social media.
              </p>
            </div>

            <div className="grid grid-cols-2 md:flex items-center justify-center gap-3 md:gap-4">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="w-full md:w-auto">
                <Button
                  onClick={shareOnFacebook}
                  className="w-full md:w-auto rounded-full bg-[#1877F2] hover:bg-[#1864cc] text-white px-4 md:px-8 h-10 md:h-12 shadow-lg shadow-blue-500/30 transition-all font-semibold text-sm md:text-base"
                  aria-label="Share on Facebook"
                >
                  <Facebook className="h-4 w-4 md:h-5 md:w-5 mr-1.5 md:mr-2" />
                  <span className="hidden sm:inline">Facebook</span>
                  <span className="sm:hidden">FB</span>
                </Button>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="w-full md:w-auto">
                <Button
                  onClick={shareOnTwitter}
                  className="w-full md:w-auto rounded-full bg-[#1DA1F2] hover:bg-[#1a91da] text-white px-4 md:px-8 h-10 md:h-12 shadow-lg shadow-sky-500/30 transition-all font-semibold text-sm md:text-base"
                  aria-label="Share on Twitter"
                >
                  <Twitter className="h-4 w-4 md:h-5 md:w-5 mr-1.5 md:mr-2" />
                  <span className="hidden sm:inline">Twitter</span>
                  <span className="sm:hidden">TW</span>
                </Button>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="w-full md:w-auto">
                <Button
                  onClick={shareOnLinkedIn}
                  className="w-full md:w-auto rounded-full bg-[#0A66C2] hover:bg-[#0958a8] text-white px-4 md:px-8 h-10 md:h-12 shadow-lg shadow-blue-700/30 transition-all font-semibold text-sm md:text-base"
                  aria-label="Share on LinkedIn"
                >
                  <Linkedin className="h-4 w-4 md:h-5 md:w-5 mr-1.5 md:mr-2" />
                  <span className="hidden sm:inline">LinkedIn</span>
                  <span className="sm:hidden">LI</span>
                </Button>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="w-full md:w-auto col-span-2 md:col-span-1">
                <Button
                  onClick={copyToClipboard}
                  variant="outline"
                  className="w-full md:w-auto rounded-full border border-gray-300 md:border-2 px-4 md:px-8 h-10 md:h-12 hover:bg-gray-50 hover:border-gray-400 transition-all font-semibold shadow-md text-sm md:text-base"
                  aria-label="Copy link"
                >
                  <Share2 className="h-4 w-4 md:h-5 md:w-5 mr-1.5 md:mr-2" />
                  Copy Link
                </Button>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </article>

      {/* Related Blogs Section - Enhanced */}
      {relatedBlogs.length > 0 && (
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          variants={fadeIn}
          className="bg-gradient-to-b from-white via-gray-50/50 to-white border-t border-gray-200 md:border-t-2 py-12 md:py-24 lg:py-32"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-10 md:mb-16">
              <div className="mb-4 md:mb-0">
                <span className="text-green-600 font-bold tracking-wider uppercase text-xs md:text-sm mb-2 md:mb-3 block">Keep Reading</span>
                <h2 className="text-2xl md:text-4xl lg:text-5xl font-extrabold text-gray-900">
                  <span className="bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                    Related Articles
                  </span>
                </h2>
                <p className="text-gray-600 mt-2 md:mt-3 text-sm md:text-base lg:text-lg">Discover more inspiring content</p>
              </div>
              <Link href="/blogs" className="hidden md:block">
                <Button variant="outline" className="rounded-full hover:bg-green-50 hover:text-green-700 hover:border-green-300 transition-all group shadow-md border-2 font-semibold px-6 h-11">
                  View All
                  <ChevronRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </div>

            <motion.div
              variants={staggerContainer}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-8 lg:gap-10"
            >
              {relatedBlogs.map((blog, index) => (
                <motion.article
                  key={blog._id || blog.id || index}
                  variants={scaleIn}
                  whileHover={{ y: -8, scale: 1.01 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                >
                  <Link href={getBlogLink(blog)} className="block h-full group">
                    <div className="bg-white rounded-2xl md:rounded-3xl overflow-hidden shadow-md hover:shadow-xl hover:shadow-green-900/10 transition-all duration-500 h-full flex flex-col border border-gray-100 md:border-2 hover:border-green-200">
                      <div className="relative aspect-[4/3] overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200">
                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        <Image
                          src={getBlogImage(blog)}
                          alt={blog.title || 'Blog post'}
                          fill
                          className="object-cover group-hover:scale-110 transition-transform duration-700"
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />
                        <div className="absolute top-3 md:top-4 left-3 md:left-4 bg-white/95 backdrop-blur-md px-2.5 md:px-4 py-1 md:py-1.5 rounded-full text-xs font-bold text-gray-900 shadow-lg border border-gray-200/50 z-20">
                          {getCategoryDisplayName(blog.category)}
                        </div>
                      </div>
                      <div className="p-4 md:p-6 lg:p-7 flex flex-col flex-1">
                        <div className="flex items-center gap-2 md:gap-3 text-xs text-gray-500 mb-3 md:mb-5 font-semibold flex-wrap">
                          <span className="flex items-center gap-1 bg-gray-50 px-2 md:px-3 py-0.5 md:py-1 rounded-full text-xs">
                            <Calendar className="h-3 w-3 md:h-3.5 md:w-3.5 text-green-600" />
                            {formatDate(blog.publishedAt || blog.createdAt)}
                          </span>
                          <span className="w-1 h-1 md:w-1.5 md:h-1.5 rounded-full bg-green-400" />
                          <span className="flex items-center gap-1 bg-gray-50 px-2 md:px-3 py-0.5 md:py-1 rounded-full text-xs">
                            <Clock className="h-3 w-3 md:h-3.5 md:w-3.5 text-green-600" />
                            {getReadingTime(blog)}
                          </span>
                        </div>
                        <h3 className="text-lg md:text-xl lg:text-2xl font-extrabold text-gray-900 mb-3 md:mb-4 group-hover:text-green-600 transition-colors line-clamp-2 leading-tight">
                          {blog.title || 'Untitled'}
                        </h3>
                        <p className="text-gray-600 text-xs md:text-sm lg:text-base mb-4 md:mb-6 line-clamp-2 md:line-clamp-3 flex-1 leading-relaxed">
                          {blog.excerpt || blog.content?.substring(0, 120) || 'No excerpt available.'}
                        </p>
                        <div className="flex items-center text-green-600 font-bold text-xs md:text-sm group-hover:translate-x-2 transition-transform duration-300 mt-auto">
                          Read Article
                          <ArrowRight className="ml-1.5 md:ml-2 h-3.5 w-3.5 md:h-4 md:w-4" />
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.article>
              ))}
            </motion.div>

            <div className="mt-10 md:mt-16 text-center md:hidden">
              <Link href="/blogs">
                <Button variant="outline" className="w-full rounded-full hover:bg-green-50 hover:text-green-700 hover:border-green-300 transition-all font-semibold h-11 border-2 shadow-md">
                  View All Articles
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </motion.section>
      )}
    </div>
  );
}
