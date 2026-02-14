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
  title: "Vardhman Decoration | Premium Event Management & Decoration Services",
  description:
    "Best Event Management & Decoration Services in India. We specialize in Birthday, Wedding, Anniversary, Baby Shower, Car, First Night, Mundan, Naming Ceremony, and Flower Decorations.",
  keywords: [
    "Vardhman Decoration",
    "Event Management",
    "Birthday Decoration",
    "Anniversary Decoration",
    "Baby Shower Decoration",
    "Car decoration",
    "First Night Decoration",
    "Welcome Baby Decoration",
    "Bon Voyage Decoration",
    "Wedding Decoration",
    "Haldi Decoration",
    "Mehndi Decoration",
    "Kankotri Lekhan",
    "Naming Ceremony",
    "Mundan Decoration",
    "Annaprashan Decoration",
    "Artificial Flower Decoration",
    "Real Flower Decoration",
    "Party Decorations",
    "Event Planners",
    "Decoration Services",
    "Theme Decoration",
    "Ahmedabad Event Management",
    "Jamnagar Decoration"
  ].join(", "),
  metadataBase: new URL("https://www.thevardhmancreation.com/"),
  alternates: {
    canonical: "https://www.thevardhmancreation.com/",
  },
  openGraph: {
    title: "Vardhman Decoration | Premium Event Management Services",
    description:
      "Expert decoration services for Weddings, Birthdays, Baby Showers, Anniversaries, and more. Creating magical moments with Real & Artificial Flower decor.",
    url: "https://www.thevardhmancreation.com/",
    siteName: "Vardhman Decoration",
    images: [
      {
        url: "https://www.thevardhmancreation.com/og-products.jpg",
        width: 1200,
        height: 630,
        alt: "Vardhman Decoration Services",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Vardhman Decoration | Event Management & Decor",
    description:
      "Specialists in Birthday, Wedding, Car, and Flower Decorations. Transform your event with our premium management services.",
    images: ["https://www.thevardhmancreation.com/og-products.jpg"],
  },
  robots: "index, follow",
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/favicon.ico",
  },
};

// ✅ Perfect Viewport Configuration for Mobile & Desktop (separate export as per Next.js requirements)
export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  viewportFit: "cover",
  // ✅ Theme Color for Mobile Browsers
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#22c55e" },
    { media: "(prefers-color-scheme: dark)", color: "#34d399" },
  ],
};

// ✅ Organization Schema for Google
const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "EventPlanner",
  name: "Vardhman Decoration",
  url: "https://www.thevardhmancreation.com/",
  description:
    "Premier Event Management and Decoration service provider offering Birthday, Wedding, Baby Shower, Anniversary, and Corporate event decorations.",
  areaServed: ["Ahmedabad", "Jamnagar", "Gujarat"],
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
        {/* ✅ Preconnect to critical domains FIRST - reduces critical request chain */}
        <link rel="preconnect" href="https://e-commerce-decor-backend.onrender.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://res.cloudinary.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
        
        <link rel="icon" href="/favicon.ico" sizes="any" />
        {/* Google Tag Manager - Deferred to reduce blocking */}
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

        {/* ✅ Critical inline script to defer CSS loading - Must run FIRST before any CSS */}
        {/* This prevents CSS from blocking initial render, improving LCP and FCP */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              !function(){"use strict";var e=new Set;function t(t){var n=t.getAttribute("href")||t.href;if(!n||n.match(/^data:/)||e.has(n))return;e.add(n),t.media="print","onload"in t?t.onload=function(){this.media="all"}:setTimeout(function(){t.media="all"},0)}function n(){var n=document.querySelectorAll("link[rel=stylesheet]");for(var o=0;o<n.length;o++)t(n[o])}document.head&&n(),"loading"===document.readyState&&(document.addEventListener("readystatechange",function(){"loading"!==document.readyState&&document.head&&n()}),document.addEventListener("DOMContentLoaded",n)),window.MutationObserver&&document.head&&new MutationObserver(function(e){for(var n=0;n<e.length;n++)for(var o=e[n].addedNodes,r=0;r<o.length;r++){var i=o[r];1===i.nodeType&&"LINK"===i.tagName&&"stylesheet"===i.rel&&t(i)}}).observe(document.head||document.documentElement,{childList:!0,subtree:!0})}();
            `,
          }}
        />

        {/* ✅ Removed Unsplash preload to avoid third-party cookie warnings */}
        {/* Use Cloudinary images instead for better performance and no cookie issues */}

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

      <body 
        className={`${poppins.variable} font-poppins`} 
        suppressHydrationWarning={true}
        style={{ 
          fontDisplay: 'swap',
          fontFamily: 'var(--font-poppins), system-ui, sans-serif'
        }}
      >
        {/* ✅ bfcache optimization - prevent scripts from running on back/forward */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                // Handle pageshow event for bfcache
                window.addEventListener('pageshow', function(event) {
                  if (event.persisted) {
                    // Page was restored from bfcache - don't reinitialize scripts
                    return;
                  }
                });
              })();
            `,
          }}
        />
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

        {/* ✅ Google Analytics - Deferred and bfcache-safe */}
        <Script
          id="google-analytics-deferred"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                // ✅ bfcache-safe: Check if page was restored from cache
                if (window.performance && window.performance.navigation && 
                    window.performance.navigation.type === window.performance.navigation.TYPE_BACK_FORWARD) {
                  return; // Don't run on back/forward navigation
                }
                
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