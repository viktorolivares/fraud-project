"use client";

import * as React from "react";
import { ChevronsUpDown, Plus } from "lucide-react";
import Logo from "@public/logo.png";
import Image from "next/image";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import { useSidebar } from "../../hooks/use-sidebar";

export function NavTeam({
  channels,
}: {
  channels: {
    name: string;
    logo: React.ElementType;
    company: string;
  }[];
}) {
  const { isMobile, state } = useSidebar();
  const [activeChannel, setActiveChannel] = React.useState(channels[0]);

  if (!activeChannel) {
    return null;
  }

  if (state === "collapsed") {
    return (
      <div className="flex items-center justify-center py-2">
        <Avatar>
          <AvatarImage src="/logo.png" alt="Apuesta Total" className="dark:invert dark:grayscale"/>
          <AvatarFallback>AT</AvatarFallback>
        </Avatar>
      </div>
    );
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <div className="border shadow rounded-full p-1">
                <Image
                  src={Logo}
                  alt={activeChannel.name}
                  className="size-6 dark:invert dark:grayscale"
                  width={24}
                  height={24}
                />
              </div>

              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">
                  {activeChannel.company}
                </span>
                <span className="truncate text-xs">{activeChannel.name}</span>
              </div>
              <ChevronsUpDown className="ml-auto" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            align="start"
            side={isMobile ? "bottom" : "right"}
            sideOffset={4}
          >
            <DropdownMenuLabel className="text-muted-foreground text-xs">
              Canales
            </DropdownMenuLabel>
            {channels.map((channel, index) => (
              <DropdownMenuItem
                key={channel.name}
                onClick={() => setActiveChannel(channel)}
                className="gap-2 p-2"
              >
                <div className="flex size-6 items-center justify-center rounded-md border">
                  <channel.logo className="size-3.5 shrink-0" />
                </div>
                {channel.name}
                <DropdownMenuShortcut>⌘{index + 1}</DropdownMenuShortcut>
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
            <DropdownMenuItem className="gap-2 p-2">
              <div className="flex size-6 items-center justify-center rounded-md border bg-transparent">
                <Plus className="size-4" />
              </div>
              <div className="text-muted-foreground font-medium">Add team</div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
