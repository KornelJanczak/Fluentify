import { authService } from "@/common/services/auth/auth.service";
import { AppSidebar } from "@/components/app-sidebar";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import React from "react";

export default async function Page({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await authService.getUser();

  return (
    <SidebarProvider>
      <AppSidebar user={user} />
      <SidebarTrigger className="ml-1" />
      <SidebarInset>{children}</SidebarInset>
    </SidebarProvider>
  );
}
