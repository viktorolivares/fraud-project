"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { createSortableHeader } from "@/components/ui/data-table";
import { 
  MoreHorizontal, 
  Bot as BotIcon, 
  AlertTriangle,
  Clock,
  CheckCircle,
  XCircle,
  Play,
  Settings,
  Eye,
  Copy,
  Edit,
  Trash2
} from "lucide-react";
import { format, formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";
import type { Bot } from "@/types/bot";
import { cn } from "@/lib/utils";

// Configuración para hacer que solo 6 columnas sean visibles inicialmente
export const columns: ColumnDef<Bot>[] = [
  // Columna 1: Sistema (Principal - Siempre visible)
  {
    accessorKey: "name",
    header: createSortableHeader("Sistema"),
    cell: ({ row }) => {
      const bot = row.original;
      const isActive = bot.lastRun && new Date(bot.lastRun) > new Date(Date.now() - 24 * 60 * 60 * 1000);
      
      return (
        <div className="flex items-center gap-3 min-w-[250px]">
          <div className="relative">
            <BotIcon className="h-8 w-8 text-muted-foreground" />
            <div className={cn(
              "absolute -bottom-1 -right-1 h-3 w-3 rounded-full border-2 border-background",
              isActive ? "bg-green-500" : "bg-gray-400"
            )} />
          </div>
          <div className="min-w-0 flex-1">
            <div className="font-medium truncate">{bot.name}</div>
            <div className="text-sm text-muted-foreground truncate">
              {bot.description || "Sin descripción"}
            </div>
          </div>
        </div>
      );
    },
  },
  // Columna 2: Tipo de Alerta (Visible)
  {
    accessorKey: "alertType",
    header: createSortableHeader("Tipo de Alerta"),
    cell: ({ row }) => {
      const alertType = row.original.alertType;
      const getAlertVariant = (type: string) => {
        if (type.toLowerCase().includes('critical') || type.toLowerCase().includes('alto')) return 'destructive';
        if (type.toLowerCase().includes('medium') || type.toLowerCase().includes('medio')) return 'default';
        return 'secondary';
      };
      
      return (
        <div className="min-w-[120px]">
          <Badge variant={getAlertVariant(alertType)} className="flex items-center gap-1 w-fit">
            <AlertTriangle className="h-3 w-3" />
            <span className="truncate max-w-[80px]">{alertType}</span>
          </Badge>
        </div>
      );
    },
  },
  // Columna 3: Canal (Visible)
  {
    accessorKey: "channelId",
    header: createSortableHeader("Canal"),
    cell: ({ row }) => {
      const bot = row.original;
      if (!bot.channelId) {
        return <span className="text-muted-foreground text-sm">No asignado</span>;
      }
      
      return (
        <div className="min-w-[120px]">
          <Badge variant="outline" className="flex items-center gap-1 w-fit">
            {bot.channel?.name || `Canal ${bot.channelId}`}
          </Badge>
        </div>
      );
    },
  },
  // Columna 4: Estado (Visible)
  {
    accessorKey: "status",
    header: createSortableHeader("Estado"),
    cell: ({ row }) => {
      const lastRun = row.original.lastRun;
      
      if (!lastRun) {
        return (
          <div className="flex items-center gap-2 min-w-[120px]">
            <XCircle className="h-4 w-4 text-red-500" />
            <div>
              <div className="text-sm font-medium text-red-600">Inactivo</div>
              <div className="text-xs text-muted-foreground">Sin ejecución</div>
            </div>
          </div>
        );
      }
      
      const lastRunDate = new Date(lastRun);
      const isRecent = lastRunDate > new Date(Date.now() - 24 * 60 * 60 * 1000);
      
      return (
        <div className="flex items-center gap-2 min-w-[120px]">
          <CheckCircle className={cn(
            "h-4 w-4",
            isRecent ? "text-green-500" : "text-yellow-500"
          )} />
          <div>
            <div className={cn(
              "text-sm font-medium",
              isRecent ? "text-green-600" : "text-yellow-600"
            )}>
              {isRecent ? "Activo" : "Pausado"}
            </div>
            <div className="text-xs text-muted-foreground">
              {isRecent ? "Última 24h" : "Más de 1 día"}
            </div>
          </div>
        </div>
      );
    },
  },
  // Columna 4: Última Ejecución (Visible)
  {
    accessorKey: "lastRun",
    header: createSortableHeader("Última Ejecución"),
    cell: ({ row }) => {
      const lastRun = row.original.lastRun;
      
      if (!lastRun) {
        return (
          <div className="min-w-[130px]">
            <span className="text-muted-foreground">Nunca ejecutado</span>
          </div>
        );
      }
      
      return (
        <div className="flex items-center gap-2 min-w-[130px]">
          <Clock className="h-4 w-4 text-muted-foreground" />
          <div>
            <div className="text-sm font-medium">
              {format(new Date(lastRun), "dd/MM/yyyy")}
            </div>
            <div className="text-xs text-muted-foreground">
              {format(new Date(lastRun), "HH:mm:ss")}
            </div>
          </div>
        </div>
      );
    },
  },
  // Columna 5: Acciones (Visible)
  {
    id: "actions",
    header: "Acciones",
    cell: ({ row, table }) => {
      const bot = row.original;
      const onEdit = (table.options.meta as any)?.onEdit;
      const onDelete = (table.options.meta as any)?.onDelete;
      
      return (
        <div className="flex justify-end">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Abrir menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Acciones</DropdownMenuLabel>
              <DropdownMenuItem onClick={() => onEdit?.(bot)}>
                <Edit className="mr-2 h-4 w-4" /> Editar
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onDelete?.(bot)}>
                <Trash2 className="mr-2 h-4 w-4" /> Eliminar
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => console.log("Ver detalles:", bot.name)}>
                <Eye className="mr-2 h-4 w-4" /> Ver detalles
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => console.log("Ejecutar:", bot.name)}>
                <Play className="mr-2 h-4 w-4" /> Ejecutar ahora
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => console.log("Configurar:", bot.name)}>
                <Settings className="mr-2 h-4 w-4" /> Configurar
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => navigator.clipboard.writeText(bot.id.toString())}>
                <Copy className="mr-2 h-4 w-4" /> Copiar ID
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      );
    },
    size: 120,
  },
  // Columnas adicionales (ocultas por defecto, accesibles con scroll horizontal)
  {
    accessorKey: "id",
    header: createSortableHeader("ID"),
    cell: ({ row }) => (
      <div className="min-w-[80px]">
        <code className="text-xs bg-muted px-2 py-1 rounded">
          {row.original.id}
        </code>
      </div>
    ),
  },
  {
    accessorKey: "description", 
    header: createSortableHeader("Descripción Completa"),
    cell: ({ row }) => {
      const description = row.original.description;
      
      return (
        <div className="min-w-[200px] max-w-[300px]">
          <div className="text-sm">
            {description || "Sin descripción disponible"}
          </div>
        </div>
      );
    },
  },
];
