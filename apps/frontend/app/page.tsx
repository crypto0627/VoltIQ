// 'use client'
// import { Navbar } from "@/components/landing/navbar";
// import { Hero } from "@/components/landing/hero";
// import { Features } from "@/components/landing/features";
// import { TechnicalStack } from "@/components/landing/technical-stack";
// import { Footer } from "@/components/landing/footer";
// import { CookieConsentBanner } from "@/components/cookie-consent-banner";
// import { useState, useEffect } from "react";

// export default function HomePage() {
//   const [isConsentGiven, setIsConsentGiven] = useState(false);

//   useEffect(() => {
//     const consent = localStorage.getItem("cookie_consent");
//     if (consent === "accepted") {
//       setIsConsentGiven(true);
//     }
//   }, []);

//   const handleAccept = () => {
//     setIsConsentGiven(true);
//   };

//   const handleReject = () => {
//     setIsConsentGiven(false)
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
//       <CookieConsentBanner onAccept={handleAccept} onReject={handleReject} />
//       {isConsentGiven ? (
//         <>
//           <Navbar />
//           <Hero />
//           <Features />
//           <TechnicalStack />
//           <Footer />
//         </>
//       ) : (
//         <div className="pointer-events-none blur-sm">
//           <Navbar />
//           <Hero />
//           <Features />
//           <TechnicalStack />
//           <Footer />
//         </div>
//       )}
//     </div>
//   );
// }

'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import useUserStore from '@/stores/useUserStore'

export default function HomePage() {
  const router = useRouter()
  const { user, isLoading, fetchUser } = useUserStore()

  useEffect(() => {
    fetchUser()
  }, [fetchUser])

  useEffect(() => {
    if (!isLoading) {
      if (!user) {
        router.push('/auth/signin')
      } else {
        router.push('/main/dashboard')
      }
    }
  }, [user, isLoading, router])

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
    </div>
  )
}