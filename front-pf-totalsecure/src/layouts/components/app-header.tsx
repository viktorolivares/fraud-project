"use client";

import { useAuth } from "../../hooks/use-auth";
import { usePathname, useRouter } from "next/navigation";
import { protectedRoutes, ProtectedRoute } from "../../routes";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";
import { useTheme } from "next-themes";
import clsx from "clsx";

const AppHeader: React.FC = () => {
  const { toggleTheme } = useAuth();
  const { theme } = useTheme();

  const isDark = theme === "dark";
  const router = useRouter();
  const pathname = usePathname();

  // Buscar el nombre de la ruta actual
  const currentRoute = protectedRoutes.find((r: ProtectedRoute) => r.path === pathname);
  const currentRouteName = currentRoute ? currentRoute.name : "";

  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <header className="flex h-16 shrink-0 items-center justify-between px-4 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
      <div className="flex items-center gap-2">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="h-4" />
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem className="hidden md:block">
              <BreadcrumbLink
                href="#"
                onClick={e => {
                  e.preventDefault();
                  router.push("/dashboard");
                }}
              >
                Total Secure
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator className="hidden md:block" />
            <BreadcrumbItem>
              <BreadcrumbPage>{currentRouteName || "Dashboard"}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>
      {mounted && (
        <Button
          variant="outline"
          size="icon"
          onClick={toggleTheme}
          className={clsx(
            "transition-colors rounded-full",
            isDark ? "bg-yellow-200 hover:bg-yellow-300" : "bg-slate-200 hover:bg-slate-300"
          )}
        >
          {isDark ? (
            <Sun className="w-5 h-5 text-yellow-600" />
          ) : (
            <Moon className="w-5 h-5 text-slate-600" />
          )}
        </Button>
      )}
    </header>
  );
};

export default AppHeader;
