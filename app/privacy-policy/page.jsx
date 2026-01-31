'use client'
import { motion } from "framer-motion"
import { Shield, Lock, FileText, Eye, UserCheck, Clock, AlertCircle } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

const PrivacyPolicyPage = () => {
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
      },
    },
  }

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
      },
    },
  }

  const slideUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
  }

  const sections = [
    {
      id: "information-collection",
      icon: <FileText className="h-6 w-6" />,
      title: "Information Collection",
      content: `
        <p>We collect several types of information from and about users of our Website and event booking services, including:</p>
        <ul>
          <li><strong>Personal Information:</strong> Name, email address, phone number, venue address, and event details when you book our decoration services</li>
          <li><strong>Payment Information:</strong> Billing details and payment information processed securely through our payment gateway</li>
          <li><strong>Event Details:</strong> Event date, time, venue location, guest count, theme preferences, and special requirements</li>
          <li><strong>Technical Information:</strong> Information about your internet connection, device, and usage details when accessing our Website</li>
          <li><strong>Communication Records:</strong> Correspondence with our team regarding your event requirements and customizations</li>
          <li><strong>Cookies and Tracking:</strong> Information collected through cookies, web beacons, and other tracking technologies</li>
        </ul>
      `,
    },
    {
      id: "information-usage",
      icon: <Eye className="h-6 w-6" />,
      title: "How We Use Your Information",
      content: `
        <p>We use the information we collect to provide and improve our event decoration services:</p>
        <ul>
          <li><strong>Service Delivery:</strong> To plan, coordinate, and execute your event decoration setup</li>
          <li><strong>Event Coordination:</strong> To communicate with you about your event details, customizations, and timeline</li>
          <li><strong>Booking Management:</strong> To process your bookings, payments, and send confirmation details</li>
          <li><strong>Venue Coordination:</strong> To coordinate with your event venue for setup access and requirements</li>
          <li><strong>Service Improvement:</strong> To improve our decoration services, designs, and customer experience</li>
          <li><strong>Communication:</strong> To send you updates, reminders, and follow-ups about your event</li>
          <li><strong>Marketing:</strong> To send promotional offers and updates about our services (with your consent)</li>
          <li><strong>Legal Compliance:</strong> To fulfill our legal obligations and enforce our terms of service</li>
        </ul>
      `,
    },
    {
      id: "information-sharing",
      icon: <UserCheck className="h-6 w-6" />,
      title: "Information Sharing and Disclosure",
      content: `
        <p>We may share your information in the following circumstances:</p>
        <ul>
          <li><strong>Service Providers:</strong> With our decoration team, vendors, and suppliers who help execute your event</li>
          <li><strong>Venue Partners:</strong> With your event venue to coordinate setup access and logistics</li>
          <li><strong>Payment Processors:</strong> With secure payment gateways to process your booking payments</li>
          <li><strong>Third-Party Services:</strong> With contractors and service providers who support our business operations</li>
          <li><strong>Legal Requirements:</strong> When required by law, court order, or legal process</li>
          <li><strong>Business Transfers:</strong> In the event of a merger, acquisition, or sale of our business</li>
          <li><strong>Safety and Protection:</strong> To protect the rights, property, or safety of our company, customers, or others</li>
        </ul>
        <p><strong>Note:</strong> We do not sell your personal information to third parties for marketing purposes.</p>
      `,
    },
    {
      id: "data-security",
      icon: <Lock className="h-6 w-6" />,
      title: "Data Security",
      content: `
        <p>We implement robust security measures to protect your personal information:</p>
        <ul>
          <li><strong>Secure Storage:</strong> All information is stored on secure servers behind firewalls</li>
          <li><strong>Encryption:</strong> Sensitive data, including payment information, is encrypted during transmission</li>
          <li><strong>Access Control:</strong> Limited access to personal information only to authorized personnel</li>
          <li><strong>Regular Audits:</strong> Periodic security audits and updates to our systems</li>
          <li><strong>Secure Payments:</strong> Payment processing through PCI-compliant payment gateways</li>
        </ul>
        <p>While we implement strong security measures, please note that no method of transmission over the internet is 100% secure. You are responsible for keeping your account password confidential.</p>
      `,
    },
    {
      id: "data-retention",
      icon: <Clock className="h-6 w-6" />,
      title: "Data Retention",
      content: `
        <p>We retain your information for different periods depending on the purpose:</p>
        <ul>
          <li><strong>Event Records:</strong> Booking and event details are retained for 2 years for service records and potential future bookings</li>
          <li><strong>Payment Records:</strong> Financial transaction records are kept for 7 years as required by law</li>
          <li><strong>Communication:</strong> Email and message correspondence is retained for 1 year</li>
          <li><strong>Marketing Data:</strong> Marketing preferences and contact information until you unsubscribe</li>
          <li><strong>Photos/Videos:</strong> Event photos (if taken) are retained with your consent for portfolio purposes</li>
        </ul>
        <p>You can request deletion of your personal data at any time, subject to legal retention requirements.</p>
      `,
    },
    {
      id: "cookies",
      icon: <Shield className="h-6 w-6" />,
      title: "Cookies and Tracking Technologies",
      content: `
        <p>We use cookies and similar tracking technologies to enhance your browsing experience:</p>
        <ul>
          <li><strong>Session Cookies:</strong> To maintain your browsing session and booking process</li>
          <li><strong>Preference Cookies:</strong> To remember your preferences and settings</li>
          <li><strong>Analytics Cookies:</strong> To understand how visitors use our Website and improve user experience</li>
          <li><strong>Security Cookies:</strong> For security and fraud prevention purposes</li>
        </ul>
        <p>You can control cookies through your browser settings. However, disabling cookies may limit some functionality of our Website.</p>
      `,
    },
    {
      id: "your-rights",
      icon: <UserCheck className="h-6 w-6" />,
      title: "Your Privacy Rights",
      content: `
        <p>You have the following rights regarding your personal information:</p>
        <ul>
          <li><strong>Access:</strong> Request a copy of the personal information we hold about you</li>
          <li><strong>Correction:</strong> Request correction of inaccurate or incomplete information</li>
          <li><strong>Deletion:</strong> Request deletion of your personal data (subject to legal requirements)</li>
          <li><strong>Opt-Out:</strong> Unsubscribe from marketing communications at any time</li>
          <li><strong>Data Portability:</strong> Request your data in a portable format</li>
          <li><strong>Withdraw Consent:</strong> Withdraw consent for data processing where applicable</li>
        </ul>
        <p>To exercise these rights, please contact us at <a href="mailto:vardhmancreation03@gmail.com" class="text-green-600 hover:text-green-700 underline font-semibold">vardhmancreation03@gmail.com</a></p>
      `,
    },
    {
      id: "third-party",
      icon: <AlertCircle className="h-6 w-6" />,
      title: "Third-Party Links",
      content: `
        <p>Our Website may contain links to third-party websites, social media platforms, or payment gateways. Please note:</p>
        <ul>
          <li>We are not responsible for the privacy practices of third-party sites</li>
          <li>We recommend reviewing the privacy policy of any site you visit</li>
          <li>Third-party payment processors have their own privacy policies</li>
          <li>Social media integrations are subject to their respective privacy policies</li>
        </ul>
      `,
    },
    {
      id: "changes",
      icon: <Clock className="h-6 w-6" />,
      title: "Changes to Our Privacy Policy",
      content: `
        <p>We may update this Privacy Policy from time to time to reflect changes in our practices or legal requirements:</p>
        <ul>
          <li>We will notify you of significant changes by posting a notice on our Website</li>
          <li>The "Last Updated" date at the top will be revised</li>
          <li>Continued use of our services after changes constitutes acceptance</li>
          <li>We encourage you to review this policy periodically</li>
        </ul>
      `,
    },
  ]

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
                Privacy Policy
              </h1>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
                Learn how we collect, use, and protect your personal information when you book our event decoration services.
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
            variants={fadeIn}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="bg-white border-2 border-gray-100 rounded-2xl p-6 md:p-8 mb-10"
          >
            <p className="text-gray-700 leading-relaxed">
              At <strong className="font-semibold text-gray-900">Vardhman Decoration</strong>, we take your privacy seriously. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website or book our event decoration services. Please read this privacy policy carefully. If you do not agree with the terms of this privacy policy, please do not access the site or use our services.
            </p>
          </motion.div>

          {/* Table of Contents */}
          <motion.div
            variants={fadeIn}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="bg-green-50 border-2 border-green-100 rounded-2xl p-6 mb-10"
          >
            <h2 className="text-xl font-bold text-gray-900 mb-4">Table of Contents</h2>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {sections.map((section) => (
                <li key={section.id}>
                  <a href={`#${section.id}`} className="text-green-600 hover:text-green-700 hover:underline flex items-center font-semibold">
                    <span className="mr-2">{section.icon}</span>
                    {section.title}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Policy Sections */}
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            className="space-y-10"
          >
            {sections.map((section) => (
              <motion.section key={section.id} id={section.id} variants={slideUp} className="scroll-mt-20">
                <div className="flex items-center mb-4">
                  <div className="bg-green-500 text-white p-3 rounded-xl mr-3">{section.icon}</div>
                  <h2 className="text-2xl font-bold text-gray-900">{section.title}</h2>
                </div>
                <div className="prose prose-gray max-w-none text-gray-700" dangerouslySetInnerHTML={{ __html: section.content }} />
              </motion.section>
            ))}
          </motion.div>

          {/* Contact Section */}
          <motion.div
            variants={fadeIn}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="mt-16 bg-green-50 border-2 border-green-100 rounded-2xl p-6 md:p-8"
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Contact Us</h2>
            <p className="mb-6 text-gray-700 leading-relaxed">
              If you have any questions or concerns about our Privacy Policy or how we handle your personal information, please don't hesitate to contact us.
            </p>
            <div className="space-y-2 mb-6">
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
        </div>
      </div>
    </div>
  )
}

export default PrivacyPolicyPage