"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CheckCircle, MapPin, MessageSquare, Phone, Sparkles, Heart, Award } from "lucide-react";

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

const scaleIn = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.5 } },
};

const values = [
  {
    title: "Creativity",
    description:
      "We design unique and memorable decorations for every occasion, making your celebrations truly special.",
    icon: Sparkles,
  },
  {
    title: "Quality",
    description:
      "We use only premium materials to ensure your decorations look stunning and last throughout your event.",
    icon: Award,
  },
  {
    title: "Customer Focus",
    description:
      "Your happiness is our priority. We tailor our services to your needs and provide exceptional support.",
    icon: Heart,
  },
  {
    title: "Reliability",
    description:
      "We deliver on time and as promised, so you can enjoy your event stress-free.",
    icon: CheckCircle,
  },
];

export default function AboutPage() {
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
                About Us
              </h1>
              <p className="text-base sm:text-lg text-gray-600 font-light max-w-xl mx-auto leading-relaxed">
                Making every celebration magical with creative, high-quality
                decorations for birthdays, anniversaries, baby showers, and more.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Tabs Section */}
      <section className="py-16 sm:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={fadeIn}
            className="mb-12 md:mb-16"
          >
            <Tabs defaultValue="story" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-12 md:mb-16 bg-gray-100 rounded-none h-14">
                <TabsTrigger 
                  value="story"
                  className="rounded-none font-light data-[state=active]:bg-white data-[state=active]:text-gray-900 data-[state=active]:border-b-2 data-[state=active]:border-green-500"
                >
                  Our Story
                </TabsTrigger>
                <TabsTrigger 
                  value="mission"
                  className="rounded-none font-light data-[state=active]:bg-white data-[state=active]:text-gray-900 data-[state=active]:border-b-2 data-[state=active]:border-green-500"
                >
                  Mission & Values
                </TabsTrigger>
              </TabsList>

              {/* Story Tab */}
              <TabsContent value="story" className="space-y-12 md:space-y-16">
                <motion.div
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: "-50px" }}
                  variants={staggerContainer}
                  className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center"
                >
                  <motion.div variants={fadeIn}>
                    <h2 className="text-3xl sm:text-4xl md:text-5xl font-light text-gray-900 mb-6 leading-tight tracking-tight">
                      From Inspiration to Celebration
                    </h2>
                    <div className="space-y-4">
                      <p className="text-base text-gray-600 font-light leading-relaxed">
                        Vardhman Decoration was founded with a passion for
                        transforming ordinary spaces into extraordinary memories.
                        Our journey began by helping families and friends
                        celebrate life's special moments—birthdays, anniversaries,
                        baby showers, and more—with beautiful, creative
                        decorations.
                      </p>
                      <p className="text-base text-gray-600 font-light leading-relaxed">
                        We believe every occasion deserves a unique touch. Our
                        team works tirelessly to design and deliver decorations
                        that bring your vision to life, making your celebrations
                        unforgettable.
                      </p>
                    </div>
                  </motion.div>
                  <motion.div 
                    variants={scaleIn}
                    className="relative h-[400px] md:h-[500px] overflow-hidden border border-gray-200"
                  >
                    <Image
                      src="/images/about_us.jpg"
                      alt="Vardhman Decoration Story"
                      fill
                      className="object-cover transition-transform duration-700 hover:scale-105"
                      sizes="(max-width: 768px) 100vw, 50vw"
                      priority
                    />
                  </motion.div>
                </motion.div>

                <motion.div
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: "-50px" }}
                  variants={staggerContainer}
                  className="bg-gray-50/50 p-8 md:p-12 border border-gray-100"
                >
                  <motion.h3 
                    variants={fadeIn}
                    className="text-2xl sm:text-3xl font-light text-gray-900 mb-8 md:mb-12 text-center tracking-tight"
                  >
                    Our Growth Journey
                  </motion.h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                    {[
                      {
                        year: "2025",
                        title: "Founded",
                        desc: "Vardhman Decoration launched to make event decoration easy and accessible for everyone.",
                      },
                    ].map((item, index) => (
                      <motion.div key={index} variants={slideUp} whileHover={{ y: -4 }} transition={{ duration: 0.2 }}>
                        <Card className="h-full border border-gray-200 hover:border-green-300 transition-colors">
                          <CardContent className="pt-6">
                            <div className="text-4xl md:text-5xl font-light text-gray-900 mb-3 tracking-tight">
                              {item.year}
                            </div>
                            <h4 className="font-medium mb-3 text-gray-900 text-lg">
                              {item.title}
                            </h4>
                            <p className="text-sm text-gray-600 font-light leading-relaxed">{item.desc}</p>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              </TabsContent>

              {/* Mission Tab */}
              <TabsContent value="mission" className="space-y-12 md:space-y-16">
                <motion.div
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: "-50px" }}
                  variants={staggerContainer}
                  className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center"
                >
                  <motion.div 
                    variants={scaleIn}
                    className="order-2 md:order-1 relative h-[400px] md:h-[500px] overflow-hidden border border-gray-200"
                  >
                    <Image
                      src="/assets/about1.jpg"
                      alt="Vardhman Decoration Mission"
                      fill
                      className="object-cover transition-transform duration-700 hover:scale-105"
                      sizes="(max-width: 768px) 100vw, 50vw"
                      priority
                    />
                  </motion.div>
                  <motion.div variants={fadeIn} className="order-1 md:order-2">
                    <h2 className="text-3xl sm:text-4xl md:text-5xl font-light text-gray-900 mb-6 leading-tight tracking-tight">
                      Our Mission
                    </h2>
                    <p className="text-base text-gray-600 font-light mb-8 leading-relaxed">
                      Our mission is to help you celebrate every milestone with
                      style and ease. We strive to provide creative,
                      high-quality decorations and exceptional service for every
                      event—big or small.
                    </p>
                    <h3 className="text-xl font-medium mb-4 text-gray-900">
                      We are committed to:
                    </h3>
                    <ul className="space-y-3 mb-6">
                      {[
                        "Designing decorations that match your unique vision and theme",
                        "Using premium, safe, and eco-friendly materials",
                        "Delivering on time so your event goes smoothly",
                        "Providing friendly, helpful customer support",
                      ].map((point, index) => (
                        <motion.li 
                          key={index} 
                          initial="hidden"
                          whileInView="visible"
                          viewport={{ once: true }}
                          variants={fadeIn}
                          transition={{ delay: index * 0.1 }}
                          className="flex items-start"
                        >
                          <CheckCircle className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-600 font-light leading-relaxed">{point}</span>
                        </motion.li>
                      ))}
                    </ul>
                  </motion.div>
                </motion.div>

                <motion.div
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: "-50px" }}
                  variants={staggerContainer}
                  className="bg-gray-50/50 p-8 md:p-12 border border-gray-100"
                >
                  <motion.h3 
                    variants={fadeIn}
                    className="text-2xl sm:text-3xl font-light text-gray-900 mb-10 md:mb-12 text-center tracking-tight"
                  >
                    Our Core Values
                  </motion.h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-8">
                    {values.map((value, index) => (
                      <motion.div 
                        key={index} 
                        variants={slideUp}
                        whileHover={{ y: -4 }}
                        transition={{ duration: 0.2 }}
                      >
                        <Card className="h-full border border-gray-200 hover:border-green-300 transition-colors">
                          <CardContent className="pt-6">
                            <div className="flex items-center gap-4 mb-4">
                              <div className="p-3 rounded-full bg-green-500 text-white">
                                <value.icon className="h-5 w-5" />
                              </div>
                              <h4 className="font-medium text-gray-900 text-lg">
                                {value.title}
                              </h4>
                            </div>
                            <p className="text-gray-600 font-light leading-relaxed">{value.description}</p>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              </TabsContent>
            </Tabs>
          </motion.div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 sm:py-20 bg-gray-50/50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={fadeIn}
            className="text-center mb-12 md:mb-16"
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-light text-gray-900 mb-4 tracking-tight">
              Get In Touch
            </h2>
            <p className="text-base text-gray-600 font-light max-w-2xl mx-auto leading-relaxed">
              Have questions about our decoration services or want to plan your
              next event? We'd love to help you make it unforgettable.
            </p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={staggerContainer}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 max-w-5xl mx-auto"
          >
            {[
              {
                icon: <Phone className="h-6 w-6" />,
                title: "Call Us",
                desc: "Mon-Fri, 9am-6pm IST",
                contact: "+91 8511950246",
              },
              {
                icon: <MessageSquare className="h-6 w-6" />,
                title: "Email Us",
                desc: "We'll respond within 24 hours",
                contact: "vardhmancreation03@gmail.com",
              },
              {
                icon: <MapPin className="h-6 w-6" />,
                title: "Visit Us",
                desc: "Our Headquarters",
                contact:
                  "Vardhman Creations, Limda Lane road, Jamnagar, Gujarat",
              },
            ].map((info, index) => (
              <motion.div 
                key={index} 
                variants={slideUp}
                whileHover={{ y: -4 }}
                transition={{ duration: 0.2 }}
              >
                <Card className="h-full border border-gray-200 hover:border-green-300 transition-colors">
                  <CardContent className="pt-8 pb-8 text-center flex flex-col items-center">
                    <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-green-500 text-white mb-5">
                      {info.icon}
                    </div>
                    <h3 className="text-lg font-medium mb-2 text-gray-900">
                      {info.title}
                    </h3>
                    <p className="text-sm text-gray-600 font-light mb-3">
                      {info.desc}
                    </p>
                    <p className="font-light text-sm break-words px-4 text-gray-700">
                      {info.contact}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
    </div>
  );
}
