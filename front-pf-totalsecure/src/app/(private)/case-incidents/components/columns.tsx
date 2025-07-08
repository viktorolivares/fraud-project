"use client";

import { type ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowUpDown, MoreHorizontal, Eye, AlertTriangle } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { CaseIncident } from "@/types/case-incident";

export const columns: ColumnDef<CaseIncident>[] = [
  {
    accessorKey: "id",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="h-8 px-2"
        >
          ID
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <AlertTriangle className="h-4 w-4 text-orange-500" />
        <span className="font-medium">#{row.getValue("id")}</span>
      </div>
    ),
  },
  {
    accessorKey: "caseId",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="h-8 px-2"
        >
          Caso ID
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => (
      <Badge variant="outline" className="font-mono">
        Caso #{row.getValue("caseId")}
      </Badge>
    ),
  },
  {
    accessorKey: "dataJson",
    header: "Datos del Incidente",
    cell: ({ row }) => {
      const data = row.getValue("dataJson") as Record<string, unknown>;
      const dataString = JSON.stringify(data);
      const hasData = data && Object.keys(data).length > 0;
      
      return (
        <div className="max-w-xs">
          {hasData ? (
            <div className="space-y-1">
              <div className="text-sm font-medium">
                {Object.keys(data).length} campo(s)
              </div>
              <div 
                className="text-xs text-muted-foreground truncate cursor-help" 
                title={dataString}
              >
                {dataString.length > 50 ? `${dataString.substring(0, 50)}...` : dataString}
              </div>
            </div>
          ) : (
            <Badge variant="secondary">Sin datos</Badge>
          )}
        </div>
      );
    },
  },
  {
    header: "Estado",
    cell: ({ row }) => {
      const data = row.getValue("dataJson") as Record<string, unknown>;
      const hasData = data && Object.keys(data).length > 0;
      
      return (
        <Badge variant={hasData ? "default" : "secondary"}>
          {hasData ? "Con datos" : "Vacío"}
        </Badge>
      );
    },
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const incident = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Abrir menú</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Acciones</DropdownMenuLabel>
            <DropdownMenuItem 
              onClick={() => navigator.clipboard.writeText(String(incident.id))}
            >
              Copiar ID
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={() => navigator.clipboard.writeText(JSON.stringify(incident.dataJson, null, 2))}
            >
              Copiar datos JSON
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Eye className="mr-2 h-4 w-4" />
              Ver detalles
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
