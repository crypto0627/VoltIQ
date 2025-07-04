"use client";

import { useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Battery,
  Sun,
  Zap,
  Factory,
  ArrowLeft,
  ArrowRight,
  ArrowDown,
} from "lucide-react";
import { useElectricityStore } from "@/stores/electricityStore";
import { useTranslations } from "next-intl";

export default function SystemStatus() {
  const t = useTranslations("main.dashboard");
  const { data, currentTimeIndex, startSimulation, stopSimulation } =
    useElectricityStore();
  const currentData = data[currentTimeIndex] || {
    powerUsage: 0,
    batteryUsage: 0,
  };
  const currentTime = data[currentTimeIndex]?.time || "00:00";

  const isDayTime = currentTime >= "07:00" && currentTime <= "18:00";

  useEffect(() => {
    startSimulation();
    return () => stopSimulation();
  }, [startSimulation, stopSimulation]);

  return (
    <div className="relative">
      <Card className="shadow-lg bg-card text-card-foreground">
        <CardHeader className="">
          <CardTitle className="text-xl font-semibold">
            {t("systemStatus")}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 sm:p-6">
          <div className="relative w-full max-w-[300px] sm:max-w-[400px] mx-auto h-[200px] sm:h-[265px]">
            {/* Dashed Lines */}
            <svg
              className="absolute inset-0 w-full h-full"
              style={{ pointerEvents: "none", zIndex: 1 }}
            >
              {/* Center to Solar */}
              <line
                x1="50%"
                y1="63%"
                x2="50%"
                y2="25%"
                stroke="hsl(var(--primary))"
                strokeWidth="2"
                strokeDasharray="5,5"
              />
              {/* Center to Battery */}
              <line
                x1="42%"
                y1="77%"
                x2="20%"
                y2="77%"
                stroke="hsl(var(--primary))"
                strokeWidth="2"
                strokeDasharray="5,5"
              />
              {/* Center to Grid */}
              <line
                x1="58%"
                y1="77%"
                x2="82%"
                y2="77%"
                stroke="hsl(var(--primary))"
                strokeWidth="2"
                strokeDasharray="5,5"
              />
            </svg>

            {/* Arrows */}
            <div
              className="absolute left-1/2 top-[30%] transform -translate-x-1/2"
              style={{ zIndex: 2 }}
            >
              {isDayTime && (
                <div className="flex flex-col items-center gap-1">
                  <ArrowDown
                    className="text-primary w-6 h-6 sm:w-8 sm:h-8"
                    fill="hsl(var(--primary))"
                  />
                  <ArrowDown
                    className="text-primary w-6 h-6 sm:w-8 sm:h-8"
                    fill="hsl(var(--primary))"
                  />
                </div>
              )}
            </div>

            <div
              className="absolute left-[22%] top-[77%] transform -translate-y-1/2"
              style={{ zIndex: 2 }}
            >
              {currentData.batteryUsage > 0 && (
                <div className="flex flex-row items-center gap-1">
                  <ArrowLeft
                    className="text-chart-2 w-6 h-6 sm:w-8 sm:h-8"
                    fill="hsl(var(--chart-2))"
                  />
                  <ArrowLeft
                    className="text-chart-2 w-6 h-6 sm:w-8 sm:h-8"
                    fill="hsl(var(--chart-2))"
                  />
                </div>
              )}
              {currentData.batteryUsage < 0 && (
                <div className="flex flex-row items-center gap-1">
                  <ArrowRight
                    className="text-chart-1 w-6 h-6 sm:w-8 sm:h-8"
                    fill="hsl(var(--chart-1))"
                  />
                  <ArrowRight
                    className="text-chart-1 w-6 h-6 sm:w-8 sm:h-8"
                    fill="hsl(var(--chart-1))"
                  />
                </div>
              )}
            </div>

            <div
              className="absolute right-[20%] top-[77%] transform -translate-y-1/2"
              style={{ zIndex: 2 }}
            >
              {currentData.powerUsage !== 0 && (
                <div className="flex flex-row items-center gap-1">
                  <ArrowLeft
                    className="text-primary w-6 h-6 sm:w-8 sm:h-8"
                    fill="hsl(var(--primary))"
                  />
                  <ArrowLeft
                    className="text-primary w-6 h-6 sm:w-8 sm:h-8"
                    fill="hsl(var(--primary))"
                  />
                </div>
              )}
            </div>

            {/* Solar Panel - Top */}
            <div
              className="absolute top-0 left-1/2 transform -translate-x-1/2"
              style={{ zIndex: 2 }}
            >
              <div className="flex flex-col items-center">
                <div className="p-2 sm:p-4 bg-primary/10 rounded-full relative">
                  <Sun className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
                  <span className="absolute -top-4 sm:-top-6 left-1/2 transform -translate-x-1/2 text-xs sm:text-sm font-medium whitespace-nowrap">
                    {t("solarPanel")}
                  </span>
                </div>
              </div>
            </div>

            {/* Battery Status - Left */}
            <div
              className="absolute top-[80%] left-0 transform -translate-y-1/2"
              style={{ zIndex: 2 }}
            >
              <div className="flex flex-col items-center">
                <div className="p-2 sm:p-4 bg-primary/10 rounded-full">
                  <Battery className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
                </div>
                <span className="text-xs sm:text-sm font-medium">
                  {t("batteryStatus")}
                </span>
              </div>
            </div>

            {/* Grid Power - Right */}
            <div
              className="absolute top-[80%] right-0 transform -translate-y-1/2"
              style={{ zIndex: 2 }}
            >
              <div className="flex flex-col items-center">
                <div className="p-2 sm:p-4 bg-primary/10 rounded-full">
                  <Zap className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
                </div>
                <span className="text-xs sm:text-sm font-medium">{t("gridPower")}</span>
              </div>
            </div>

            {/* Center Factory */}
            <div
              className="absolute top-[80%] left-1/2 transform -translate-x-1/2 -translate-y-1/2"
              style={{ zIndex: 3 }}
            >
              <div className="flex flex-col items-center">
                <div className="p-2 sm:p-4 bg-primary/10 rounded-full">
                  <Factory className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
                </div>
                <span className="text-xs sm:text-sm font-medium">
                  {t("factory")}
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Legend Card */}
      <Card className="absolute top-0 right-0 w-[150px] sm:w-[200px] bg-card text-card-foreground">
        <CardContent className="p-2 sm:p-4">
          <div className="space-y-2 sm:space-y-4">
            <div className="flex items-center gap-1 sm:gap-2">
              <ArrowDown
                className="text-primary w-5 h-5 sm:w-6 sm:h-6"
                fill="hsl(var(--primary))"
              />
              <span className="text-xs sm:text-sm">{t("solarPowerGeneration")}</span>
            </div>
            <div className="flex items-center gap-1 sm:gap-2">
              <ArrowLeft
                className="text-chart-2 w-5 h-5 sm:w-6 sm:h-6"
                fill="hsl(var(--chart-2))"
              />
              <span className="text-xs sm:text-sm">{t("batteryCharging")}</span>
            </div>
            <div className="flex items-center gap-1 sm:gap-2">
              <ArrowRight
                className="text-chart-1 w-5 h-5 sm:w-6 sm:h-6"
                fill="hsl(var(--chart-1))"
              />
              <span className="text-xs sm:text-sm">{t("batteryDischarging")}</span>
            </div>
            <div className="flex items-center gap-1 sm:gap-2">
              <ArrowLeft
                className="text-primary w-5 h-5 sm:w-6 sm:h-6"
                fill="hsl(var(--primary))"
              />
              <span className="text-xs sm:text-sm">{t("gridPowerFlow")}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
