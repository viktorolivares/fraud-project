"use client";
import { DataTableHeader } from "@/shared/datatable/header";
import { DataTableCellViewer } from "@/shared/datatable/cell-viewer";
import { type ColumnDef, type Column } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { MoreHorizontal, User, UserPlus } from "lucide-react";
import type { Case } from "@/types/case";
import { format } from "date-fns";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { useRouter } from "next/navigation";
import { useMemo } from "react";

// Extraemos el renderizado del ID en una función separada
const renderIdCell = (item: Case) => {
  const activeAssignment = item.assignments?.find(assignment => assignment.active);
  
  return (
    <div className="space-y-4 text-sm max-w-md">
      <div>
        <strong>ID:</strong> {item.id}
      </div>
      <div>
        <strong>Descripción:</strong> {item.description}
      </div>
      {item.state && (
        <div>
          <strong>Estado:</strong> {item.state.name}
          {item.state.description && (
            <p className="text-xs text-muted-foreground mt-1">{item.state.description}</p>
          )}
        </div>
      )}
      {activeAssignment && activeAssignment.analyst && (
        <div>
          <strong>Analista Asignado:</strong> {activeAssignment.analyst.firstName} {activeAssignment.analyst.lastName}
          <p className="text-xs text-muted-foreground">{activeAssignment.analyst.email}</p>
          <p className="text-xs text-muted-foreground">
            Asignado el {format(new Date(activeAssignment.assignedAt), "dd/MM/yyyy HH:mm")}
          </p>
        </div>
      )}
      {item.affectedUser && (
        <div>
          <strong>Usuario Afectado:</strong> {item.affectedUser.firstName} {item.affectedUser.lastName}
          <p className="text-xs text-muted-foreground">{item.affectedUser.email}</p>
        </div>
      )}
      {item.incidents && item.incidents.length > 0 && (
        <div>
          <strong>Incidentes:</strong> {item.incidents.length}
        </div>
      )}
      {item.notes && item.notes.length > 0 && (
        <div>
          <strong>Notas:</strong> {item.notes.length}
        </div>
      )}
    </div>
  );
};

