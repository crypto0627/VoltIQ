import Link from "next/link";
import { Mail, Phone, MapPin, Linkedin, Globe, Instagram } from "lucide-react";
import Image from "next/image";

const socialLinks = [
  {
    icon: Globe,
    href: "https://www.fortune-ess.com.tw/",
    label: "Fortune-ess",
  },
  {
    icon: Instagram,
    href: "https://www.instagram.com/fortune_electric_co._ltd/",
    label: "Instagram",
  },
  {
    icon: Linkedin,
    href: "https://www.linkedin.com/company/%E8%8F%AF%E5%9F%8E%E9%9B%BB%E6%A9%9F%E8%82%A1%E4%BB%BD%E6%9C%89%E9%99%90%E5%85%AC%E5%8F%B8-fortune-electric/",
    label: "LinkedIn",
  },
];

export function Footer() {
  return (
    <footer
      className="bg-black/20 backdrop-blur-lg border-t border-white/10"
      id="footer"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8">
          {/* Company Info */}
          <div className="lg:col-span-2">
            <div className="flex items-center space-x-2">
              <div className="relative w-48 h-24">
                <Image
                  alt="home-logo"
                  src="/logo.png"
                  fill
                  className="object-contain"
                />
              </div>
            </div>
            <p className="text-gray-300 mb-6 max-w-md leading-relaxed">
              Building the future of renewable energy with cutting-edge
              technology and global infrastructure.
            </p>

            {/* Contact Info */}
            <div className="space-y-3 text-sm text-gray-400">
              <div className="flex items-center space-x-3">
                <MapPin className="w-4 h-4" />
                <span>
                  11F., No. 66, SanChong Rd., Nangang Dist., Taipei City 115602
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="w-4 h-4" />
                <span>fortune-ess@fortune.com.tw</span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="w-4 h-4" />
                <span>+886 02-26559520 #9818</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-white/10 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <div className="text-sm text-gray-400 mb-4 md:mb-0">
            © 2025 VoltIQ from Fortune Ess. All rights reserved.
          </div>

          {/* Social Links */}
          <div className="flex space-x-6">
            {socialLinks.map((social, index) => (
              <Link
                key={index}
                href={social.href}
                className="text-gray-400 hover:text-white transition-colors"
                aria-label={social.label}
              >
                <social.icon className="w-5 h-5" />
              </Link>
            ))}
          </div>
        </div>

        {/* Legal Links */}
        <div className="border-t border-white/10 mt-8 pt-8 flex flex-col md:flex-row justify-center items-center space-y-2 md:space-y-0 md:space-x-8">
          <Link
            href="#"
            className="text-sm text-gray-400 hover:text-white transition-colors"
          >
            Privacy Policy
          </Link>
          <Link
            href="#"
            className="text-sm text-gray-400 hover:text-white transition-colors"
          >
            Terms of Service
          </Link>
          <Link
            href="#"
            className="text-sm text-gray-400 hover:text-white transition-colors"
          >
            Cookie Policy
          </Link>
          <Link
            href="#"
            className="text-sm text-gray-400 hover:text-white transition-colors"
          >
            Security
          </Link>
        </div>
      </div>
    </footer>
  );
}
