"use client";
import { DataTableHeader } from "@/shared/datatable/header";
import { type ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MoreHorizontal } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { CaseState } from "@/types/case-state";

export const columns: ColumnDef<CaseState, string | number>[] = [
  {
    accessorKey: "id",
    header: ({ column }) => <DataTableHeader column={column} title="ID" />,
    cell: ({ row }) => (
      <Button variant="link" size="sm">{row.original.id}</Button>
    ),
  },
  {
    accessorKey: "name",
    header: ({ column }) => <DataTableHeader column={column} title="Nombre" />,
    cell: ({ row }) => <Badge>{row.original.name}</Badge>,
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const item = row.original;
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Acciones</DropdownMenuLabel>
            <DropdownMenuItem onClick={() => navigator.clipboard.writeText(String(item.id))}>
              Copiar ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Ver detalles</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
