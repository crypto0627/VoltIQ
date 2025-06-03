import type React from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { Navbar } from "@/components/navbar";
import { redirect } from "next/navigation";
import { cookies } from 'next/headers';
import useUserStore from "@/stores/useUserStore";

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
      throw new Error("Unauthorized");
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
  console.log('[/main/layout] MainLayout rendering...');
  const isAuthenticated = await checkAuth();
  console.log('[/main/layout] isAuthenticated:', isAuthenticated);

  if (!isAuthenticated) {
    console.log('[/main/layout] User not authenticated, redirecting...');
    redirect("/auth/signin");
  }

  console.log('[/main/layout] User authenticated, rendering dashboard');
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
