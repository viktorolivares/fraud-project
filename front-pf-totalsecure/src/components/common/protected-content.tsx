// src/components/ProtectedContent.tsx
"use client";

import React, { useEffect } from "react";
import { useAuth } from "../../hooks/use-auth";
import { useRouter } from "next/navigation";

interface ProtectedContentProps {
  children: React.ReactNode;
}

export default function ProtectedContent({ children }: ProtectedContentProps) {
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace("/login");
    } else {
      router.prefetch("/dashboard");
    }
  }, [isAuthenticated, router]);

  return <>{children}</>;
}
