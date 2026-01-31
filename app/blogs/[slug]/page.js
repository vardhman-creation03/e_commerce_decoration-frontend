'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import {
  ArrowLeft,
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
  const slug = params?.slug;

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
        const result = await blogService.getBlogPost(slug);
        const blogData = result.blog || result.data || result;
        setSelectedBlog(blogData);
      } catch (err) {
        console.error("Error fetching blog detail:", err);
        setError("The blog post you are looking for does not exist or has been removed.");
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
        const list = Array.isArray(result) ? result : (result?.blogs || result?.data || []);
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
      <div className="min-h-screen bg-white flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <Loader2 className="h-10 w-10 text-green-500 mx-auto mb-6 animate-spin" />
          <p className="text-gray-600 text-base">Loading article...</p>
        </motion.div>
      </div>
    );
  }

  // Error state
  if (error || !selectedBlog) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center px-4">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeIn}
          className="text-center max-w-md"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-6">Blog Not Found</h1>
          <p className="text-gray-600 mb-10 leading-relaxed">
            {error || 'The blog post you are looking for does not exist or has been removed.'}
          </p>
          <Button
            onClick={() => router.push('/blogs')}
            variant="outline"
            className="rounded-full border-2"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Blogs
          </Button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-green-50/10 to-white">
      {/* Header Section */}
      <motion.section
        initial="hidden"
        animate="visible"
        variants={fadeIn}
        className="bg-white border-b border-gray-100"
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
          {/* Back Button */}
          <motion.div
            variants={slideUp}
            className="mb-8"
          >
            <Button
              onClick={() => router.push('/blogs')}
              variant="ghost"
              size="sm"
              className="rounded-full hover:bg-gray-100 -ml-2"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Blogs
            </Button>
          </motion.div>

          {/* Category Badge */}
          {selectedBlog.category && (
            <motion.div
              variants={slideUp}
              className="mb-6"
            >
              <span className="inline-flex items-center gap-2 px-4 py-2 bg-green-50 text-green-600 rounded-full text-sm font-semibold">
                <Tag className="h-3.5 w-3.5" />
                {getCategoryDisplayName(selectedBlog.category)}
              </span>
            </motion.div>
          )}

          {/* Title */}
          <motion.h1
            variants={slideUp}
            className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 mb-8 leading-tight"
          >
            {selectedBlog.title || 'Untitled'}
          </motion.h1>

          {/* Meta Information */}
          <motion.div
            variants={slideUp}
            className="flex flex-wrap items-center gap-6 text-gray-600 text-sm"
          >
            {selectedBlog.author && (
              <div className="flex items-center gap-2">
                <User className="h-4 w-4" />
                <span>{selectedBlog.author}</span>
              </div>
            )}
            {(selectedBlog.publishedAt || selectedBlog.createdAt) && (
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span>{formatDate(selectedBlog.publishedAt || selectedBlog.createdAt)}</span>
              </div>
            )}
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              <span>{getReadingTime(selectedBlog)}</span>
            </div>
          </motion.div>
        </div>
      </motion.section>

      {/* Main Content */}
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20">
        {/* Featured Image */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={scaleIn}
          className="mb-16"
        >
          <div className="relative w-full h-[450px] md:h-[600px] overflow-hidden rounded-2xl bg-gray-100">
            <Image
              src={getBlogImage(selectedBlog)}
              alt={selectedBlog.title || 'Blog post'}
              fill
              className="object-cover"
              priority
              sizes="(max-width: 768px) 100vw, 896px"
            />
          </div>
        </motion.div>

        {/* Excerpt */}
        {selectedBlog.excerpt && (
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={fadeIn}
            className="mb-12"
          >
            <p className="text-xl md:text-2xl text-gray-700 leading-relaxed italic border-l-4 border-green-500 pl-6 py-4">
              {selectedBlog.excerpt}
            </p>
          </motion.div>
        )}

        {/* Content */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={fadeIn}
          className="prose prose-lg max-w-none mb-16"
        >
          <div
            className="blog-content text-gray-700 leading-relaxed"
            dangerouslySetInnerHTML={{
              __html: selectedBlog.content || '<p>No content available.</p>',
            }}
            style={{
              fontSize: '1.125rem',
              lineHeight: '1.9',
            }}
          />
        </motion.div>

        {/* Additional Images */}
        {selectedBlog.images && Array.isArray(selectedBlog.images) && selectedBlog.images.length > 0 && (
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16"
          >
            {selectedBlog.images.map((image, index) => (
              <motion.div
                key={index}
                variants={scaleIn}
                className="relative h-72 md:h-96 overflow-hidden rounded-2xl bg-gray-100"
              >
                <Image
                  src={image}
                  alt={`${selectedBlog.title} - Image ${index + 1}`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Tags */}
        {selectedBlog.tags && Array.isArray(selectedBlog.tags) && selectedBlog.tags.length > 0 && (
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={fadeIn}
            className="mb-16"
          >
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">Tags</h3>
            <div className="flex flex-wrap gap-2">
              {selectedBlog.tags.map((tag, index) => (
                <span
                  key={index}
                  className="px-4 py-2 bg-green-50 text-green-600 text-sm font-semibold rounded-full border-2 border-green-100 hover:border-green-300 transition-all cursor-default"
                >
                  {tag}
                </span>
              ))}
            </div>
          </motion.div>
        )}

        {/* Share Section */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={fadeIn}
          className="border-t border-gray-200 pt-12 pb-8 mb-16"
        >
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div>
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">Share This Article</h3>
              <p className="text-base text-gray-700">
                Share this with others who might find it helpful
              </p>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <Button
                onClick={shareOnFacebook}
                variant="outline"
                size="sm"
                className="rounded-full border-2"
                aria-label="Share on Facebook"
              >
                <Facebook className="h-4 w-4 mr-2" />
                Facebook
              </Button>
              <Button
                onClick={shareOnTwitter}
                variant="outline"
                size="sm"
                className="rounded-full border-2"
                aria-label="Share on Twitter"
              >
                <Twitter className="h-4 w-4 mr-2" />
                Twitter
              </Button>
              <Button
                onClick={shareOnLinkedIn}
                variant="outline"
                size="sm"
                className="rounded-full border-2"
                aria-label="Share on LinkedIn"
              >
                <Linkedin className="h-4 w-4 mr-2" />
                LinkedIn
              </Button>
              <Button
                onClick={copyToClipboard}
                variant="outline"
                size="sm"
                className="rounded-full border-2"
                aria-label="Copy link"
              >
                <Share2 className="h-4 w-4 mr-2" />
                Copy
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Back to Blogs */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={fadeIn}
          className="mb-20"
        >
          <Link href="/blogs">
            <Button
              variant="ghost"
              className="rounded-full hover:bg-gray-100 group"
            >
              <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" />
              Back to All Blogs
            </Button>
          </Link>
        </motion.div>
      </article>

      {/* Related Blogs Section */}
      {relatedBlogs.length > 0 && (
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          variants={fadeIn}
          className="bg-white border-t border-gray-100 py-20"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-12">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Related Articles</h2>
              <Link href="/blogs">
                <Button variant="ghost" className="rounded-full hover:bg-gray-100 group">
                  View All
                  <ChevronRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </div>

            <motion.div
              variants={staggerContainer}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {relatedBlogs.map((blog, index) => (
                <motion.article
                  key={blog._id || blog.id || index}
                  variants={scaleIn}
                  whileHover={{ y: -4 }}
                  transition={{ duration: 0.2 }}
                >
                  <Link href={getBlogLink(blog)}>
                    <div className="bg-white border-2 border-gray-100 rounded-2xl overflow-hidden hover:border-green-300 hover:shadow-xl transition-all cursor-pointer group h-full flex flex-col">
                      <div className="relative h-56 overflow-hidden bg-gray-100">
                        <Image
                          src={getBlogImage(blog)}
                          alt={blog.title || 'Blog post'}
                          fill
                          className="object-cover group-hover:scale-110 transition-transform duration-500"
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />
                      </div>
                      <div className="p-6 flex flex-col flex-1">
                        <div className="flex items-center gap-4 mb-4 text-xs text-gray-500">
                          <span className="flex items-center gap-1.5 bg-green-50 text-green-600 px-2.5 py-1 rounded-full font-semibold">
                            <Tag className="h-3 w-3" />
                            {getCategoryDisplayName(blog.category)}
                          </span>
                          <span className="flex items-center gap-1.5">
                            <Clock className="h-3 w-3" />
                            {getReadingTime(blog)}
                          </span>
                        </div>
                        <h3 className="text-lg font-bold text-gray-900 mb-3 group-hover:text-green-600 transition-colors line-clamp-2 leading-snug">
                          {blog.title || 'Untitled'}
                        </h3>
                        <p className="text-gray-600 text-sm mb-5 line-clamp-3 flex-1 leading-relaxed">
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
                            <ChevronRight className="ml-1 h-3 w-3 group-hover:translate-x-1 transition-transform" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.article>
              ))}
            </motion.div>
          </div>
        </motion.section>
      )}
    </div>
  );
}
