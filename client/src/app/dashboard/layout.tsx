import { authService } from "@/common/api/services/auth.service";
import { AppSidebar } from "@/components/app-sidebar";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import React from "react";
import { cookies } from "next/headers";

export default async function Page({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, cookieStore] = await Promise.all([
    authService.getUser(),
    cookies(),
  ]);
  const isCollapsed = cookieStore.get("sidebar:state")?.value !== "true";

  return (
    <SidebarProvider defaultOpen={!isCollapsed}>
      <AppSidebar user={user} />
      <SidebarTrigger className="sticky top-0 left-0" />
      <SidebarInset>{children}</SidebarInset>
    </SidebarProvider>
  );
}
