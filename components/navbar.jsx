"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "../components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../components/ui/sheet";
import {
  LogOut,
  Menu,
  Settings,
  User,
  ShoppingBag,
  Leaf,
} from "lucide-react";
import { useAuth } from "../lib/context/auth-context";

export default function Navbar() {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const { user, token, logout } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    setIsMobileMenuOpen(false);
  };

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
              <div className="w-11 h-11 flex items-center justify-center rounded-2xl bg-green-500 shadow-lg shadow-green-500/30 group-hover:shadow-xl group-hover:shadow-green-500/40 transition-all duration-300">
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
              <span className="text-[10px] uppercase tracking-[0.2em] text-green-600 font-semibold">
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

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-3">
            {token ? (
              <div className="flex items-center gap-3">
                 <Link href="/cart">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="rounded-full hover:bg-green-50 text-gray-700 hover:text-green-600"
                  >
                    <ShoppingBag className="w-5 h-5" />
                  </Button>
                </Link>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className="rounded-full p-0 h-10 w-10 border-2 border-gray-200 hover:border-green-400 transition-all"
                    >
                      <Avatar className="h-9 w-9">
                        <AvatarImage src={user?.profileImage} />
                        <AvatarFallback className="bg-green-500 text-white font-bold text-sm">
                          {user?.fullName?.[0]?.toUpperCase() || "U"}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56 mt-2 p-2">
                    <DropdownMenuLabel className="font-normal text-xs text-gray-500 p-2">
                      Signed in as <br/> <span className="text-gray-900 font-semibold text-sm">{user?.email}</span>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild className="cursor-pointer rounded-lg">
                      <Link href="/dashboard">
                        <User className="mr-2 h-4 w-4" /> Dashboard
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild className="cursor-pointer rounded-lg">
                      <Link href="/profile">
                        <Settings className="mr-2 h-4 w-4" /> Settings
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={handleLogout}
                      className="cursor-pointer rounded-lg text-red-600 focus:text-red-700 focus:bg-red-50"
                    >
                      <LogOut className="mr-2 h-4 w-4" /> Sign Out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Button
                  variant="ghost"
                  asChild
                  className="font-semibold text-gray-700 hover:text-gray-900 hover:bg-gray-100"
                >
                  <Link href="/login">Sign In</Link>
                </Button>
                <Button
                  asChild
                  className="rounded-full px-6 font-semibold bg-green-500 text-white hover:bg-green-600 shadow-lg shadow-green-500/30 hover:shadow-xl hover:shadow-green-500/40 transition-all duration-300"
                >
                  <Link href="/register">Get Started</Link>
                </Button>
              </div>
            )}
          </div>

          {/* Mobile Toggle */}
          <div className="md:hidden flex items-center gap-3">
             {token && (
                <Link href="/cart" className="text-gray-700">
                  <ShoppingBag className="w-5 h-5" />
                </Link>
             )}
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="text-gray-700">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-full sm:w-[300px] p-0 border-l border-gray-200 flex flex-col">
                <SheetHeader className="p-6 border-b border-gray-100 text-left bg-gradient-to-br from-green-50 to-emerald-50 shrink-0">
                  <SheetTitle className="text-xl font-bold text-green-600">Menu</SheetTitle>
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

                {/* Fixed bottom section with auth buttons */}
                <div className="shrink-0 p-6 border-t border-gray-100 bg-gray-50">
                  {token ? (
                    <div className="space-y-3">
                      <div className="flex items-center gap-3 mb-4 px-2">
                         <Avatar className="h-10 w-10 border-2 border-green-200">
                            <AvatarImage src={user?.profileImage} />
                            <AvatarFallback className="bg-green-500 text-white font-bold">
                              {user?.fullName?.[0]}
                            </AvatarFallback>
                         </Avatar>
                         <div>
                           <p className="text-sm font-bold text-gray-900">{user?.fullName || "User"}</p>
                           <p className="text-xs text-gray-500 truncate max-w-[150px]">{user?.email}</p>
                         </div>
                      </div>
                      <Button asChild variant="outline" className="w-full justify-start rounded-xl border-gray-200">
                        <Link href="/dashboard" onClick={() => setIsMobileMenuOpen(false)}>
                          <User className="mr-2 h-4 w-4" /> Dashboard
                        </Link>
                      </Button>
                      <Button
                        onClick={handleLogout}
                        variant="ghost"
                        className="w-full justify-start text-red-600 hover:bg-red-50 hover:text-red-700 rounded-xl"
                      >
                        <LogOut className="mr-2 h-4 w-4" /> Sign Out
                      </Button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 gap-3">
                      <Button variant="outline" asChild className="rounded-xl w-full border-gray-300 font-semibold">
                        <Link href="/login" onClick={() => setIsMobileMenuOpen(false)}>
                          Sign In
                        </Link>
                      </Button>
                      <Button asChild className="rounded-xl w-full bg-green-500 text-white hover:bg-green-600 font-semibold">
                        <Link href="/register" onClick={() => setIsMobileMenuOpen(false)}>
                          Sign Up
                        </Link>
                      </Button>
                    </div>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
