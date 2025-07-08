"use client";
import { DataTableHeader } from "@/shared/datatable/header";
import { type ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MoreHorizontal, CheckCircle, XCircle } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { format } from "date-fns";
import type { BotExecution } from "@/types/bot-execution";

export const columns: ColumnDef<BotExecution, string | number>[] = [
  {
    accessorKey: "botId",
    header: ({ column }) => <DataTableHeader column={column} title="Bot ID" />,
    cell: ({ row }) => <span>#{row.original.botId}</span>,
  },
  {
    accessorKey: "id",
    header: ({ column }) => <DataTableHeader column={column} title="ID" />,
    cell: ({ row }) => (
      <Button variant="link" size="sm" className="p-0">
        #{row.original.id}
      </Button>
    ),
  },
  {
    accessorKey: "bot.name",
    header: ({ column }) => <DataTableHeader column={column} title="Bot" />,
    cell: ({ row }) => {
      const bot = row.original.bot;
      return bot ? (
        <span className="font-medium">{bot.name}</span>
      ) : (
        <Badge variant="secondary">Bot #{row.original.botId}</Badge>
      );
    },
  },
  {
    accessorKey: "executedAt",
    header: ({ column }) => <DataTableHeader column={column} title="Fecha de Ejecución" />,
    cell: ({ row }) => {
      const value = row.original.executedAt;
      return value ? (
        <span className="text-sm">
          {format(new Date(value), "dd/MM/yyyy HH:mm")}
        </span>
      ) : (
        <span className="text-muted-foreground">-</span>
      );
    },
  },
  {
    accessorKey: "totalProcessedRecords",
    header: ({ column }) => <DataTableHeader column={column} title="Registros Procesados" />,
    cell: ({ row }) => (
      <div className="text-center">
        <span className="font-medium">{row.original.totalProcessedRecords?.toLocaleString() || 0}</span>
      </div>
    ),
  },
  {
    accessorKey: "totalDetectedIncidents",
    header: ({ column }) => <DataTableHeader column={column} title="Incidentes Detectados" />,
    cell: ({ row }) => {
      const incidents = row.original.totalDetectedIncidents || 0;
      return (
        <Badge 
          variant={incidents > 0 ? "destructive" : "secondary"}
          className="font-medium"
        >
          {incidents}
        </Badge>
      );
    },
  },
  {
    accessorKey: "status",
    header: ({ column }) => <DataTableHeader column={column} title="Estado" />,
    cell: ({ row }) => {
      // Determinar estado basado en los datos disponibles
      const hasProcessedRecords = row.original.totalProcessedRecords > 0;
      const hasIncidents = row.original.totalDetectedIncidents > 0;
      
      if (hasProcessedRecords) {
        return (
          <Badge variant="outline" className="text-green-600 border-green-200 bg-green-50 dark:text-green-400 dark:border-green-800 dark:bg-green-950">
            <CheckCircle className="w-3 h-3 mr-1" />
            Completado
          </Badge>
        );
      } else {
        return (
          <Badge variant="outline" className="text-gray-600 border-gray-200 bg-gray-50 dark:text-gray-400 dark:border-gray-800 dark:bg-gray-950">
            <XCircle className="w-3 h-3 mr-1" />
            Sin datos
          </Badge>
        );
      }
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const execution = row.original;
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
            <DropdownMenuItem onClick={() => navigator.clipboard.writeText(String(execution.id))}>
              Copiar ID de Ejecución
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Ver Detalles</DropdownMenuItem>
            <DropdownMenuItem>Descargar Log</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
