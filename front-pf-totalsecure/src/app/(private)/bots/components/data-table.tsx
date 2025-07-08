"use client";
import * as React from "react";
import {
  type ColumnDef,
  type ColumnFiltersState,
  type VisibilityState,
  type SortingState,
  flexRender,
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
} from "@tanstack/react-table";
import {
  Table,
  TableRow,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
} from "@/components/ui/table";
import { DataTablePagination } from "@/shared/datatable/pagination";
import { DataTableViewOptions } from "@/shared/datatable/view-options";
import type { Bot } from "@/types/bot";
import { Siren } from "lucide-react";

interface DataTableProps<TValue> {
  columns: ColumnDef<Bot, TValue>[];
  data: Bot[];
  onEdit?: (bot: Bot) => void;
  onDelete?: (bot: Bot) => void;
}

export function DataTable<TValue>({ 
  columns, 
  data,
  onEdit,
  onDelete 
}: DataTableProps<TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [rowSelection, setRowSelection] = React.useState({});
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({
    // Ocultar las columnas adicionales por defecto
    id: false,
    description: false,
  });

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    meta: {
      onEdit,
      onDelete
    },
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  return (
    <div className="space-y-4">
      {/* Controles de la tabla */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Siren className="text-primary" size={20} />
          <span className="text-sm text-muted-foreground">
            {data.length} {data.length === 1 ? 'sistema' : 'sistemas'} configurados
          </span>
        </div>
        <DataTableViewOptions table={table} />
      </div>

      {/* Tabla con scroll horizontal */}
      <div className="rounded-md border">
        <div className="overflow-x-auto">
          <Table className="min-w-full">
            <TableHeader>
              {table.getHeaderGroups().map((hg) => (
                <TableRow key={hg.id}>
                  {hg.headers.map((header) => (
                    <TableHead 
                      key={header.id} 
                      className="bg-muted/50 text-muted-foreground font-medium text-xs uppercase tracking-wide"
                      style={{ minWidth: header.column.columnDef.size || 'auto' }}
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                    className="hover:bg-muted/50 transition-colors"
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell 
                        key={cell.id}
                        className="py-3"
                        style={{ minWidth: cell.column.columnDef.size || 'auto' }}
                      >
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={columns.length} className="h-32 text-center">
                    <div className="flex flex-col items-center justify-center text-muted-foreground">
                      <Siren className="h-8 w-8 mb-2 opacity-50" />
                      <span>No hay sistemas configurados</span>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        
        {/* Indicador de scroll horizontal */}
        {data.length > 0 && (
          <div className="px-4 py-2 border-t bg-muted/20">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>💡 Desliza horizontalmente para ver más columnas</span>
              <span>Mostrando 5 columnas principales</span>
            </div>
          </div>
        )}
      </div>

      {/* Paginación */}
      <DataTablePagination table={table} />
    </div>
  );
}
