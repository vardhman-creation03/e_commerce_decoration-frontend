"use client";

import { useState, useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import { AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";
import Navbar from "../components/navbar";
import Footer from "../components/footer";
import { Toaster } from "../components/ui/toaster";
import Providers from "./providers";

// ✅ Dynamic imports (only on client)
const ProtectedRoute = dynamic(() => import("../components/protectedRoute"), {
  ssr: false,
});
const VardhmanLoader = dynamic(() => import("../components/vardhman-loader"), {
  ssr: false,
});

export default function ClientLayout({ children }) {
  const [isLoading, setIsLoading] = useState(true);
  const [isAdminRoute, setIsAdminRoute] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    // Check if this is a page reload or initial load (not client-side navigation)
    const navigation = typeof window !== 'undefined'
      ? performance.getEntriesByType('navigation')[0]
      : null;

    const isReload = navigation?.type === 'reload';
    const isInitialLoad = navigation?.type === 'navigate';

    // Check if we've already shown loader in this session (for client-side navigation)
    const hasShownInSession = typeof window !== 'undefined'
      ? sessionStorage.getItem('vardhman-loader-shown') === 'true'
      : false;

    // Show loader on reload (always) or on initial load (first time only)
    if (isReload || (isInitialLoad && !hasShownInSession)) {
      // Mark that we've shown the loader in this session (only for initial load, not reload)
      if (typeof window !== 'undefined' && isInitialLoad) {
        sessionStorage.setItem('vardhman-loader-shown', 'true');
      }

      // Set loading to false after animation completes (1.2 seconds - faster)
      const timer = setTimeout(() => {
        setIsLoading(false);
      }, 1200);
      return () => clearTimeout(timer);
    } else {
      // If it's client-side navigation, don't show loader
      setIsLoading(false);
    }
  }, []);

  // Check if current route is admin route or user is admin
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const userRole = localStorage.getItem('userRole');
      const isAdmin = userRole === 'admin' || pathname?.startsWith('/admin');
      setIsAdminRoute(isAdmin);
    }
  }, [pathname]);

  return (
    <Providers>
      {/* Show loader first, hide everything else */}
      <AnimatePresence mode="wait">
        {isLoading ? (
          <div
            key="loader"
            style={{
              position: "fixed",
              inset: 0,
              zIndex: 99999,
              background: "white",
            }}
          >
            <VardhmanLoader />
          </div>
        ) : null}
      </AnimatePresence>
      {/* Always render content structure to prevent layout shifts */}
      <div key="content" style={{ visibility: isLoading ? 'hidden' : 'visible' }}>
        {!isAdminRoute && <Navbar />}
        <ProtectedRoute>
          <main className={`min-h-screen ${!isAdminRoute ? 'pt-20' : ''}`}>
            {children}
          </main>
        </ProtectedRoute>
        {!isAdminRoute && <Footer />}
        <Toaster />
      </div>
    </Providers>
  );
}