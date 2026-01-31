import "./globals.css";
import { Poppins } from "next/font/google";
import ClientLayout from "./ClientLayout";
import Script from "next/script";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-poppins",
  display: "swap", // Prevent font from blocking render
  preload: true, // Preload font for better performance
});

// ✅ SEO metadata for all pages
export const metadata = {
  title: "Vardhman Decoration | Premium Decoration Products",
  description:
    "Buy premium decoration products online at Vardhman Decoration. Explore party supplies, birthday decor, baby shower items, and more at the best prices.",
  keywords: [
    "Vardhman Decoration",
    "All Products",
    "Decoration Products",
    "Buy Online",
    "Decoration Items",
    "Party Decorations",
    "Home Decor",
    "Birthday Decoration",
    "Shop Online",
    "Best Price",
    "Premium Products",
    "Quality Decoration",
    "Decoration Store",
    "Online Shopping",
    "Decoration Accessories",
    "Decoration Supplies",
    "Decoration Gifts",
    "Decoration Ideas",
    "Decoration Trends",
    "Decoration Inspiration",
    "Decoration Collection",
    "Decoration Essentials",
    "Decoration Deals",
    "Decoration Offers",
    "Decoration Sale",
    "Decoration Discounts",
    "Decoration Products Online",
    "Decoration Products India",
    "Decoration Products Shop",
    "Balloons Decoration",
    "Banners and Streamers",
    "Birthday Banners",
    "Birthday Decoration Kit",
    "Birthday Balloons",
    "Baby Shower Decorations",
    "Baby Shower Balloons",
    "Baby Shower Foil Balloons",
    "Baby Shower Decoration Kit",
    "Wedding Decorations",
    "Anniversary Decorations",
    "Anniversary Decoration Kit",
  ].join(", "),
  metadataBase: new URL("https://www.thevardhmancreation.com/"),
  alternates: {
    canonical: "https://www.thevardhmancreation.com/",
  },
  openGraph: {
    title: "Vardhman Decoration | Premium Decoration Products",
    description:
      "Shop birthday, wedding, anniversary, baby shower, and car decoration products at the best prices.",
    url: "https://www.thevardhmancreation.com/",
    siteName: "Vardhman Decoration",
    images: [
      {
        url: "https://www.thevardhmancreation.com/og-products.jpg",
        width: 1200,
        height: 630,
        alt: "All Products - Vardhman Decoration",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Vardhman Decoration | Premium Decoration Products",
    description:
      "Explore premium decoration items online – balloons, party supplies, banners, baby shower kits, and more.",
    images: ["https://www.thevardhmancreation.com/og-products.jpg"],
  },
  robots: "index, follow",
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/favicon.ico",
  },
};

// ✅ Organization Schema for Google
const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Vardhman Decoration",
  url: "https://www.thevardhmancreation.com/",
  description:
    "Vardhman Decoration offers premium products for birthdays, weddings, anniversaries, and baby showers.",
  sameAs: [
    "https://www.facebook.com/vardhmandecoration",
    "https://www.instagram.com/vardhman_decoration25",
  ],
  contactPoint: {
    "@type": "ContactPoint",
    telephone: "+91-8511950246",
    contactType: "Customer Service",
    email: "vardhmancreation03@gmail.com",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="scroll-smooth" data-scroll-behavior="smooth">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        {/* Google Tag Manager - Must be placed as high as possible in the head */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
              new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
              j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
              'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
              })(window,document,'script','dataLayer','GTM-5RMM8F35');
            `,
          }}
        />
        {/* End Google Tag Manager */}

        {/* Critical inline script to defer CSS loading - Must run FIRST before any CSS */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                'use strict';
                var processed = new Set();
                
                // Function to defer a single stylesheet
                function deferStylesheet(link) {
                  var href = link.getAttribute('href') || link.href;
                  if (!href || href.match(/^data:/) || processed.has(href)) return;
                  
                  processed.add(href);
                  
                  // Use media="print" trick - browser loads it but doesn't block render
                  link.media = 'print';
                  
                  // Check for onload support BEFORE assigning (fix for browsers without onload support)
                  var supportsOnload = 'onload' in link;
                  if (supportsOnload) {
                    link.onload = function() {
                      this.media = 'all';
                    };
                  } else {
                    // Fallback for browsers that don't support onload
                    setTimeout(function() {
                      link.media = 'all';
                    }, 0);
                  }
                }
                
                // Process existing stylesheets immediately
                function processExisting() {
                  var links = document.querySelectorAll('link[rel="stylesheet"]');
                  for (var i = 0; i < links.length; i++) {
                    deferStylesheet(links[i]);
                  }
                }
                
                // Run immediately - don't wait for DOM
                if (document.head) {
                  processExisting();
                }
                
                // Also run when head is available
                if (document.readyState === 'loading') {
                  document.addEventListener('readystatechange', function() {
                    if (document.readyState !== 'loading' && document.head) {
                      processExisting();
                    }
                  });
                }
                
                // Watch for new stylesheets added dynamically
                if (window.MutationObserver && document.head) {
                  var observer = new MutationObserver(function(mutations) {
                    for (var i = 0; i < mutations.length; i++) {
                      var nodes = mutations[i].addedNodes;
                      for (var j = 0; j < nodes.length; j++) {
                        var node = nodes[j];
                        if (node.nodeType === 1 && node.tagName === 'LINK' && 
                            node.rel === 'stylesheet') {
                          deferStylesheet(node);
                        }
                      }
                    }
                  });
                  
                  observer.observe(document.head || document.documentElement, {
                    childList: true,
                    subtree: true
                  });
                }
                
                // Fallback: run on DOMContentLoaded
                if (document.readyState === 'loading') {
                  document.addEventListener('DOMContentLoaded', processExisting);
                }
              })();
            `,
          }}
        />

        {/* Preconnect to critical external domains for faster resource loading - Priority order matters */}
        {/* API origin - Critical for LCP (300ms savings) */}
        <link rel="preconnect" href="https://vardhman-decoration.onrender.com" crossOrigin="anonymous" />
        {/* Image CDN - Critical for product images */}
        <link rel="preconnect" href="https://res.cloudinary.com" crossOrigin="anonymous" />
        {/* Fonts - Critical for FCP */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* Unsplash images - Lower priority */}
        <link rel="dns-prefetch" href="https://images.unsplash.com" />

        {/* Preload LCP image (hero background) for optimal LCP performance */}
        <link
          rel="preload"
          as="image"
          href="https://images.unsplash.com/photo-1511578314322-379afb476865?w=1920&q=80"
          fetchPriority="high"
        />

        {/* Google Analytics - Deferred loading to improve performance */}

        {/* Razorpay is loaded dynamically on payment page only - not needed globally */}

        {/* Schema.org */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationSchema).replace(/</g, "\\u003c"),
          }}
        />
      </head>

      <body className={`${poppins.variable} font-poppins`} suppressHydrationWarning={true}>
        {/* Google Tag Manager (noscript) */}
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-5RMM8F35"
            height="0"
            width="0"
            style={{ display: 'none', visibility: 'hidden' }}
          ></iframe>
        </noscript>
        {/* End Google Tag Manager (noscript) */}

        <ClientLayout>{children}</ClientLayout>

        {/* Google Analytics - Deferred until after page is interactive and user engages */}
        <Script
          id="google-analytics-deferred"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                // Initialize dataLayer immediately but defer script loading
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                
                // Defer actual script loading until:
                // 1. Page is fully interactive (requestIdleCallback or setTimeout fallback)
                // 2. User interacts (scroll, click, touchstart)
                var gtmLoaded = false;
                var loadGTM = function() {
                  if (gtmLoaded) return;
                  gtmLoaded = true;
                  
                  // Load the gtag script
                  var script = document.createElement('script');
                  script.async = true;
                  script.src = 'https://www.googletagmanager.com/gtag/js?id=G-BLHEH82JSF';
                  document.head.appendChild(script);
                  
                  // Initialize after script loads
                  script.onload = function() {
                    gtag('js', new Date());
                    gtag('config', 'G-BLHEH82JSF', {
                      page_path: window.location.pathname,
                    });
                  };
                };
                
                // Load on user interaction (most important for mobile)
                var events = ['scroll', 'click', 'touchstart', 'mousemove', 'keydown'];
                var interactionHandler = function() {
                  loadGTM();
                  events.forEach(function(event) {
                    document.removeEventListener(event, interactionHandler, { passive: true });
                  });
                };
                events.forEach(function(event) {
                  document.addEventListener(event, interactionHandler, { passive: true, once: true });
                });
                
                // Fallback: Load after 3 seconds if no interaction
                setTimeout(function() {
                  if (!gtmLoaded) {
                    loadGTM();
                  }
                }, 3000);
                
                // Also try requestIdleCallback for better performance
                if (window.requestIdleCallback) {
                  requestIdleCallback(function() {
                    if (!gtmLoaded) {
                      loadGTM();
                    }
                  }, { timeout: 2000 });
                }
              })();
            `,
          }}
        />
      </body>
    </html>
  );
}