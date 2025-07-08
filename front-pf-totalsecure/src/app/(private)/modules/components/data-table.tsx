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
import { Input } from "@/components/ui/input";
import { DataTablePagination } from "@/shared/datatable/pagination";
import { DataTableViewOptions } from "@/shared/datatable/view-options";
import { LayoutGrid } from "lucide-react";
import type { Module } from "@/types/module";

interface DataTableProps<TValue> {
  columns: ColumnDef<Module, TValue>[];
  data: Module[];
  headerActions?: React.ReactNode;
}

export function DataTable<TValue>({ columns, data, headerActions }: DataTableProps<TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [rowSelection, setRowSelection] = React.useState({});
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
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
    <div className="rounded-md border p-4 shadow-sm">
      <div className="flex items-center mb-6 min-h-[40px] gap-4">
        <LayoutGrid className="text-primary mr-2" size={28} />
        <h2 className="text-xl font-bold leading-none">Gestión de Módulos</h2>
        <div className="flex-1" />
        <div className="flex items-center gap-2 h-9">
          {headerActions}
          <DataTableViewOptions table={table} />
        </div>
      </div>
      <div className="grid grid-cols-12 gap-4 pb-2">
        <div className="col-span-4">
          <Input
            placeholder="Filtrar por nombre..."
            value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
            onChange={(e) => table.getColumn("name")?.setFilterValue(e.target.value)}
            className="w-full"
          />
        </div>
        <div className="col-span-4">
          <Input
            placeholder="Filtrar por descripción..."
            value={(table.getColumn("description")?.getFilterValue() as string) ?? ""}
            onChange={(e) => table.getColumn("description")?.setFilterValue(e.target.value)}
            className="w-full"
          />
        </div>
      </div>
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((hg) => (
            <TableRow key={hg.id}>
              {hg.headers.map((header) => (
                <TableHead key={header.id} className="bg-gray-100 dark:bg-slate-800 dark:text-slate-100 font-semibold">
                  {header.isPlaceholder
                    ? null
                    : flexRender(header.column.columnDef.header, header.getContext())}
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
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                Sin datos
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      <DataTablePagination table={table} />
    </div>
  );
}
