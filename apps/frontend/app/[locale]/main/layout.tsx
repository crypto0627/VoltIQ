'use client'
import type React from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { Navbar } from "@/components/navbar";
import { useEffect } from "react";
import { useRouter } from "@/i18n/navigation";
import useUserStore from "@/stores/useUserStore";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { isLoggedOut } = useUserStore();

  useEffect(() => {
    if (isLoggedOut) {
      router.replace("/auth/signin");
    }
  }, [isLoggedOut, router]);

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <AppSidebar />
        <div className="flex flex-1 flex-col">
          <Navbar />
          <main className="flex-1 p-1 bg-muted/50">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  );
}
