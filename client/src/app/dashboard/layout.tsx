import { AppSidebar } from "@/components/sidebar";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import React from "react";

export default function Page({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarTrigger className="ml-1" />
      <SidebarInset>{children}</SidebarInset>
    </SidebarProvider>
  );
}
