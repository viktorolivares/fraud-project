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
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import type { CaseDataWithClientResult } from "@/api/report.api";

interface DataTableProps<TValue> {
  columns: ColumnDef<CaseDataWithClientResult, TValue>[];
  data: CaseDataWithClientResult[];
}

export function DataTable<TValue>({ columns, data }: DataTableProps<TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

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

  const handleExportCSV = () => {
    const headers = columns
      .filter(col => col.id !== 'actions' && col.id !== 'json_data')
      .map(col => {
        if (typeof col.header === 'string') return col.header;
        if (col.id) return col.id;
        return '';
      })
      .join(',');

    const rows = data.map(row => {
      const values = [
        row.case_id,
        row.execution_id,
        `"${row.first_name} ${row.last_name}"`,
        row.email,
        `"${row.national_id_type}: ${row.national_id}"`,
        row.birthday,
        row.capture_timestamp,
        row.calimaco_user
      ];
      return values.join(',');
    });

    const csvContent = [headers, ...rows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `case-details-report-${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div className="rounded-md border p-4 shadow-sm">
      <div className="grid grid-cols-12 gap-4 pb-2">
        <div className="col-span-3">
          <Input
            placeholder="Filtrar por Caso ID..."
            value={(table.getColumn("case_id")?.getFilterValue() as string) ?? ""}
            onChange={(e) => table.getColumn("case_id")?.setFilterValue(e.target.value)}
            className="w-full"
          />
        </div>
        <div className="col-span-3">
          <Input
            placeholder="Filtrar por cliente..."
            value={(table.getColumn("client_info")?.getFilterValue() as string) ?? ""}
            onChange={(e) => table.getColumn("client_info")?.setFilterValue(e.target.value)}
            className="w-full"
          />
        </div>
        <div className="col-span-3">
          <Input
            placeholder="Filtrar por email..."
            value={(table.getColumn("client_info")?.getFilterValue() as string) ?? ""}
            onChange={(e) => {
              // Filtrar por email dentro de client_info
              const emailFilter = e.target.value.toLowerCase();
              table.setGlobalFilter(emailFilter);
            }}
            className="w-full"
          />
        </div>
        <div className="col-span-3">
          <Input
            placeholder="Filtrar por documento..."
            value={(table.getColumn("document_info")?.getFilterValue() as string) ?? ""}
            onChange={(e) => table.getColumn("document_info")?.setFilterValue(e.target.value)}
            className="w-full"
          />
        </div>
      </div>
      <div className="flex items-center gap-2 mb-6">
        <DataTableViewOptions table={table} />
        <Button variant="outline" onClick={handleExportCSV}>
          <Download className="mr-1 h-4 w-4" />
          Exportar CSV
        </Button>
      </div>
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((hg) => (
            <TableRow key={hg.id}>
              {hg.headers.map((header) => (
                <TableHead key={header.id}>
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
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(
                      cell.column.columnDef.cell,
                      cell.getContext()
                    )}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                No hay resultados.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      <DataTablePagination table={table} />
    </div>
  );
}

export default DataTable;
