"use client";

import { CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";

export default function ProductIncludes({ includes = [] }) {
  if (!includes || includes.length === 0) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-12"
      >
        <span className="inline-block text-sm font-semibold text-green-600 mb-2">
          Package Includes
        </span>
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
          What You'll Get
        </h2>
        <p className="text-gray-600 mt-3 max-w-2xl mx-auto">
          Every package is curated with premium materials and professional service to ensure your event is perfect.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {includes.map((item, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.05 }}
            className="flex items-start gap-3 p-4 bg-white rounded-xl border border-gray-200 hover:border-green-300 hover:shadow-md transition-all group"
          >
            <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5 group-hover:scale-110 transition-transform" />
            <span className="text-gray-700 font-medium group-hover:text-gray-900 transition-colors">
              {item}
            </span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
