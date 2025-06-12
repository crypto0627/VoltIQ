"use client";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import type { ThemeProviderProps } from "next-themes";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  const searchParams = useSearchParams();
  const theme = searchParams.get("theme");

  useEffect(() => {
    if (theme === "dark" || theme === "light") {
      document.documentElement.classList.remove("light", "dark");
      document.documentElement.classList.add(theme);
    }
  }, [theme]);

  return (
    <NextThemesProvider
      {...props}
      defaultTheme={theme === "dark" ? "dark" : "light"}
      forcedTheme={theme === "dark" ? "dark" : theme === "light" ? "light" : undefined}
    >
      {children}
    </NextThemesProvider>
  );
}
