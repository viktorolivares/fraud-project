"use client";

import { UserActionsCell } from "./user-actions-cell";
import { DataTableCellViewer } from "@/shared/datatable/cell-viewer";
import { User as UserIcon, Shield } from "lucide-react";
import { DataTableHeader } from "@/shared/datatable/header";
import { type ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import type { User } from "@/types/user";
import { format } from "date-fns";
import { UserActiveCell } from "./user-active-cell";

// Extraemos el renderizado del ID en una función separada
const renderIdCell = (item: User) => (
  <div className="space-y-4 text-sm">
    <div>
      <strong>username:</strong> {item.username}
    </div>
    <div>
      <strong>Dark Mode:</strong> {item.darkMode ? "Sí" : "No"}
    </div>
  </div>
);

const CHANNEL_NAMES: Record<number, string> = {
  1: "Digital",
  2: "Teleservicios",
  3: "Retail",
};

export const columns = (options?: {
  onUserUpdated?: () => void;
  onUserDeleted?: () => void;
}): ColumnDef<User, string | number>[] => [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "id",
    header: ({ column }) => <DataTableHeader column={column} title="ID" />,
    cell: ({ row }) => (
      <DataTableCellViewer
        item={row.original}
        renderTrigger={(item) => (
          <Button variant="link" className="text-primary" size="sm">
            {item.id}
          </Button>
        )}
        renderContent={renderIdCell}
      />
    ),
  },
  {
    accessorKey: "fullName",
    header: ({ column }) => (
      <DataTableHeader column={column} title="Nombre completo" />
    ),
    cell: ({ row }) => (
      <span>{`${row.original.firstName} ${row.original.lastName}`}</span>
    ),
  },
    {
    accessorKey: "email",
    header: ({ column }) => <DataTableHeader column={column} title="Email" />,
  },
    {
    accessorKey: "username",
    header: ({ column }) => <DataTableHeader column={column} title="Usuario" />,
    cell: ({ row }) => (
      <span className="flex items-center gap-2 text-primary font-bold">
        <UserIcon size={18} className="text-primary" />
        {row.getValue("username")}
      </span>
    ),
  },
  {
    accessorKey: "role",
    header: ({ column }) => <DataTableHeader column={column} title="Rol" />,
    cell: ({ row }) => (
      <span className="flex items-center gap-2 font-semibold text-blue-700 dark:text-blue-300">
        <Shield size={16} />
        {row.getValue("role") || "-"}
      </span>
    ),
  },
    {
    accessorKey: "channelId",
    header: ({ column }) => <DataTableHeader column={column} title="Canal" />,
    cell: ({ row }) => {
      const channelId = Number(row.getValue("channelId"));
      return (
          <div className=" text-yellow-600 dark:text-yellow-400">
            {CHANNEL_NAMES[channelId] || `Canal ${channelId}`}
          </div>
      );
    },
    filterFn: (row, columnId, filterValue) => {
      if (!filterValue) return true;
      return String(row.getValue(columnId)) === String(filterValue);
    },
  },
  {
    accessorKey: "isActive",
    header: ({ column }) => <DataTableHeader column={column} title="Estado" />,
    cell: ({ row }) => (
      <UserActiveCell
        user={row.original}
        onUserUpdated={options?.onUserUpdated}
      />
    ),
    filterFn: (row, columnId, filterValue) => {
      if (!filterValue) return true;
      return String(row.getValue(columnId)) === filterValue;
    },
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => (
      <DataTableHeader column={column} title="Fecha de Creación" />
    ),
    cell: ({ row }) => {
      const date = new Date(row.getValue("createdAt"));
      return <div>{format(date, "dd/MM/yyyy HH:mm:ss")}</div>;
    },
  },
  {
    id: "actions",
    cell: ({ row }) => (
      <UserActionsCell
        user={row.original}
        onUserUpdated={options?.onUserUpdated}
        onUserDeleted={options?.onUserDeleted}
      />
    ),
  },
];
