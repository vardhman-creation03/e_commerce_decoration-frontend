'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import {
  Plus,
  ChevronUp,
  X,
  Loader2,
  FileText,
  Calendar,
  User,
  Tag,
  Trash2
} from 'lucide-react';
import Image from 'next/image';
import AdminSidebar from '@/components/adminSidebar';
import AdminHeader from '@/components/adminHeader';
import { blogService } from '@/lib/services/blogService';

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

export default function BlogPage() {
  const { toast } = useToast();
  const [showForm, setShowForm] = useState(false);
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [editingId, setEditingId] = useState(null);

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    excerpt: '',
    content: '',
    author: '',
    category: '',
    tags: '',
    status: 'published',
    metaDescription: '',
    metaKeywords: '',
  });
  const [featuredImage, setFeaturedImage] = useState(null);
  const [images, setImages] = useState([]);

  // Fetch blogs
  const fetchBlogs = async () => {
    setLoading(true);
    try {
      const data = await blogService.getAllBlogPosts({ isAdmin: true });
      const blogList = Array.isArray(data) ? data : (data?.blogs || data?.data || []);
      setBlogs(blogList);
    } catch (error) {
      console.error('Failed to fetch blogs', error);
      toast({
        title: 'Error',
        description: 'Failed to load blogs.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  // Handle form input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle featured image
  const handleFeaturedImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: 'Error',
          description: 'Featured image must be less than 5MB',
          variant: 'destructive',
        });
        return;
      }
      setFeaturedImage(file);
    }
  };

  // Handle multiple images
  const handleImagesChange = (e) => {
    const files = Array.from(e.target.files);
    const validFiles = files.filter((file) => {
      const isValidType = ['image/jpeg', 'image/png', 'image/webp'].includes(file.type);
      const isValidSize = file.size <= 5 * 1024 * 1024;
      return isValidType && isValidSize;
    });

    setImages((prev) => [...prev, ...validFiles]);
  };

  const removeImage = (index) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const handleDeleteBlog = async (id) => {
    if (!confirm('Are you sure you want to delete this blog post?')) return;
    try {
      await blogService.deleteBlog(id);
      toast({ title: 'Success', description: 'Blog deleted successfully' });
      fetchBlogs();
    } catch (error) {
      console.error('Failed to delete blog:', error);
      toast({ title: 'Error', description: 'Failed to delete blog', variant: 'destructive' });
    }
  };


  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) return;

    setSubmitting(true);
    try {
      const formDataToSend = new FormData();
      Object.keys(formData).forEach(key => {
        formDataToSend.append(key, formData[key]);
      });

      if (featuredImage) {
        formDataToSend.append('featuredImage', featuredImage);
      }
      images.forEach((file) => {
        formDataToSend.append('images', file);
      });

      if (editingId) {
        // Update existing blog
        await blogService.updateBlog(editingId, formDataToSend);
        toast({ title: 'Success', description: 'Blog updated successfully' });
      } else {
        // Create new blog
        await blogService.createBlog(formDataToSend);
        toast({ title: 'Success', description: 'Blog created successfully' });
      }

      // Reset form
      setFormData({
        title: '',
        excerpt: '',
        content: '',
        author: '',
        category: '',
        tags: '',
        status: 'published',
        metaDescription: '',
        metaKeywords: '',
      });
      setFeaturedImage(null);
      setImages([]);
      setEditingId(null);
      setShowForm(false);
      fetchBlogs();

    } catch (error) {
      console.error('Failed to submit blog:', error);
      toast({
        title: 'Error',
        description: `Failed to ${editingId ? 'update' : 'create'} blog`,
        variant: 'destructive',
      });
    } finally {
      setSubmitting(false);
    }
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    } catch { return dateString; }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <AdminSidebar />
      <div className="flex-1 flex flex-col lg:ml-0">
        <AdminHeader />
        <main className="flex-1 p-6 overflow-y-auto">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <motion.div
              initial="hidden"
              animate="visible"
              variants={fadeIn}
              className="mb-8"
            >
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h1 className="text-3xl sm:text-4xl font-light text-gray-900 mb-2">
                    Blog Management
                  </h1>
                  <p className="text-gray-600 font-light">
                    Manage your blog posts and content
                  </p>
                </div>
                <Button
                  onClick={() => setShowForm(!showForm)}
                  className="rounded-none font-light"
                  variant={showForm ? 'outline' : 'default'}
                >
                  {showForm ? (
                    <>
                      <ChevronUp className="mr-2 h-4 w-4" />
                      Hide Form
                    </>
                  ) : (
                    <>
                      <Plus className="mr-2 h-4 w-4" />
                      Add New Blog
                    </>
                  )}
                </Button>
              </div>
            </motion.div>

            {/* Add/Edit Blog Form */}
            <AnimatePresence>
              {showForm && (
                <motion.div
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                  variants={slideUp}
                  className="mb-8"
                >
                  <Card className="border border-gray-200 rounded-none">
                    <CardHeader>
                      <CardTitle className="font-light text-xl">{editingId ? 'Edit Blog' : 'Create New Blog'}</CardTitle>
                      <CardDescription className="font-light">
                        {editingId ? 'Update the details of the blog post' : 'Fill in the details to create a new blog post'}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="md:col-span-2">
                            <label className="text-sm font-medium mb-2 block">Title</label>
                            <Input
                              name="title"
                              value={formData.title}
                              onChange={handleInputChange}
                              required
                              className="rounded-none font-light"
                            />
                          </div>
                          <div className="md:col-span-2">
                            <label className="text-sm font-medium mb-2 block">Excerpt</label>
                            <Textarea
                              name="excerpt"
                              value={formData.excerpt}
                              onChange={handleInputChange}
                              required
                              className="rounded-none font-light"
                            />
                          </div>
                          <div className="md:col-span-2">
                            <label className="text-sm font-medium mb-2 block">Content</label>
                            <Textarea
                              name="content"
                              value={formData.content}
                              onChange={handleInputChange}
                              required
                              rows={8}
                              className="rounded-none font-light"
                            />
                          </div>

                          {/* Author & Category */}
                          <div>
                            <label className="text-sm font-medium mb-2 block">Author</label>
                            <Input
                              name="author"
                              value={formData.author}
                              onChange={handleInputChange}
                              className="rounded-none font-light"
                            />
                          </div>
                          <div>
                            <label className="text-sm font-medium mb-2 block">Category</label>
                            <Input
                              name="category"
                              value={formData.category}
                              onChange={handleInputChange}
                              className="rounded-none font-light"
                              placeholder="e.g. Wedding, Birthday"
                            />
                          </div>

                          {/* Status & Tags */}
                          <div>
                            <label className="text-sm font-medium mb-2 block">Status</label>
                            <select
                              name="status"
                              value={formData.status}
                              onChange={handleInputChange}
                              className="flex h-10 w-full rounded-none border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 font-light"
                            >
                              <option value="draft">Draft</option>
                              <option value="published">Published</option>
                            </select>
                          </div>
                          <div>
                            <label className="text-sm font-medium mb-2 block">Tags (comma separated)</label>
                            <Input
                              name="tags"
                              value={formData.tags}
                              onChange={handleInputChange}
                              className="rounded-none font-light"
                              placeholder="e.g. tips, decoration"
                            />
                          </div>

                          {/* SEO Meta */}
                          <div className="md:col-span-2">
                            <label className="text-sm font-medium mb-2 block">Meta Description (SEO)</label>
                            <Input
                              name="metaDescription"
                              value={formData.metaDescription}
                              onChange={handleInputChange}
                              className="rounded-none font-light"
                              maxLength={160}
                            />
                          </div>
                          <div className="md:col-span-2">
                            <label className="text-sm font-medium mb-2 block">Meta Keywords (comma separated)</label>
                            <Input
                              name="metaKeywords"
                              value={formData.metaKeywords}
                              onChange={handleInputChange}
                              className="rounded-none font-light"
                            />
                          </div>

                          {/* Images */}
                          <div>
                            <label className="text-sm font-medium mb-2 block">Featured Image {editingId && '(Leave empty to keep current)'}</label>
                            <Input
                              type="file"
                              onChange={handleFeaturedImageChange}
                              required={!editingId}
                              accept="image/*"
                              className="rounded-none font-light"
                            />
                          </div>
                          <div>
                            <label className="text-sm font-medium mb-2 block">Additional Images (Max 10)</label>
                            <Input
                              type="file"
                              onChange={handleImagesChange}
                              multiple
                              accept="image/*"
                              className="rounded-none font-light"
                            />
                            {images.length > 0 && (
                              <div className="mt-2 flex flex-wrap gap-2">
                                {images.map((img, idx) => (
                                  <div key={idx} className="relative w-16 h-16 border border-gray-200">
                                    {/* Preview roughly */}
                                    <span className="text-xs absolute top-0 left-0 bg-white p-1">{idx + 1}</span>
                                    <button
                                      type="button"
                                      onClick={() => removeImage(idx)}
                                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 h-5 w-5 flex items-center justify-center text-xs"
                                    >
                                      &times;
                                    </button>
                                  </div>
                                ))}
                                <span className="text-xs text-gray-500 self-center">{images.length} files selected</span>
                              </div>
                            )}
                          </div>

                        </div>
                        <div className="flex gap-4">
                          <Button type="submit" disabled={submitting} className="rounded-none font-light flex-1">
                            {submitting ? (editingId ? 'Updating...' : 'Creating...') : (editingId ? 'Update Blog' : 'Create Blog')}
                          </Button>
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => {
                              setShowForm(false);
                              setEditingId(null);
                              setFormData({
                                title: '',
                                excerpt: '',
                                content: '',
                                author: '',
                                category: '',
                                tags: '',
                                status: 'published',
                                metaDescription: '',
                                metaKeywords: '',
                              });
                            }}
                            className="rounded-none font-light"
                          >
                            Cancel
                          </Button>
                        </div>
                      </form>
                    </CardContent>
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Blogs List */}
            <motion.div
              initial="hidden"
              animate="visible"
              variants={staggerContainer}
              className="space-y-4"
            >
              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
                </div>
              ) : blogs.length === 0 ? (
                <Card className="border border-gray-200 rounded-none">
                  <CardContent className="py-12 text-center">
                    <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 font-light">No blogs found</p>
                  </CardContent>
                </Card>
              ) : (
                blogs.map((blog) => (
                  <motion.div key={blog._id || blog.id} variants={slideUp}>
                    <Card className="border border-gray-200 rounded-none hover:shadow-md transition-shadow">
                      <CardContent className="p-6">
                        <div className="flex flex-col sm:flex-row gap-6">
                          {/* Featured Image */}
                          {blog.featuredImage && (
                            <div className="relative w-full sm:w-48 h-48 flex-shrink-0">
                              <Image
                                src={blog.featuredImage}
                                alt={blog.title}
                                fill
                                className="object-cover"
                                sizes="(max-width: 640px) 100vw, 192px"
                              />
                            </div>
                          )}
                          <div className="flex-1 space-y-4">
                            <div>
                              <h3 className="text-xl font-light text-gray-900 mb-2">
                                {blog.title}
                              </h3>
                              <p className="text-gray-600 font-light text-sm line-clamp-2">
                                {blog.excerpt}
                              </p>
                            </div>
                            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                              <div className="flex items-center gap-1">
                                <User className="h-4 w-4" />
                                <span className="font-light">{blog.author || 'N/A'}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Calendar className="h-4 w-4" />
                                <span className="font-light">
                                  {formatDate(blog.createdAt || blog.created_at)}
                                </span>
                              </div>
                              {blog.category && (
                                <div className="flex items-center gap-1">
                                  <Tag className="h-4 w-4" />
                                  <span className="font-light">{blog.category}</span>
                                </div>
                              )}
                              <div className="flex items-center gap-1">
                                <span className={`px-2 py-0.5 text-xs rounded-full ${blog.status === 'published' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                  {blog.status}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="mt-4 flex justify-end">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEdit(blog)}
                            className="rounded-none mr-2"
                          >
                            Edit
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleDeleteBlog(blog._id || blog.id)}
                            className="rounded-none"
                          >
                            <Trash2 className="h-4 w-4 mr-2" /> Delete
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))
              )}
            </motion.div>
          </div>
        </main>
      </div >
    </div >
  );
}