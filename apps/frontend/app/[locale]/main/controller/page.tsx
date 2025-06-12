"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useTranslations } from 'next-intl';
import { useSearchParams } from "next/navigation";

const getBaseUrls = (theme: string) => ({
  meter:
    `http://60.248.136.217:13000/d/8x2xVJ2nw/meter?orgId=1&refresh=5s&kiosk=tv&theme=${theme}`,
  powerControl:
    `http://60.248.136.217:13000/d/5fnBlbXnz/pcs?orgId=1&refresh=5s&kiosk=tv&theme=${theme}`,
  battery:
    `http://60.248.136.217:13000/d/15odcko7z/battery-monitor?orgId=1&refresh=5s&kiosk=tv&theme=${theme}`,
});

export default function ControllerPage() {
  const t = useTranslations('main.controller');
  const [activeTab, setActiveTab] = useState("battery");
  const [showIframe, setShowIframe] = useState(false);
  const searchParams = useSearchParams();
  const theme = searchParams.get("theme") || "light";
  const urls = getBaseUrls(theme);

  const handleIframeLoad = () => {
    setShowIframe(true);
  };

  const changeTab = (tab: string) => {
    if (activeTab === tab) return;
    setShowIframe(false);
    setActiveTab(tab);
  };

  useEffect(() => {
    setShowIframe(true);
  }, []);

  return (
    <div className="flex flex-col min-h-screen w-full gap-2">
      <header className="shadow-md bg-white dark:bg-gray-800 rounded-lg p-6">
        <div className="flex items-center justify-between">
          <h1 className="m-0 text-3xl font-bold text-gray-800 dark:text-white">
            {t('title')}
          </h1>
          <div className="flex space-x-6">
            <Button
              onClick={() => changeTab("meter")}
              variant={activeTab === "meter" ? "default" : "outline"}
            >
              {t('meter')}
            </Button>
            <Button
              onClick={() => changeTab("powerControl")}
              variant={activeTab === "powerControl" ? "default" : "outline"}
            >
              {t('pcs')}
            </Button>
            <Button
              onClick={() => changeTab("battery")}
              variant={activeTab === "battery" ? "default" : "outline"}
            >
              {t('battery')}
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1 relative">
        <div className="w-full h-[calc(100vh-140px)] overflow-hidden rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
          <iframe
            src={urls[activeTab as keyof typeof urls]}
            className="w-full h-full border-none"
            onLoad={handleIframeLoad}
            frameBorder="0"
            allowFullScreen
          />
        </div>
      </main>
    </div>
  );
}
