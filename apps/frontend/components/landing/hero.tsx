"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const slogans = [
  "Build, deploy, and scale renewable energy infrastructure with unparalleled ease",
  "Transform the world with intelligent energy solutions",
  "Power the future with next-generation clean technology",
];

const partnerLogos = [
  "Tesla Energy",
  "Siemens",
  "GE Renewable",
  "Schneider Electric",
  "ABB",
  "Vestas",
];

// Define fixed positions for background particles
const particlePositions = [
  { left: "10%", top: "20%" },
  { left: "30%", top: "10%" },
  { left: "50%", top: "30%" },
  { left: "70%", top: "15%" },
  { left: "90%", top: "25%" },
  { left: "20%", top: "40%" },
  { left: "45%", top: "55%" },
  { left: "60%", top: "48%" },
  { left: "85%", top: "60%" },
  { left: "5%", top: "75%" },
  { left: "25%", top: "85%" },
  { left: "55%", top: "70%" },
  { left: "75%", top: "80%" },
  { left: "95%", top: "90%" },
  { left: "40%", top: "5%" },
  { left: "65%", top: "35%" },
  { left: "15%", top: "50%" },
  { left: "35%", top: "65%" },
  { left: "70%", top: "75%" },
  { left: "50%", top: "95%" },
];

export function Hero() {
  const [currentSlogan, setCurrentSlogan] = useState(0);
  const [displayedText, setDisplayedText] = useState("");
  const [isTyping, setIsTyping] = useState(true);
  const [charIndex, setCharIndex] = useState(0);
  const [particleAnimations, setParticleAnimations] = useState<
    {
      animationDelay: string;
      animationDuration: string;
    }[]
  >([]);

  useEffect(() => {
    const generatedAnimations = particlePositions.map(() => ({
      animationDelay: `${Math.random() * 3}s`,
      animationDuration: `${2 + Math.random() * 3}s`,
    }));
    setParticleAnimations(generatedAnimations);
  }, []);

  useEffect(() => {
    const currentText = slogans[currentSlogan];

    if (isTyping) {
      // Typing effect
      if (charIndex < currentText.length) {
        const timer = setTimeout(() => {
          setDisplayedText(currentText.slice(0, charIndex + 1));
          setCharIndex(charIndex + 1);
        }, 50); // Typing speed
        return () => clearTimeout(timer);
      } else {
        // Finished typing, wait then start erasing
        const timer = setTimeout(() => {
          setIsTyping(false);
        }, 2000); // Wait time after typing
        return () => clearTimeout(timer);
      }
    } else {
      // Erasing effect
      if (charIndex > 0) {
        const timer = setTimeout(() => {
          setDisplayedText(currentText.slice(0, charIndex - 1));
          setCharIndex(charIndex - 1);
        }, 30); // Erasing speed
        return () => clearTimeout(timer);
      } else {
        // Finished erasing, move to next slogan
        const timer = setTimeout(() => {
          setCurrentSlogan((prev) => (prev + 1) % slogans.length);
          setIsTyping(true);
        }, 500); // Wait time before next slogan
        return () => clearTimeout(timer);
      }
    }
  }, [charIndex, isTyping, currentSlogan]);

  return (
    <section className="relative min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(34,197,94,0.15),transparent_50%)]"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(59,130,246,0.15),transparent_50%)]"></div>

      {/* Floating Particles */}
      <div className="absolute inset-0">
        {particlePositions.map((pos, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-emerald-400/30 rounded-full animate-pulse"
            style={{
              left: pos.left,
              top: pos.top,
              ...particleAnimations[i],
            }}
          />
        ))}
      </div>

      <div className="relative z-10 text-center max-w-6xl mx-auto">
        {/* Badge */}
        <Badge className="mb-8 bg-emerald-500/10 text-emerald-400 border-emerald-500/20 px-6 py-2 text-sm font-medium hover:bg-emerald-500/20 transition-all duration-300">
          Scale Fast, Scale Smart ⚡
        </Badge>

        {/* Main Headline */}
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold mb-8 leading-tight">
          <span className="text-white">Next-Gen</span>
          <br />
          <span className="text-white">Globally Distributed</span>
          <br />
          <span className="bg-gradient-to-r from-emerald-400 via-blue-500 to-purple-500 bg-clip-text text-transparent">
            Smart Energy
          </span>
        </h1>

        {/* Animated Subtitle with Typing Effect */}
        <div className="h-16 flex items-center justify-center mb-12">
          <p className="text-xl md:text-2xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
            {displayedText}
            <span className="animate-pulse text-emerald-400">|</span>
          </p>
        </div>

        {/* CTA Button */}
        <Button
          size="lg"
          className="bg-gradient-to-r from-emerald-500 to-blue-500 hover:from-emerald-600 hover:to-blue-600 text-white px-8 py-4 text-lg font-semibold rounded-full shadow-2xl hover:shadow-emerald-500/25 transition-all duration-300 hover:scale-105 transform"
          asChild
        >
          <Link href="/auth/signup">Get Started →</Link>
        </Button>

        {/* Partner Logos */}
        <div className="mt-20">
          <p className="text-gray-400 text-sm mb-8 uppercase tracking-wider">
            Trusted by industry leaders
          </p>
          {/* Carousel Container */}
          <div className="w-full overflow-hidden">
            {/* Carousel Track */}
            <div className="flex whitespace-nowrap logo-carousel">
              {[...partnerLogos, ...partnerLogos].map((logo, index) => (
                <div
                  key={index}
                  className="flex-shrink-0 mx-8 md:mx-12 text-gray-500 font-semibold text-lg hover:text-emerald-400 transition-all duration-300 cursor-pointer transform hover:scale-105"
                >
                  {logo}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-slate-900 to-transparent"></div>
    </section>
  );
}
