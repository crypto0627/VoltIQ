"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import Image from "next/image";

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSignedIn, setIsSignedIn] = useState(false);

  const navItems = [
    { name: "Product", href: "#features" },
    { name: "Solution", href: "#tech-stack" },
    { name: "About us", href: "#about" },
  ];

  return (
    <>
      {/* Announcement Bar */}
      <div className="bg-gradient-to-r from-emerald-500 to-blue-500 text-white text-center py-2 px-4 text-sm">
        <span className="mr-2">🔥</span>
        Subscribe member $NT 150 per month
        <Button
          variant="link"
          className="text-white underline ml-2 p-0 h-auto hover:text-emerald-200 transition-colors"
        >
          <Link href="#subscribe">Learn More</Link>
        </Button>
      </div>

      <nav className="relative z-50 bg-slate-900/80 backdrop-blur-lg border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center space-x-2">
              <div className="relative w-48 h-64">
                <Image
                  alt="home-logo"
                  src="/logo.png"
                  fill
                  className="object-contain"
                />
              </div>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="text-gray-300 hover:text-emerald-400 transition-all duration-300 font-medium relative group"
                >
                  {item.name}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-emerald-400 transition-all duration-300 group-hover:w-full"></span>
                </Link>
              ))}
            </div>

            {/* Desktop Auth Buttons */}
            <div className="hidden md:flex items-center space-x-4">
              {isSignedIn ? (
                <Button
                  variant="outline"
                  onClick={() => setIsSignedIn(false)}
                  className="border-gray-600 text-white hover:bg-emerald-500/10 hover:border-emerald-500 hover:text-emerald-400 transition-all duration-300"
                >
                  Sign out
                </Button>
              ) : (
                <>
                  <Button
                    variant="ghost"
                    className="text-white hover:bg-emerald-500/10 hover:text-emerald-400 transition-all duration-300"
                    asChild
                  >
                    <Link href="/auth/signin">Sign in</Link>
                  </Button>
                  <Button
                    className="bg-gradient-to-r from-emerald-500 to-blue-500 hover:from-emerald-600 hover:to-blue-600 text-white shadow-lg hover:shadow-emerald-500/25 transition-all duration-300 hover:scale-105 transform"
                    asChild
                  >
                    <Link href="/auth/signup">Sign up →</Link>
                  </Button>
                </>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-white hover:bg-emerald-500/10 hover:text-emerald-400 transition-all duration-300"
              >
                {isMenuOpen ? (
                  <X className="h-5 w-5" />
                ) : (
                  <Menu className="h-5 w-5" />
                )}
              </Button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <div className="md:hidden py-4 space-y-4 bg-slate-800/90 backdrop-blur-lg rounded-lg mt-2 border border-white/10">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="block text-gray-300 hover:text-emerald-400 transition-all duration-300 px-4 py-2 rounded-lg hover:bg-emerald-500/10"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              <div className="pt-4 space-y-2 px-4">
                {isSignedIn ? (
                  <Button
                    variant="outline"
                    className="w-full border-gray-600 text-white hover:bg-emerald-500/10 hover:border-emerald-500 hover:text-emerald-400 transition-all duration-300"
                    onClick={() => setIsSignedIn(false)}
                  >
                    Sign out
                  </Button>
                ) : (
                  <>
                    <Button
                      variant="ghost"
                      className="w-full text-white hover:bg-emerald-500/10 hover:text-emerald-400 transition-all duration-300"
                      asChild
                    >
                      <Link href="/auth/signin">Sign in</Link>
                    </Button>
                    <Button
                      className="w-full bg-gradient-to-r from-emerald-500 to-blue-500 hover:from-emerald-600 hover:to-blue-600 transition-all duration-300"
                      asChild
                    >
                      <Link href="/auth/signup">Sign up →</Link>
                    </Button>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </nav>
    </>
  );
}
