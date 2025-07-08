"use client";

import AuthLayout from "@/layouts/auth-layout";
import ProtectedContent from "@/components/common/protected-content";

export default function AuthPagesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthLayout>
      <ProtectedContent>{children}</ProtectedContent>
    </AuthLayout>
  );
}
