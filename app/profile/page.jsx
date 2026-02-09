"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { useToast } from "../../hooks/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Edit,
  Home,
  LogOut,
  MapPin,
  Phone,
  Plus,
  Save,
  Trash,
  User,
  CheckCircle,
  ChevronDown,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import {
  updateUserProfile,
  getUserProfile,
  getUserAddress,
  deleteUserAddress,
  addUserAddress,
} from "../store/userSlice";

// Animation variants
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

const addressSuccessAnimation = {
  hidden: { opacity: 0, scale: 0.3, y: 50 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      duration: 0.6,
      type: "spring",
      bounce: 0.5,
    },
  },
  exit: { opacity: 0, scale: 0.3, transition: { duration: 0.3 } },
};

const profileSuccessAnimation = {
  hidden: { opacity: 0, x: -50 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut",
    },
  },
  exit: { opacity: 0, x: 50, transition: { duration: 0.3 } },
};

export default function ProfilePage() {
  const dispatch = useDispatch();
  const router = useRouter();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [profileUpdated, setProfileUpdated] = useState(false);
  const { profile: userProfile, loading, error } = useSelector((state) => state.user || {}); 

  const [userData, setUserData] = useState({
    name: "",
    email: "",
    phone: "",
  });

  const [showAddAddressForm, setShowAddAddressForm] = useState(false);
  const [addressFormData, setAddressFormData] = useState({
    name: "",
    street: "",
    city: "",
    state: "",
    zip: "",
    country: "",
    phone: "",
    type: "Home",
    isDefault: false,
  });
  const [isAddressAdding, setIsAddressAdding] = useState(false);
  const [addressAdded, setAddressAdded] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isActionsDropdownOpen, setIsActionsDropdownOpen] = useState(false);
  const [selectedAction, setSelectedAction] = useState(null);
  const [activeTab, setActiveTab] = useState("addresses");
  const dropdownRef = useRef(null);
  const actionsDropdownRef = useRef(null);

  const { addressList: userAddresses, addressLoading } = useSelector((state) => state.user);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
      if (
        actionsDropdownRef.current &&
        !actionsDropdownRef.current.contains(event.target)
      ) {
        setIsActionsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const result = await dispatch(getUserProfile()).unwrap();
        setUserData({
          name: result?.fullName || "",
          email: result?.email || "",
          phone: result?.mobile || "",
        });
      } catch (error) {
        toast({
          title: "Error",
          description: error || "Failed to load profile",
          variant: "destructive",
        });
      }
    };

    fetchUserProfile();
  }, [dispatch, toast]);

  useEffect(() => {
    dispatch(getUserAddress());
  }, [dispatch]);

  const handleSaveProfile = async () => {
    try {
      const updateData = {
        fullName: userData.name,
        email: userData.email,
        mobile: userData.phone,
      };

      await dispatch(updateUserProfile(updateData)).unwrap();
      setIsEditing(false);
      setProfileUpdated(true);
      toast({
        title: "Success",
        description: "Profile updated successfully",
      });
      setTimeout(() => {
        setProfileUpdated(false);
      }, 3000);
    } catch (error) {
      toast({
        title: "Error",
        description: error?.message || "Failed to update profile",
        variant: "destructive",
      });
    }
  };

  const handleDeleteAddress = async (id) => {
    try {
      await dispatch(deleteUserAddress(id)).unwrap();
      toast({
        title: "Success",
        description: "Address deleted successfully",
      });
      await dispatch(getUserAddress()).unwrap();
    } catch (error) {
      toast({
        title: "Error",
        description: error || "Failed to delete address",
        variant: "destructive",
      });
    }
  };

  const handleSetDefaultAddress = (id) => {
    toast({
      title: "Default address updated",
      description: "Your default shipping address has been updated.",
    });
  };

  const handleAddAddressChange = (e) => {
    const { name, value } = e.target;
    setAddressFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddAddressSubmit = async (e) => {
    e.preventDefault();
    setIsAddressAdding(true);
    try {
      await dispatch(addUserAddress(addressFormData)).unwrap();
      toast({
        title: "Success",
        description: "Address added successfully",
      });
      setAddressAdded(true);
      setTimeout(async () => {
        setAddressAdded(false);
        setShowAddAddressForm(false);
        setAddressFormData({
          name: "",
          street: "",
          city: "",
          state: "",
          zip: "",
          country: "",
          phone: "",
          type: "Home",
          isDefault: false,
        });
        await dispatch(getUserAddress()).unwrap();
      }, 3000);
    } catch (error) {
      toast({
        title: "Error",
        description: error?.message || "Failed to add address",
        variant: "destructive",
      });
    } finally {
      setIsAddressAdding(false);
    }
  };

  const handleSignOut = () => {
    toast({
      title: "Signed Out",
      description: "You have been signed out from all devices.",
    });
  };

  const handleDeleteAccount = () => {
    setTimeout(() => {
      toast({
        title: "Account deleted",
        description:
          "Your account has been deleted. You will be redirected to the homepage.",
      });
      setTimeout(() => {
        router.push("/");
      }, 2000);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gray-50/30 font-sans">
      {/* Premium Hero Section */}
      <section className="relative overflow-hidden bg-white pb-12 pt-20 lg:pt-28">
        <div className="absolute inset-0 bg-gradient-to-b from-green-50/50 via-white to-white" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-green-100/30 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
        
        <div className="container relative mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="flex flex-col md:flex-row items-center justify-between gap-8"
          >
            <motion.div variants={fadeIn} className="text-center md:text-left space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-100/50 text-green-700 text-xs font-semibold uppercase tracking-wider mb-4 border border-green-200">
                <User className="w-3 h-3" /> Personal Account
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 tracking-tight">
                Welcome, {userData.name.split(' ')[0] || 'Member'}
              </h1>
              <p className="text-lg text-gray-500 max-w-lg font-light">
                Manage your profile settings, addresses, and account security in one place.
              </p>
            </motion.div>
            
            {/* Quick Stats or Avatar Placeholder */}
            <motion.div variants={fadeIn} className="hidden md:flex gap-6">
              <div className="flex flex-col items-center p-4 bg-white rounded-2xl shadow-sm border border-gray-100 min-w-[120px]">
                <span className="text-2xl font-bold text-gray-900">{userAddresses?.length || 0}</span>
                <span className="text-xs text-gray-500 uppercase tracking-widest mt-1">Addresses</span>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Main Content Area */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 -mt-8 relative z-10">
        {loading ? (
          <div className="flex flex-col justify-center items-center min-h-[40vh] bg-white rounded-3xl shadow-sm border border-gray-100">
            <div className="animate-spin rounded-full h-10 w-10 border-2 border-gray-200 border-t-green-500 mb-4"></div>
            <p className="text-sm text-gray-500">Loading your profile...</p>
          </div>
        ) : (
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="space-y-8"
          >
            {/* Mobile Dropdown Navigation */}
            <div className="md:hidden relative z-50" ref={dropdownRef}>
              <button
                className="w-full p-4 bg-white border border-gray-200 rounded-xl shadow-sm flex justify-between items-center text-left"
                onClick={() => setIsDropdownOpen((prev) => !prev)}
              >
                <div className="flex items-center gap-3">
                  {activeTab === "profile" && <User className="h-5 w-5 text-green-600" />}
                  {activeTab === "addresses" && <MapPin className="h-5 w-5 text-green-600" />}
                  {activeTab === "security" && <LogOut className="h-5 w-5 text-green-600" />}
                  <span className="font-medium text-gray-900 capitalize">
                    {activeTab === "security" ? "Account Actions" : activeTab}
                  </span>
                </div>
                <ChevronDown className={`h-5 w-5 text-gray-400 transition-transform ${isDropdownOpen ? "rotate-180" : ""}`} />
              </button>
              
              <AnimatePresence>
                {isDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute w-full mt-2 bg-white border border-gray-100 rounded-xl shadow-xl overflow-hidden p-1"
                  >
                    {[
                      { id: 'profile', icon: User, label: 'Profile' },
                      { id: 'addresses', icon: MapPin, label: 'Addresses' },
                      { id: 'security', icon: LogOut, label: 'Account Actions' }
                    ].map((item) => (
                      <div
                        key={item.id}
                        className={`p-3 rounded-lg flex items-center gap-3 cursor-pointer transition-colors ${activeTab === item.id ? 'bg-green-50 text-green-700' : 'hover:bg-gray-50 text-gray-600'}`}
                        onClick={() => {
                          setActiveTab(item.id);
                          setIsDropdownOpen(false);
                        }}
                      >
                        <item.icon className="h-4 w-4" />
                        <span className="text-sm font-medium">{item.label}</span>
                      </div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Desktop Navigation */}
            <TabsList className="hidden md:flex p-1 bg-white/50 backdrop-blur-sm border border-gray-200 rounded-2xl w-fit mx-auto shadow-sm">
              {[
                { id: 'profile', icon: User, label: 'Profile Info' },
                { id: 'addresses', icon: MapPin, label: 'My Addresses' },
                { id: 'security', icon: LogOut, label: 'Settings' }
              ].map((item) => (
                <TabsTrigger
                  key={item.id}
                  value={item.id}
                  className="flex items-center gap-2 px-6 py-3 rounded-xl data-[state=active]:bg-green-500 data-[state=active]:text-white data-[state=active]:shadow-md transition-all duration-300 font-medium text-gray-600"
                >
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </TabsTrigger>
              ))}
            </TabsList>

            <div className="max-w-4xl mx-auto">
              {/* Profile Tab */}
              <TabsContent value="profile" className="focus-visible:outline-none">
                <motion.div initial="hidden" animate="visible" variants={fadeIn}>
                  <Card className="border-none shadow-lg shadow-gray-100 bg-white rounded-3xl overflow-hidden">
                    <CardHeader className="bg-gray-50/50 border-b border-gray-100 p-8">
                      <div className="flex justify-between items-center">
                        <div>
                          <CardTitle className="text-2xl font-bold text-gray-900">Personal Information</CardTitle>
                          <CardDescription className="text-gray-500 mt-1">View and update your personal details</CardDescription>
                        </div>
                        <Button
                          variant={isEditing ? "default" : "outline"}
                          size="sm"
                          onClick={() => isEditing ? handleSaveProfile() : setIsEditing(true)}
                          disabled={loading}
                          className={`rounded-full px-6 transition-all ${isEditing ? 'bg-green-600 hover:bg-green-700 text-white shadow-lg shadow-green-200' : 'bg-white hover:bg-gray-50 border-gray-200'}`}
                        >
                           {loading ? (
                            "Saving..." 
                          ) : isEditing ? (
                            <><Save className="w-4 h-4 mr-2"/> Save Changes</>
                          ) : (
                             <><Edit className="w-4 h-4 mr-2"/> Edit Profile</>
                          )}
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent className="p-8">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="col-span-1 md:col-span-2 space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2.5">
                                    <Label className="text-sm font-medium text-gray-700 ml-1">Full Name</Label>
                                    <div className="relative">
                                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                        <Input
                                        value={userData.name}
                                        onChange={(e) => setUserData({ ...userData, name: e.target.value })}
                                        disabled={!isEditing}
                                        className="pl-10 h-11 rounded-xl border-gray-200 bg-gray-50/30 focus:bg-white transition-all disabled:opacity-70 disabled:bg-gray-50"
                                        placeholder="Enter your full name"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2.5">
                                    <Label className="text-sm font-medium text-gray-700 ml-1">Phone Number</Label>
                                    <div className="relative">
                                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                        <Input
                                        value={userData.phone}
                                        onChange={(e) => setUserData({ ...userData, phone: e.target.value })}
                                        disabled={!isEditing}
                                        className="pl-10 h-11 rounded-xl border-gray-200 bg-gray-50/30 focus:bg-white transition-all disabled:opacity-70 disabled:bg-gray-50"
                                        placeholder="Enter your phone number"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2.5 md:col-span-2">
                                    <Label className="text-sm font-medium text-gray-700 ml-1">Email Address</Label>
                                     <div className="relative">
                                         <div className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 flex items-center justify-center font-bold">@</div>
                                        <Input
                                        value={userData.email}
                                        onChange={(e) => setUserData({ ...userData, email: e.target.value })}
                                        disabled={!isEditing} // Email usually readonly, but editable here if API supports
                                        className="pl-10 h-11 rounded-xl border-gray-200 bg-gray-50/30 focus:bg-white transition-all disabled:opacity-70 disabled:bg-gray-50"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                      </div>
                      
                      <AnimatePresence>
                        {profileUpdated && (
                          <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 10 }}
                            className="mt-6 p-4 bg-green-50 border border-green-100 rounded-xl flex items-center gap-3"
                          >
                            <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                                <CheckCircle className="h-5 w-5 text-green-600" />
                            </div>
                            <p className="text-green-800 font-medium">Your profile has been updated successfully.</p>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </CardContent>
                  </Card>
                </motion.div>
              </TabsContent>

              {/* Addresses Tab */}
              <TabsContent value="addresses" className="focus-visible:outline-none">
                <motion.div initial="hidden" animate="visible" variants={staggerContainer} className="space-y-6">
                    {/* Header Action */}
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                         <div>
                            <h2 className="text-2xl font-bold text-gray-900">Saved Addresses</h2>
                            <p className="text-gray-500">Manage your shipping destinations</p>
                        </div>
                        {!showAddAddressForm && (
                            <Button
                            onClick={() => setShowAddAddressForm(true)}
                            className="rounded-full bg-green-600 hover:bg-green-700 text-white shadow-lg shadow-green-200 px-6"
                            >
                            <Plus className="mr-2 h-4 w-4" /> Add New Address
                            </Button>
                        )}
                    </div>

                  {addressLoading ? (
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {[1, 2].map((i) => (
                            <div key={i} className="h-48 rounded-2xl bg-gray-100 animate-pulse" />
                        ))}
                     </div>
                  ) : userAddresses?.length === 0 && !showAddAddressForm ? (
                    <motion.div variants={fadeIn} className="text-center py-16 bg-white rounded-3xl border border-dashed border-gray-300">
                      <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                        <MapPin className="h-8 w-8 text-gray-400" />
                      </div>
                      <h3 className="text-lg font-bold text-gray-900 mb-2">No Addresses Found</h3>
                      <p className="text-gray-500 mb-6 max-w-sm mx-auto">Add a shipping address to speed up your checkout process.</p>
                      <Button onClick={() => setShowAddAddressForm(true)} variant="outline" className="rounded-full border-gray-300">
                        Add First Address
                      </Button>
                    </motion.div>
                  ) : showAddAddressForm ? (
                    <motion.div variants={slideUp} className="bg-white rounded-3xl p-8 border border-gray-100 shadow-xl shadow-gray-100/50">
                        <div className="flex items-center justify-between mb-8">
                            <h3 className="text-xl font-bold text-gray-900">Add New Address</h3>
                            <Button variant="ghost" size="sm" onClick={() => setShowAddAddressForm(false)} className="text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full h-8 w-8 p-0">
                                <span className="sr-only">Close</span>
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                            </Button>
                        </div>
                        
                        {addressAdded ? (
                            <div className="text-center py-12">
                                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
                                    <CheckCircle className="h-8 w-8 text-green-600" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900">Address Added!</h3>
                                <p className="text-gray-500 mt-2">Redirecting back to your list...</p>
                            </div>
                        ) : (
                             <form onSubmit={handleAddAddressSubmit} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <Label>Street Address</Label>
                                        <Input name="street" value={addressFormData.street} onChange={handleAddAddressChange} required className="rounded-xl h-11 bg-gray-50/50 border-gray-200" placeholder="123 Main St" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>City</Label>
                                        <Input name="city" value={addressFormData.city} onChange={handleAddAddressChange} required className="rounded-xl h-11 bg-gray-50/50 border-gray-200" placeholder="New York" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>State</Label>
                                        <Input name="state" value={addressFormData.state} onChange={handleAddAddressChange} required className="rounded-xl h-11 bg-gray-50/50 border-gray-200" placeholder="NY" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Zip Code</Label>
                                        <Input name="zip" value={addressFormData.zip} onChange={handleAddAddressChange} required className="rounded-xl h-11 bg-gray-50/50 border-gray-200" placeholder="10001" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Country</Label>
                                        <Input name="country" value={addressFormData.country} onChange={handleAddAddressChange} required className="rounded-xl h-11 bg-gray-50/50 border-gray-200" placeholder="United States" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Address Type</Label>
                                        <select 
                                            name="type" 
                                            value={addressFormData.type} 
                                            onChange={handleAddAddressChange} 
                                            className="w-full h-11 rounded-xl border-gray-200 bg-gray-50/50 px-3 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                                        >
                                            <option value="Home">Home</option>
                                            <option value="Work">Work</option>
                                            <option value="Other">Other</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="flex gap-4 pt-4">
                                     <Button type="submit" disabled={isAddressAdding} className="flex-1 rounded-xl h-11 bg-green-600 hover:bg-green-700 text-white">
                                        {isAddressAdding ? "Saving..." : "Save Address"}
                                     </Button>
                                     <Button type="button" variant="outline" onClick={() => setShowAddAddressForm(false)} disabled={isAddressAdding} className="flex-1 rounded-xl h-11 border-gray-200">
                                        Cancel
                                     </Button>
                                </div>
                             </form>
                        )}
                    </motion.div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {userAddresses?.map((address) => (
                          <motion.div
                            key={address._id}
                            variants={slideUp}
                            whileHover={{ y: -5 }}
                            className={`relative p-6 rounded-2xl border transition-all duration-300 ${
                                address.isDefault
                                  ? "bg-green-50/30 border-green-500 shadow-md ring-1 ring-green-100"
                                  : "bg-white border-gray-200 hover:border-green-200 hover:shadow-lg hover:shadow-green-50/50"
                            }`}
                          >
                            <div className="flex justify-between items-start mb-4">
                              <div className="flex items-center gap-2">
                                <span className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${address.type === 'Work' ? 'bg-blue-100 text-blue-700' : 'bg-orange-100 text-orange-700'}`}>
                                    {address.type === 'Work' ? <span className="w-1.5 h-1.5 rounded-full bg-blue-500"/> : <span className="w-1.5 h-1.5 rounded-full bg-orange-500"/>}
                                    {address.type || "Home"}
                                </span>
                                {address.isDefault && (
                                    <span className="text-xs font-medium text-green-600 flex items-center gap-1">
                                        <CheckCircle className="w-3 h-3" /> Default
                                    </span>
                                )}
                              </div>
                              <div className="flex gap-2">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => handleDeleteAddress(address._id)}
                                  className="h-8 w-8 rounded-full text-gray-400 hover:text-red-500 hover:bg-red-50"
                                >
                                  <Trash className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                            
                            <div className="space-y-1 mb-6">
                                <p className="font-bold text-gray-900 text-lg">{addressFormData.name || userData.name}</p>
                                <p className="text-gray-600 text-sm leading-relaxed">
                                    {address.street}<br/>
                                    {address.city}, {address.state} {address.zip}<br/>
                                    {address.country}
                                </p>
                            </div>
                            
                            {!address.isDefault && (
                                <Button 
                                    variant="outline" 
                                    className="w-full rounded-xl border-gray-200 hover:border-green-500 hover:text-green-600 text-xs"
                                    onClick={() => handleSetDefaultAddress(address._id)}
                                >
                                    Set as Default
                                </Button>
                            )}
                          </motion.div>
                        ))}
                    </div>
                  )}
                </motion.div>
              </TabsContent>

              {/* Account Actions Tab */}
              <TabsContent value="security" className="focus-visible:outline-none">
                <motion.div initial="hidden" animate="visible" variants={fadeIn}>
                   <Card className="border-none shadow-lg shadow-gray-100 bg-white rounded-3xl overflow-hidden">
                        <CardHeader className="bg-red-50/30 border-b border-red-50 p-8">
                            <CardTitle className="text-2xl font-bold text-gray-900">Danger Zone</CardTitle>
                            <CardDescription className="text-red-500/80">Irreversible account actions</CardDescription>
                        </CardHeader>
                        <CardContent className="p-8 space-y-6">
                            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 p-4 rounded-xl border border-gray-100 bg-gray-50/50">
                                <div>
                                    <h4 className="font-semibold text-gray-900">Sign Out</h4>
                                    <p className="text-sm text-gray-500">Sign out from your account on this device</p>
                                </div>
                                <Button variant="outline" onClick={handleSignOut} className="rounded-xl border-gray-300 hover:bg-gray-100">
                                    <LogOut className="w-4 h-4 mr-2" /> Sign Out
                                </Button>
                            </div>
                            
                            <Separator />
                            
                            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 p-4 rounded-xl border border-red-100 bg-red-50/30">
                                <div>
                                    <h4 className="font-semibold text-red-700">Delete Account</h4>
                                    <p className="text-sm text-red-500/80">Permanently remove your account and all data</p>
                                </div>
                                <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                        <Button variant="destructive" className="rounded-xl bg-red-500 hover:bg-red-600 shadow-lg shadow-red-200">
                                            Delete Account
                                        </Button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent className="rounded-2xl">
                                        <AlertDialogHeader>
                                            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                            <AlertDialogDescription>
                                                This action cannot be undone. This will permanently delete your account
                                                and remove your data from our servers.
                                            </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                            <AlertDialogCancel className="rounded-xl">Cancel</AlertDialogCancel>
                                            <AlertDialogAction onClick={handleDeleteAccount} className="rounded-xl bg-red-600 hover:bg-red-700">
                                                Yes, delete my account
                                            </AlertDialogAction>
                                        </AlertDialogFooter>
                                    </AlertDialogContent>
                                </AlertDialog>
                            </div>
                        </CardContent>
                   </Card>
                </motion.div>
              </TabsContent>
            </div>
          </Tabs>
        )}
      </div>
    </div>
  );
}