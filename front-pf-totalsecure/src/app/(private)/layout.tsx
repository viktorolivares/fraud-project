"use client";

import React from "react";

import AppLayout from "@/layouts/app-layout";
import { SidebarProvider } from "@/contexts/sidebar-provider";
import ProtectedContent from "@/components/common/protected-content";

export default function PrivateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
      <SidebarProvider>
        <AppLayout>
          <ProtectedContent>{children}</ProtectedContent>
        </AppLayout>
      </SidebarProvider>
  );
}
