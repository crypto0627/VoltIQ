"use client";

import { useEffect, useState } from "react";
import { Moon, Sun, Cloud, CloudRain, CloudSun } from "lucide-react";
import { useTheme } from "next-themes";
import { usePathname, useRouter } from "next/navigation";
import useUserStore from "@/stores/useUserStore";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";

export function Navbar() {
  const { setTheme, theme } = useTheme();
  const pathname = usePathname();
  const router = useRouter();
  const [currentDateTime, setCurrentDateTime] = useState("");
  const [weather, setWeather] = useState<{ temp: number; condition: string; county: string; town: string }>({ temp: 25, condition: "sunny", county: "", town: "" });

  const { user, fetchUser, isLoading } = useUserStore();

  useEffect(() => {
    fetchUser();
  }, []);

  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();
      const utc8Time = new Date(now.getTime() + 8 * 60 * 60 * 1000);
      const date = utc8Time.toISOString().split('T')[0];
      const time = utc8Time.toISOString().split('T')[1].slice(0, 8);
      setCurrentDateTime(`${date} ${time}`);
    };

    updateDateTime();
    const timer = setInterval(updateDateTime, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const fetchWeatherData = async () => {
      try {
        const response = await fetch(`https://opendata.cwa.gov.tw/api/v1/rest/datastore/O-A0003-001?Authorization=${process.env.NEXT_PUBLIC_WEATHER_API_KEY}&format=JSON&StationId=466930&StationName=%E7%AB%B9%E5%AD%90%E6%B9%96`);
        
        const data = await response.json();

        if (data.success === "true" && data.records.Station.length > 0) {
          const stationData = data.records.Station[0];
          const temp = parseFloat(stationData.WeatherElement.AirTemperature);
          const weatherCondition = stationData.WeatherElement.Weather;
          const countyName = stationData.GeoInfo.CountyName;
          const townName = stationData.GeoInfo.TownName;

          let condition = "sunny"; // Default to sunny
          if (weatherCondition.includes("陰") || weatherCondition.includes("多雲")) {
            condition = "cloudy";
          } else if (weatherCondition.includes("雨")) {
            condition = "rainy";
          } else if (weatherCondition.includes("晴") && weatherCondition.includes("雲")) {
            condition = "partly-cloudy";
          }
          
          setWeather({ temp, condition, county: countyName, town: townName });
        }
      } catch (error) {
        console.error("Failed to fetch weather data:", error);
      }
    };

    fetchWeatherData();
    const weatherInterval = setInterval(fetchWeatherData, 3600000); // Update every hour

    return () => clearInterval(weatherInterval);
  }, []);

  const getWeatherIcon = (condition: string) => {
    switch (condition) {
      case "sunny":
        return <Sun className="h-4 w-4" />;
      case "cloudy":
        return <Cloud className="h-4 w-4" />;
      case "rainy":
        return <CloudRain className="h-4 w-4" />;
      case "partly-cloudy":
        return <CloudSun className="h-4 w-4" />;
      default:
        return <Sun className="h-4 w-4" />;
    }
  };

  const handleLogout = async () => {
    try {
      const response = await fetch("/api/auth/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) throw new Error("Logout failed");
      router.push("/auth/signin");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const routeName = pathname.split("/").pop() || "Dashboard";
  const formattedRouteName =
    routeName.charAt(0).toUpperCase() + routeName.slice(1);

  return (
    <header className="flex h-16 shrink-0 items-center gap-2 border-b bg-background px-4">
      <SidebarTrigger className="-ml-1" />
      <Separator orientation="vertical" className="mr-2 h-4" />

      <div className="flex flex-1 items-center justify-between">
        <div className="flex items-center gap-2">
          <h1 className="text-lg font-semibold">{formattedRouteName}</h1>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 px-3 py-1 rounded-md bg-muted">
            {getWeatherIcon(weather.condition)}
            <span className="text-sm font-medium">{weather.county} {weather.town} {weather.temp}°C</span>
          </div>
          <div className="text-sm font-medium w-[180px] text-right font-mono tabular-nums">
            {currentDateTime}
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "light" ? "dark" : "light")}
          >
            <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarImage
                    src="/placeholder.svg?height=32&width=32"
                    alt="User"
                  />
                  <AvatarFallback>
                    {user?.email?.charAt(0).toUpperCase() ?? "?"}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  {isLoading ? (
                    <>
                      <p className="text-sm font-medium leading-none">
                        Loading...
                      </p>
                      <p className="text-xs leading-none text-muted-foreground">
                        Please wait
                      </p>
                    </>
                  ) : user ? (
                    <>
                      <p className="text-sm font-medium leading-none">
                        {user.email}
                      </p>
                      <p className="text-xs leading-none text-muted-foreground">
                        Hi, Welcome to VoltIQ!
                      </p>
                    </>
                  ) : (
                    <>
                      <p className="text-sm font-medium leading-none">Guest</p>
                      <p className="text-xs leading-none text-muted-foreground">
                        Not signed in
                      </p>
                    </>
                  )}
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Profile</DropdownMenuItem>
              <DropdownMenuItem>Settings</DropdownMenuItem>
              <DropdownMenuItem>Support</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout}>
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
