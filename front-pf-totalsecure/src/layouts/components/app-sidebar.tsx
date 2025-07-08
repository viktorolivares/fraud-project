"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { NavMain } from "./nav-main";
import { NavTeam } from "./nav-team";
import { NavUser } from "./nav-user";
import NavBanner from "./nav-banner";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";

import navMain from "../data/nav-main";
import channels from "../data/channels";

// This is sample data.
const data = {
  user: {
    name: "Victor Olivares",
    email: "victor.olivares@apuestatotal.com",
    avatar: "/avatar.webp",
  },
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname();
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <NavTeam channels={channels} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain
          items={navMain.map((item) => ({
            ...item,
            isActive:
              pathname === item.url ||
              (item.items && item.items.some((sub) => pathname === sub.url)),
            items: item.items.map((subItem) => ({
              ...subItem,
              isActive: pathname === subItem.url,
            })),
            render: (
              <Link
                href={item.url}
                className={`nav-link${
                  pathname === item.url ? " active" : ""
                }`}
              >
                {item.icon && <item.icon className="nav-icon" />}
                {item.title}
              </Link>
            ),
          }))}
        />
      </SidebarContent>
      <NavBanner />
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
