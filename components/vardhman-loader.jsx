import { motion } from "framer-motion";

// Fast background fade-in
const backgroundVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    background: "linear-gradient(135deg, #ffffff 0%, #f0fdf4 100%)", // White to green-50
    transition: { duration: 0.3, ease: "easeOut" },
  },
  exit: { opacity: 0, transition: { duration: 0.2 } },
};

// Faster letter animation with scale and fade
const letterVariants = {
  hidden: { opacity: 0, scale: 0.8, y: 5 },
  visible: (i) => ({
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      delay: i * 0.03, // Much faster stagger (0.03s instead of 0.1s)
      duration: 0.2,
      ease: [0.25, 0.46, 0.45, 0.94], // Custom easing for snappier feel
    },
  }),
};

// Simplified tagline animation - appears much faster
const taglineVariants = {
  hidden: { opacity: 0, y: 5 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      delay: 0.4, // Appears after ~0.4s (much faster than 1.5s)
      duration: 0.3,
      ease: "easeOut",
    },
  },
};

// Decorative accent animation
const accentVariants = {
  hidden: { scale: 0, opacity: 0 },
  visible: {
    scale: 1,
    opacity: 1,
    transition: {
      delay: 0.35,
      duration: 0.25,
      ease: "easeOut",
    },
  },
};

export default function VardhmanLoader() {
  const word1 = "Vardhman";
  const word2 = "Decoration";

  return (
    <motion.div
      className="fixed inset-0 flex flex-col items-center justify-center z-50 px-4 bg-white"
      initial="hidden"
      animate="visible"
      exit="exit"
      variants={backgroundVariants}
    >
      {/* Modern Logo Container */}
      <div className="relative">
        {/* Decorative accent dots - Green */}
        <motion.div
          className="absolute -left-4 sm:-left-8 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-green-500/60"
          variants={accentVariants}
        />
        <motion.div
          className="absolute -right-4 sm:-right-8 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-green-500/60"
          variants={accentVariants}
        />

        {/* Brand Name - Faster animation */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-3">
          <div className="flex items-center space-x-0.5 sm:space-x-1">
            {word1.split("").map((letter, index) => (
              <motion.span
                key={index}
                className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 tracking-tight"
                custom={index}
                initial="hidden"
                animate="visible"
                variants={letterVariants}
              >
                {letter}
              </motion.span>
            ))}
          </div>
          <div className="flex items-center space-x-0.5 sm:space-x-1">
            {word2.split("").map((letter, index) => (
              <motion.span
                key={index}
                className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 tracking-tight"
                custom={index + word1.length}
                initial="hidden"
                animate="visible"
                variants={letterVariants}
              >
                {letter}
              </motion.span>
            ))}
          </div>
        </div>
      </div>

      {/* Tagline - Appears much faster */}
      <motion.p
        className="mt-3 sm:mt-4 text-sm sm:text-base font-medium text-gray-600 tracking-wide"
        initial="hidden"
        animate="visible"
        variants={taglineVariants}
      >
        Elevate the Art of Celebration
      </motion.p>

      {/* Subtle loading indicator - Green */}
      <motion.div
        className="mt-6 w-24 h-0.5 bg-gray-200 rounded-full overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.2 }}
      >
        <motion.div
          className="h-full bg-green-500 rounded-full"
          initial={{ width: "0%" }}
          animate={{ width: "100%" }}
          transition={{
            delay: 0.6,
            duration: 0.8,
            ease: "easeInOut",
          }}
        />
      </motion.div>
    </motion.div>
  );
}