export function useCaseColumns(
  onAssignAnalyst?: (caseData: Case) => void,
  onResolveCase?: (caseData: Case) => void
): ColumnDef<Case, string | number>[] {
  const router = useRouter();
  return useMemo(
    () => [
      {
        id: "select",
        header: ({ table }) => (
          <Checkbox
            checked={
              table.getIsAllPageRowsSelected() ||
              (table.getIsSomePageRowsSelected() && "indeterminate")
            }
            onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
            aria-label="Seleccionar todos"
          />
        ),
        cell: ({ row }) => (
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(value) => row.toggleSelected(!!value)}
            aria-label="Seleccionar fila"
          />
        ),
        enableSorting: false,
        enableHiding: false,
      },
      {
        accessorKey: "id",
        header: ({ column }: { column: Column<Case, unknown> }) => (
          <DataTableHeader column={column} title="ID" />
        ),
        cell: ({ row }: { row: { original: Case } }) => (
          <DataTableCellViewer
            item={row.original}
            renderTrigger={(item: Case) => (
              <Button 
                variant="link" 
                size="sm"
                onClick={() => router.push(`/cases/${item.id}`)}
              >
                {item.id}
              </Button>
            )}
            renderContent={renderIdCell}
          />
        ),
      },
      {
        accessorKey: "description",
        header: ({ column }: { column: Column<Case, unknown> }) => (
          <DataTableHeader column={column} title="Descripción" />
        ),
        cell: ({ row }: { row: { original: Case } }) => (
          <HoverCard>
            <HoverCardTrigger asChild>
              <p className="block min-w-[200px] max-w-[300px] truncate underline cursor-pointer text-slate-600 dark:text-slate-300">
                {row.original.description}
              </p>
            </HoverCardTrigger>
            <HoverCardContent className="w-[300px]">
              <div className="text-sm">{row.original.description}</div>
            </HoverCardContent>
          </HoverCard>
        ),
      },
      {
        accessorKey: "executionId",
        header: ({ column }: { column: Column<Case, unknown> }) => (
          <DataTableHeader column={column} title="ID Ejecución" />
        ),
        cell: ({ row }: { row: { original: Case } }) => (
          <span>{row.original.executionId}</span>
        ),
      },
      {
        accessorKey: "captureDate",
        header: ({ column }: { column: Column<Case, unknown> }) => (
          <DataTableHeader column={column} title="Fecha Captura" />
        ),
        cell: ({ row }: { row: { original: Case } }) => (
          <span>
            {format(new Date(row.original.captureDate), "dd/MM/yyyy HH:mm")}
          </span>
        ),
      },
      {
        accessorKey: "state.name",
        header: ({ column }: { column: Column<Case, unknown> }) => (
          <DataTableHeader column={column} title="Estado" />
        ),
        cell: ({ row }: { row: { original: Case } }) => (
          <Badge variant={row.original.state?.active ? "default" : "secondary"}>
            {row.original.state?.name || `ID: ${row.original.stateId}`}
          </Badge>
        ),
      },
      {
        accessorKey: "assignments",
        header: ({ column }: { column: Column<Case, unknown> }) => (
          <DataTableHeader column={column} title="Analista Asignado" />
        ),
        cell: ({ row }: { row: { original: Case } }) => {
          const caseData = row.original;
          const activeAssignment = caseData.assignments?.find(assignment => assignment.active);
          
          if (!activeAssignment || !activeAssignment.analyst) {
            return (
              <div className="flex items-center gap-2 text-muted-foreground">
                <div className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center">
                  <User className="w-3 h-3 text-gray-400" />
                </div>
                <span className="text-sm">Sin asignar</span>
              </div>
            );
          }

          const analyst = activeAssignment.analyst;
          const assignedDate = new Date(activeAssignment.assignedAt);
          
          return (
            <HoverCard>
              <HoverCardTrigger asChild>
                <div className="flex items-center gap-2 cursor-pointer">
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                    <User className="w-3 h-3 text-blue-600" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-medium">
                      {analyst.firstName} {analyst.lastName}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {analyst.email}
                    </span>
                  </div>
                </div>
              </HoverCardTrigger>
              <HoverCardContent className="w-[300px]">
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <User className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="text-sm font-medium">
                        {analyst.firstName} {analyst.lastName}
                      </h4>
                      <p className="text-xs text-muted-foreground">
                        @{analyst.username}
                      </p>
                    </div>
                  </div>
                  <div className="space-y-2 text-xs">
                    <div>
                      <strong>Email:</strong> {analyst.email}
                    </div>
                    <div>
                      <strong>Asignado el:</strong> {format(assignedDate, "dd/MM/yyyy HH:mm")}
                    </div>
                    {activeAssignment.reason && (
                      <div>
                        <strong>Motivo:</strong> {activeAssignment.reason}
                      </div>
                    )}
                    <div>
                      <strong>Estado:</strong>{" "}
                      <Badge variant={analyst.isActive ? "default" : "secondary"} className="text-xs">
                        {analyst.isActive ? "Activo" : "Inactivo"}
                      </Badge>
                    </div>
                  </div>
                </div>
              </HoverCardContent>
            </HoverCard>
          );
        },
      },
      {
        id: "actions",
        cell: ({ row }: { row: { original: Case } }) => {
          const item = row.original;
          const activeAssignment = item.assignments?.find(a => a.active);
          const hasAssignedAnalyst = !!(activeAssignment && activeAssignment.analyst);
          const isClosed = item.state?.name.toLowerCase().includes("cerr");
          return (
            <div className="flex items-center gap-2">
              {onAssignAnalyst && (
                <Button
                  variant={hasAssignedAnalyst ? "secondary" : "outline"}
                  size="sm"
                  onClick={() => !hasAssignedAnalyst && onAssignAnalyst(item)}
                  disabled={!!hasAssignedAnalyst}
                  className="flex items-center gap-1"
                  title={hasAssignedAnalyst ? `Ya asignado a ${activeAssignment?.analyst?.firstName}` : "Asignar analista"}
                >
                  <UserPlus className="h-3 w-3" />
                  {hasAssignedAnalyst ? "Asignado" : "Asignar"}
                </Button>
              )}
              {onResolveCase && !isClosed && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onResolveCase(item)}
                >
                  Resolver
                </Button>
              )}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="h-8 w-8 p-0">
                    <span className="sr-only">Open menu</span>
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                  <DropdownMenuItem
                    onClick={() => navigator.clipboard.writeText(String(item.id))}
                  >
                    Copiar ID
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => router.push(`/cases/${item.id}`)}
                  >
                    Ver detalles
                  </DropdownMenuItem>
                  {onAssignAnalyst && (
                    <>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => !hasAssignedAnalyst && onAssignAnalyst(item)}
                        disabled={!!hasAssignedAnalyst}
                      >
                        <UserPlus className="h-4 w-4 mr-2" />
                        {hasAssignedAnalyst ? "Ya asignado" : "Asignar analista"}
                      </DropdownMenuItem>
                    </>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          );
        },
      },
    ],
    [router, onAssignAnalyst, onResolveCase]
  );
}
