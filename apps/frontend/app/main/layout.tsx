import type React from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { Navbar } from "@/components/navbar";
import { redirect } from "next/navigation";
import { cookies } from 'next/headers';

async function checkAuth() {
  try {
    const cookieStore: any = await cookies();

    const authToken = cookieStore.get('auth_token')?.value;
    if (!authToken) {
      return false;
    }

    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/me`, {
      cache: 'no-store',
      headers: {
        'Authorization': `Bearer ${authToken}`
      }
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('[/main/layout/checkAuth] Fetch error response:', errorText);
    }
    return true;
  } catch (error) {
    return false;
  }
}

export default async function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  
  const isAuthenticated = await checkAuth();
  if (!isAuthenticated) {
   redirect("/auth/signin");
  }

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <AppSidebar />
        <div className="flex flex-1 flex-col">
          <Navbar />
          <main className="flex-1 p-6 bg-muted/50">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  );
}
