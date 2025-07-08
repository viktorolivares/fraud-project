"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle } from "lucide-react";
import type { Case } from "@/types/case";
import { useIncidentColumns } from "./incident-columns";
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel,
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

interface CaseIncidentsProps {
  caseData: Case;
}

export const CaseIncidents = ({ caseData }: CaseIncidentsProps) => {
  // Obtener las columnas
  const columns = useIncidentColumns();

  // Preparar los datos para la tabla
  const incidentsData = caseData.incidents || [];
  const hasIncidents = incidentsData.length > 0;

  // Crear la tabla
  const table = useReactTable({
    data: incidentsData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  // Si no hay incidentes, no mostrar la tabla
  if (!hasIncidents) {
    return null;
  }
  
  return (
    <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-gray-200 dark:border-gray-700 shadow-xl">
      <CardHeader className="bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 border-b border-gray-200 dark:border-gray-700">
        <CardTitle className="flex items-center gap-3 text-xl text-gray-900 dark:text-white">
          <div className="bg-orange-500 dark:bg-orange-600 p-3 rounded-xl shadow-lg">
            <AlertTriangle className="h-6 w-6 text-white" />
          </div>
          Incidentes Detectados
          <Badge variant="secondary" className="ml-auto bg-orange-100 dark:bg-orange-900 text-orange-800 dark:text-orange-200">
            {incidentsData.length} incidente{incidentsData.length !== 1 ? 's' : ''}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-4">
          <div className="flex items-center justify-end space-x-2 py-2">
            <DataTableViewOptions table={table} />
          </div>
          
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <TableHead key={header.id} className="bg-orange-50/50 dark:bg-orange-900/10 font-medium">
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
                {table.getRowModel().rows?.length ? (
                  table.getRowModel().rows.map((row) => (
                    <TableRow
                      key={row.id}
                      data-state={row.getIsSelected() && "selected"}
                      className="hover:bg-orange-50/30 dark:hover:bg-orange-900/10"
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
                    <TableCell
                      colSpan={columns.length}
                      className="h-24 text-center"
                    >
                      No se encontraron incidentes.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
          <DataTablePagination table={table} />
        </div>
      </CardContent>
    </Card>
  );
};
