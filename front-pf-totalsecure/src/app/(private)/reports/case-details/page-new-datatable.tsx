"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ColumnDef } from "@tanstack/react-table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DataTable, createSortableHeader, createActionCell } from "@/components/ui/data-table";
import { 
  ArrowLeft,
  Calendar,
  Users,
  RefreshCw,
  Bot as BotIcon,
  AlertTriangle
} from "lucide-react";
import * as reportApi from "@/api/report.api";
import type { CaseDataWithClientResult } from "@/api/report.api";

// Función helper para obtener fechas por defecto (último día)
const getDefaultDateRange = () => {
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  
  return {
    from: yesterday.toISOString().split('T')[0],
    to: today.toISOString().split('T')[0]
  };
};

export default function CaseDetailsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Estados para datos y loading
  const [loading, setLoading] = useState(true);
  const [reportLoading, setReportLoading] = useState(false);
  const [caseData, setCaseData] = useState<CaseDataWithClientResult[]>([]);

  // Estados para filtros
  const [dateRange, setDateRange] = useState(() => {
    const fromParam = searchParams.get('from');
    const toParam = searchParams.get('to');
    const defaults = getDefaultDateRange();
    
    return {
      from: fromParam || defaults.from,
      to: toParam || defaults.to
    };
  });
  
  const [selectedBot, setSelectedBot] = useState<number>(() => {
    const botParam = searchParams.get('bot');
    return botParam ? parseInt(botParam) : 4;
  });

  // Funciones de acciones
  const handleViewDetails = (row: CaseDataWithClientResult) => {
    alert(`Detalles del caso ${row.case_id} - ${row.first_name} ${row.last_name}`);
  };

  const handleCopyJson = async (row: CaseDataWithClientResult) => {
    try {
      await navigator.clipboard.writeText(JSON.stringify(row, null, 2));
      alert('JSON copiado al portapapeles');
    } catch (error) {
      console.error('Error copying to clipboard:', error);
      alert('Error al copiar al portapapeles');
    }
  };

  // Definición de columnas para el DataTable
  const columns: ColumnDef<CaseDataWithClientResult>[] = [
    {
      accessorKey: "case_id",
      header: createSortableHeader("Caso"),
      cell: ({ row }) => (
        <div className="font-mono text-blue-600 font-semibold">
          {row.getValue("case_id")}
        </div>
      ),
    },
    {
      accessorKey: "execution_id", 
      header: createSortableHeader("Ejecución"),
      cell: ({ row }) => (
        <div className="font-mono text-sm">
          {row.getValue("execution_id")}
        </div>
      ),
    },
    {
      id: "client_name",
      accessorKey: "first_name",
      header: createSortableHeader("Cliente"),
      cell: ({ row }) => {
        const firstName = row.original.first_name;
        const lastName = row.original.last_name;
        const clientId = row.original.client_id;
        return (
          <div>
            <div className="font-medium">{firstName} {lastName}</div>
            <div className="text-xs text-muted-foreground">ID: {clientId}</div>
          </div>
        );
      },
    },
    {
      accessorKey: "email",
      header: createSortableHeader("Email"),
      cell: ({ row }) => (
        <div className="text-sm max-w-[200px] truncate" title={row.getValue("email") as string}>
          {row.getValue("email")}
        </div>
      ),
    },
    {
      id: "national_id_info",
      accessorKey: "national_id",
      header: createSortableHeader("Documento"),
      cell: ({ row }) => {
        const type = row.original.national_id_type;
        const id = row.getValue("national_id");
        return (
          <div className="text-sm font-mono">
            {type}: {String(id)}
          </div>
        );
      },
    },
    {
      accessorKey: "phone",
      header: createSortableHeader("Teléfono"),
      cell: ({ row }) => (
        <div className="text-sm font-mono">
          {row.getValue("phone")}
        </div>
      ),
    },
    {
      accessorKey: "address",
      header: createSortableHeader("Dirección"),
      cell: ({ row }) => (
        <div className="text-sm max-w-[150px] truncate" title={row.getValue("address") as string}>
          {row.getValue("address")}
        </div>
      ),
    },
    {
      accessorKey: "birth_date",
      header: createSortableHeader("Fecha Nac."),
      cell: ({ row }) => {
        const date = row.getValue("birth_date") as string;
        return date ? (
          <div className="text-sm font-mono">
            {new Date(date).toLocaleDateString('es-ES')}
          </div>
        ) : (
          <div className="text-sm text-muted-foreground">-</div>
        );
      },
    },
    {
      accessorKey: "capture_timestamp",
      header: createSortableHeader("Timestamp"),
      cell: ({ row }) => {
        const timestamp = row.getValue("capture_timestamp") as string;
        return (
          <div>
            <div className="text-xs font-mono">
              {new Date(timestamp).toLocaleDateString('es-ES')}
            </div>
            <div className="text-xs font-mono text-muted-foreground">
              {new Date(timestamp).toLocaleTimeString('es-ES')}
            </div>
          </div>
        );
      },
    },
    {
      id: "actions",
      header: "Acciones",
      cell: createActionCell<CaseDataWithClientResult>(
        handleViewDetails,
        handleCopyJson
      ),
    },
  ];

  const fetchCaseData = async () => {
    try {
      setReportLoading(true);
      const { from, to } = dateRange;
      const data = await reportApi.getCaseDataWithClients(from, to, selectedBot);
      setCaseData(data);
    } catch (error) {
      console.error("Error fetching case data:", error);
    } finally {
      setReportLoading(false);
      setLoading(false);
    }
  };

  const handleDateChange = (field: 'from' | 'to', value: string) => {
    setDateRange(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleBotChange = (botId: number) => {
    setSelectedBot(botId);
  };

  const handleRefresh = () => {
    fetchCaseData();
  };

  const handleBack = () => {
    router.push('/reports');
  };

  useEffect(() => {
    fetchCaseData();
  }, [selectedBot]);

  return (
    <div className="flex-1 space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" onClick={handleBack}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver a Dashboard
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Casos con Datos de Clientes</h1>
            <p className="text-muted-foreground">
              Análisis detallado de casos detectados con información completa del cliente
            </p>
          </div>
        </div>
        <Button variant="outline" size="sm" onClick={handleRefresh} disabled={reportLoading}>
          {reportLoading ? (
            <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <RefreshCw className="h-4 w-4 mr-2" />
          )}
          Actualizar
        </Button>
      </div>

      {/* Filtros */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Filtros de Consulta
          </CardTitle>
          <CardDescription>
            Configura los parámetros de búsqueda para el reporte
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Rango de fechas */}
            <div className="flex items-center gap-2">
              <Label htmlFor="date-from" className="text-sm font-medium">Desde:</Label>
              <Input
                id="date-from"
                type="date"
                value={dateRange.from}
                onChange={(e) => handleDateChange('from', e.target.value)}
                className="w-auto"
              />
            </div>
            <div className="flex items-center gap-2">
              <Label htmlFor="date-to" className="text-sm font-medium">Hasta:</Label>
              <Input
                id="date-to"
                type="date"
                value={dateRange.to}
                onChange={(e) => handleDateChange('to', e.target.value)}
                className="w-auto"
              />
            </div>

            {/* Selector de Bot */}
            <div className="flex items-center gap-2">
              <Label className="text-sm font-medium">Bot:</Label>
              <div className="flex gap-1">
                {[1, 2, 3, 4].map((botNumber) => (
                  <Button
                    key={botNumber}
                    size="sm"
                    variant={selectedBot === botNumber ? "default" : "outline"}
                    onClick={() => handleBotChange(botNumber)}
                    disabled={reportLoading}
                    className="flex items-center gap-1"
                  >
                    <BotIcon className="h-3 w-3" />
                    {botNumber}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* KPIs Summary */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Casos</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{caseData.length}</div>
            <p className="text-xs text-muted-foreground">
              casos detectados
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Clientes Únicos</CardTitle>
            <Users className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {new Set(caseData.map(item => item.client_id)).size}
            </div>
            <p className="text-xs text-muted-foreground">
              clientes afectados
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Bot Activo</CardTitle>
            <BotIcon className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">Bot {selectedBot}</div>
            <p className="text-xs text-muted-foreground">
              sistema de detección
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Período</CardTitle>
            <Calendar className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-sm font-bold text-purple-600">
              {new Date(dateRange.from).toLocaleDateString('es-ES')} -
            </div>
            <div className="text-sm font-bold text-purple-600">
              {new Date(dateRange.to).toLocaleDateString('es-ES')}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* DataTable */}
      <Card>
        <CardContent className="p-6">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : (
            <DataTable
              columns={columns}
              data={caseData}
              title="Casos Detectados"
              description={`${caseData.length} casos encontrados para el Bot ${selectedBot} en el período seleccionado`}
              searchPlaceholder="Buscar por nombre del cliente..."
              searchColumn="first_name"
              exportFilename={`casos-${selectedBot}-${dateRange.from}-${dateRange.to}.csv`}
              enableSearch={true}
              enableExport={true}
              enableColumnVisibility={true}
              enablePagination={true}
              pageSize={20}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
