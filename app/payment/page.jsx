'use client';

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
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
} from "lucide-react";
import { useToast } from "../../hooks/use-toast";
import { viewCart } from "../store/cartSlice";
import {
  createPaymentOrder,
  verifyPayment,
  handlePaymentFailure,
  resetPaymentState,
} from "../store/paymentSlice";
import { cancelOrder } from "../store/createOrderSlice";
import { useDispatch, useSelector } from "react-redux";

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

const slideUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
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

// Animation for the checkmark (scale and bounce with glow)
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

// Glow effect for the checkmark container
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

// Fade-in animation for the success message and description
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

const EMPTY_ARRAY = [];

export default function PaymentPage() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { toast } = useToast();

  // Split useSelector calls for cart state
  const products = useSelector((state) => state.cart.products ?? EMPTY_ARRAY);
  const loading = useSelector((state) => state.cart.loading);
  const error = useSelector((state) => state.cart.error);

  const [isLoading, setIsLoading] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isScriptLoaded, setIsScriptLoaded] = useState(false);
  const [isMounted, setIsMounted] = useState(false); // Track client-side mounting
  const [orderId, setOrderId] = useState(null); // Store OrderId from localStorage
  const [userMobile, setUserMobile] = useState(null); // Store userMobile from localStorage

  const [orderSummary, setOrderSummary] = useState({
    subtotal: 0,
    shipping: 0,
    discount: 0,
    total: 0,
  });

  const orderNumber = "ORD-" + Math.floor(10000 + Math.random() * 90000);

  // Ensure localStorage is only accessed after the component mounts on the client
  useEffect(() => {
    setIsMounted(true);
    if (typeof window !== "undefined") {
      const storedOrderSummary = localStorage.getItem("orderSummary");
      const storedOrderId = localStorage.getItem("OrderId");
      const storedUserMobile = localStorage.getItem("userMobile");

      if (storedOrderSummary) {
        setOrderSummary(JSON.parse(storedOrderSummary));
      } else {
        toast({
          title: "Error",
          description: "Order summary not found. Please return to checkout.",
          variant: "destructive",
        });
        router.push("/checkout");
      }

      if (storedOrderId) {
        setOrderId(storedOrderId);
      } else {
        toast({
          title: "Error",
          description: "Order ID not found. Please return to checkout.",
          variant: "destructive",
        });
        router.push("/checkout");
      }

      if (storedUserMobile) {
        setUserMobile(storedUserMobile);
      }
    }
  }, [router, toast]);

  useEffect(() => {
    const fetchCart = async () => {
      try {
        await dispatch(viewCart()).unwrap();
      } catch (error) {
        toast({
          title: "Error",
          description: error?.message || "Failed to load cart",
          variant: "destructive",
        });
        router.push("/cart");
      }
    };

    fetchCart();
  }, [dispatch, toast, router]); // Dependencies for cart fetching

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

      const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
      if (!token) {
        toast({
          title: "Error",
          description: "Authentication token not found. Please log in and try again.",
          variant: "destructive",
        });
        console.error("Payment failed: No token found");
        setTimeout(() => router.push("/login"), 1500);
        return;
      }

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
        description: `Order #${orderNumber}`,
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
              description: `Your order #${orderNumber} has been placed.`,
            });
            if (typeof window !== "undefined") {
              localStorage.removeItem("orderSummary");
              localStorage.removeItem("OrderId");
              localStorage.removeItem("userMobile");
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
            if (typeof window !== "undefined") {
              localStorage.removeItem("orderSummary");
              localStorage.removeItem("OrderId");
              localStorage.removeItem("userMobile");
            }
            setTimeout(() => {
              router.push("/");
            }, 2000);
          }
        },
        prefill: {
          name: "Jemi",
          email: "vardhmancreation03@gmail.com",
          contact: userMobile,
        },
        notes: {
          orderId: orderId,
        },
        theme: {
          color: "#000000",
        },
        modal: {
          ondismiss: async () => {
            await dispatch(
              handlePaymentFailure({
                orderId,
                error: "Payment cancelled by user",
              })
            ).unwrap();
            toast({
              title: "Payment Cancelled",
              description: "Your payment was cancelled. Redirecting to home.",
              variant: "destructive",
            });
            if (typeof window !== "undefined") {
              localStorage.removeItem("orderSummary");
              localStorage.removeItem("OrderId");
              localStorage.removeItem("userMobile");
            }
            setTimeout(() => {
              router.push("/");
            }, 2000);
          },
        },
      };

      const razorpay = new window.Razorpay(options);

      razorpay.on("payment.failed", async (response) => {
        const error = response.error.description || "Payment failed";
        await dispatch(
          handlePaymentFailure({ orderId, error })
        ).unwrap();
        toast({
          title: "Payment Failed",
          description: `${error}. Redirecting to home.`,
          variant: "destructive",
        });
        if (typeof window !== "undefined") {
          localStorage.removeItem("orderSummary");
          localStorage.removeItem("OrderId");
          localStorage.removeItem("userMobile");
        }
        setTimeout(() => {
          router.push("/");
        }, 2000);
      });

      razorpay.open();
    } catch (error) {
      toast({
        title: "Error",
        description: error?.message || "Failed to process payment",
        variant: "destructive",
      });
      if (typeof window !== "undefined") {
        localStorage.removeItem("orderSummary");
        localStorage.removeItem("OrderId");
        localStorage.removeItem("userMobile");
      }
      setTimeout(() => {
        router.push("/");
      }, 2000);
    } finally {
      setIsLoading(false);
      setIsProcessing(false);
    }
  };

  const handleCancelOrder = async () => {
    if (!orderId) {
      toast({
        title: "Error",
        description: "Order ID not found. Please try again.",
        variant: "destructive",
      });
      setTimeout(() => router.push("/checkout"), 1500);
      return;
    }

    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    if (!token) {
      toast({
        title: "Error",
        description: "Authentication token not found. Please log in and try again.",
        variant: "destructive",
      });
      setTimeout(() => router.push("/login"), 1500);
      return;
    }

    setIsLoading(true);

    try {
      const result = await dispatch(cancelOrder({ orderId })).unwrap();
      toast({
        title: "Order Cancelled",
        description: `Your order #${orderNumber} has been cancelled successfully.`,
        variant: "default",
      });

      if (typeof window !== "undefined") {
        localStorage.removeItem("orderSummary");
        localStorage.removeItem("OrderId");
        localStorage.removeItem("userMobile");
      }

      setTimeout(() => {
        router.push("/cart");
      }, 1500);
    } catch (error) {
      let errorMessage = "Failed to cancel the order. Please try again or contact support.";
      if (error?.message?.includes("token")) {
        errorMessage = "Authentication failed. Please log in again.";
        setTimeout(() => router.push("/login"), 1500);
      } else if (error?.message?.includes("not found")) {
        errorMessage = "Order not found. Please check your order details.";
      }
      toast({
        title: "Cancellation Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!isMounted) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center min-h-[400px]">
          <Loader2 className="h-12 w-12 animate-spin text-green-500" />
        </div>
      </div>
    );
  }

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
                Payment
              </h1>
              <p className="text-base sm:text-lg text-gray-600 font-light max-w-xl mx-auto leading-relaxed">
                Complete your purchase by providing your payment details.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="lg:col-span-2"
        >
          {!isSuccess ? (
            <Card className="border border-gray-200 rounded-none">
              <CardHeader className="border-b border-gray-100">
                <CardTitle className="flex items-center text-xl font-light text-gray-900">
                  <CreditCard className="mr-2 h-5 w-5" />
                  Payment Details
                </CardTitle>
                <CardDescription className="font-light text-gray-600">
                  Proceed with secure payment via Razorpay
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isProcessing ? (
                  <div className="flex flex-col items-center justify-center py-12">
                    <Loader2 className="h-12 w-12 animate-spin text-green-500 mb-4" />
                    <h3 className="text-lg font-medium mb-2">
                      Processing your payment
                    </h3>
                    <p className="text-gray-500 text-center max-w-md">
                      Please wait while we process your payment. This may take a
                      few moments. Do not refresh or close this page.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-4">
                      <div className="rounded-lg bg-gray-50 p-4 mt-4">
                        <div className="flex items-center gap-2">
                          <Shield className="h-5 w-5 text-green-600" />
                          <span className="font-medium">Secure Payment</span>
                        </div>
                        <p className="mt-1 text-sm text-gray-500">
                          You will be redirected to Razorpay's secure payment
                          gateway to complete your purchase.
                        </p>
                      </div>

                      <div className="flex flex-col sm:flex-row gap-4">
                        <Button
                          type="submit"
                          className="w-full sm:w-auto rounded-none font-light bg-green-500 hover:bg-green-600 text-white"
                          disabled={isLoading}
                          aria-label={isLoading ? "Processing payment" : `Pay with Razorpay (₹${orderSummary.total.toFixed(2)})`}
                        >
                          {isLoading ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Processing...
                            </>
                          ) : (
                            `Pay with Razorpay (₹${orderSummary.total.toFixed(2)})`
                          )}
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          className="w-full sm:w-auto rounded-none font-light"
                          disabled={isLoading}
                          onClick={handleCancelOrder}
                          aria-label="Cancel order"
                        >
                          {isLoading ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Cancelling...
                            </>
                          ) : (
                            <>
                              <X className="mr-2 h-4 w-4" />
                              Cancel Order
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                  </form>
                )}
              </CardContent>
            </Card>
          ) : (
            <Card className="border border-gray-200 rounded-none">
              <CardContent className="pt-6 relative overflow-hidden">
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="absolute inset-0 pointer-events-none">
                    <AnimatePresence>
                      {isSuccess &&
                        Array.from({ length: 20 }).map((_, i) => (
                          <motion.div
                            key={i}
                            className="absolute w-3 h-3 rounded-full"
                            style={{
                              backgroundColor: `hsl(${Math.random() * 360}, 70%, 60%)`,
                              top: "50%",
                              left: "50%",
                            }}
                            variants={confettiVariants}
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                            custom={i * (Math.PI / 10)}
                          />
                        ))}
                    </AnimatePresence>
                  </div>

                  <motion.div
                    className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100"
                    variants={glowVariants}
                    initial="hidden"
                    animate="visible"
                  >
                    <motion.div variants={checkmarkVariants} initial="hidden" animate="visible">
                      <Check className="h-8 w-8 text-green-600" />
                    </motion.div>
                  </motion.div>

                  <motion.h3
                    className="text-2xl font-bold mb-2"
                    variants={textVariants}
                    initial="hidden"
                    animate="visible"
                  >
                    Payment Successful!
                  </motion.h3>
                  <motion.p
                    className="text-gray-500 mb-6 max-w-md"
                    variants={textVariants}
                    initial="hidden"
                    animate="visible"
                  >
                    Your order #{orderNumber} has been placed successfully. You
                    will receive a confirmation email shortly.
                  </motion.p>

                  <motion.div
                    className="flex flex-col sm:flex-row gap-4"
                    initial="hidden"
                    animate="visible"
                  >
                    <motion.div custom={0} variants={buttonVariants}>
                      <Button asChild variant="outline" className="rounded-none font-light" aria-label="View order">
                        <Link href="/order-history">View Order</Link>
                      </Button>
                    </motion.div>
                    <motion.div custom={1} variants={buttonVariants}>
                      <Button asChild className="rounded-none font-light bg-green-500 hover:bg-green-600 text-white" aria-label="Go to dashboard">
                        <Link href="/dashboard">Go to Dashboard</Link>
                      </Button>
                    </motion.div>
                  </motion.div>
                </div>
              </CardContent>
            </Card>
          )}
        </motion.div>

        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeIn}
          className="lg:col-span-1"
        >
          <Card className="sticky top-20 border border-gray-200 rounded-none">
            <CardHeader className="border-b border-gray-100">
              <CardTitle className="text-xl font-light text-gray-900">Order Summary</CardTitle>
              <CardDescription className="font-light text-gray-600">
                {orderId ? `Order #${orderId}` : "Loading order..."}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {loading ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin" />
                </div>
              ) : error ? (
                <div className="text-center py-8">
                  <p className="text-red-500">{error}</p>
                  <Button onClick={() => router.push("/cart")} className="mt-4 rounded-none font-light bg-green-500 hover:bg-green-600 text-white" aria-label="Return to cart">
                    Return to Cart
                  </Button>
                </div>
              ) : (
                <>
                  <div className="max-h-80 overflow-auto space-y-4 pr-2">
                    {products?.map((item, index) => {
                      const imageSrc = item.product.images?.[0] || "/placeholder.svg?height=64&width=64";
                      return (
                        <div key={`${item.product._id}-${item.size}`} className="flex gap-4 items-center">
                          <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-md border">
                            <Image
                              src={imageSrc}
                              alt={item.product.productName || "Product image"}
                              fill
                              sizes="64px"
                              className="object-contain"
                              placeholder="blur"
                              blurDataURL="/placeholder.svg"
                              priority={index < 4}
                              onError={(e) => {
                                console.error(`Failed to load image for "${item.product.productName}": ${imageSrc}`);
                                e.target.src = "/placeholder.svg?height=64&width=64";
                              }}
                            />
                          </div>
                          <div className="flex flex-1 flex-col">
                            <div className="flex justify-between text-sm font-medium">
                              <h3 className="text-gray-900">
                                {item.product.productName}
                              </h3>
                              <p className="text-gray-900">₹{(item.subtotal || 0).toFixed(2)}</p>
                            </div>
                            <div className="flex items-end justify-between text-xs">
                              <p className="text-gray-500">Size: {item.size}</p>
                              <p className="text-gray-500">
                                Qty: {item.quantity}
                              </p>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <Separator />

                  <div className="space-y-1.5">
                    <div className="flex justify-between">
                      <span className="text-sm">Subtotal</span>
                      <span>₹{(orderSummary.subtotal || 0).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Shipping</span>
                      <span>{orderSummary.shipping === 0 ? "Free" : `₹${(orderSummary.shipping || 0).toFixed(2)}`}</span>
                    </div>
                    {orderSummary.discount > 0 && (
                      <div className="flex justify-between text-green-600">
                        <span className="text-sm">Discount</span>
                        <span>-₹{(orderSummary.discount || 0).toFixed(2)}</span>
                      </div>
                    )}
                  </div>
                  <Separator />
                  <div className="flex justify-between font-medium text-base">
                    <span>Total</span>
                    <span>₹{(orderSummary.total || 0).toFixed(2)}</span>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
      </div>
    </div>
  );
}