"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "../components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../components/ui/sheet";
import {
  Menu,
  Leaf,
} from "lucide-react";

export default function Navbar() {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Events", href: "/all-events" },
    { name: "Blogs", href: "/blogs" },
    { name: "About", href: "/about" },
    { name: "Contact", href: "/contact" },
  ];

  const isActiveLink = (href) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-in-out ${
        isScrolled
          ? "bg-white/95 backdrop-blur-lg border-b border-gray-200 shadow-lg shadow-green-500/5 py-3"
          : "bg-white/80 backdrop-blur-md border-b border-gray-100 py-4"
      }`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative">
              {/* ✅ Improved contrast: Using darker green for better text contrast */}
              <div className="w-11 h-11 flex items-center justify-center rounded-2xl bg-green-600 shadow-lg shadow-green-600/30 group-hover:shadow-xl group-hover:shadow-green-600/40 transition-all duration-300">
                <span className="font-bold text-lg text-white">VD</span>
              </div>
              <div className="absolute -top-1 -right-1 w-3 h-3">
                <Leaf className="w-3 h-3 text-emerald-400 animate-pulse" />
              </div>
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-bold tracking-tight leading-none text-gray-900">
                Vardhman
              </span>
              <span className="text-[10px] uppercase tracking-[0.2em] text-green-700 font-semibold">
                Decoration
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className={`text-sm font-semibold transition-all duration-300 hover:-translate-y-0.5 relative ${
                  isActiveLink(link.href) 
                    ? 'text-gray-900' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {link.name}
                {isActiveLink(link.href) && (
                  <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-green-500 rounded-full" />
                )}
              </Link>
            ))}
          </nav>

          {/* Desktop Actions - All public, no auth required */}
          <div className="hidden md:flex items-center gap-3">
            {/* All features are public - no login/register needed */}
          </div>

          {/* Mobile Toggle */}
          <div className="md:hidden flex items-center gap-3">
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="text-gray-700"
                  aria-label="Open mobile menu"
                >
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-full sm:w-[300px] p-0 border-l border-gray-200 flex flex-col">
                <SheetHeader className="p-6 border-b border-gray-100 text-left bg-gradient-to-br from-green-50 to-emerald-50 shrink-0">
                  <SheetTitle className="text-xl font-bold text-green-700">Menu</SheetTitle>
                </SheetHeader>
                <div className="flex flex-col h-full bg-white">
                  <div className="p-4 space-y-2">
                    {navLinks.map((link) => (
                      <Link
                        key={link.name}
                        href={link.href}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className={`block px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                          isActiveLink(link.href)
                            ? "bg-green-500 text-white shadow-lg shadow-green-500/30"
                            : "bg-transparent text-gray-700 hover:bg-gray-50"
                        }`}
                      >
                        {link.name}
                      </Link>
                    ))}
                  </div>
                </div>

                {/* Mobile menu footer - All public, no auth required */}
                <div className="shrink-0 p-6 border-t border-gray-100 bg-gray-50">
                  {/* All features are public - no login/register needed */}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
