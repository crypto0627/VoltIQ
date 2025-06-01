import type React from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { Navbar } from "@/components/navbar";
import { redirect } from "next/navigation";
import { cookies } from 'next/headers';

async function checkAuth() {
  try {
    // Read the cookie directly in the Server Component
    const cookieStore: any = await cookies();
    // Log the cookieStore itself
    console.log('[/main/layout/checkAuth] cookieStore object:', cookieStore);

    const authToken = cookieStore.get('auth_token')?.value;

    console.log('[/main/layout/checkAuth] Read token from cookie:', authToken ? 'Exists' : 'None');

    // If no token found, return false immediately
    if (!authToken) {
      console.log('[/main/layout/checkAuth] No token found.');
      return false;
    }

    // Fetch the /api/auth/me route, passing the token in the Authorization header
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/me`, {
      cache: 'no-store',
      headers: {
        'Authorization': `Bearer ${authToken}` // Pass the token here
      }
    });

    if (!response.ok) {
      console.error(`[/main/layout/checkAuth] Fetch failed: Status ${response.status}`);
      const errorText = await response.text();
      console.error('[/main/layout/checkAuth] Fetch error response:', errorText);
      throw new Error("Unauthorized");
    }

    console.log('[/main/layout/checkAuth] Auth check successful');
    return true;
  } catch (error) {
    console.error('[/main/layout/checkAuth] Caught exception during auth check:', error);
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
