'use client';

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
import { Loader2, CheckCircle, Eye, EyeOff, X, User, Mail, Smartphone, Lock, Sparkles } from "lucide-react";
import { useToast } from "../../hooks/use-toast";
import { useAuth } from "../../lib/context/auth-context";

export default function Register() {
  const router = useRouter();
  const { register } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    mobile: "",
    password: "",
  });
  const [isRegistered, setIsRegistered] = useState(false);
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);

  // Lock body scroll to prevent double scrollbars
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.fullName || formData.fullName.trim().length < 2) {
      newErrors.fullName = "Full Name must be at least 2 characters long";
    } else if (!/^[A-Za-z\s]+$/.test(formData.fullName.trim())) {
      newErrors.fullName = "Full Name can only contain letters and spaces";
    }

    if (!formData.email) {
      newErrors.email = "Email Address is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!formData.mobile) {
      newErrors.mobile = "Mobile Number is required";
    } else if (!/^\d{10}$/.test(formData.mobile)) {
      newErrors.mobile = "Mobile Number must be a valid 10-digit number";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
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
      const result = await register(formData);

      if (result) {
        toast({
          title: "Registration Successful!",
          description: "You can now login with your credentials.",
        });
        setIsRegistered(true);
        setTimeout(() => {
          router.replace("/login");
        }, 2000);
      } else {
        throw new Error("Registration failed. Please try again.");
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
        title: "Registration Failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
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
              <CardTitle className="text-3xl font-bold text-center text-gray-900">
                Create an Account
              </CardTitle>
              <CardDescription className="text-center text-gray-600 mt-2">
                Sign up to book amazing event decorations
              </CardDescription>
            </CardHeader>
            
            <CardContent className="pt-6">
              <AnimatePresence>
                {isRegistered ? (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5 }}
                    className="flex flex-col items-center justify-center space-y-4 py-8"
                  >
                    <motion.div
                      animate={{ scale: [1, 1.2, 1], rotate: [0, 360] }}
                      transition={{ duration: 1, repeat: 1 }}
                    >
                      <CheckCircle className="h-20 w-20 text-green-500" />
                    </motion.div>
                    <p className="text-xl font-bold text-green-600" role="alert" aria-live="assertive">
                      Account Created Successfully!
                    </p>
                    <p className="text-sm text-gray-600">
                      Redirecting to login...
                    </p>
                  </motion.div>
                ) : (
                  <motion.form
                    key="form"
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    onSubmit={handleSubmit}
                    className="space-y-5"
                  >
                    <div className="space-y-2">
                      <Label htmlFor="fullName" className="text-gray-900 font-semibold">Full Name</Label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <Input
                          id="fullName"
                          name="fullName"
                          type="text"
                          placeholder="Enter your full name"
                          autoComplete="name"
                          required
                          value={formData.fullName}
                          onChange={handleChange}
                          className="pl-10 rounded-xl border-2 border-gray-200 focus:border-green-500 focus:ring-green-500 h-12"
                          aria-invalid={errors.fullName ? "true" : "false"}
                          aria-describedby={errors.fullName ? "fullName-error" : undefined}
                        />
                      </div>
                      {errors.fullName && (
                        <p id="fullName-error" className="text-sm text-red-500 font-medium">
                          {errors.fullName}
                        </p>
                      )}
                    </div>
                    
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
                        />
                      </div>
                      {errors.mobile && (
                        <p id="mobile-error" className="text-sm text-red-500 font-medium">
                          {errors.mobile}
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
                          type={showPassword ? "text" : "password"}
                          placeholder="Create a password"
                          autoComplete="new-password"
                          required
                          value={formData.password}
                          onChange={handleChange}
                          className="pl-10 pr-10 rounded-xl border-2 border-gray-200 focus:border-green-500 focus:ring-green-500 h-12"
                          aria-invalid={errors.password ? "true" : "false"}
                          aria-describedby={errors.password ? "password-error" : undefined}
                        />
                        <button
                          type="button"
                          tabIndex={-1}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                          onClick={() => setShowPassword((prev) => !prev)}
                          aria-label={showPassword ? "Hide password" : "Show password"}
                        >
                          {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                      </div>
                      {errors.password && (
                        <p id="password-error" className="text-sm text-red-500 font-medium">
                          {errors.password}
                        </p>
                      )}
                    </div>
                    
                    <Button type="submit" className="w-full rounded-xl font-semibold bg-green-500 hover:bg-green-600 text-white h-12 mt-6" disabled={isLoading}>
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                          Creating account...
                        </>
                      ) : (
                        "Create Account"
                      )}
                    </Button>
                  </motion.form>
                )}
              </AnimatePresence>
            </CardContent>
            
            {!isRegistered && (
              <CardFooter className="flex flex-col space-y-4 border-t border-gray-100 pt-6 pb-6">
                <div className="text-center text-xs text-gray-600">
                  By creating an account, you agree to our{" "}
                  <Link
                    href="/termsandcondition"
                    className="text-green-600 hover:text-green-700 font-semibold"
                  >
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link
                    href="/privacy-policy"
                    className="text-green-600 hover:text-green-700 font-semibold"
                  >
                    Privacy Policy
                  </Link>
                </div>
                <div className="text-center text-sm text-gray-600">
                  Already have an account?{" "}
                  <Link
                    href="/login"
                    className="text-green-600 hover:text-green-700 font-semibold"
                  >
                    Sign in
                  </Link>
                </div>
              </CardFooter>
            )}
          </Card>
        </motion.div>
      </div>
    </div>
  );
}