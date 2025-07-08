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

import { Table, TableRow, TableBody, TableCell, TableHead, TableHeader } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectItem,
  SelectValue,
  SelectContent,
  SelectTrigger,
} from "@/components/ui/select";
import { DataTablePagination } from "@/shared/datatable/pagination";
import { DataTableViewOptions } from "@/shared/datatable/view-options";
import { User as UserIcon } from "lucide-react";
import { Card } from "@/components/ui/card";
import type { User } from "@/types/user";

interface DataTableProps<TValue> {
  columns: ColumnDef<User, TValue>[];
  data: User[];
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
    <Card className="p-4">
      <div className="flex items-center mb-6 min-h-[40px] gap-4">
        <UserIcon className="text-primary mr-2" size={28} />
        <h2 className="text-xl font-bold leading-none">Gestión de Usuarios</h2>
        <div className="flex-1" />
        <div className="flex items-center gap-2 h-9">
          {headerActions}
          <DataTableViewOptions table={table} />
        </div>
      </div>
      <div className="grid grid-cols-12 gap-4 pb-2">
        <div className="col-span-3">
          <Input
            placeholder="Filtrar usuario..."
            value={
              (table.getColumn("username")?.getFilterValue() as string) ?? ""
            }
            onChange={(e) =>
              table.getColumn("username")?.setFilterValue(e.target.value)
            }
            className="w-full"
          />
        </div>
        <div className="col-span-3">
          <Input
            id="email-filter"
            placeholder="Filtrar email..."
            value={(table.getColumn("email")?.getFilterValue() as string) ?? ""}
            onChange={(e) =>
              table.getColumn("email")?.setFilterValue(e.target.value)
            }
            className="w-full"
          />
        </div>
        <div className="col-span-2">
          <Select
            defaultValue="1"
            onValueChange={(value) =>
              table.getColumn("status")?.setFilterValue(value)
            }
          >
            <SelectTrigger id="status-filter" className="w-full">
              <SelectValue placeholder="Todos" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">Activo</SelectItem>
              <SelectItem value="0">Inactivo</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="col-span-2">
          <Select
            value={String(table.getColumn("channelId")?.getFilterValue() ?? "")}
            onValueChange={(value) =>
              table.getColumn("channelId")?.setFilterValue(value ? Number(value) : undefined)
            }
          >
            <SelectTrigger id="channel-filter" className="w-full">
              <SelectValue placeholder="Filtrar canal" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">Digital</SelectItem>
              <SelectItem value="2">Teleservicios</SelectItem>
              <SelectItem value="3">Retail</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="col-span-2">
          <Input
            id="date-filter"
            type="date"
            value={
              (table.getColumn("createdAt")?.getFilterValue() as string) ?? ""
            }
            onChange={(e) =>
              table.getColumn("createdAt")?.setFilterValue(e.target.value)
            }
            className="w-full"
          />
        </div>
      </div>
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((hg) => (
            <TableRow key={hg.id}>
              {hg.headers.map((header) => (
                <TableHead key={header.id} className="bg-gray-100 dark:bg-gray-800 font-semibold">
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
            table
              .getRowModel()
              .rows
              .map((row) => (
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
    </Card>
  );
}
