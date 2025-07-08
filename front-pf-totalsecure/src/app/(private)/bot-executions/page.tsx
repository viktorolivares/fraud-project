"use client";
 
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Activity, 
  Play, 
  CheckCircle, 
  XCircle,
  Clock,
  Bot,
  TrendingUp,
  AlertTriangle,
  Calendar,
  Filter,
  RefreshCw,
  PieChart
} from "lucide-react";
import { columns } from "./components/columns";
import { DataTable } from "./components/data-table";
import * as botExecutionApi from "@/api/bot-execution.api";
import type { BotExecution } from "@/types/bot-execution";
import { format } from "date-fns";
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent } from "@/components/ui/chart";
import { PieChart as RechartsPieChart, Pie, Cell, ResponsiveContainer } from "recharts";

const BotExecutions = () => {
  const [executions, setExecutions] = useState<BotExecution[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Estados para filtros de fecha - Por defecto últimos 7 días
  const getDefaultStartDate = () => {
    const date = new Date();
    date.setDate(date.getDate() - 7);
    return date.toISOString().split('T')[0];
  };

  const getDefaultEndDate = () => {
    const date = new Date();
    return date.toISOString().split('T')[0];
  };

  const [startDate, setStartDate] = useState<string>(getDefaultStartDate());
  const [endDate, setEndDate] = useState<string>(getDefaultEndDate());
  const [showFilters, setShowFilters] = useState(false);

  const fetchData = async (forceStartDate?: string, forceEndDate?: string) => {
    try {
      setLoading(true);
      setError(null);
      
      // Usar fechas forzadas o las del estado
      const dateFrom = forceStartDate !== undefined ? forceStartDate : startDate;
      const dateTo = forceEndDate !== undefined ? forceEndDate : endDate;
      
      const response = await botExecutionApi.getAllBotExecutions(
        dateFrom || undefined, 
        dateTo || undefined
      );
      setExecutions(response || []); // Asegurar que siempre sea un array
    } catch (error: any) {
      console.error("Error fetching bot executions:", error);
      setError(error?.response?.data?.message || error?.message || "Error al cargar las ejecuciones");
      setExecutions([]); // Resetear a array vacío en caso de error
    } finally {
      setLoading(false);
    }
  };

  const handleFilterApply = () => {
    fetchData();
  };

  const handleFilterClear = () => {
    const newStartDate = getDefaultStartDate();
    const newEndDate = getDefaultEndDate();
    setStartDate(newStartDate);
    setEndDate(newEndDate);
    fetchData(newStartDate, newEndDate);
  };

  const getSuccessfulExecutions = () => {
    if (!executions || executions.length === 0) return 0;
    // Consideramos exitosas las que procesaron registros
    return executions.filter(exec => 
      exec && 
      typeof exec.totalProcessedRecords === 'number' && 
      exec.totalProcessedRecords > 0
    ).length;
  };

  const getFailedExecutions = () => {
    if (!executions || executions.length === 0) return 0;
    // Consideramos fallidas las que no procesaron registros
    return executions.filter(exec => 
      exec && 
      typeof exec.totalProcessedRecords === 'number' && 
      exec.totalProcessedRecords === 0
    ).length;
  };

  const getUniqueBotsExecuted = () => {
    if (!executions || executions.length === 0) return 0;
    const uniqueBotIds = new Set(executions.map(exec => exec.botId).filter(id => id !== null && id !== undefined));
    return uniqueBotIds.size;
  };

  const getChartData = () => {
    const successful = getSuccessfulExecutions();
    const failed = getFailedExecutions();
    // Sólo Exitosas y Sin Resultados en el gráfico
    return [
      {
        name: "Exitosas",
        value: successful,
        color: "#22c55e" // green-500
      },
      {
        name: "Sin Resultados", 
        value: failed,
        color: "#ef4444" // red-500
      }
    ];
  };

  const chartConfig = {
    successful: {
      label: "Exitosas",
      color: "#16a34a",
    },
    failed: {
      label: "Sin Resultados", 
      color: "#dc2626",
    },
    incidents: {
      label: "Con Incidentes",
      color: "#ca8a04",
    },
  };

  const getStatusColor = (status: string) => {
    switch (status.toUpperCase()) {
      case 'SUCCESS':
      case 'COMPLETED':
        return 'text-green-600';
      case 'FAILED':
      case 'ERROR':
        return 'text-red-600';
      case 'RUNNING':
      case 'IN_PROGRESS':
        return 'text-blue-600';
      default:
        return 'text-muted-foreground';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toUpperCase()) {
      case 'SUCCESS':
      case 'COMPLETED':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'FAILED':
      case 'ERROR':
        return <XCircle className="h-4 w-4 text-red-500" />;
      case 'RUNNING':
      case 'IN_PROGRESS':
        return <Clock className="h-4 w-4 text-blue-500" />;
      default:
        return <Activity className="h-4 w-4 text-muted-foreground" />;
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="flex-1 space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Ejecuciones de Bots</h1>
          <p className="text-muted-foreground">
            Monitoreo y seguimiento de las ejecuciones automáticas de bots
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2"
          >
            <Filter className="h-4 w-4" />
            Filtros
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => fetchData()}
            disabled={loading}
            className="flex items-center gap-2"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            Actualizar
          </Button>
          <div className="flex items-center space-x-2">
            <Bot className="h-5 w-5" />
            <span className="text-sm text-muted-foreground">
              {executions.length} ejecución(es)
            </span>
          </div>
        </div>
      </div>

      {/* Filtros de Fecha */}
      {showFilters && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Filtros de Fecha
              <Badge variant="outline" className="text-xs">
                Por defecto: últimos 7 días
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="startDate">Fecha Desde</Label>
                <Input
                  id="startDate"
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="endDate">Fecha Hasta</Label>
                <Input
                  id="endDate"
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full"
                />
              </div>
              <div className="flex items-end gap-2">
                <Button 
                  onClick={handleFilterApply}
                  disabled={loading}
                  className="flex items-center gap-2"
                >
                  <Filter className="h-4 w-4" />
                  Aplicar Filtros
                </Button>
                <Button 
                  variant="outline"
                  onClick={handleFilterClear}
                  disabled={loading}
                  className="flex items-center gap-2"
                >
                  <RefreshCw className="h-4 w-4" />
                  Limpiar
                </Button>
              </div>
            </div>
            {(startDate || endDate) && (
              <div className="mt-4 p-3 bg-muted rounded-lg">
                <p className="text-sm text-muted-foreground">
                  <strong>Filtros activos:</strong>
                  {startDate && ` Desde: ${format(new Date(startDate), "dd/MM/yyyy")}`}
                  {startDate && endDate && " | "}
                  {endDate && ` Hasta: ${format(new Date(endDate), "dd/MM/yyyy")}`}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Ejecuciones</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{executions.length}</div>
            <p className="text-xs text-muted-foreground">
              {(startDate || endDate) ? "en el período seleccionado" : "últimos 7 días"}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Registros Procesados</CardTitle>
            <TrendingUp className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {executions.reduce((total, exec) => total + (exec?.totalProcessedRecords || 0), 0).toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">total procesados</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Incidentes Detectados</CardTitle>
            <AlertTriangle className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {executions.reduce((total, exec) => total + (exec?.totalDetectedIncidents || 0), 0)}
            </div>
            <p className="text-xs text-muted-foreground">total detectados</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Bots Ejecutados</CardTitle>
            <Bot className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">{getUniqueBotsExecuted()}</div>
            <p className="text-xs text-muted-foreground">
              bots únicos activos
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Gráfico de Rendimiento */}
      {executions.length > 0 && getChartData().length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Gráfico de Torta */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PieChart className="h-5 w-5" />
                Distribución de Ejecuciones
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={chartConfig}
                className="mx-auto aspect-square max-h-[300px]"
              >
                <RechartsPieChart>
                  <ChartTooltip
                    cursor={false}
                    content={<ChartTooltipContent hideLabel />}
                  />
                  <Pie
                    data={getChartData()}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={60}
                    strokeWidth={5}
                    label={({ percent }) => `${(percent * 100).toFixed(0)}%`}
                    labelLine={false}
                  >
                    {getChartData().map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <ChartLegend
                    content={<ChartLegendContent />}
                    className="-translate-y-2 flex-wrap gap-2 [&>*]:basis-1/4 [&>*]:justify-center"
                  />
                </RechartsPieChart>
              </ChartContainer>
            </CardContent>
          </Card>

          {/* Resumen Numérico Mejorado */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Resumen de Rendimiento
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <div>
                      <h3 className="font-medium">Exitosas</h3>
                      <p className="text-sm text-green-500">
                        Con registros procesados
                      </p>
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">
                      {getSuccessfulExecutions()}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {executions.length > 0 ? `${Math.round((getSuccessfulExecutions() / executions.length) * 100)}%` : "0%"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                  <div className="flex items-center gap-3">
                    <XCircle className="h-5 w-5 text-red-500" />
                    <div>
                      <h3 className="font-medium">Sin Resultados</h3>
                      <p className="text-sm text-red-500">
                        Sin registros procesados
                      </p>
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-red-600">
                      {getFailedExecutions()}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {executions.length > 0 ? `${Math.round((getFailedExecutions() / executions.length) * 100)}%` : "0%"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                  <div className="flex items-center gap-3">
                    <AlertTriangle className="h-5 w-5 text-yellow-500" />
                    <div>
                      <h3 className="font-medium">Con Incidentes</h3>
                      <p className="text-sm text-yellow-500">
                        Incidentes detectados
                      </p>
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-yellow-600">
                      {executions && executions.length > 0 
                        ? executions.filter(exec => 
                            exec && 
                            typeof exec.totalDetectedIncidents === 'number' && 
                            exec.totalDetectedIncidents > 0
                          ).length 
                        : 0
                      }
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {executions.length > 0 && executions.filter(exec => 
                        exec && 
                        typeof exec.totalDetectedIncidents === 'number' && 
                        exec.totalDetectedIncidents > 0
                      ).length > 0 
                        ? `${Math.round((executions.filter(exec => 
                            exec && 
                            typeof exec.totalDetectedIncidents === 'number' && 
                            exec.totalDetectedIncidents > 0
                          ).length / executions.length) * 100)}%` 
                        : "0%"
                      }
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Tabla de Ejecuciones */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bot className="h-5 w-5" />
            Lista de Ejecuciones
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <div className="flex items-center justify-center h-32">
              <div className="flex items-center gap-2 text-muted-foreground">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                <span>Cargando ejecuciones...</span>
              </div>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center h-32 text-center">
              <XCircle className="h-8 w-8 mb-2 text-red-500" />
              <div className="space-y-2">
                <h3 className="font-medium text-red-600">Error al cargar datos</h3>
                <p className="text-sm text-muted-foreground">{error}</p>
                <button 
                  onClick={() => fetchData()}
                  className="text-sm text-primary hover:underline"
                >
                  Intentar nuevamente
                </button>
              </div>
            </div>
          ) : executions.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-32 text-muted-foreground">
              <Bot className="h-8 w-8 mb-2" />
              <span>No hay ejecuciones registradas</span>
            </div>
          ) : (
            <div className="p-6">
              <DataTable columns={columns} data={executions} />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default BotExecutions;
