"use client";

import { useSearchParams } from "next/navigation";
import RoleForm from "../components/role-form";

export default function RoleFormPage() {
  const searchParams = useSearchParams();
  const roleId = searchParams.get("id");
  const isEdit = Boolean(roleId);

  return <RoleForm roleId={roleId} isEdit={isEdit} />;
}
