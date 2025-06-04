import { Navbar } from "@/components/landing/navbar";
import { Hero } from "@/components/landing/hero";
import { Features } from "@/components/landing/features";
import { TechnicalStack } from "@/components/landing/technical-stack";
import { Discount } from "@/components/landing/discount";
import { Footer } from "@/components/landing/footer";
import { CookieConsentBanner } from "@/components/cookie-consent-banner";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <Navbar />
      <Hero />
      <Features />
      <TechnicalStack />
      <Discount />
      <Footer />
    </div>
  );
}
