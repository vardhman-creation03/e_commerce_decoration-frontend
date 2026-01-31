"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, HelpCircle } from "lucide-react";

const faqs = [
  {
    q: "How long does setup take?",
    a: "Our professional team usually takes between 45 to 90 minutes depending on the complexity of your chosen theme. We ensure everything is perfect before your event begins."
  },
  {
    q: "Is customization possible?",
    a: "Absolutely! We can customize colors, balloon types, and even add personalized neon signs. Share your vision, and we'll bring it to life."
  },
  {
    q: "Do you provide cleanup?",
    a: "Yes, we offer complimentary cleanup services. Simply let our team know during setup if you'd like us to return and handle the teardown."
  },
  {
    q: "How far in advance should I book?",
    a: "To ensure availability for your preferred date and time, we recommend booking at least 3-5 days in advance, especially for weekends."
  },
  {
    q: "What areas do you serve?",
    a: "We currently serve Ahmedabad and Jamnagar. Contact us if you're in a nearby area, and we'll do our best to accommodate your event."
  }
];

export default function ProductFAQ() {
  const [openIndex, setOpenIndex] = useState(null);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-12"
      >
        <div className="inline-flex items-center gap-2 text-green-600 mb-3">
          <HelpCircle className="w-5 h-5" />
          <span className="text-sm font-semibold">FAQ</span>
        </div>
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
          Frequently Asked Questions
        </h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Got questions? We've got answers. If you don't find what you're looking for, feel free to contact us.
        </p>
      </motion.div>

      <div className="space-y-3">
        {faqs.map((faq, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.05 }}
            className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:border-green-300 transition-colors"
          >
            <button
              onClick={() => setOpenIndex(openIndex === i ? null : i)}
              className="w-full text-left p-5 flex items-center justify-between gap-4 group"
            >
              <h4 className="text-base md:text-lg font-semibold text-gray-900 group-hover:text-green-600 transition-colors">
                {faq.q}
              </h4>
              <ChevronDown
                className={`w-5 h-5 text-gray-400 flex-shrink-0 transition-transform duration-300 ${openIndex === i ? "rotate-180 text-green-600" : ""
                  }`}
              />
            </button>

            <AnimatePresence>
              {openIndex === i && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  className="overflow-hidden"
                >
                  <div className="px-5 pb-5 pt-0">
                    <p className="text-gray-600 leading-relaxed">
                      {faq.a}
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>

      {/* Contact CTA */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mt-12 text-center p-8 bg-gradient-to-br from-green-50 to-blue-50 rounded-2xl border border-green-100"
      >
        <h3 className="text-xl font-bold text-gray-900 mb-2">Still have questions?</h3>
        <p className="text-gray-600 mb-4">Our team is here to help you plan the perfect event.</p>
        <a
          href="/contact"
          className="inline-flex items-center gap-2 bg-green-500 text-white px-6 py-3 rounded-full font-semibold hover:bg-green-600 transition-all shadow-md hover:shadow-lg"
        >
          Contact Us
        </a>
      </motion.div>
    </div>
  );
}
