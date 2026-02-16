'use client';

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Check,
  CreditCard,
  Loader2,
  Shield,
  X,
  Calendar,
  Clock,
  MapPin
} from "lucide-react";
import { useToast } from "../../hooks/use-toast";
import {
  createPaymentOrder,
  verifyPayment,
  handlePaymentFailure,
  resetPaymentState,
} from "../store/paymentSlice";
import { cancelOrder } from "../store/createOrderSlice";
import { useDispatch } from "react-redux";

// Base fade-in animation for the page
const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

// Stagger container for order summary items
const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
    },
  },
};

// Animation for the confetti particles
const confettiVariants = {
  hidden: { opacity: 0, scale: 0 },
  visible: (i) => ({
    opacity: 1,
    scale: 1,
    x: Math.cos(i) * (50 + Math.random() * 100), // Spread horizontally
    y: Math.sin(i) * (50 + Math.random() * 100), // Spread vertically
    transition: {
      duration: 0.8,
      ease: "easeOut",
      opacity: { duration: 0.2 },
    },
  }),
  exit: { opacity: 0, transition: { duration: 0.3 } },
};

// Animation for the checkmark
const checkmarkVariants = {
  hidden: { scale: 0, opacity: 0 },
  visible: {
    scale: 1,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 200,
      damping: 10,
      duration: 0.5,
    },
  },
};

// Glow effect
const glowVariants = {
  hidden: { boxShadow: "0 0 0 rgba(34, 197, 94, 0)" },
  visible: {
    boxShadow: "0 0 20px rgba(34, 197, 94, 0.5)",
    transition: {
      duration: 1,
      repeat: 2,
      repeatType: "reverse",
    },
  },
};

// Fade-in animation
const textVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      delay: 0.3,
    },
  },
};

// Slide-in animation for the buttons
const buttonVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      delay: 0.5 + i * 0.2, // Stagger the buttons
    },
  }),
};

export default function PaymentPage() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { toast } = useToast();

  const [isLoading, setIsLoading] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isScriptLoaded, setIsScriptLoaded] = useState(false);
  const [isMounted, setIsMounted] = useState(false); 
  const [orderId, setOrderId] = useState(null); 
  const [userMobile, setUserMobile] = useState(null);
  
  // Specific for event booking flow
  const [bookingDetails, setBookingDetails] = useState(null);

  const [orderSummary, setOrderSummary] = useState({
    subtotal: 0,
    shipping: 0,
    discount: 0,
    total: 0,
  });

  const orderNumber = "ORD-" + Math.floor(10000 + Math.random() * 90000);

  // Ensure localStorage is only accessed after client mount
  useEffect(() => {
    setIsMounted(true);
    if (typeof window !== "undefined") {
      const storedOrderSummary = localStorage.getItem("orderSummary");
      const storedOrderId = localStorage.getItem("OrderId");
      const storedUserMobile = localStorage.getItem("userMobile");
      const storedBookingDetails = localStorage.getItem("bookingDetails");

      if (storedOrderSummary) {
        setOrderSummary(JSON.parse(storedOrderSummary));
      } else {
        toast({
            title: "Session Expired",
            description: "No pending payment found. Redirecting...",
            variant: "destructive",
        });
        router.push("/all-events");
        return;
      }

      if (storedOrderId) {
        setOrderId(storedOrderId);
      } else {
         router.push("/all-events");
         return;
      }

      if (storedUserMobile) {
        setUserMobile(storedUserMobile);
      }

      if (storedBookingDetails) {
        try {
            setBookingDetails(JSON.parse(storedBookingDetails));
        } catch(e) {
            console.error("Failed to parse booking details");
        }
      }
    }
  }, [router, toast]);

