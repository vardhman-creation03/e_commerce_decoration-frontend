'use client';

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";
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
  ShoppingBag,
  Trash2,
  Calendar,
  Clock,
  MapPin,
  CreditCard,
  Loader2,
  ArrowLeft,
  Plus,
  Minus,
  Shield,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useDispatch, useSelector } from "react-redux";
import {
  getCart,
  removeFromCart,
  updateCartItem,
  clearCart,
  checkoutCart,
} from "../store/cartSlice";
import {
  createPaymentOrder,
  verifyPayment,
  handlePaymentFailure,
  resetPaymentState,
} from "../store/paymentSlice";
import { bookingService } from "@/lib/services/bookingService";

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

export default function CartPage() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { toast } = useToast();
  const { cart, loading, error } = useSelector((state) => state.cart || { cart: null, loading: false, error: null });
  const [isScriptLoaded, setIsScriptLoaded] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    dispatch(getCart());
  }, [dispatch]);

  useEffect(() => {
    const loadRazorpayScript = () => {
      return new Promise((resolve) => {
        if (window.Razorpay) {
          setIsScriptLoaded(true);
          resolve(true);
          return;
        }
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

  const handleRemoveItem = async (itemId) => {
    try {
      await dispatch(removeFromCart(itemId)).unwrap();
      toast({
        title: "Item Removed",
        description: "Item has been removed from your cart.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error || "Failed to remove item",
        variant: "destructive",
      });
    }
  };

  const handleUpdateQuantity = async (itemId, newQuantity) => {
    if (newQuantity < 1) {
      handleRemoveItem(itemId);
      return;
    }
    try {
      await dispatch(updateCartItem({ itemId, updateData: { quantity: newQuantity } })).unwrap();
    } catch (error) {
      toast({
        title: "Error",
        description: error || "Failed to update quantity",
        variant: "destructive",
      });
    }
  };

  const handleClearCart = async () => {
    try {
      await dispatch(clearCart()).unwrap();
      toast({
        title: "Cart Cleared",
        description: "All items have been removed from your cart.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error || "Failed to clear cart",
        variant: "destructive",
      });
    }
  };

  const handleCheckout = async () => {
    if (!cart || !cart.items || cart.items.length === 0) {
      toast({
        title: "Cart Empty",
        description: "Your cart is empty. Add items to proceed.",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);
    dispatch(resetPaymentState());

    try {
      // Convert cart to bookings
      const checkoutResult = await dispatch(checkoutCart('Online')).unwrap();
      
      if (!checkoutResult.bookings || checkoutResult.bookings.length === 0) {
        throw new Error('Failed to create bookings');
      }

      // Use first booking ID as order ID
      const orderId = checkoutResult.bookings[0]._id;
      const totalAmount = cart.totalAmount;

      // Create payment order
      const amountInPaise = Math.round(totalAmount * 100);
      const paymentOrderResult = await dispatch(
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

      // Store booking details for payment page
      if (typeof window !== "undefined") {
        const orderSummary = {
          subtotal: totalAmount,
          shipping: 0,
          discount: 0,
          total: totalAmount,
        };
        localStorage.setItem("OrderId", orderId);
        localStorage.setItem("orderSummary", JSON.stringify(orderSummary));
        localStorage.setItem("bookingDetails", JSON.stringify({
          eventName: cart.items[0]?.eventSnapshot?.title || "Event Booking",
          date: cart.items[0]?.bookingDate,
          time: cart.items[0]?.bookingTime,
          location: cart.items[0]?.eventLocation,
        }));
      }

      // Open Razorpay checkout
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY,
        amount: amountInPaise,
        currency: "INR",
        order_id: paymentOrderResult.razorpayOrderId || paymentOrderResult.data?.razorpayOrderId,
        name: "Vardhman Decoration",
        description: `Booking for ${cart.items.length} event(s)`,
        handler: async (response) => {
          try {
            // Verify payment
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
              description: "Your bookings have been confirmed.",
            });

            if (typeof window !== "undefined") {
              localStorage.removeItem("OrderId");
              localStorage.removeItem("orderSummary");
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
          }
        },
        prefill: {
          name: "Customer",
          email: "vardhmancreation03@gmail.com",
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
        description: error?.message || "Failed to process checkout",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  if (loading && !cart) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <Loader2 className="h-12 w-12 animate-spin text-green-500" />
      </div>
    );
  }

  if (isSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <Card className="max-w-md w-full">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <motion.div
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                className="mb-6 h-20 w-20 bg-green-100 rounded-full flex items-center justify-center"
              >
                <ShoppingBag className="h-10 w-10 text-green-600" />
              </motion.div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Booking Confirmed!</h3>
              <p className="text-gray-600 mb-8 max-w-md">
                Thank you for your payment. Your events have been successfully booked.
              </p>
              <Button asChild className="bg-green-600 hover:bg-green-700 text-white">
                <Link href="/dashboard">Go to Dashboard</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <section className="border-b border-gray-100 bg-gradient-to-b from-green-50/30 to-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeIn}
            className="max-w-3xl mx-auto"
          >
            <div className="flex items-center gap-4 mb-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => router.back()}
                className="rounded-full"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div>
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900">
                  Your Cart
                </h1>
                <p className="text-base sm:text-lg text-gray-600 mt-2">
                  Review your event bookings and proceed to payment
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        {!cart || !cart.items || cart.items.length === 0 ? (
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeIn}
            className="max-w-md mx-auto text-center py-16"
          >
            <ShoppingBag className="h-24 w-24 text-gray-300 mx-auto mb-6" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h2>
            <p className="text-gray-600 mb-8">Add events to your cart to get started.</p>
            <Button asChild className="bg-green-600 hover:bg-green-700 text-white">
              <Link href="/all-events">Browse Events</Link>
            </Button>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column: Cart Items */}
            <motion.div
              initial="hidden"
              animate="visible"
              variants={fadeIn}
              className="lg:col-span-2 space-y-4"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">
                  {cart.items.length} {cart.items.length === 1 ? 'Event' : 'Events'}
                </h2>
                {cart.items.length > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleClearCart}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Clear Cart
                  </Button>
                )}
              </div>

              <AnimatePresence>
                {cart.items.map((item, index) => (
                  <motion.div
                    key={item._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -100 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className="border border-gray-200">
                      <CardContent className="p-6">
                        <div className="flex flex-col sm:flex-row gap-6">
                          {/* Event Image */}
                          <div className="relative w-full sm:w-32 h-48 sm:h-32 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                            {item.eventSnapshot?.image ? (
                              <Image
                                src={item.eventSnapshot.image}
                                alt={item.eventSnapshot.title}
                                fill
                                className="object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-gray-400">
                                <ShoppingBag className="h-12 w-12" />
                              </div>
                            )}
                          </div>

                          {/* Event Details */}
                          <div className="flex-1 space-y-4">
                            <div>
                              <h3 className="text-lg font-bold text-gray-900 mb-2">
                                {item.eventSnapshot?.title || 'Event'}
                              </h3>
                              <div className="space-y-2 text-sm text-gray-600">
                                <div className="flex items-center gap-2">
                                  <Calendar className="h-4 w-4" />
                                  <span>
                                    {new Date(item.bookingDate).toLocaleDateString('en-IN', {
                                      year: 'numeric',
                                      month: 'long',
                                      day: 'numeric',
                                    })}
                                  </span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Clock className="h-4 w-4" />
                                  <span>{item.bookingTime}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <MapPin className="h-4 w-4" />
                                  <span>{item.eventLocation}</span>
                                </div>
                              </div>
                            </div>

                            {/* Quantity and Price */}
                            <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                              <div className="flex items-center gap-3">
                                <span className="text-sm text-gray-600">Quantity:</span>
                                <div className="flex items-center gap-2 border border-gray-200 rounded-lg">
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8"
                                    onClick={() => handleUpdateQuantity(item._id, item.quantity - 1)}
                                  >
                                    <Minus className="h-4 w-4" />
                                  </Button>
                                  <span className="w-8 text-center font-medium">{item.quantity}</span>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8"
                                    onClick={() => handleUpdateQuantity(item._id, item.quantity + 1)}
                                  >
                                    <Plus className="h-4 w-4" />
                                  </Button>
                                </div>
                              </div>
                              <div className="text-right">
                                <div className="text-sm text-gray-600">Price</div>
                                <div className="text-lg font-bold text-gray-900">
                                  ₹{(item.eventSnapshot?.price * item.quantity).toLocaleString()}
                                </div>
                              </div>
                            </div>

                            {/* Remove Button */}
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleRemoveItem(item._id)}
                              className="text-red-600 hover:text-red-700 hover:bg-red-50 w-full sm:w-auto"
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Remove
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>

            {/* Right Column: Order Summary */}
            <motion.div
              initial="hidden"
              animate="visible"
              variants={fadeIn}
              className="lg:col-span-1"
            >
              <Card className="sticky top-24 border border-gray-200">
                <CardHeader className="border-b border-gray-100 bg-gray-50/50">
                  <CardTitle className="text-lg font-bold text-gray-900">Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6 pt-6">
                  <div className="space-y-2">
                    <div className="flex justify-between text-gray-600">
                      <span className="text-sm">Subtotal</span>
                      <span className="font-medium">₹{cart.totalAmount?.toLocaleString() || 0}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between items-center text-lg font-bold text-gray-900 pt-2">
                      <span>Total</span>
                      <span>₹{cart.totalAmount?.toLocaleString() || 0}</span>
                    </div>
                  </div>

                  <div className="bg-green-50/50 border border-green-100 rounded-lg p-4 flex items-start gap-4">
                    <Shield className="h-6 w-6 text-green-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="font-medium text-gray-900 text-sm">Secure Payment</h4>
                      <p className="text-sm text-gray-500 mt-1">
                        We use Razorpay to ensure your payment information is encrypted and safe.
                      </p>
                    </div>
                  </div>

                  <Button
                    onClick={handleCheckout}
                    disabled={isProcessing || loading}
                    className="w-full bg-green-600 hover:bg-green-700 text-white py-6 text-lg font-semibold"
                  >
                    {isProcessing ? (
                      <span className="flex items-center gap-2">
                        <Loader2 className="h-5 w-5 animate-spin" />
                        Processing...
                      </span>
                    ) : (
                      <>
                        <CreditCard className="h-5 w-5 mr-2" />
                        Pay ₹{cart.totalAmount?.toLocaleString() || 0}
                      </>
                    )}
                  </Button>

                  <Button
                    variant="outline"
                    asChild
                    className="w-full"
                  >
                    <Link href="/all-events">Continue Shopping</Link>
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
}
