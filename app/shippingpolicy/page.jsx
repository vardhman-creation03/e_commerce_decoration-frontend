'use client';

import React from "react";
import { motion } from "framer-motion";

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

export default function ServiceDeliveryPolicyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-green-50/10 to-white">
      {/* Hero Section */}
      <section className="border-b border-gray-100 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="max-w-4xl mx-auto text-center"
          >
            <motion.div variants={fadeIn} className="space-y-4">
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 leading-tight">
                Service Delivery Policy
              </h1>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
                Learn about our event setup process, delivery timelines, and service execution.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
            className="space-y-8"
          >
            <p className="text-gray-700 leading-relaxed mb-6">
              Thank you for choosing <strong className="font-semibold text-gray-900">Vardhman Decoration</strong> for your event decoration needs. This Service Delivery Policy outlines how and when we will set up your event decorations.
            </p>

            <motion.div variants={slideUp} className="bg-white rounded-2xl border-2 border-gray-100 p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Important Notice</h2>
              <p className="text-gray-700 leading-relaxed">
                We are an <strong className="font-semibold text-green-600">event decoration and management service</strong>, not an e-commerce store. We do not sell or ship physical products. Instead, we provide professional decoration setup services at your event venue.
              </p>
            </motion.div>

            <motion.div variants={slideUp}>
              <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">Booking Confirmation</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                After you book an event decoration package with us, you will receive:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                <li>Booking confirmation email within <strong className="font-semibold">24 hours</strong></li>
                <li>Event details summary including date, time, and venue</li>
                <li>Payment confirmation and invoice</li>
                <li>Assigned event coordinator contact information</li>
              </ul>
            </motion.div>

            <motion.div variants={slideUp}>
              <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">Pre-Event Consultation</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Once your booking is confirmed, our team will:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                <li>Contact you within <strong className="font-semibold">2-3 business days</strong> to discuss your requirements</li>
                <li>Schedule a venue visit (if required) to assess the space</li>
                <li>Provide customization options based on your preferences</li>
                <li>Finalize the decoration theme, colors, and additional elements</li>
                <li>Confirm the setup timeline and any special requests</li>
              </ul>
            </motion.div>

            <motion.div variants={slideUp}>
              <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">Service Delivery Timeline</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Our decoration setup follows this timeline:
              </p>

              <div className="overflow-x-auto rounded-xl border-2 border-gray-100">
                <table className="min-w-full border-collapse text-left">
                  <thead className="bg-green-50">
                    <tr>
                      <th className="border-b-2 border-gray-200 p-4 font-semibold text-gray-900">Service Type</th>
                      <th className="border-b-2 border-gray-200 p-4 font-semibold text-gray-900">Setup Time Before Event</th>
                      <th className="border-b-2 border-gray-200 p-4 font-semibold text-gray-900">Duration</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white">
                    <tr>
                      <td className="border-b border-gray-200 p-4 text-gray-700">Basic Decoration</td>
                      <td className="border-b border-gray-200 p-4 text-gray-700">2-3 hours before</td>
                      <td className="border-b border-gray-200 p-4 text-gray-700">1-2 hours</td>
                    </tr>
                    <tr>
                      <td className="border-b border-gray-200 p-4 text-gray-700">Standard Decoration</td>
                      <td className="border-b border-gray-200 p-4 text-gray-700">3-4 hours before</td>
                      <td className="border-b border-gray-200 p-4 text-gray-700">2-3 hours</td>
                    </tr>
                    <tr>
                      <td className="border-b border-gray-200 p-4 text-gray-700">Premium Decoration</td>
                      <td className="border-b border-gray-200 p-4 text-gray-700">4-6 hours before</td>
                      <td className="border-b border-gray-200 p-4 text-gray-700">3-4 hours</td>
                    </tr>
                    <tr>
                      <td className="p-4 text-gray-700">Large Events/Weddings</td>
                      <td className="p-4 text-gray-700">1 day before</td>
                      <td className="p-4 text-gray-700">4-8 hours</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <p className="text-gray-700 leading-relaxed mt-4">
                <strong className="font-semibold text-gray-900">Note:</strong> Setup times may vary based on venue size, decoration complexity, and accessibility.
              </p>
            </motion.div>

            <motion.div variants={slideUp}>
              <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">Service Area</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                We provide decoration services in the following areas:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                <li><strong className="font-semibold">Local Area:</strong> Within city limits - No additional charges</li>
                <li><strong className="font-semibold">Extended Area:</strong> Up to 50 km - Additional travel charges may apply</li>
                <li><strong className="font-semibold">Outstation:</strong> Beyond 50 km - Custom quote provided</li>
              </ul>
            </motion.div>

            <motion.div variants={slideUp}>
              <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">Venue Requirements</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                To ensure smooth setup, please ensure:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                <li>Venue access is available at the agreed setup time</li>
                <li>Basic amenities (electricity, water) are accessible</li>
                <li>Space is cleared and ready for decoration</li>
                <li>Parking facility for our team and equipment</li>
                <li>Any venue-specific permissions are obtained</li>
              </ul>
            </motion.div>

            <motion.div variants={slideUp}>
              <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">Cleanup & Removal</h2>
              <p className="text-gray-700 leading-relaxed">
                After your event concludes, our team will return to remove all decorations and clean up the venue. This service is included in your booking package at no additional cost. Removal typically takes <strong className="font-semibold">1-2 hours</strong> depending on the decoration scale.
              </p>
            </motion.div>

            <motion.div variants={slideUp}>
              <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">Delays & Rescheduling</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                In case of unforeseen circumstances:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                <li>Please notify us at least <strong className="font-semibold">48 hours in advance</strong> for rescheduling</li>
                <li>Weather-related delays will be communicated immediately</li>
                <li>We maintain backup plans for critical events</li>
                <li>Rescheduling is subject to availability and may incur additional charges</li>
              </ul>
            </motion.div>

            <motion.div variants={slideUp}>
              <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">Cancellation Policy</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Event cancellations are subject to the following terms:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                <li><strong className="font-semibold">7+ days before event:</strong> Full refund minus booking fee</li>
                <li><strong className="font-semibold">3-7 days before event:</strong> 50% refund</li>
                <li><strong className="font-semibold">Less than 3 days:</strong> No refund</li>
              </ul>
            </motion.div>

            <motion.div variants={slideUp} className="bg-green-50 rounded-2xl border-2 border-green-100 p-8 mt-10">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Questions or Special Requests?</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                For any service delivery inquiries, special requests, or to discuss your event requirements, please contact us:
              </p>
              <div className="space-y-2">
                <p className="text-gray-700">
                  <strong className="font-semibold">Email:</strong>{" "}
                  <a
                    href="mailto:vardhmancreation03@gmail.com"
                    className="text-green-600 underline hover:text-green-700 font-semibold"
                  >
                    vardhmancreation03@gmail.com
                  </a>
                </p>
                <p className="text-gray-700">
                  <strong className="font-semibold">Phone:</strong> Available in booking confirmation
                </p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
