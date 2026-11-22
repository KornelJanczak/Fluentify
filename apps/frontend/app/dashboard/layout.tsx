import { Suspense } from "react";

import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

export default function DashboardLayout({
  children,
}: LayoutProps<"/dashboard">) {
  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <Suspense fallback={null}>
        <AppSidebar variant="inset" />
      </Suspense>
      <SidebarInset className="h-svh overflow-hidden md:h-[calc(100svh-1rem)] md:max-h-[calc(100svh-1rem)]">
        <SiteHeader />
        <main className="flex min-h-0 flex-1 flex-col overflow-y-auto bg-[var(--fluent-paper)]">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
