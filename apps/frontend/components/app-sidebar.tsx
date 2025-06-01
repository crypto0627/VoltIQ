"use client";

import {
  Calendar,
  Home,
  Settings,
  Sliders,
  User,
  FileText,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
} from "@/components/ui/sidebar";

const menuItems = [
  {
    title: "Dashboard",
    url: "/main/dashboard",
    icon: Home,
  },
  {
    title: "Reports",
    url: "/main/reports",
    icon: FileText,
  },
  {
    title: "Schedule",
    url: "/main/schedule",
    icon: Calendar,
  },
  {
    title: "Controller",
    url: "/main/controller",
    icon: Sliders,
  },
];

const accountItems = [
  {
    title: "Profile",
    url: "/main/profile",
    icon: User,
  },
  {
    title: "Settings",
    url: "/main/settings",
    icon: Settings,
  },
];

export function AppSidebar() {
  const pathname = usePathname();
  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex justify-start p-2 rounded-lg">
          <Link href={"/"} className="w-[200px] h-[50px] relative">
            <Image src="/logo.png" alt="Logo" fill className="object-contain" />
          </Link>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Main Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={pathname === item.url}>
                    <Link href={item.url}>
                      <item.icon className="size-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Account</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {accountItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={pathname === item.url}>
                    <Link href={item.url}>
                      <item.icon className="size-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <div className="flex flex-row item-center justify-center p-2 gap-4 absolute bottom-0">
          <div className="text-xs text-muted-foreground">© 2025 VoltIQ</div>
          <Link
            href="/privacy-policy"
            className="text-xs text-muted-foreground hover:underline"
          >
            Privacy Policy
          </Link>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
