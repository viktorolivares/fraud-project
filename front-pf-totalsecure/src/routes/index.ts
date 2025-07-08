// src/routes/routes-definitions.ts
export interface ProtectedRoute {
  path: string;
  name: string;
}

export const protectedRoutes: ProtectedRoute[] = [
  { path: "/dashboard", name: "Dashboard" },
  { path: "/dashboard/overview", name: "Dashboard Overview" },
  { path: "/dashboard/summary", name: "Dashboard Summary" },
  { path: "/users", name: "Users" },
  { path: "/user-management/roles", name: "Roles" },
  { path: "/user-management/permissions", name: "Permissions" },
  { path: "/user-management/modules", name: "Modules" },
  { path: "/reports", name: "Reports" },
  { path: "/config", name: "Config" },
  { path: "/bots", name: "Bots" },
  { path: "/bot-executions", name: "Bot Executions" },
  { path: "/cases", name: "Cases" },
  { path: "/case-incidents", name: "Case Incidents" },
  { path: "/case-states", name: "Case States" },
  { path: "/test", name: "Test" },
];
