"use client";

import { createContext } from "react";
import type { SidebarContextProps } from "../types/layout";

export const SidebarContext = createContext<SidebarContextProps | null>(null);
