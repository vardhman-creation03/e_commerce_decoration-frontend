"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";

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

export default function TermsPage() {
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
                Terms & Conditions
              </h1>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
                Please read these terms carefully before booking our event decoration services.
              </p>
              <p className="text-sm text-gray-500">
                Last Updated: January 2026
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
            variants={staggerContainer}
            className="space-y-6 text-base leading-relaxed"
          >
            <motion.div variants={slideUp} className="bg-white border-2 border-gray-100 rounded-2xl p-6 md:p-8">
              <p className="text-gray-700">
                This website is operated by <strong className="font-semibold text-gray-900">Vardhman Decoration</strong>. Throughout the site, the terms "we", "us" and "our" refer to Vardhman Decoration. We offer this website, including all information, tools and event decoration services available from this site to you, the user, conditioned upon your acceptance of all terms, conditions, policies and notices stated here.
              </p>
            </motion.div>

            <motion.p variants={slideUp} className="text-gray-700">
              By visiting our site and/or booking our event decoration services, you engage in our "Service" and agree to be bound by the following terms and conditions ("Terms of Service", "Terms"), including those additional terms and conditions and policies referenced herein and/or available by hyperlink. These Terms of Service apply to all users of the site and customers booking our services.
            </motion.p>

            <motion.p variants={slideUp} className="text-gray-700">
              Please read these Terms of Service carefully before accessing or using our website or booking our services. By accessing or using any part of the site, you agree to be bound by these Terms of Service. If you do not agree to all the terms and conditions of this agreement, then you may not access the website or use any services.
            </motion.p>

            <motion.div variants={slideUp} className="bg-green-50 border-2 border-green-100 rounded-2xl p-6 mt-8">
              <h3 className="text-lg font-bold text-gray-900 mb-2">Important Notice</h3>
              <p className="text-gray-700">
                <strong className="font-semibold text-green-600">Vardhman Decoration</strong> is an event decoration and management service provider. We do not sell or ship physical products. All services are provided on-site at your event venue.
              </p>
            </motion.div>

            <motion.h2 variants={slideUp} className="text-gray-900 font-bold text-2xl mt-10 mb-4">
              1. Service Booking Terms
            </motion.h2>
            <motion.div variants={slideUp} className="text-gray-700 space-y-3">
              <p>By booking our event decoration services, you agree to:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Provide accurate event details including date, time, venue, and guest count</li>
                <li>Be of legal age (18+) or have guardian consent to enter into this agreement</li>
                <li>Make payment as per the agreed terms and schedule</li>
                <li>Provide venue access at the agreed setup time</li>
                <li>Ensure basic amenities (electricity, water) are available at the venue</li>
                <li>Obtain any necessary venue permissions for decoration setup</li>
              </ul>
            </motion.div>

            <motion.h2 variants={slideUp} className="text-gray-900 font-bold text-2xl mt-10 mb-4">
              2. Booking Confirmation & Payment
            </motion.h2>
            <motion.div variants={slideUp} className="text-gray-700 space-y-3">
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li><strong className="font-semibold">Booking Confirmation:</strong> A booking is confirmed only after payment of the advance amount (typically 30-50% of total cost)</li>
                <li><strong className="font-semibold">Payment Schedule:</strong> Remaining balance must be paid before or on the event date as agreed</li>
                <li><strong className="font-semibold">Payment Methods:</strong> We accept online payments, bank transfers, and cash (as applicable)</li>
                <li><strong className="font-semibold">Invoice:</strong> You will receive an invoice upon booking confirmation</li>
                <li><strong className="font-semibold">Refunds:</strong> Refer to our cancellation policy (Section 8)</li>
              </ul>
            </motion.div>

            <motion.h2 variants={slideUp} className="text-gray-900 font-bold text-2xl mt-10 mb-4">
              3. Service Delivery & Setup
            </motion.h2>
            <motion.div variants={slideUp} className="text-gray-700 space-y-3">
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>We will arrive at the venue at the agreed setup time</li>
                <li>Setup duration varies based on decoration complexity (1-8 hours)</li>
                <li>Venue must be accessible and ready for decoration</li>
                <li>Any delays due to venue issues are not our responsibility</li>
                <li>We will remove decorations after the event as per agreement</li>
                <li>Additional charges may apply for extended service hours or last-minute changes</li>
              </ul>
            </motion.div>

            <motion.h2 variants={slideUp} className="text-gray-900 font-bold text-2xl mt-10 mb-4">
              4. Customization & Changes
            </motion.h2>
            <motion.div variants={slideUp} className="text-gray-700 space-y-3">
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Customization requests must be made at least 7 days before the event</li>
                <li>Changes within 3 days of the event may incur additional charges</li>
                <li>We reserve the right to substitute materials with equivalent alternatives if original items are unavailable</li>
                <li>Final design approval should be obtained before the event date</li>
                <li>Photos shown are for reference; actual setup may vary slightly</li>
              </ul>
            </motion.div>

            <motion.h2 variants={slideUp} className="text-gray-900 font-bold text-2xl mt-10 mb-4">
              5. Client Responsibilities
            </motion.h2>
            <motion.div variants={slideUp} className="text-gray-700 space-y-3">
              <p>As a client, you are responsible for:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Providing accurate venue address and contact information</li>
                <li>Ensuring venue access permissions and parking facilities</li>
                <li>Informing us of any venue restrictions or special requirements</li>
                <li>Coordinating with the venue management for our team's access</li>
                <li>Protecting decorations during the event (we are not liable for damage caused by guests)</li>
                <li>Notifying us immediately of any issues during setup</li>
              </ul>
            </motion.div>

            <motion.h2 variants={slideUp} className="text-gray-900 font-bold text-2xl mt-10 mb-4">
              6. Liability & Damages
            </motion.h2>
            <motion.div variants={slideUp} className="text-gray-700 space-y-3">
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>We are not liable for venue damage caused by normal decoration setup</li>
                <li>Any pre-existing venue damage should be reported before setup</li>
                <li>We are not responsible for decorations damaged by guests during the event</li>
                <li>Weather-related issues for outdoor events are beyond our control</li>
                <li>We maintain liability insurance for our team and equipment</li>
                <li>Maximum liability is limited to the amount paid for the service</li>
              </ul>
            </motion.div>

            <motion.h2 variants={slideUp} className="text-gray-900 font-bold text-2xl mt-10 mb-4">
              7. Force Majeure
            </motion.h2>
            <motion.div variants={slideUp} className="text-gray-700 space-y-3">
              <p>We are not liable for failure to perform services due to:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Natural disasters, extreme weather conditions</li>
                <li>Government restrictions, lockdowns, or curfews</li>
                <li>Accidents, illness, or emergencies affecting our team</li>
                <li>Venue closure or access denial</li>
                <li>Any other circumstances beyond our reasonable control</li>
              </ul>
              <p className="mt-3">In such cases, we will work with you to reschedule or provide a partial/full refund as appropriate.</p>
            </motion.div>

            <motion.h2 variants={slideUp} className="text-gray-900 font-bold text-2xl mt-10 mb-4">
              8. Cancellation & Rescheduling Policy
            </motion.h2>
            <motion.div variants={slideUp} className="text-gray-700 space-y-3">
              <p><strong className="font-semibold">Cancellation by Client:</strong></p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li><strong>7+ days before event:</strong> Full refund minus 10% booking fee</li>
                <li><strong>3-7 days before event:</strong> 50% refund</li>
                <li><strong>Less than 3 days before event:</strong> No refund</li>
              </ul>
              <p className="mt-3"><strong className="font-semibold">Rescheduling:</strong></p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Notify us at least 48 hours in advance</li>
                <li>Subject to availability on the new date</li>
                <li>May incur additional charges based on new requirements</li>
              </ul>
            </motion.div>

            <motion.h2 variants={slideUp} className="text-gray-900 font-bold text-2xl mt-10 mb-4">
              9. Photography & Portfolio Use
            </motion.h2>
            <motion.div variants={slideUp} className="text-gray-700 space-y-3">
              <p>By booking our services, you grant us permission to:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Photograph our decoration work at your event</li>
                <li>Use these photos for our portfolio, website, and marketing materials</li>
                <li>Share photos on social media platforms</li>
              </ul>
              <p className="mt-3">If you prefer not to have your event photographed or shared, please inform us in writing before the event.</p>
            </motion.div>

            <motion.h2 variants={slideUp} className="text-gray-900 font-bold text-2xl mt-10 mb-4">
              10. Intellectual Property
            </motion.h2>
            <motion.div variants={slideUp} className="text-gray-700 space-y-3">
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>All decoration designs, concepts, and arrangements are our intellectual property</li>
                <li>You may not reproduce or copy our designs for commercial purposes</li>
                <li>Website content, images, and materials are protected by copyright</li>
                <li>Unauthorized use of our content may result in legal action</li>
              </ul>
            </motion.div>

            <motion.h2 variants={slideUp} className="text-gray-900 font-bold text-2xl mt-10 mb-4">
              11. Privacy & Data Protection
            </motion.h2>
            <motion.div variants={slideUp} className="text-gray-700">
              <p>
                Personal information submitted through our website or booking process is governed by our{" "}
                <Link href="/privacy-policy" className="text-green-600 hover:text-green-700 underline font-semibold">
                  Privacy Policy
                </Link>
                . We are committed to protecting your personal data and using it only for service delivery and communication purposes.
              </p>
            </motion.div>

            <motion.h2 variants={slideUp} className="text-gray-900 font-bold text-2xl mt-10 mb-4">
              12. Prohibited Uses
            </motion.h2>
            <motion.div variants={slideUp} className="text-gray-700 space-y-3">
              <p>You may not use our website or services for:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Any unlawful or illegal purposes</li>
                <li>Fraudulent bookings or payment chargebacks</li>
                <li>Harassing or threatening our staff</li>
                <li>Submitting false information or impersonating others</li>
                <li>Attempting to hack, disrupt, or damage our website</li>
              </ul>
            </motion.div>

            <motion.h2 variants={slideUp} className="text-gray-900 font-bold text-2xl mt-10 mb-4">
              13. Warranty Disclaimer
            </motion.h2>
            <motion.div variants={slideUp} className="text-gray-700">
              <p>
                We provide our services "as-is" and make no warranties, express or implied, regarding the suitability of decorations for any specific purpose. While we strive for excellence, we cannot guarantee that decorations will be exactly as shown in reference photos due to material availability and venue conditions.
              </p>
            </motion.div>

            <motion.h2 variants={slideUp} className="text-gray-900 font-bold text-2xl mt-10 mb-4">
              14. Limitation of Liability
            </motion.h2>
            <motion.div variants={slideUp} className="text-gray-700">
              <p>
                Our total liability for any claims arising from our services is limited to the amount you paid for the specific service. We are not liable for indirect, incidental, or consequential damages including loss of profits, data, or business opportunities.
              </p>
            </motion.div>

            <motion.h2 variants={slideUp} className="text-gray-900 font-bold text-2xl mt-10 mb-4">
              15. Governing Law & Jurisdiction
            </motion.h2>
            <motion.div variants={slideUp} className="text-gray-700">
              <p>
                These Terms of Service are governed by the laws of India. Any disputes arising from these terms or our services shall be subject to the exclusive jurisdiction of the courts in Jaipur, Rajasthan.
              </p>
            </motion.div>

            <motion.h2 variants={slideUp} className="text-gray-900 font-bold text-2xl mt-10 mb-4">
              16. Changes to Terms
            </motion.h2>
            <motion.div variants={slideUp} className="text-gray-700">
              <p>
                We reserve the right to update or modify these Terms of Service at any time without prior notice. Changes will be effective immediately upon posting on this page. Your continued use of our website or services after changes constitutes acceptance of the modified terms.
              </p>
            </motion.div>

            <motion.h2 variants={slideUp} className="text-gray-900 font-bold text-2xl mt-10 mb-4">
              17. Severability
            </motion.h2>
            <motion.div variants={slideUp} className="text-gray-700">
              <p>
                If any provision of these Terms is found to be invalid or unenforceable, the remaining provisions shall continue in full force and effect.
              </p>
            </motion.div>

            <motion.h2 variants={slideUp} className="text-gray-900 font-bold text-2xl mt-10 mb-4">
              18. Entire Agreement
            </motion.h2>
            <motion.div variants={slideUp} className="text-gray-700">
              <p>
                These Terms of Service, along with our Privacy Policy and Service Delivery Policy, constitute the entire agreement between you and Vardhman Decoration regarding the use of our website and services.
              </p>
            </motion.div>

            <motion.div variants={slideUp} className="bg-green-50 border-2 border-green-100 rounded-2xl p-6 md:p-8 mt-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Contact Information</h2>
              <p className="text-gray-700 mb-4">
                If you have any questions about these Terms & Conditions, please contact us:
              </p>
              <div className="space-y-2 mb-6">
                <p className="text-gray-700">
                  <strong className="font-semibold">Business Name:</strong> Vardhman Decoration
                </p>
                <p className="text-gray-700">
                  <strong className="font-semibold">Email:</strong>{" "}
                  <a href="mailto:vardhmancreation03@gmail.com" className="text-green-600 hover:text-green-700 underline font-semibold">
                    vardhmancreation03@gmail.com
                  </a>
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button asChild className="rounded-full font-semibold bg-green-500 hover:bg-green-600 text-white">
                  <Link href="/contact">Contact Us</Link>
                </Button>
                <Button variant="outline" asChild className="rounded-full font-semibold border-2">
                  <Link href="/">Return to Home</Link>
                </Button>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
