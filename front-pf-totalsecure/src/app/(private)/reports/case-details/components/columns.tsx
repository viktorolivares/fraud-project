"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Copy, Eye } from "lucide-react";
import type { CaseDataWithClientResult } from "@/api/report.api";

export const columns: ColumnDef<CaseDataWithClientResult>[] = [
  {
    accessorKey: "case_id",
    header: "Caso ID",
    cell: ({ row }) => {
      const caseId = row.getValue("case_id") as number;
      return (
        <div className="font-mono text-blue-600 font-medium">
          {caseId}
        </div>
      );
    },
  },
  {
    accessorKey: "execution_id",
    header: "Ejecución ID",
    cell: ({ row }) => {
      const executionId = row.getValue("execution_id") as number;
      return (
        <div className="font-mono text-sm">
          {executionId}
        </div>
      );
    },
  },
  {
    id: "client_info",
    header: "Cliente",
    cell: ({ row }) => {
      const firstName = row.original.first_name;
      const lastName = row.original.last_name;
      const clientId = row.original.client_id;
      const email = row.original.email;
      
      return (
        <div className="space-y-1">
          <div className="font-medium text-sm">
            {firstName} {lastName}
          </div>
          <div className="text-xs text-muted-foreground">
            ID: {clientId}
          </div>
          <div className="text-xs text-blue-600 truncate max-w-[200px]">
            {email}
          </div>
        </div>
      );
    },
  },
  {
    id: "document_info",
    header: "Documento",
    cell: ({ row }) => {
      const nationalIdType = row.original.national_id_type;
      const nationalId = row.original.national_id;
      
      return (
        <div className="space-y-1">
          <Badge variant="outline" className="text-xs">
            {nationalIdType}
          </Badge>
          <div className="font-mono text-sm">
            {nationalId}
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "birthday",
    header: "Fecha Nacimiento",
    cell: ({ row }) => {
      const birthday = row.getValue("birthday") as string;
      return (
        <div className="text-sm">
          {new Date(birthday).toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
          })}
        </div>
      );
    },
  },
  {
    accessorKey: "capture_timestamp",
    header: "Timestamp",
    cell: ({ row }) => {
      const timestamp = row.getValue("capture_timestamp") as string;
      return (
        <div className="text-xs font-mono space-y-1">
          <div>{new Date(timestamp).toLocaleDateString('es-ES')}</div>
          <div className="text-muted-foreground">
            {new Date(timestamp).toLocaleTimeString('es-ES')}
          </div>
        </div>
      );
    },
  },
  {
    id: "calimaco_info",
    header: "Calimaco",
    cell: ({ row }) => {
      const calimacoUser = row.original.calimaco_user;
      const mvtId = row.original.mvt_id;
      const calimacoStatus = row.original.calimaco_status;
      
      return (
        <div className="space-y-1">
          <div className="text-xs">
            Usuario: {calimacoUser}
          </div>
          {mvtId && (
            <div className="text-xs text-muted-foreground">
              MVT: {mvtId}
            </div>
          )}
          {calimacoStatus && (
            <Badge variant="secondary" className="text-xs">
              {calimacoStatus}
            </Badge>
          )}
        </div>
      );
    },
  },
  {
    id: "json_data",
    header: "Datos JSON",
    cell: ({ row }) => {
      const jsonData = row.original.json_data;
      
      const handleCopyJson = () => {
        try {
          const parsed = typeof jsonData === 'string' ? JSON.parse(jsonData) : jsonData;
          const formatted = JSON.stringify(parsed, null, 2);
          navigator.clipboard.writeText(formatted);
        } catch (error) {
          navigator.clipboard.writeText(jsonData);
        }
      };

      const handleViewJson = () => {
        try {
          const parsed = typeof jsonData === 'string' ? JSON.parse(jsonData) : jsonData;
          const formatted = JSON.stringify(parsed, null, 2);
          
          // Crear una nueva ventana para mostrar el JSON
          const newWindow = window.open('', '_blank');
          if (newWindow) {
            newWindow.document.write(`
              <html>
                <head>
                  <title>JSON Data - Caso ${row.original.case_id}</title>
                  <style>
                    body { font-family: monospace; padding: 20px; }
                    pre { background: #f5f5f5; padding: 15px; border-radius: 5px; overflow: auto; }
                  </style>
                </head>
                <body>
                  <h3>JSON Data - Caso ${row.original.case_id}</h3>
                  <pre>${formatted}</pre>
                </body>
              </html>
            `);
            newWindow.document.close();
          }
        } catch (error) {
          alert('Error al procesar JSON: ' + error);
        }
      };
      
      return (
        <div className="flex gap-1">
          <Button
            variant="outline"
            size="sm"
            onClick={handleViewJson}
            className="h-8 w-8 p-0"
          >
            <Eye className="h-3 w-3" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleCopyJson}
            className="h-8 w-8 p-0"
          >
            <Copy className="h-3 w-3" />
          </Button>
        </div>
      );
    },
  },
];

export default columns;
