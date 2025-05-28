import Link from "next/link"
import { Mail, Phone, MapPin, Github, Twitter, Linkedin } from "lucide-react"
import Image from "next/image"

const footerSections = [
  {
    title: "Product",
    links: [
      { name: "Smart Grid", href: "#" },
      { name: "Energy Storage", href: "#" },
      { name: "Monitoring Platform", href: "#" },
      { name: "API Documentation", href: "#" },
    ],
  },
  {
    title: "Solutions",
    links: [
      { name: "Enterprise", href: "#" },
      { name: "Residential", href: "#" },
      { name: "Industrial", href: "#" },
      { name: "Custom Solutions", href: "#" },
    ],
  },
  {
    title: "Developers",
    links: [
      { name: "API Reference", href: "#" },
      { name: "SDKs", href: "#" },
      { name: "Webhooks", href: "#" },
      { name: "Status Page", href: "#" },
    ],
  },
  {
    title: "Company",
    links: [
      { name: "About Us", href: "#" },
      { name: "Careers", href: "#" },
      { name: "Press", href: "#" },
      { name: "Contact", href: "#" },
    ],
  },
]

const socialLinks = [
  { icon: Github, href: "#", label: "GitHub" },
  { icon: Twitter, href: "#", label: "Twitter" },
  { icon: Linkedin, href: "#", label: "LinkedIn" },
]

export function Footer() {
  return (
    <footer className="bg-black/20 backdrop-blur-lg border-t border-white/10">
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
              Building the future of renewable energy with cutting-edge technology and global infrastructure.
            </p>

            {/* Contact Info */}
            <div className="space-y-3 text-sm text-gray-400">
              <div className="flex items-center space-x-3">
                <MapPin className="w-4 h-4" />
                <span>11F., No. 66, SanChong Rd., Nangang Dist., Taipei City 115602</span>
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

          {/* Footer Links */}
          {footerSections.map((section, index) => (
            <div key={index}>
              <h3 className="font-semibold text-white mb-4">{section.title}</h3>
              <ul className="space-y-3">
                {section.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    <Link href={link.href} className="text-gray-400 hover:text-white transition-colors text-sm">
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Section */}
        <div className="border-t border-white/10 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <div className="text-sm text-gray-400 mb-4 md:mb-0">© 2024 EnergyFlow. All rights reserved.</div>

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
          <Link href="#" className="text-sm text-gray-400 hover:text-white transition-colors">
            Privacy Policy
          </Link>
          <Link href="#" className="text-sm text-gray-400 hover:text-white transition-colors">
            Terms of Service
          </Link>
          <Link href="#" className="text-sm text-gray-400 hover:text-white transition-colors">
            Cookie Policy
          </Link>
          <Link href="#" className="text-sm text-gray-400 hover:text-white transition-colors">
            Security
          </Link>
        </div>
      </div>
    </footer>
  )
}
