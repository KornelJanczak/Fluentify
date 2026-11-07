"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  Sidebar,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
} from "@/components/ui/sidebar";
import { BookOpen, MessageCircle } from "lucide-react";

const navigation = [
  { title: "Flashcard sets", url: "/dashboard/flashcard-sets", icon: BookOpen },
  { title: "Chats", url: "/dashboard/chats", icon: MessageCircle },
];

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname() ?? "";

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              className="p-1.5!"
              render={<Link href="/dashboard/flashcard-sets" />}
            >
              <span className="flex size-7 items-center justify-center rounded-full bg-[var(--fluent-coral)] text-xs font-bold text-white">
                F
              </span>
              <span className="text-base font-semibold tracking-[-0.04em]">
                Fluentify
              </span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Practice</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigation.map(({ title, url, icon: Icon }) => (
                <SidebarMenuItem key={url}>
                  <SidebarMenuButton
                    render={<Link href={url} />}
                    isActive={
                      pathname === url || pathname.startsWith(`${url}/`)
                    }
                    tooltip={title}
                  >
                    <Icon />
                    <span>{title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <p className="px-2 pb-2 text-xs leading-5 text-muted-foreground">
          One useful sentence at a time.
        </p>
      </SidebarFooter>
    </Sidebar>
  );
}
