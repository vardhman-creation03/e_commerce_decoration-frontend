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
                My Account
              </h1>
              <p className="text-base sm:text-lg text-gray-600 font-light max-w-xl mx-auto leading-relaxed">
                Manage your profile, addresses, and preferences
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <div className="container mx-auto px-3 py-6 sm:px-4 sm:py-8">
      {loading ? (
        <div className="flex flex-col justify-center items-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-2 border-gray-200 border-t-green-500 mb-4"></div>
          <p className="text-sm text-gray-500 font-light">Loading profile...</p>
        </div>
      ) : (
        <>

          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="space-y-4 sm:space-y-8"
          >
            <div className="block sm:hidden mb-4 relative" ref={dropdownRef}>
              <div
                className="w-full p-2 border rounded-lg bg-white text-sm flex justify-between items-center cursor-pointer"
                onClick={() => setIsDropdownOpen((prev) => !prev)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    setIsDropdownOpen((prev) => !prev);
                  } else if (e.key === "Escape") {
                    setIsDropdownOpen(false);
                  }
                }}
                role="button"
                tabIndex={0}
                aria-expanded={isDropdownOpen}
                aria-controls="dropdown-options"
              >
                <span>
                  {activeTab === "profile"
                    ? "Profile"
                    : activeTab === "addresses"
                    ? "Addresses"
                    : "Account Actions"}
                </span>
                <ChevronDown
                  className={`h-5 w-5 transition-transform ${
                    isDropdownOpen ? "rotate-180" : ""
                  }`}
                />
              </div>
              {isDropdownOpen && (
                <div
                  id="dropdown-options"
                  className="absolute w-full mt-1 border rounded-lg bg-white shadow-lg z-10"
                >
                  <div
                    className="p-2 text-sm hover:bg-gray-100 cursor-pointer flex items-center gap-2"
                    onClick={() => {
                      setActiveTab("profile");
                      setIsDropdownOpen(false);
                    }}
                  >
                    <User className="h-5 w-5" />
                    Profile
                  </div>
                  <div
                    className="p-2 text-sm hover:bg-gray-100 cursor-pointer flex items-center gap-2"
                    onClick={() => {
                      setActiveTab("addresses");
                      setIsDropdownOpen(false);
                    }}
                  >
                    <MapPin className="h-5 w-5" />
                    Addresses
                  </div>
                  <div
                    className="p-2 text-sm hover:bg-gray-100 cursor-pointer flex items-center gap-2"
                    onClick={() => {
                      setActiveTab("security");
                      setIsDropdownOpen(false);
                    }}
                  >
                    <LogOut className="h-5 w-5" />
                    Account Actions
                  </div>
                </div>
              )}
            </div>

            <TabsList className="hidden sm:grid grid-cols-2 md:grid-cols-3 gap-2 rounded-none bg-gray-100 h-14">
              <TabsTrigger value="profile" className="flex items-center gap-2 rounded-none font-light data-[state=active]:bg-white data-[state=active]:text-gray-900 data-[state=active]:border-b-2 data-[state=active]:border-green-500">
                <User className="h-4 w-4" />
                <span className="hidden sm:inline">Profile</span>
              </TabsTrigger>
              <TabsTrigger value="addresses" className="flex items-center gap-2 rounded-none font-light data-[state=active]:bg-white data-[state=active]:text-gray-900 data-[state=active]:border-b-2 data-[state=active]:border-green-500">
                <MapPin className="h-4 w-4" />
                <span className="hidden sm:inline">Addresses</span>
              </TabsTrigger>
              <TabsTrigger value="security" className="flex items-center gap-2 rounded-none font-light data-[state=active]:bg-white data-[state=active]:text-gray-900 data-[state=active]:border-b-2 data-[state=active]:border-green-500">
                <LogOut className="h-4 w-4" />
                <span className="hidden sm:inline">Account Actions</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="profile">
              <motion.div initial="hidden" animate="visible" variants={fadeIn}>
                <Card className="border border-gray-200 rounded-none">
                  <CardHeader className="border-b border-gray-100">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                      <div>
                        <CardTitle className="text-lg sm:text-xl font-light text-gray-900">
                          Profile Information
                        </CardTitle>
                        <CardDescription className="text-sm sm:text-base font-light text-gray-600">
                          Manage your personal information
                        </CardDescription>
                      </div>
                      <Button
                        variant={isEditing ? "default" : "outline"}
                        onClick={() =>
                          isEditing ? handleSaveProfile() : setIsEditing(true)
                        }
                        disabled={loading}
                        className="w-full sm:w-auto rounded-none font-light"
                      >
                        {loading ? (
                          <div className="flex items-center gap-2">
                            <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                            <span>Saving...</span>
                          </div>
                        ) : isEditing ? (
                          <>
                            <Save className="mr-2 h-5 w-5 sm:h-4 sm:w-4" />
                            Save Changes
                          </>
                        ) : (
                          <>
                            <Edit className="mr-2 h-5 w-5 sm:h-4 sm:w-4" />
                            Edit Profile
                          </>
                        )}
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-col md:flex-row gap-6 sm:gap-8">
                      <div className="flex-1 space-y-3 sm:space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="name" className="text-sm sm:text-base font-light text-gray-900">
                              Full Name
                            </Label>
                            <Input
                              id="name"
                              value={userData.name}
                              onChange={(e) =>
                                setUserData({ ...userData, name: e.target.value })
                              }
                              disabled={!isEditing}
                              className="text-sm sm:text-base rounded-none border-gray-200 font-light focus:border-gray-400"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="email" className="text-sm sm:text-base font-light text-gray-900">
                              Email Address
                            </Label>
                            <Input
                              id="email"
                              type="email"
                              value={userData.email}
                              onChange={(e) =>
                                setUserData({ ...userData, email: e.target.value })
                              }
                              disabled={!isEditing}
                              className="text-sm sm:text-base rounded-none border-gray-200 font-light focus:border-gray-400"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="phone" className="text-sm sm:text-base font-light text-gray-900">
                              Phone Number
                            </Label>
                            <Input
                              id="phone"
                              value={userData.phone}
                              onChange={(e) =>
                                setUserData({ ...userData, phone: e.target.value })
                              }
                              disabled={!isEditing}
                              className="text-sm sm:text-base rounded-none border-gray-200 font-light focus:border-gray-400"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                    <AnimatePresence>
                      {profileUpdated && (
                        <motion.div
                          className="mt-4 p-4 bg-green-50 rounded-lg flex items-center gap-2"
                          variants={profileSuccessAnimation}
                          initial="hidden"
                          animate="visible"
                          exit="exit"
                        >
                          <motion.div
                            animate={{
                              scale: [1, 1.1, 1],
                              transition: { duration: 0.5, repeat: 1 },
                            }}
                          >
                            <CheckCircle className="h-6 w-6 text-green-500" />
                          </motion.div>
                          <motion.p
                            className="text-green-600 font-semibold text-sm sm:text-base"
                            animate={{
                              opacity: [0, 1],
                              transition: { delay: 0.2, duration: 0.3 },
                            }}
                          >
                            Profile Updated Successfully!
                          </motion.p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </CardContent>
                </Card>
              </motion.div>
            </TabsContent>

            <TabsContent value="addresses">
              <motion.div
                initial="hidden"
                animate="visible"
                variants={staggerContainer}
                className="space-y-4 sm:space-y-6"
              >
                <motion.div variants={fadeIn}>
                  <Card className="border border-gray-200 rounded-none">
                    <CardHeader className="border-b border-gray-100">
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                        <div>
                          <CardTitle className="text-lg sm:text-xl font-light text-gray-900">
                            Addresses
                          </CardTitle>
                          <CardDescription className="text-sm sm:text-base font-light text-gray-600">
                            Manage your shipping and billing addresses
                          </CardDescription>
                        </div>
                        {userAddresses?.length > 0 && !showAddAddressForm && (
                          <Button
                            onClick={() => setShowAddAddressForm(true)}
                            className="w-full sm:w-auto rounded-none font-light"
                          >
                            <Plus className="mr-2 h-5 w-5 sm:h-4 sm:w-4" />
                            Add New Address
                          </Button>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent>
                      {addressLoading ? (
                        <div className="flex justify-center items-center py-8">
                          <div className="flex items-center gap-2">
                            <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                            <span>Loading addresses...</span>
                          </div>
                        </div>
                      ) : userAddresses?.length === 0 && !showAddAddressForm ? (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ duration: 0.5, delay: 0.3 }}
                          className="text-center py-12 bg-gray-50 rounded-lg"
                        >
                          <MapPin className="h-10 w-10 sm:h-12 sm:w-12 text-gray-400 mx-auto mb-4" />
                          <h3
                            className="text-base sm:text-lg font-semibold text-gray-700 mb-6"
                            role="alert"
                            aria-live="assertive"
                          >
                            No Address Found
                          </h3>
                          <Button
                            onClick={() => setShowAddAddressForm(true)}
                            className="w-full sm:w-auto"
                          >
                            <Plus className="mr-2 h-5 w-5 sm:h-4 sm:w-4" />
                            Add New Address
                          </Button>
                        </motion.div>
                      ) : showAddAddressForm ? (
                        <AnimatePresence>
                          {addressAdded ? (
                            <motion.div
                              key="success"
                              className="flex flex-col items-center justify-center space-y-4 py-8 bg-green-50 rounded-lg"
                              variants={addressSuccessAnimation}
                              initial="hidden"
                              animate="visible"
                              exit="exit"
                            >
                              <motion.div
                                animate={{
                                  scale: [1, 1.3, 1],
                                  rotate: [0, 180, 0],
                                  transition: { duration: 0.8, repeat: 1 },
                                }}
                              >
                                <CheckCircle className="h-16 w-16 text-green-500" />
                              </motion.div>
                              <motion.div
                                className="relative"
                                animate={{
                                  scale: [1, 1.1, 1],
                                  transition: {
                                    duration: 1.5,
                                    repeat: Infinity,
                                  },
                                }}
                              >
                                <motion.div
                                  className="absolute inset-0 rounded-full bg-green-200/50"
                                  animate={{
                                    scale: [1, 2],
                                    opacity: [0.5, 0],
                                    transition: {
                                      duration: 1.5,
                                      repeat: Infinity,
                                      delay: 0.3,
                                    },
                                  }}
                                />
                                <p
                                  className="text-base sm:text-lg font-semibold text-green-600"
                                  role="alert"
                                  aria-live="assertive"
                                >
                                  Address Added Successfully!
                                </p>
                              </motion.div>
                            </motion.div>
                          ) : (
                            <motion.div
                              key="form"
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              exit={{ opacity: 0 }}
                              transition={{ duration: 0.3 }}
                            >
                              <form
                                onSubmit={handleAddAddressSubmit}
                                className="space-y-3 sm:space-y-4 max-w-lg mx-auto"
                              >
                                <div className="space-y-2">
                                  <Label
                                    htmlFor="street"
                                    className="text-sm sm:text-base font-light text-gray-900"
                                  >
                                    Street Address
                                  </Label>
                                  <Input
                                    id="street"
                                    name="street"
                                    value={addressFormData.street}
                                    onChange={handleAddAddressChange}
                                    required
                                    className="text-sm sm:text-base rounded-none border-gray-200 font-light focus:border-gray-400"
                                  />
                                </div>
                                <div className="grid grid-cols-2 gap-3 sm:gap-4">
                                  <div className="space-y-2">
                                    <Label
                                      htmlFor="city"
                                      className="text-sm sm:text-base font-light text-gray-900"
                                    >
                                      City
                                    </Label>
                                    <Input
                                      id="city"
                                      name="city"
                                      value={addressFormData.city}
                                      onChange={handleAddAddressChange}
                                      required
                                      className="text-sm sm:text-base rounded-none border-gray-200 font-light focus:border-gray-400"
                                    />
                                  </div>
                                  <div className="space-y-2">
                                    <Label
                                      htmlFor="state"
                                      className="text-sm sm:text-base font-light text-gray-900"
                                    >
                                      State
                                    </Label>
                                    <Input
                                      id="state"
                                      name="state"
                                      value={addressFormData.state}
                                      onChange={handleAddAddressChange}
                                      required
                                      className="text-sm sm:text-base rounded-none border-gray-200 font-light focus:border-gray-400"
                                    />
                                  </div>
                                </div>
                                <div className="grid grid-cols-2 gap-3 sm:gap-4">
                                  <div className="space-y-2">
                                    <Label
                                      htmlFor="zip"
                                      className="text-sm sm:text-base font-light text-gray-900"
                                    >
                                      Zip Code
                                    </Label>
                                    <Input
                                      id="zip"
                                      name="zip"
                                      value={addressFormData.zip}
                                      onChange={handleAddAddressChange}
                                      required
                                      className="text-sm sm:text-base rounded-none border-gray-200 font-light focus:border-gray-400"
                                    />
                                  </div>
                                  <div className="space-y-2">
                                    <Label
                                      htmlFor="country"
                                      className="text-sm sm:text-base font-light text-gray-900"
                                    >
                                      Country
                                    </Label>
                                    <Input
                                      id="country"
                                      name="country"
                                      value={addressFormData.country}
                                      onChange={handleAddAddressChange}
                                      required
                                      className="text-sm sm:text-base rounded-none border-gray-200 font-light focus:border-gray-400"
                                    />
                                  </div>
                                </div>
                                <div className="flex gap-2">
                                  <Button
                                    type="submit"
                                    className="w-full rounded-none font-light"
                                    disabled={isAddressAdding}
                                  >
                                    {isAddressAdding ? (
                                      <div className="flex items-center gap-2">
                                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                                        <span>Saving...</span>
                                      </div>
                                    ) : (
                                      "Save Address"
                                    )}
                                  </Button>
                                  <Button
                                    type="button"
                                    variant="outline"
                                    className="w-full rounded-none font-light"
                                    onClick={() => setShowAddAddressForm(false)}
                                    disabled={isAddressAdding}
                                  >
                                    Cancel
                                  </Button>
                                </div>
                              </form>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                          {userAddresses?.map((address) => (
                            <motion.div
                              key={address._id}
                              variants={slideUp}
                              whileHover={{ y: -4 }}
                              transition={{ duration: 0.2 }}
                              className={`border border-gray-200 p-3 sm:p-4 relative ${
                                address.isDefault
                                  ? "border-gray-900 bg-gray-50"
                                  : "border-gray-200"
                              }`}
                            >
                              <div className="flex justify-between items-start mb-2">
                                <div className="flex items-center gap-2">
                                  <div
                                    className={`p-1.5 rounded-full bg-blue-100`}
                                  >
                                    <Home className="h-4 w-4 text-blue-600" />
                                  </div>
                                  <span className="font-medium text-sm sm:text-base">
                                    {address.type || "Home"}
                                  </span>
                                </div>
                              </div>
                              <div className="space-y-1 text-xs sm:text-sm">
                                <p className="font-medium">
                                  {"Your Address is: "}
                                </p>
                                <p>{address.street}</p>
                                <p>
                                  {address.city}, {address.state} {address.zip}
                                </p>
                                <p>{address.country}</p>
                                {address.phone && (
                                  <p className="flex items-center gap-1 mt-2">
                                    <Phone className="h-3 w-3" />
                                    {address.phone}
                                  </p>
                                )}
                              </div>
                              <div className="flex flex-wrap gap-2 mt-3 sm:mt-4">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-none font-light"
                                  onClick={() =>
                                    handleDeleteAddress(address._id)
                                  }
                                >
                                  <Trash className="h-5 w-5 sm:h-4 sm:w-4 mr-1" />
                                  Delete
                                </Button>
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              </motion.div>
            </TabsContent>

            <TabsContent value="security">
              <motion.div
                initial="hidden"
                animate="visible"
                variants={staggerContainer}
                className="space-y-4 sm:space-y-6"
              >
                <motion.div variants={fadeIn}>
                  <Card className="border border-gray-200 rounded-none">
                    <CardHeader className="border-b border-gray-100">
                      <CardTitle className="text-lg sm:text-xl font-light text-gray-900">
                        Account Actions
                      </CardTitle>
                      <CardDescription className="text-sm sm:text-base font-light text-gray-600">
                        Manage your account status
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div
                        className="block sm:hidden mb-4 relative"
                        ref={actionsDropdownRef}
                      >
                        <div
                          className="w-full p-2 border rounded-lg bg-white text-sm flex justify-between items-center cursor-pointer"
                          onClick={() =>
                            setIsActionsDropdownOpen((prev) => !prev)
                          }
                          onKeyDown={(e) => {
                            if (e.key === "Enter" || e.key === " ") {
                              e.preventDefault();
                              setIsActionsDropdownOpen((prev) => !prev);
                            } else if (e.key === "Escape") {
                              setIsActionsDropdownOpen(false);
                            }
                          }}
                          role="button"
                          tabIndex={0}
                          aria-expanded={isActionsDropdownOpen}
                          aria-controls="actions-dropdown-options"
                        >
                          <span>{selectedAction || "Select Action"}</span>
                          <ChevronDown
                            className={`h-5 w-5 transition-transform ${
                              isActionsDropdownOpen ? "rotate-180" : ""
                            }`}
                          />
                        </div>
                        {isActionsDropdownOpen && (
                          <div
                            id="actions-dropdown-options"
                            className="absolute w-full mt-1 border rounded-lg bg-white shadow-lg z-10"
                          >
                            <div
                              className="p-2 text-sm hover:bg-gray-100 cursor-pointer flex items-center gap-2"
                              onClick={() => {
                                setSelectedAction("Sign Out from All Devices");
                                setIsActionsDropdownOpen(false);
                                handleSignOut();
                              }}
                            >
                              <LogOut className="h-5 w-5" />
                              Sign Out from All Devices
                            </div>
                            <div
                              className="p-2 text-sm hover:bg-gray-100 cursor-pointer flex items-center gap-2"
                              onClick={() => {
                                setSelectedAction("Delete Account");
                                setIsActionsDropdownOpen(false);
                                document
                                  .getElementById("delete-account-trigger")
                                  ?.click();
                              }}
                            >
                              <Trash className="h-5 w-5 text-red-500" />
                              Delete Account
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="hidden sm:block space-y-3 sm:space-y-4">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                          <div className="space-y-0.5">
                            <Label className="text-sm sm:text-base">
                              Sign Out from All Devices
                            </Label>
                            <p className="text-xs sm:text-sm text-gray-500">
                              Log out from all devices where you're currently
                              signed in
                            </p>
                          </div>
                          <Button
                            variant="outline"
                            className="w-full sm:w-auto rounded-none font-light"
                            onClick={handleSignOut}
                          >
                            <LogOut className="mr-2 h-5 w-5 sm:h-4 sm:w-4" />
                            Sign Out
                          </Button>
                        </div>
                        <Separator />
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                          <div className="space-y-0.5">
                            <Label
                              className="text-sm sm:text-base"
                              htmlFor="delete-account"
                            >
                              Delete Account
                            </Label>
                            <p className="text-xs sm:text-sm text-gray-500">
                              Permanently delete your account and all associated
                              data
                            </p>
                          </div>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                variant="destructive"
                                className="w-full sm:w-auto rounded-none font-light"
                                id="delete-account-trigger"
                              >
                                <Trash className="mr-2 h-5 w-5 sm:h-4 sm:w-4" />
                                Delete Account
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>
                                  Are you absolutely sure?
                                </AlertDialogTitle>
                                <AlertDialogDescription>
                                  This action cannot be undone. This will
                                  permanently delete your account and remove all
                                  your data from our servers.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={handleDeleteAccount}
                                >
                                  Delete Account
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </div>

                      <div className="block sm:hidden">
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <button
                              id="delete-account-trigger"
                              className="hidden"
                            >
                              Trigger Delete Account Dialog
                            </button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>
                                Are you absolutely sure?
                              </AlertDialogTitle>
                              <AlertDialogDescription>
                                This action cannot be undone. This will
                                permanently delete your account and remove all
                                your data from our servers.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction onClick={handleDeleteAccount}>
                                Delete Account
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </motion.div>
            </TabsContent>
          </Tabs>
        </>
      )}
      </div>
    </div>
  );
}