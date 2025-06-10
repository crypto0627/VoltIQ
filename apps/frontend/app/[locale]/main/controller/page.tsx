"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";

const urls = {
  meter:
    "http://60.248.136.217:13000/d/8x2xVJ2nw/meter?orgId=1&refresh=5s&kiosk=tv&kios",
  powerControl:
    "http://60.248.136.217:13000/d/5fnBlbXnz/pcs?orgId=1&refresh=5s&kiosk=tv&kiosk",
  battery:
    "http://60.248.136.217:13000/d/15odcko7z/battery-monitor?orgId=1&refresh=5s&kiosk=tv&kios",
};

export default function ControllerPage() {
  const [activeTab, setActiveTab] = useState("battery");
  const [showIframe, setShowIframe] = useState(false);

  const handleIframeLoad = () => {
    setShowIframe(true);
  };

  const changeTab = (tab: string) => {
    if (activeTab === tab) return;
    setShowIframe(false);
    setActiveTab(tab);
  };

  useEffect(() => {
    // 初始化時顯示iframe
    setShowIframe(true);
  }, []);

  return (
    <div className="flex flex-col min-h-screen w-full gap-2">
      <header className="shadow-md bg-white rounded-lg p-6">
        <div className="flex items-center justify-between">
          <h1 className="m-0 text-3xl font-bold text-gray-800">
            System Monitor
          </h1>
          <div className="flex space-x-6">
            <Button
              onClick={() => changeTab("meter")}
              variant={activeTab === "meter" ? "default" : "outline"}
            >
              Meter
            </Button>
            <Button
              onClick={() => changeTab("powerControl")}
              variant={activeTab === "powerControl" ? "default" : "outline"}
            >
              PCS
            </Button>
            <Button
              onClick={() => changeTab("battery")}
              variant={activeTab === "battery" ? "default" : "outline"}
            >
              Battery
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1 relative">
        <div className="w-full h-[calc(100vh-140px)] overflow-hidden rounded-lg shadow-md border border-gray-200">
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
