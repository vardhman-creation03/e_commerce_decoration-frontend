'use client';

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { MapPin, Phone, Mail, Clock, Send, CheckCircle, Instagram, Facebook, Twitter, Linkedin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useSelector, useDispatch } from "react-redux";
import { useToast } from "@/hooks/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { submitContact, clearContactMessages } from "../store/contactSlice";

const ContactPage = () => {
  const { toast } = useToast();
  const dispatch = useDispatch();

  // Redux state
  const { submitting, successMessage, error } = useSelector((state) => state.contact);

  // Local state
  const [formState, setFormState] = useState({
    customerName: "",
    customerEmail: "",
    subject: "",
    category: "",
    priority: "",
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
  };

  // Handle select dropdown changes
  const handleSelectChange = (name, value) => {
    setFormState((prev) => ({ ...prev, [name]: value }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic client-side validation
    if (!formState.customerEmail.includes("@")) {
      toast({
        title: "Error",
        description: "Please enter a valid email address",
        variant: "destructive",
      });
      return;
    }

    // Dispatch the submitContact thunk with form data
    dispatch(submitContact(formState));
  };

  // Handle success/error messages and form reset
  useEffect(() => {
    if (successMessage) {
      setIsSubmitted(true);
      toast({
        title: "Message Sent",
        description: successMessage,
        variant: "success",
      });

      // Reset form after 2 seconds
      setTimeout(() => {
        setIsSubmitted(false);
        setFormState({
          customerName: "",
          customerEmail: "",
          subject: "",
          category: "",
          priority: "",
        });
        dispatch(clearContactMessages()); // Clear success message
      }, 2000);
    }

    if (error) {
      toast({
        title: "Error",
        description: error,
        variant: "destructive",
      });
      dispatch(clearContactMessages()); // Clear error message
    }
  }, [successMessage, error, toast, dispatch]);

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
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

  const slideUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
  };

  const contactInfo = [
    {
      icon: <MapPin className="h-5 w-5" />,
      title: "Our Location",
      details: "Vardhman Decoration, Limda lane road, Jamnagar, Gujarat",
    },
    {
      icon: <Phone className="h-5 w-5" />,
      title: "Phone Number",
      details: "+91 8511950246",
    },
    {
      icon: <Mail className="h-5 w-5" />,
      title: "Email Address",
      details: "vardhmancreation03@gmail.com",
    },
    {
      icon: <Clock className="h-5 w-5" />,
      title: "Working Hours",
      details: "Mon - Fri: 9:00 AM - 8:00 PM",
    },
  ];

  const socialLinks = [
    {
      icon: <Instagram className="h-5 w-5" />,
      url: "https://www.instagram.com/vardhman_decoration25/",
      name: "Instagram",
    },
  ];

  const categories = [
    "General Inquiry",
    "Event Support",
    "Event Booking",
    "Event Cancellation",
    "Other",
  ];

  const priorities = ["Low", "Medium", "High"];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="border-b border-gray-100 bg-gradient-to-b from-green-50/30 to-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="max-w-3xl mx-auto text-center"
          >
            <motion.div variants={fadeIn} className="space-y-4">
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-light text-gray-900 leading-tight tracking-tight">
                Contact Us
              </h1>
              <p className="text-base sm:text-lg text-gray-600 font-light max-w-xl mx-auto leading-relaxed">
                Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
          {/* Contact Information */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={staggerContainer}
          >
            <motion.h2 variants={fadeIn} className="text-3xl sm:text-4xl font-light text-gray-900 mb-10 tracking-tight">
              Get In Touch
            </motion.h2>

            <div className="grid gap-8 mb-12">
              {contactInfo.map((item, index) => (
                <motion.div 
                  key={index} 
                  variants={slideUp}
                  whileHover={{ x: 4 }}
                  transition={{ duration: 0.2 }}
                  className="flex items-start space-x-4"
                >
                  <div className="bg-green-500 text-white p-3 rounded-none flex-shrink-0">{item.icon}</div>
                  <div>
                    <h3 className="font-medium text-lg text-gray-900 mb-1">{item.title}</h3>
                    <p className="text-gray-600 font-light">{item.details}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            <motion.div variants={fadeIn}>
              <h3 className="text-xl font-medium text-gray-900 mb-5">Follow Us</h3>
              <div className="flex space-x-4">
                {socialLinks.map((social, index) => (
                  <motion.a
                    key={index}
                    href={social.url}
                    whileHover={{ y: -4, scale: 1.05 }}
                    className="bg-gray-100 hover:bg-green-500 hover:text-white p-3 rounded-none transition-colors duration-300"
                    aria-label={social.name}
                  >
                    {social.icon}
                  </motion.a>
                ))}
              </div>
            </motion.div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true, margin: "-50px" }}
            className="bg-white border border-gray-200 p-6 md:p-10 relative"
          >
            <h2 className="text-2xl md:text-3xl font-light text-gray-900 mb-3 tracking-tight">Send Us a Message</h2>
            <p className="text-gray-600 font-light mb-8">
              Fill out the form below and we'll get back to you as soon as possible.
            </p>

            {isSubmitted ? (
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="flex flex-col items-center justify-center py-12 text-center"
              >
                <CheckCircle className="h-16 w-16 text-green-500 mb-4" />
                <h3 className="text-2xl font-light text-gray-900 mb-2">Thank You!</h3>
                <p className="text-gray-600 font-light">
                  Your message has been sent successfully. We'll get back to you soon.
                </p>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="customerName" className="block text-sm font-light text-gray-900 mb-2">
                      Customer Name
                    </label>
                    <Input
                      id="customerName"
                      name="customerName"
                      type="text"
                      autoComplete="name"
                      value={formState.customerName}
                      onChange={handleChange}
                      placeholder="John Doe"
                      required
                      className="w-full rounded-none border-gray-200 font-light focus:border-green-500 focus:ring-green-500"
                    />
                  </div>
                  <div>
                    <label htmlFor="customerEmail" className="block text-sm font-light text-gray-900 mb-2">
                      Customer Email
                    </label>
                    <Input
                      id="customerEmail"
                      name="customerEmail"
                      type="email"
                      autoComplete="email"
                      value={formState.customerEmail}
                      onChange={handleChange}
                      placeholder="john@example.com"
                      required
                      className="w-full rounded-none border-gray-200 font-light focus:border-green-500 focus:ring-green-500"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="subject" className="block text-sm font-light text-gray-900 mb-2">
                    Subject
                  </label>
                  <Input
                    id="subject"
                    name="subject"
                    value={formState.subject}
                    onChange={handleChange}
                    placeholder="How can we help you?"
                    required
                    className="w-full rounded-none border-gray-200 font-light focus:border-green-500 focus:ring-green-500"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="category" className="block text-sm font-light text-gray-900 mb-2">
                      Select Categories
                    </label>
                    <Select
                      onValueChange={(value) => handleSelectChange("category", value)}
                      value={formState.category}
                      required
                    >
                      <SelectTrigger className="w-full rounded-none border-gray-200 font-light focus:border-green-500 focus:ring-green-500">
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label htmlFor="priority" className="block text-sm font-light text-gray-900 mb-2">
                      Priority for the Selected Categories
                    </label>
                    <Select
                      onValueChange={(value) => handleSelectChange("priority", value)}
                      value={formState.priority}
                      required
                    >
                      <SelectTrigger className="w-full rounded-none border-gray-200 font-light focus:border-green-500 focus:ring-green-500">
                        <SelectValue placeholder="Select priority" />
                      </SelectTrigger>
                      <SelectContent>
                        {priorities.map((priority) => (
                          <SelectItem key={priority} value={priority}>
                            {priority}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
                  <Button type="submit" className="w-full rounded-none font-light bg-green-500 hover:bg-green-600 text-white" disabled={submitting}>
                    {submitting ? (
                      <span className="flex items-center">
                        <svg
                          className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Sending...
                      </span>
                    ) : (
                      <span className="flex items-center">
                        <Send className="mr-2 h-4 w-4" /> Send Message
                      </span>
                    )}
                  </Button>
                </motion.div>
              </form>
            )}
          </motion.div>
        </div>

        {/* FAQ Section */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={staggerContainer}
          className="mt-20 md:mt-32"
        >
          <motion.div variants={fadeIn} className="text-center mb-12 md:mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-light text-gray-900 mb-4 tracking-tight">Frequently Asked Questions</h2>
            <p className="text-base text-gray-600 font-light max-w-2xl mx-auto">
              Find answers to the most common questions about our products, shipping, returns, and more.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
            {[
              {
                question: "How long does shipping take?",
                answer:
                  "Standard shipping typically takes 3-5 business days within India. Express shipping options are available at checkout for faster delivery.",
              },
              {
                question: "What is your return policy?",
                answer:
                  "We offer a 30-day return policy for unused items in original condition with tags attached. Return shipping is free for exchanges or store credit.",
              },
              {
                question: "Do you ship internationally?",
                answer:
                  "Currently, we ship within India. International shipping options may be available in the future. Please contact us for more information.",
              },
              {
                question: "How can I track my order?",
                answer:
                  "Once your order ships, you'll receive a confirmation email with tracking information. You can also track your order in your account dashboard.",
              },
              {
                question: "Do you offer custom decorations?",
                answer:
                  "Yes, we offer custom decoration services. Please contact us with your requirements and we'll work with you to create the perfect decorations for your event.",
              },
              {
                question: "Are your products eco-friendly?",
                answer:
                  "Yes, we're committed to sustainability. Many of our products are made from eco-friendly materials and we continuously work to improve our environmental impact.",
              },
            ].map((faq, index) => (
              <motion.div
                key={index}
                variants={slideUp}
                whileHover={{ y: -4 }}
                transition={{ duration: 0.2 }}
                viewport={{ once: true }}
                className="bg-white p-6 md:p-8 border border-gray-200 hover:border-green-300 transition-colors"
              >
                <h3 className="text-xl font-medium text-gray-900 mb-3">{faq.question}</h3>
                <p className="text-gray-600 font-light leading-relaxed">{faq.answer}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ContactPage;