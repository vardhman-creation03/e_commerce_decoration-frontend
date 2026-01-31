'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import AdminSidebar from '@/components/adminSidebar';
import AdminHeader from '@/components/adminHeader';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { User, Mail, Phone, MapPin, Save } from 'lucide-react';
import userService from '@/lib/services/userService';
import { useToast } from '@/hooks/use-toast';

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const slideUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
};

export default function AdminProfile() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: '',
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const data = await userService.getUserProfile();
      const user = data.user || {};

      const userAddress = user.address && user.address.length > 0 ? user.address[0] : {};

      setFormData({
        fullName: user.fullName || '',
        email: user.email || '',
        phone: user.mobile || '',
        address: userAddress.street || '',
        city: userAddress.city || '',
        state: userAddress.state || '',
        zipCode: userAddress.zip || '',
        country: userAddress.country || '',
      });
    } catch (error) {
      console.error('Error fetching profile:', error);
      toast({
        title: 'Error',
        description: 'Failed to load profile data',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        fullName: formData.fullName,
        email: formData.email,
        mobile: formData.phone,
        address: {
          street: formData.address,
          city: formData.city,
          state: formData.state,
          zip: formData.zipCode,
          country: formData.country
        }
      };

      await userService.updateUserProfile(payload);
      toast({
        title: 'Success',
        description: 'Profile updated successfully'
      });
      fetchProfile(); // Refresh data
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to update profile',
        variant: 'destructive'
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <AdminSidebar />
      <div className="flex-1 flex flex-col lg:ml-0">
        <AdminHeader />
        <main className="flex-1 p-6 overflow-y-auto">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeIn}
            className="max-w-4xl mx-auto space-y-6"
          >
            {/* Page Header */}
            <div>
              <h1 className="text-3xl sm:text-4xl font-light text-gray-900 mb-2">
                Profile Settings
              </h1>
              <p className="text-gray-600 font-light">
                Manage your account information and preferences
              </p>
            </div>

            {/* Profile Card */}
            <motion.div variants={slideUp}>
              <Card className="border border-gray-200 rounded-none">
                <CardHeader>
                  <CardTitle className="font-light text-xl flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Personal Information
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Full Name */}
                      <div>
                        <Label htmlFor="fullName" className="font-light mb-2 block">
                          Full Name
                        </Label>
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                          <Input
                            id="fullName"
                            name="fullName"
                            value={formData.fullName}
                            onChange={handleInputChange}
                            className="pl-10 rounded-none font-light"
                            required
                          />
                        </div>
                      </div>

                      {/* Email */}
                      <div>
                        <Label htmlFor="email" className="font-light mb-2 block">
                          Email
                        </Label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                          <Input
                            id="email"
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            className="pl-10 rounded-none font-light"
                            required
                          />
                        </div>
                      </div>

                      {/* Phone */}
                      <div>
                        <Label htmlFor="phone" className="font-light mb-2 block">
                          Phone
                        </Label>
                        <div className="relative">
                          <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                          <Input
                            id="phone"
                            name="phone"
                            type="tel"
                            value={formData.phone}
                            onChange={handleInputChange}
                            className="pl-10 rounded-none font-light"
                            required
                          />
                        </div>
                      </div>

                      {/* Address */}
                      <div>
                        <Label htmlFor="address" className="font-light mb-2 block">
                          Address
                        </Label>
                        <div className="relative">
                          <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                          <Input
                            id="address"
                            name="address"
                            value={formData.address}
                            onChange={handleInputChange}
                            className="pl-10 rounded-none font-light"
                            required
                          />
                        </div>
                      </div>

                      {/* City */}
                      <div>
                        <Label htmlFor="city" className="font-light mb-2 block">
                          City
                        </Label>
                        <Input
                          id="city"
                          name="city"
                          value={formData.city}
                          onChange={handleInputChange}
                          className="rounded-none font-light"
                          required
                        />
                      </div>

                      {/* State */}
                      <div>
                        <Label htmlFor="state" className="font-light mb-2 block">
                          State
                        </Label>
                        <Input
                          id="state"
                          name="state"
                          value={formData.state}
                          onChange={handleInputChange}
                          className="rounded-none font-light"
                          required
                        />
                      </div>

                      {/* Zip Code */}
                      <div>
                        <Label htmlFor="zipCode" className="font-light mb-2 block">
                          Zip Code
                        </Label>
                        <Input
                          id="zipCode"
                          name="zipCode"
                          value={formData.zipCode}
                          onChange={handleInputChange}
                          className="rounded-none font-light"
                          required
                        />
                      </div>

                      {/* Country */}
                      <div>
                        <Label htmlFor="country" className="font-light mb-2 block">
                          Country
                        </Label>
                        <Input
                          id="country"
                          name="country"
                          value={formData.country}
                          onChange={handleInputChange}
                          className="rounded-none font-light"
                          required
                        />
                      </div>
                    </div>

                    {/* Submit Button */}
                    <div className="flex justify-end pt-4 border-t border-gray-200">
                      <Button type="submit" disabled={loading} className="rounded-none font-light">
                        <Save className="mr-2 h-4 w-4" />
                        {loading ? 'Saving...' : 'Save Changes'}
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        </main>
      </div>
    </div>
  );
}