//   We no longer auto-fetch cart here if we are doing direct booking.
//   Dependencies updated to remove viewCart dispatch.

  useEffect(() => {
    const loadRazorpayScript = () => {
      return new Promise((resolve) => {
        const script = document.createElement("script");
        script.src = "https://checkout.razorpay.com/v1/checkout.js";
        script.onload = () => {
          setIsScriptLoaded(true);
          resolve(true);
        };
        script.onerror = () => {
          toast({
            title: "Error",
            description: "Failed to load payment system. Please refresh the page.",
            variant: "destructive",
          });
          resolve(false);
        };
        document.body.appendChild(script);
      });
    };

    loadRazorpayScript();
  }, [toast]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setIsProcessing(true);

    try {
      dispatch(resetPaymentState());

      if (!orderId) {
        toast({
          title: "Error",
          description: "Order ID not found. Please try again.",
          variant: "destructive",
        });
        return;
      }

      // No authentication required - all payments are public

      const amountInPaise = Math.round(orderSummary.total * 100);

      // 1. Create payment order via API
      const result = await dispatch(
        createPaymentOrder({
          orderId,
          amount: amountInPaise,
        })
      ).unwrap();

      if (!isScriptLoaded) {
        toast({
          title: "Error",
          description: "Payment system not loaded. Please refresh the page.",
          variant: "destructive",
        });
        return;
      }

      // 2. Open Razorpay checkout
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY,
        amount: amountInPaise,
        currency: "INR",
        order_id: result.razorpayOrderId || result.data?.razorpayOrderId,
        name: "Vardhman Decoration",
        description: `Booking #${orderId.slice(-6).toUpperCase()}`,
        handler: async (response) => {
          try {
            // 3. Verify payment
            await dispatch(
              verifyPayment({
                orderId,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_signature: response.razorpay_signature,
              })
            ).unwrap();

            setIsSuccess(true);
            toast({
              title: "Payment Successful!",
              description: `Your booking has been confirmed.`,
            });
            if (typeof window !== "undefined") {
              localStorage.removeItem("orderSummary");
              localStorage.removeItem("OrderId");
              localStorage.removeItem("userMobile");
              localStorage.removeItem("bookingDetails");
            }
            setTimeout(() => {
              router.push("/dashboard");
            }, 2000);
          } catch (error) {
            toast({
              title: "Payment Verification Failed",
              description: error?.message || "Please try again.",
              variant: "destructive",
            });
            await dispatch(
              handlePaymentFailure({
                orderId,
                error: error.toString(),
              })
            ).unwrap();
            // Don't clear storage on failure so they can retry
          }
        },
        prefill: {
          name: "Customer",
          email: "vardhmancreation03@gmail.com",
          contact: userMobile,
        },
        notes: {
          orderId: orderId,
        },
        theme: {
          color: "#22c55e",
        },
        modal: {
          ondismiss: async () => {
             toast({
              title: "Payment Cancelled",
              description: "You cancelled the payment process.",
            });
          },
        },
      };

      const razorpay = new window.Razorpay(options);

      razorpay.on("payment.failed", async (response) => {
        const error = response.error.description || "Payment failed";
         toast({
          title: "Payment Failed",
          description: `${error}`,
          variant: "destructive",
        });
      });

      razorpay.open();
    } catch (error) {
      toast({
        title: "Error",
        description: error?.message || "Failed to process payment",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
      setIsProcessing(false);
    }
  };

  const handleCancelOrder = async () => {
    // Logic to cancel order if needed, or just redirect back
    // No authentication required - all operations are public

    try {
        if(orderId) {
             await dispatch(cancelOrder({ orderId })).unwrap();
        }
    } catch(e) {
        // ignore
    }

    if (typeof window !== "undefined") {
        localStorage.removeItem("orderSummary");
        localStorage.removeItem("OrderId");
        localStorage.removeItem("userMobile");
        localStorage.removeItem("bookingDetails");
    }
    router.push("/all-events");
  };

  if (!isMounted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
          <Loader2 className="h-12 w-12 animate-spin text-green-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="border-b border-gray-100 bg-gradient-to-b from-green-50/30 to-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="max-w-3xl mx-auto text-center"
          >
            <motion.div variants={fadeIn} className="space-y-4">
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-light text-gray-900 leading-tight tracking-tight">
                Complete Your Booking
              </h1>
              <p className="text-base sm:text-lg text-gray-600 font-light max-w-xl mx-auto leading-relaxed">
                Securely pay to confirm your event decoration.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Left Column: Payment Method */}
            <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="lg:col-span-2"
            >
            {!isSuccess ? (
                <Card className="border border-gray-200 rounded-none shadow-sm">
                <CardHeader className="border-b border-gray-100 bg-gray-50/50">
                    <CardTitle className="flex items-center text-lg font-light text-gray-900">
                    <CreditCard className="mr-2 h-5 w-5 text-green-600" />
                    Payment Method
                    </CardTitle>
                    <CardDescription className="font-light text-gray-600">
                    Secure transaction via Razorpay
                    </CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                    {isProcessing ? (
                    <div className="flex flex-col items-center justify-center py-12">
                        <Loader2 className="h-12 w-12 animate-spin text-green-500 mb-4" />
                        <h3 className="text-lg font-medium mb-2">Processing Payment...</h3>
                        <p className="text-gray-500 text-center max-w-sm text-sm">
                        Please do not close this window. We are verifying your transaction.
                        </p>
                    </div>
                    ) : (
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="bg-green-50/50 border border-green-100 rounded-lg p-4 flex items-start gap-4">
                            <Shield className="h-6 w-6 text-green-600 mt-0.5" />
                            <div>
                                <h4 className="font-medium text-gray-900 text-sm">100% Secure Payment</h4>
                                <p className="text-sm text-gray-500 mt-1">
                                    We use Razorpay to ensure your payment information is encrypted and safe.
                                </p>
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4 pt-4">
                            <Button
                            type="submit"
                            disabled={isLoading}
                            className="flex-1 bg-green-600 hover:bg-green-700 text-white rounded-none py-6 text-lg font-light shadow-md transition-all"
                            >
                            {isLoading ? (
                                <span className="flex items-center gap-2">
                                <Loader2 className="h-4 w-4 animate-spin" /> Processing...
                                </span>
                            ) : (
                                `Pay ₹${orderSummary.total.toLocaleString()}`
                            )}
                            </Button>
                            
                            <Button
                            type="button"
                            variant="outline"
                            disabled={isLoading}
                            onClick={handleCancelOrder}
                            className="sm:w-auto rounded-none py-6 text-gray-600 hover:text-red-500 hover:border-red-200"
                            >
                                Cancel
                            </Button>
                        </div>
                    </form>
                    )}
                </CardContent>
                </Card>
            ) : (
                <Card className="border border-gray-200 rounded-none shadow-sm h-full flex items-center justify-center">
                <CardContent className="pt-6 relative overflow-hidden w-full">
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="mb-6 h-20 w-20 bg-green-100 rounded-full flex items-center justify-center"
                    >
                        <Check className="h-10 w-10 text-green-600" />
                    </motion.div>

                    <h3 className="text-2xl font-bold text-gray-900 mb-2">Booking Confirmed!</h3>
                    <p className="text-gray-600 mb-8 max-w-md">
                        Thank you for your payment. Your event has been successfully booked.
                    </p>

                    <Button asChild className="rounded-none bg-green-600 hover:bg-green-700 text-white min-w-[200px]">
                        <Link href="/dashboard">Go to Dashboard</Link>
                    </Button>
                    </div>
                </CardContent>
                </Card>
            )}
            </motion.div>

            {/* Right Column: Order Summary */}
            <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeIn}
            className="lg:col-span-1"
            >
            <Card className="sticky top-24 border border-gray-200 rounded-none shadow-sm">
                <CardHeader className="border-b border-gray-100 bg-gray-50/50">
                    <CardTitle className="text-lg font-light text-gray-900">Booking Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6 pt-6">
                    
                    {bookingDetails ? (
                        <div className="space-y-4">
                             <div>
                                <h4 className="text-sm text-gray-500 uppercase tracking-wider font-semibold mb-1">Event</h4>
                                <p className="text-gray-900 font-medium text-lg leading-tight">{bookingDetails.eventName}</p>
                            </div>

                            <Separator />

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <div className="flex items-center gap-1.5 text-gray-500 mb-1">
                                        <Calendar className="w-3.5 h-3.5" />
                                        <span className="text-xs uppercase tracking-wider font-semibold">Date</span>
                                    </div>
                                    <p className="text-gray-900 font-medium text-sm">
                                        {new Date(bookingDetails.date).toLocaleDateString(undefined, {
                                            year: 'numeric',
                                            month: 'short',
                                            day: 'numeric'
                                        })}
                                    </p>
                                </div>
                                <div>
                                    <div className="flex items-center gap-1.5 text-gray-500 mb-1">
                                        <Clock className="w-3.5 h-3.5" />
                                        <span className="text-xs uppercase tracking-wider font-semibold">Time</span>
                                    </div>
                                    <p className="text-gray-900 font-medium text-sm capitalize">{bookingDetails.time}</p>
                                </div>
                            </div>
                            
                            <div>
                                <div className="flex items-center gap-1.5 text-gray-500 mb-1">
                                    <MapPin className="w-3.5 h-3.5" />
                                    <span className="text-xs uppercase tracking-wider font-semibold">City</span>
                                </div>
                                <p className="text-gray-900 font-medium text-sm text-wrap">{bookingDetails.location}</p>
                            </div>
                        </div>
                    ) : (
                        <div className="text-sm text-gray-500 italic">No specific booking details found.</div>
                    )}

                    <Separator />

                    <div className="space-y-2">
                        <div className="flex justify-between text-gray-600">
                            <span className="text-sm">Service Cost</span>
                            <span className="font-medium">₹{orderSummary.subtotal.toLocaleString()}</span>
                        </div>
                        {orderSummary.discount > 0 && (
                            <div className="flex justify-between text-green-600">
                                <span className="text-sm">Discount</span>
                                <span className="font-medium">- ₹{orderSummary.discount.toLocaleString()}</span>
                            </div>
                        )}
                        <Separator />
                        <div className="flex justify-between items-center text-lg font-bold text-gray-900 pt-2">
                            <span>Total</span>
                            <span>₹{orderSummary.total.toLocaleString()}</span>
                        </div>
                    </div>

                </CardContent>
            </Card>
            </motion.div>
        </div>
      </div>
    </div>
  );
}