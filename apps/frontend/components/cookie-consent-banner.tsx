"use client";
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";

interface CookieConsentBannerProps {
  onAccept?: () => void;
  onReject?: () => void;
}

export function CookieConsentBanner({
  onAccept,
  onReject,
}: CookieConsentBannerProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("cookie_consent");
    if (consent === null) {
      setIsVisible(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem("cookie_consent", "accepted");
    setIsVisible(false);
    onAccept?.();
  };

  const handleReject = () => {
    localStorage.setItem("cookie_consent", "rejected");
    setIsVisible(false);
    onReject?.();
  };

  if (!isVisible) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4 shadow-xl transform transition-all">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          Cookie Consent
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
          This website uses cookies to ensure you get the best experience on our
          website. By continuing to use this site, you agree to our use of
          cookies.
        </p>
        <div className="flex justify-end space-x-3">
          <Button
            onClick={handleReject}
            variant="outline"
            className="border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            Reject
          </Button>
          <Button
            onClick={handleAccept}
            className="bg-emerald-500 hover:bg-emerald-600 text-white"
          >
            Accept
          </Button>
        </div>
      </div>
    </div>
  );
}
