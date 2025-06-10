"use client";

import { Calendar, Home, Sliders, User, FileText } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { useTranslations } from "next-intl";
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
    title: "dashboard",
    url: "/main/dashboard",
    icon: Home,
  },
  {
    title: "reports",
    url: "/main/reports",
    icon: FileText,
  },
  {
    title: "schedule",
    url: "/main/schedule",
    icon: Calendar,
  },
  {
    title: "controller",
    url: "/main/controller",
    icon: Sliders,
  },
];

const accountItems = [
  {
    title: "profile",
    url: "/main/profile",
    icon: User,
  },
];

export function AppSidebar() {
  const pathname = usePathname();
  const t = useTranslations("main.sidebar");

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex justify-start p-2 rounded-lg">
          <Link href={"/"} className="w-[200px] h-[50px] relative">
            <Image
              src="/ess-logo.png"
              alt="Logo"
              fill
              className="object-contain"
            />
          </Link>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>{t("mainNavigation")}</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={pathname === item.url}>
                    <Link href={item.url}>
                      <item.icon className="size-4" />
                      <span>{t(item.title)}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>{t("account")}</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {accountItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={pathname === item.url}>
                    <Link href={item.url}>
                      <item.icon className="size-4" />
                      <span>{t(item.title)}</span>
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
