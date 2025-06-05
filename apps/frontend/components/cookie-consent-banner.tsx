"use client";
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";

export function CookieConsentBanner() {
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
  };

  const handleReject = () => {
    localStorage.setItem("cookie_consent", "rejected");
    setIsVisible(false);
  };

  if (!isVisible) {
    return null;
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gray-800 text-white p-4 flex items-center justify-between z-50">
      <p className="text-sm">
        This website uses cookies to ensure you get the best experience.
      </p>
      <div className="flex space-x-2">
        <Button
          onClick={handleAccept}
          className="bg-green-500 hover:bg-green-600 text-white"
        >
          Accept
        </Button>
        <Button
          onClick={handleReject}
          className="bg-red-500 hover:bg-red-600 text-white"
        >
          Reject
        </Button>
      </div>
    </div>
  );
}
