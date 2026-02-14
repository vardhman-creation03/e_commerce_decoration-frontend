/** @type {import('next').NextConfig} */
const nextConfig = {
  trailingSlash: true,
  images: {
    unoptimized: true,
    qualities: [75, 90],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'via.placeholder.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'vardhman-decoration.onrender.com',
        pathname: '/**',
      },
    ],
  },
  // Compress output
  compress: true,
  // Optimize CSS output
  productionBrowserSourceMaps: false,
  // ✅ Experimental optimizations
  experimental: {
    // Optimize package imports to reduce bundle size
    optimizePackageImports: [
      'lucide-react',
      '@radix-ui/react-icons',
      'framer-motion',
      '@radix-ui/react-dialog',
      '@radix-ui/react-dropdown-menu',
      '@radix-ui/react-select',
      '@radix-ui/react-tabs',
    ],
  },
  // ✅ Configure transpilation to target modern browsers only (no polyfills)
  transpilePackages: [],
  // Note: output: 'standalone' is for Docker deployments, removing to avoid conflicts
  // Turbopack configuration (Next.js 16+ default)
  turbopack: {},
  // ✅ Webpack optimizations for better code splitting and tree shaking
  webpack: (config, { isServer, dev }) => {
    // ✅ Target modern browsers - no polyfills needed
    if (!isServer) {
      config.target = ['web', 'es2020'];
    }

    if (!isServer && !dev) {
      // Optimize chunk splitting for production
      config.optimization = {
        ...config.optimization,
        // ✅ Enable tree shaking to remove unused code
        usedExports: true,
        sideEffects: false,
        splitChunks: {
          chunks: 'all',
          minSize: 20000,
          maxSize: 200000, // ✅ Reduced from 244KB to 200KB for better splitting
          maxAsyncRequests: 30,
          maxInitialRequests: 30,
          // ✅ Optimize cache groups to reduce unused code
          cacheGroups: {
            default: false,
            vendors: false,
            // ✅ React and React DOM - separate chunk
            react: {
              name: 'react-vendor',
              test: /[\\/]node_modules[\\/](react|react-dom|scheduler)[\\/]/,
              priority: 50,
              reuseExistingChunk: true,
              enforce: true,
            },
            // Vendor chunk for large libraries
            framerMotion: {
              name: 'framer-motion',
              test: /[\\/]node_modules[\\/](framer-motion)[\\/]/,
              priority: 40,
              reuseExistingChunk: true,
              enforce: true,
            },
            // Radix UI components - split by usage
            radixUI: {
              name: 'radix-ui',
              test: /[\\/]node_modules[\\/]@radix-ui[\\/]/,
              priority: 30,
              reuseExistingChunk: true,
              enforce: true,
            },
            // Redux and related
            redux: {
              name: 'redux',
              test: /[\\/]node_modules[\\/](redux|@reduxjs|react-redux)[\\/]/,
              priority: 30,
              reuseExistingChunk: true,
              enforce: true,
            },
            // ✅ Next.js framework - separate chunk
            nextjs: {
              name: 'nextjs',
              test: /[\\/]node_modules[\\/](next)[\\/]/,
              priority: 25,
              reuseExistingChunk: true,
              enforce: true,
            },
            // ✅ Google Tag Manager - separate chunk for deferred loading
            gtm: {
              name: 'gtm',
              test: /[\\/]node_modules[\\/](.*googletagmanager|.*google-analytics)[\\/]/,
              priority: 25,
              reuseExistingChunk: true,
              enforce: true,
            },
            // Common vendor chunk - only if used in 3+ places (increased threshold)
            vendor: {
              name: 'vendor',
              test: /[\\/]node_modules[\\/]/,
              priority: 20,
              reuseExistingChunk: true,
              minChunks: 3, // ✅ Increased from 2 to 3 to reduce unused code
            },
            // Common chunk for shared code - only if used in 3+ places
            common: {
              name: 'common',
              minChunks: 3, // ✅ Increased from 2 to 3
              priority: 10,
              reuseExistingChunk: true,
            },
          },
        },
      };
    }
    return config;
  },
  // ✅ Optimize CSS loading and remove unused code
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  // ✅ Optimize production builds
  productionBrowserSourceMaps: false,
  // ✅ Enable React strict mode optimizations
  reactStrictMode: true,
  // ✅ Optimize CSS output - remove unused CSS
  poweredByHeader: false,
  // ✅ Optimize JavaScript execution and reduce parsing time
  onDemandEntries: {
    maxInactiveAge: 25 * 1000,
    pagesBufferLength: 2,
  },
  // Content Security Policy headers
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://vercel.live https://www.googletagmanager.com https://www.google-analytics.com https://checkout.razorpay.com",
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
              "font-src 'self' https://fonts.gstatic.com data:",
              "img-src 'self' data: https: blob:",
              "connect-src 'self' https: wss: https://www.google-analytics.com https://www.googletagmanager.com https://api.razorpay.com",
              "frame-src 'self' https: https://checkout.razorpay.com",
              "object-src 'none'",
              "base-uri 'self'",
              "form-action 'self'",
              "frame-ancestors 'none'",
              "upgrade-insecure-requests",
            ].join('; '),
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;