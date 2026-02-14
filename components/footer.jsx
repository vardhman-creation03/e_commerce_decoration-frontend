"use client";

import Link from "next/link";
import { Instagram, Mail, Phone, Leaf } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { name: "Home", href: "/" },
    { name: "Events", href: "/all-events" },
    { name: "Blogs", href: "/blogs" },
    { name: "About", href: "/about" },
    { name: "Contact", href: "/contact" },
  ];

  const legalLinks = [
    { name: "Privacy", href: "/privacy-policy" },
    { name: "Terms", href: "/termsandcondition" },
    { name: "Shipping", href: "/shippingpolicy" },
  ];

  return (
    <footer className="bg-white border-t border-gray-100" style={{ minHeight: '300px' }}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Footer Content */}
        <div className="py-12 grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Brand Section */}
          <div className="space-y-4">
            <Link href="/" className="inline-flex items-center gap-2 group">
              <div className="w-10 h-10 flex items-center justify-center rounded-lg bg-green-500 shadow-sm">
                <Leaf className="w-5 h-5 text-white" />
              </div>
              <div className="flex flex-col">
                <span className="text-lg font-semibold text-gray-900">Vardhman</span>
                <span className="text-[10px] uppercase tracking-wider text-green-700 font-medium">Decoration</span>
              </div>
            </Link>
            
            <p className="text-sm text-gray-600 leading-relaxed max-w-xs">
              Creating unforgettable memories with premium event decorations.
            </p>
            
            {/* Social Links */}
            <div className="flex items-center gap-3">
              <Link
                href="https://www.instagram.com/vardhman_decoration25/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-lg bg-gray-50 border border-gray-200 flex items-center justify-center hover:bg-green-500 hover:border-green-500 hover:text-white transition-all duration-300"
                aria-label="Instagram"
              >
                <Instagram className="h-4 w-4" />
              </Link>
              <Link
                href="mailto:vardhmancreation03@gmail.com"
                className="w-9 h-9 rounded-lg bg-gray-50 border border-gray-200 flex items-center justify-center hover:bg-green-500 hover:border-green-500 hover:text-white transition-all duration-300"
                aria-label="Email"
              >
                <Mail className="h-4 w-4" />
              </Link>
              <Link
                href="tel:+918511950246"
                className="w-9 h-9 rounded-lg bg-gray-50 border border-gray-200 flex items-center justify-center hover:bg-green-500 hover:border-green-500 hover:text-white transition-all duration-300"
                aria-label="Phone"
              >
                <Phone className="h-4 w-4" />
              </Link>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-semibold text-gray-900 mb-4">Quick Links</h4>
            <ul className="space-y-2">
              {quickLinks.map((item) => (
                <li key={item.name}>
                  <Link 
                    href={item.href}
                    className="text-sm text-gray-600 hover:text-green-600 transition-colors"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-sm font-semibold text-gray-900 mb-4">Contact</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>
                <a href="tel:+918511950246" className="hover:text-green-600 transition-colors">
                  +91 85119 50246
                </a>
              </li>
              <li>
                <a href="mailto:vardhmancreation03@gmail.com" className="hover:text-green-600 transition-colors">
                  vardhmancreation03@gmail.com
                </a>
              </li>
              <li className="text-gray-500">
                Ahmedabad, Gujarat
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-100 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-gray-500">
              © {currentYear} Vardhman Decoration. All rights reserved.
            </p>
            
            <div className="flex items-center gap-6">
              {legalLinks.map((link) => (
                <Link 
                  key={link.name}
                  href={link.href} 
                  className="text-sm text-gray-500 hover:text-green-600 transition-colors"
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
