"use client";

import { motion } from "framer-motion";
import { Palette, Type, Sparkles, Home, CheckCircle2 } from "lucide-react";

const customizationOptions = [
    {
        icon: <Type className="w-5 h-5" />,
        title: "Text Customization",
        description: "Welcome Baby / Baby Shower / Name",
        color: "text-blue-600 bg-blue-50"
    },
    {
        icon: <Palette className="w-5 h-5" />,
        title: "Color Theme Changes",
        description: "Match your preferred color palette",
        color: "text-purple-600 bg-purple-50"
    },
    {
        icon: <Sparkles className="w-5 h-5" />,
        title: "Additional Foil Balloons",
        description: "Extra balloons or decorative accents",
        color: "text-pink-600 bg-pink-50"
    },
    {
        icon: <Home className="w-5 h-5" />,
        title: "Suitable for Home & Indoor",
        description: "Perfect for home and indoor venues",
        color: "text-green-600 bg-green-50"
    }
];

export default function ProductCustomization() {
    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-center mb-12"
            >
                <div className="inline-flex items-center gap-2 text-green-600 mb-3">
                    <Sparkles className="w-5 h-5" />
                    <span className="text-sm font-semibold">Customization</span>
                </div>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
                    Make It Yours
                </h2>
                <p className="text-gray-600 max-w-2xl mx-auto">
                    Every event is unique. Customize your decoration to perfectly match your vision and style.
                </p>
            </motion.div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {customizationOptions.map((option, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.1 }}
                        className="relative group"
                    >
                        <div className="bg-white border-2 border-gray-200 rounded-2xl p-6 h-full hover:border-green-300 hover:shadow-lg transition-all">
                            {/* Icon */}
                            <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl ${option.color} mb-4 group-hover:scale-110 transition-transform`}>
                                {option.icon}
                            </div>

                            {/* Title */}
                            <h3 className="text-lg font-bold text-gray-900 mb-2">
                                {option.title}
                            </h3>

                            {/* Description */}
                            <p className="text-sm text-gray-600 leading-relaxed">
                                {option.description}
                            </p>

                            {/* Checkmark */}
                            <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                <CheckCircle2 className="w-5 h-5 text-green-500" />
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Additional Info */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="mt-8 text-center p-6 bg-gradient-to-br from-green-50 to-blue-50 rounded-2xl border border-green-100"
            >
                <p className="text-gray-700 font-medium">
                    💡 <span className="font-bold">Pro Tip:</span> Share your customization preferences in the booking form, and our team will bring your vision to life!
                </p>
            </motion.div>
        </div>
    );
}
