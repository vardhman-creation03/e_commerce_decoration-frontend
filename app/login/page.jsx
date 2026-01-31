'use client';

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Loader2, X, Mail, Lock, Smartphone, Sparkles } from "lucide-react";
import { useToast } from "../../hooks/use-toast";
import { useAuth } from "../../lib/context/auth-context";

export default function Login() {
  const router = useRouter();
  const { login, loginWithOTP, requestOTP } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [showOtpLogin, setShowOtpLogin] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [timer, setTimer] = useState(60);
  const timerRef = useRef(null);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    mobile: "",
    otp: "",
  });
  const [errors, setErrors] = useState({});
  const otpInputsRef = useRef([]);

  // Lock body scroll to prevent double scrollbars
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  useEffect(() => {
    if (otpSent && timer > 0) {
      timerRef.current = setTimeout(() => setTimer((t) => t - 1), 1000);
    }
    return () => clearTimeout(timerRef.current);
  }, [otpSent, timer]);

  const validateForm = () => {
    const newErrors = {};
    if (!showOtpLogin) {
      if (!formData.email) {
        newErrors.email = "Email is required";
      } else if (
        !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(formData.email)
      ) {
        newErrors.email = "Enter a valid email address";
      }
      if (!formData.password) {
        newErrors.password = "Password is required";
      } else if (formData.password.length < 6) {
        newErrors.password = "Password must be at least 6 characters";
      }
    } else {
      if (!formData.mobile) {
        newErrors.mobile = "Mobile number is required";
      } else if (!/^[6-9]\d{9}$/.test(formData.mobile)) {
        newErrors.mobile = "Enter a valid 10-digit mobile number";
      }
      if (otpSent && !formData.otp) {
        newErrors.otp = "OTP is required";
      }
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSendOtp = async () => {
    if (!formData.mobile || !/^[6-9]\d{9}$/.test(formData.mobile)) {
      setErrors((prev) => ({
        ...prev,
        mobile: "Enter a valid 10-digit mobile number",
      }));
      return;
    }
    try {
      setIsLoading(true);
      await requestOTP(formData.mobile);
      toast({
        title: "OTP Sent!",
        description: "An OTP has been sent to your registered email address.",
      });
      setOtpSent(true);
      setTimer(60);
    } catch (error) {
      const errorMessage = 
        typeof error === 'string' 
          ? error 
          : error?.message || 
            error?.response?.data?.message || 
            error?.response?.data?.error ||
            error?.response?.data?.msg ||
            "Something went wrong. Please try again.";
      
      toast({
        title: "Failed to send OTP",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOtp = async () => {
    await handleSendOtp();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      toast({
        title: "Validation Error",
        description: "Please fix the errors in the form before submitting.",
        variant: "destructive",
      });
      return;
    }
    try {
      setIsLoading(true);
      let result;
      if (!showOtpLogin) {
        result = await login({ email: formData.email, password: formData.password });
      } else if (otpSent) {
        result = await loginWithOTP({ mobile: formData.mobile, otp: formData.otp });
      }

      if (result) {
        toast({
          title: "Login Successful!",
          description: "You have been logged in.",
        });
        
        const userRole = result.user?.role || localStorage.getItem('userRole') || 'user';
        if (userRole === 'admin') {
          router.replace("/admin/dashboard");
        } else {
          router.replace("/");
        }
      }
    } catch (error) {
      const errorMessage = 
        typeof error === 'string' 
          ? error 
          : error?.message || 
            error?.response?.data?.message || 
            error?.response?.data?.error ||
            error?.response?.data?.msg ||
            "Something went wrong. Please try again.";
      
      toast({
        title: "Failed to login",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpBoxChange = (e, idx) => {
    const value = e.target.value.replace(/[^0-9]/g, "");
    if (value.length > 1) return;
    let otpArr = formData.otp.split("").slice(0, 6);
    otpArr[idx] = value;
    const otp = otpArr.join("").padEnd(6, "");
    setFormData((prev) => ({ ...prev, otp }));

    if (value && idx < 5) {
      otpInputsRef.current[idx + 1]?.focus();
    }
    if (!value && idx > 0 && e.nativeEvent.inputType === "deleteContentBackward") {
      otpInputsRef.current[idx - 1]?.focus();
    }
  };

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-green-50/50 via-white to-green-50/30 backdrop-blur-sm z-50 overflow-y-auto">
      <div className="flex min-h-full items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          className="w-full max-w-md my-8"
        >
          <Card className="border-2 border-gray-100 rounded-2xl relative shadow-xl bg-white">
            {/* Close Button */}
            <button
              onClick={() => router.push('/')}
              className="absolute right-5 top-5 rounded-full p-2 hover:bg-gray-100 transition-colors z-20 bg-white shadow-sm"
              aria-label="Close"
            >
              <X className="h-5 w-5 text-gray-600" />
            </button>
            
            <CardHeader className="border-b border-gray-100 pb-6 pt-8">
              <div className="flex justify-center mb-4">
                <div className="bg-green-100 p-3 rounded-full">
                  <Sparkles className="h-8 w-8 text-green-600" />
                </div>
              </div>
              <CardTitle className="text-3xl font-bold text-center text-gray-900">Welcome Back</CardTitle>
              <CardDescription className="text-center text-gray-600 mt-2">
                Sign in to your Vardhman Decoration account
              </CardDescription>
            </CardHeader>
            
            <CardContent className="pt-6">
              <form onSubmit={handleSubmit} className="space-y-5">
                {!showOtpLogin ? (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-gray-900 font-semibold">Email Address</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          placeholder="Enter your email"
                          autoComplete="email"
                          required
                          value={formData.email}
                          onChange={handleChange}
                          className="pl-10 rounded-xl border-2 border-gray-200 focus:border-green-500 focus:ring-green-500 h-12"
                          aria-invalid={errors.email ? "true" : "false"}
                          aria-describedby={errors.email ? "email-error" : undefined}
                        />
                      </div>
                      {errors.email && (
                        <p id="email-error" className="text-sm text-red-500 font-medium">
                          {errors.email}
                        </p>
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="password" className="text-gray-900 font-semibold">Password</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <Input
                          id="password"
                          name="password"
                          type="password"
                          placeholder="Enter your password"
                          autoComplete="current-password"
                          required
                          value={formData.password}
                          onChange={handleChange}
                          className="pl-10 rounded-xl border-2 border-gray-200 focus:border-green-500 focus:ring-green-500 h-12"
                          aria-invalid={errors.password ? "true" : "false"}
                          aria-describedby={errors.password ? "password-error" : undefined}
                        />
                      </div>
                      {errors.password && (
                        <p id="password-error" className="text-sm text-red-500 font-medium">
                          {errors.password}
                        </p>
                      )}
                    </div>
                  </>
                ) : (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="mobile" className="text-gray-900 font-semibold">Mobile Number</Label>
                      <div className="relative">
                        <Smartphone className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <Input
                          id="mobile"
                          name="mobile"
                          type="tel"
                          placeholder="Enter your mobile number"
                          autoComplete="tel"
                          required
                          value={formData.mobile}
                          onChange={handleChange}
                          className="pl-10 rounded-xl border-2 border-gray-200 focus:border-green-500 focus:ring-green-500 h-12"
                          aria-invalid={errors.mobile ? "true" : "false"}
                          aria-describedby={errors.mobile ? "mobile-error" : undefined}
                          maxLength={10}
                          disabled={otpSent}
                        />
                      </div>
                      {errors.mobile && (
                        <p id="mobile-error" className="text-sm text-red-500 font-medium">
                          {errors.mobile}
                        </p>
                      )}
                    </div>
                    
                    {!otpSent ? (
                      <Button
                        type="button"
                        className="w-full rounded-xl font-semibold bg-green-500 hover:bg-green-600 text-white h-12"
                        onClick={handleSendOtp}
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <>
                            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                            Sending OTP...
                          </>
                        ) : (
                          "Send OTP"
                        )}
                      </Button>
                    ) : (
                      <>
                        <div className="space-y-3">
                          <Label htmlFor="otp" className="text-gray-900 font-semibold">Enter OTP</Label>
                          <div className="flex gap-2 justify-center">
                            {[...Array(6)].map((_, idx) => (
                              <Input
                                key={idx}
                                id={`otp-${idx}`}
                                name={`otp-${idx}`}
                                ref={el => otpInputsRef.current[idx] = el}
                                type="text"
                                inputMode="numeric"
                                pattern="[0-9]*"
                                maxLength={1}
                                autoComplete="one-time-code"
                                className="w-12 h-12 text-center text-lg font-bold rounded-xl border-2 border-gray-200 focus:border-green-500 focus:ring-green-500"
                                value={formData.otp[idx] || ""}
                                onChange={e => handleOtpBoxChange(e, idx)}
                                onFocus={e => e.target.select()}
                                aria-label={`OTP digit ${idx + 1}`}
                              />
                            ))}
                          </div>
                          {errors.otp && (
                            <p id="otp-error" className="text-sm text-red-500 font-medium text-center">
                              {errors.otp}
                            </p>
                          )}
                        </div>
                        
                        <div className="flex items-center justify-center mt-3">
                          {timer > 0 ? (
                            <span className="text-sm text-gray-600">
                              Resend OTP in <span className="font-semibold text-green-600">{timer}s</span>
                            </span>
                          ) : (
                            <button
                              type="button"
                              className="text-green-600 underline hover:text-green-700 text-sm font-semibold"
                              onClick={handleResendOtp}
                              disabled={isLoading}
                            >
                              Resend OTP
                            </button>
                          )}
                        </div>
                        
                        <Button type="submit" className="w-full rounded-xl font-semibold bg-green-500 hover:bg-green-600 text-white h-12" disabled={isLoading}>
                          {isLoading ? (
                            <>
                              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                              Signing in...
                            </>
                          ) : (
                            "Sign In"
                          )}
                        </Button>
                      </>
                    )}
                  </>
                )}

                {!showOtpLogin && (
                  <Button type="submit" className="w-full rounded-xl font-semibold bg-green-500 hover:bg-green-600 text-white h-12" disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        Signing in...
                      </>
                    ) : (
                      "Sign In"
                    )}
                  </Button>
                )}
              </form>
              
              <div className="mt-6 text-center">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-200"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-4 bg-white text-gray-500">or</span>
                  </div>
                </div>
                
                <div className="mt-4">
                  {!showOtpLogin ? (
                    <button
                      type="button"
                      className="text-green-600 hover:text-green-700 font-semibold text-sm"
                      onClick={() => setShowOtpLogin(true)}
                    >
                      Sign in with OTP instead →
                    </button>
                  ) : (
                    <button
                      type="button"
                      className="text-green-600 hover:text-green-700 font-semibold text-sm"
                      onClick={() => {
                        setShowOtpLogin(false);
                        setOtpSent(false);
                        setFormData((prev) => ({ ...prev, otp: "" }));
                      }}
                    >
                      ← Sign in with Email & Password
                    </button>
                  )}
                </div>
              </div>
            </CardContent>
            
            <CardFooter className="flex justify-center border-t border-gray-100 pt-6 pb-6">
              <div className="text-center text-sm text-gray-600">
                Don't have an account?{" "}
                <Link
                  href="/register"
                  className="text-green-600 hover:text-green-700 font-semibold"
                >
                  Sign up
                </Link>
              </div>
            </CardFooter>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}