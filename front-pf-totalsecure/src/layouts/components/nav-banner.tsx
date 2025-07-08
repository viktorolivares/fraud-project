"use client";

import React, { useEffect, useState } from "react";
import { SidebarGroup } from "@/components/ui/sidebar";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

const NavBanner: React.FC = () => {
  const [year, setYear] = useState<string>("");

  useEffect(() => {
    setYear(format(new Date(), "yyyy"));
  }, []);

  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <div
        className={cn(
          "flex flex-row items-center bg-gray-100 dark:bg-red-950/20 p-3 shadow-md w-auto h-auto rounded-xl gap-4"
        )}
      >
        <div className="flex-shrink-0 flex items-center justify-center">
          <Image
            src="/shield.png"
            alt="Equipo de Prevención de Fraude"
            width={64}
            height={64}
            className="w-8"
          />
        </div>
        <div className="flex flex-col justify-center">
          <p
            className="text-left text-xs text-gray-400 dark:text-gray-300"
            style={{ fontSize: "0.7rem" }}
          >
            Equipo Prevención de fraude
          </p>
          <span
            className="text-left text-red-300 dark:text-red-500"
            style={{ fontSize: "0.7rem" }}
          >
            apuestatotal &copy; {year}
          </span>
        </div>
      </div>
    </SidebarGroup>
  );
};

export default NavBanner;
