"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ColumnDef } from "@tanstack/react-table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DataTable, createSortableHeader, createActionCell } from "@/components/ui/data-table";
import { 
  ArrowLeft,
  Calendar,
  Users,
  RefreshCw,
  Bot as BotIcon,
  AlertTriangle,
  BarChart3,
  Globe,
  Shield,
  Lock
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useBots } from "@/hooks/use-bots";
import { getAllBots } from "@/api/bot.api";
import type { Bot } from "@/types/bot.d";
import * as reportApi from "@/api/report.api";
import type { 
  CaseDataWithClientResult,
  Bot1SummaryResult,
  Bot2SummaryResult,
  Bot3SummaryResult,
  Bot4SummaryResult
} from "@/api/report.api";
import { BotSummaryChart } from "./components/bot-summary-chart";

// Función helper para obtener fechas por defecto (últimos 7 días)
const getDefaultDateRange = () => {
  const today = new Date();
  const sevenDaysAgo = new Date(today);
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  
  return {
    from: sevenDaysAgo.toISOString().split('T')[0],
    to: today.toISOString().split('T')[0]
  };
};

export default function CaseDetailsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { getBotName } = useBots();
  
  // Estados para datos y loading
  const [loading, setLoading] = useState(true);
  const [reportLoading, setReportLoading] = useState(false);
  const [chartLoading, setChartLoading] = useState(false);
  const [bots, setBots] = useState<Bot[]>([]);
  const [caseData, setCaseData] = useState<CaseDataWithClientResult[]>([]);
  const [chartData, setChartData] = useState<Bot1SummaryResult[] | Bot2SummaryResult[] | Bot3SummaryResult[] | Bot4SummaryResult[]>([]);

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

  // Función helper para renderizar información específica del bot
  const renderBotSpecificInfo = (row: CaseDataWithClientResult, botId: number) => {
    try {
      const jsonData = typeof row.json_data === 'string' 
        ? JSON.parse(row.json_data)
        : row.json_data;

      switch (botId) {
        case 1: // Bot 1 - Similarity & IP Analysis
          return (
            <div className="text-sm max-w-[200px] space-y-1">
              {jsonData?.case_number && (
                <div className="text-xs text-blue-600 font-medium">
                  📋 {jsonData.case_number}
                </div>
              )}
              {jsonData?.ip && (
                <div className="font-mono text-xs mb-1 truncate" title={jsonData.ip}>
                  🌐 IP: {jsonData.ip}
                </div>
              )}
              {jsonData?.ip_count && (
                <div className="text-xs text-orange-600">
                  🔍 {jsonData.ip_count} IPs únicas
                </div>
              )}
              {jsonData?.similarity !== undefined && (
                <div className={cn(
                  "text-xs px-1 py-0.5 rounded",
                  jsonData.similarity > 80 ? "bg-red-100 text-red-800" :
                  jsonData.similarity > 50 ? "bg-yellow-100 text-yellow-800" :
                  "bg-green-100 text-green-800"
                )}>
                  📊 Similitud: {jsonData.similarity}%
                </div>
              )}
              {jsonData?.mobile && (
                <div className="text-xs text-muted-foreground">
                  📱 {jsonData.mobile}
                </div>
              )}
            </div>
          );

        case 2: // Bot 2 - Promotion Analysis
          return (
            <div className="text-sm max-w-[200px] space-y-1">
              {jsonData?.case_number && (
                <div className="text-xs text-blue-600 font-medium">
                  📋 {jsonData.case_number}
                </div>
              )}
              {jsonData?.flag_promotion !== undefined && (
                <div className={cn(
                  "text-xs px-1 py-0.5 rounded",
                  jsonData.flag_promotion ? "bg-blue-100 text-blue-800" : "bg-gray-100 text-gray-800"
                )}>
                  🎁 Promoción: {jsonData.flag_promotion ? "Activa" : "Inactiva"}
                </div>
              )}
              {jsonData?.flag_promotion_redeemed !== undefined && (
                <div className={cn(
                  "text-xs px-1 py-0.5 rounded",
                  jsonData.flag_promotion_redeemed ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
                )}>
                  ✅ Canjeada: {jsonData.flag_promotion_redeemed ? "Sí" : "No"}
                </div>
              )}
              {jsonData?.deposit_count !== null && jsonData?.deposit_count !== undefined && (
                <div className="text-xs text-muted-foreground">
                  💰 Depósitos: {jsonData.deposit_count}
                </div>
              )}
              {jsonData?.creation_date && (
                <div className="text-xs text-muted-foreground">
                  📅 {new Date(jsonData.creation_date).toLocaleDateString('es-ES')}
                </div>
              )}
            </div>
          );

        case 3: // Bot 3 - Login Analysis
          return (
            <div className="text-sm max-w-[200px] space-y-1">
              {jsonData?.ip && (
                <div className="font-mono text-xs mb-1 truncate" title={jsonData.ip}>
                  🌐 IP: {jsonData.ip}
                </div>
              )}
              {jsonData?.login_date && (
                <div className="text-xs text-blue-600">
                  🔐 Login: {new Date(jsonData.login_date).toLocaleString('es-ES')}
                </div>
              )}
              <div className="text-xs text-muted-foreground">
                🕐 Análisis de acceso
              </div>
            </div>
          );

        case 4: // Bot 4 - Transaction Analysis (Outliers)
          return (
            <div className="text-sm max-w-[200px] space-y-1">
              {jsonData?.amount && (
                <div className="font-semibold text-red-600">
                  💰 S/ {jsonData.amount.toLocaleString()}
                </div>
              )}
              {jsonData?.method && (
                <div className="text-xs text-muted-foreground mb-1">
                  🏦 {jsonData.method}
                </div>
              )}
              {jsonData?.z_score && (
                <div className={cn(
                  "text-xs px-1 py-0.5 rounded font-bold",
                  jsonData.z_score > 3 ? "bg-red-100 text-red-800" :
                  jsonData.z_score > 2 ? "bg-orange-100 text-orange-800" :
                  "bg-yellow-100 text-yellow-800"
                )}>
                  📊 Z-Score: {jsonData.z_score.toFixed(2)}
                </div>
              )}
              {jsonData?.percent_deviation && (
                <div className={cn(
                  "text-xs px-1 py-0.5 rounded",
                  jsonData.percent_deviation > 100 ? "bg-red-100 text-red-800" :
                  jsonData.percent_deviation > 50 ? "bg-orange-100 text-orange-800" :
                  "bg-yellow-100 text-yellow-800"
                )}>
                  ⚠️ {jsonData.percent_deviation.toFixed(1)}% desviación
                </div>
              )}
              {jsonData?.comments && (
                <div className="text-xs text-orange-600 italic">
                  💬 {jsonData.comments}
                </div>
              )}
            </div>
          );

        default:
          return <div className="text-sm text-muted-foreground">-</div>;
      }
    } catch (error) {
      console.warn("Error parsing JSON data:", error);
      return <div className="text-sm text-muted-foreground">Error en datos</div>;
    }
  };

  // Función para obtener el título de la columna específica del bot
  const getBotSpecificColumnTitle = (botId: number) => {
    switch (botId) {
      case 1: return "Análisis IP & Similitud";
      case 2: return "Análisis Promociones";
      case 3: return "Análisis Login";
      case 4: return "Análisis Transacciones";
      default: return "Datos Bot";
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
      header: createSortableHeader("Documento"),
      cell: ({ row }) => {
        const type = row.original.national_id_type;
        const id = row.original.national_id;
        return (
          <div className="text-sm font-mono">
            {type}: {String(id)}
          </div>
        );
      },
    },
    {
      accessorKey: "birthday",
      header: createSortableHeader("Fecha Nac."),
      cell: ({ row }) => {
        const date = row.getValue("birthday") as string;
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
      id: "calimaco_info",
      header: createSortableHeader("Calimaco"),
      cell: ({ row }) => {
        const calimacoUser = row.original.calimaco_user;
        const calimacoStatus = row.original.calimaco_status;
        return (
          <div className="text-sm">
            {calimacoUser && (
              <div className="font-mono text-xs">{String(calimacoUser)}</div>
            )}
            {calimacoStatus && (
              <div className={`text-xs px-1 rounded ${
                calimacoStatus === 'ABIERTO' 
                  ? 'bg-green-100 text-green-700' 
                  : calimacoStatus === 'CERRADO'
                  ? 'bg-red-100 text-red-700'
                  : 'bg-gray-100 text-gray-700'
              }`}>
                {calimacoStatus}
              </div>
            )}
            {!calimacoUser && !calimacoStatus && (
              <div className="text-sm text-muted-foreground">-</div>
            )}
          </div>
        );
      },
    },
    {
      id: "bot_specific_info",
      header: createSortableHeader(getBotSpecificColumnTitle(selectedBot)),
      cell: ({ row }) => renderBotSpecificInfo(row.original, selectedBot),
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

  // Función para obtener métricas específicas por bot
  const getBotSpecificMetrics = () => {
    if (caseData.length === 0) return null;

    try {
      switch (selectedBot) {
        case 1: // Bot 1 - IP & Similarity Analysis
          const uniqueIPs = new Set();
          let totalIpCount = 0;
          let highSimilarityCount = 0;
          let mobileCount = 0;

          caseData.forEach(item => {
            try {
              const jsonData = typeof item.json_data === 'string' 
                ? JSON.parse(item.json_data) 
                : item.json_data;
              if (jsonData?.ip) uniqueIPs.add(jsonData.ip);
              if (jsonData?.ip_count) totalIpCount += jsonData.ip_count;
              if (jsonData?.similarity && jsonData.similarity > 70) highSimilarityCount++;
              if (jsonData?.mobile) mobileCount++;
            } catch {}
          });

          return {
            uniqueIPs: uniqueIPs.size,
            totalIpCount,
            highSimilarityCount,
            mobileCount,
            type: "IP & Similitud"
          };

        case 2: // Bot 2 - Promotion Analysis
          let promotionActiveCount = 0;
          let promotionRedeemedCount = 0;
          let totalDeposits = 0;
          let casesWithDeposits = 0;

          caseData.forEach(item => {
            try {
              const jsonData = typeof item.json_data === 'string' 
                ? JSON.parse(item.json_data) 
                : item.json_data;
              if (jsonData?.flag_promotion === true) promotionActiveCount++;
              if (jsonData?.flag_promotion_redeemed === true) promotionRedeemedCount++;
              if (jsonData?.deposit_count && jsonData.deposit_count > 0) {
                totalDeposits += jsonData.deposit_count;
                casesWithDeposits++;
              }
            } catch {}
          });

          return {
            promotionActiveCount,
            promotionRedeemedCount,
            totalDeposits,
            casesWithDeposits,
            type: "Promociones"
          };

        case 3: // Bot 3 - Login Analysis
          const loginIPs = new Set();
          let recentLogins = 0;
          const today = new Date();
          const yesterday = new Date(today);
          yesterday.setDate(yesterday.getDate() - 1);

          caseData.forEach(item => {
            try {
              const jsonData = typeof item.json_data === 'string' 
                ? JSON.parse(item.json_data) 
                : item.json_data;
              if (jsonData?.ip) loginIPs.add(jsonData.ip);
              if (jsonData?.login_date) {
                const loginDate = new Date(jsonData.login_date);
                if (loginDate >= yesterday) recentLogins++;
              }
            } catch {}
          });

          return {
            uniqueLoginIPs: loginIPs.size,
            recentLogins,
            totalLogins: caseData.length,
            avgLoginsPerIP: loginIPs.size > 0 ? (caseData.length / loginIPs.size).toFixed(1) : 0,
            type: "Accesos"
          };

        case 4: // Bot 4 - Transaction Analysis
          let totalAmount = 0;
          let highValueCount = 0;
          let highRiskCount = 0;
          const methods = new Set();

          caseData.forEach(item => {
            try {
              const jsonData = typeof item.json_data === 'string' 
                ? JSON.parse(item.json_data) 
                : item.json_data;
              if (jsonData?.amount) {
                totalAmount += jsonData.amount;
                if (jsonData.amount >= 10000) highValueCount++;
              }
              if (jsonData?.method) methods.add(jsonData.method);
              if (jsonData?.z_score && jsonData.z_score > 3) highRiskCount++;
            } catch {}
          });

          return {
            totalAmount,
            highValueCount,
            highRiskCount,
            uniqueMethods: methods.size,
            avgAmount: caseData.length > 0 ? (totalAmount / caseData.length) : 0,
            type: "Transacciones"
          };

        default:
          return null;
      }
    } catch (error) {
      console.error("Error calculating bot metrics:", error);
      return null;
    }
  };

  const botMetrics = getBotSpecificMetrics();

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

  const fetchChartData = async () => {
    try {
      setChartLoading(true);
      const { from, to } = dateRange;
      const data = await reportApi.getBotSummary(selectedBot as 1 | 2 | 3 | 4, from, to);
      setChartData(data);
    } catch (error) {
      console.error("Error fetching chart data:", error);
    } finally {
      setChartLoading(false);
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
    fetchChartData();
  };

  const handleBack = () => {
    router.push('/cases');
  };

  // Cargar bots al inicio
  useEffect(() => {
    async function fetchBots() {
      try {
        const botsData = await getAllBots();
        setBots(botsData);
      } catch (error) {
        console.error('Error loading bots:', error);
      }
    }
    fetchBots();
  }, []);

  // Función para obtener el icono apropiado para cada bot
  const getBotIcon = (botId: number) => {
    switch (botId) {
      case 1: return Globe;
      case 2: return Shield;
      case 3: return Lock;
      case 4: return AlertTriangle;
      default: return BotIcon;
    }
  };

  // Función para obtener el bot seleccionado
  const getSelectedBot = () => {
    return bots.find(bot => bot.id === selectedBot);
  };

  useEffect(() => {
    fetchCaseData();
    fetchChartData();
  }, [selectedBot]);

  // Efecto para actualizar datos cuando cambien las fechas
  useEffect(() => {
    fetchCaseData();
    fetchChartData();
  }, [dateRange.from, dateRange.to]);

  return (
    <div className="flex-1 space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" onClick={handleBack}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver a Casos
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Análisis Detallado de Casos</h1>
            <p className="text-muted-foreground">
              Análisis específico de casos detectados por Bot {selectedBot} con información completa del cliente
            </p>
          </div>
        </div>
        <Button variant="outline" size="sm" onClick={handleRefresh} disabled={reportLoading || chartLoading}>
          {(reportLoading || chartLoading) ? (
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
            Configura los parámetros de búsqueda para el análisis
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
              <Select
                value={selectedBot.toString()}
                onValueChange={(value) => handleBotChange(parseInt(value))}
                disabled={reportLoading || chartLoading}
              >
                <SelectTrigger className="w-[280px]">
                  <div className="flex items-center gap-2">
                    {(() => {
                      const selectedBotData = getSelectedBot();
                      const IconComponent = getBotIcon(selectedBot);
                      return (
                        <>
                          <IconComponent className="h-4 w-4" />
                          <span>{selectedBotData?.name || getBotName(selectedBot)}</span>
                        </>
                      );
                    })()}
                  </div>
                </SelectTrigger>
                <SelectContent>
                  {bots.map((bot) => {
                    const IconComponent = getBotIcon(bot.id);
                    return (
                      <SelectItem key={bot.id} value={bot.id.toString()}>
                        <div className="flex items-center gap-2">
                          <IconComponent className="h-4 w-4" />
                          <span>{bot.name}</span>
                        </div>
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Gráfico de Resumen del Bot y Filtros de Fecha */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Gráfico */}
        <BotSummaryChart 
          botNumber={selectedBot as 1 | 2 | 3 | 4}
          data={chartData}
          loading={chartLoading}
        />
        
        {/* Filtros de Fecha para el Gráfico */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Filtros de Gráfico
            </CardTitle>
            <CardDescription>
              Configura el período de tiempo para visualizar en el gráfico de resumen
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Filtros de fecha */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="chart-date-from" className="text-sm font-medium">Fecha Desde:</Label>
                <Input
                  id="chart-date-from"
                  type="date"
                  value={dateRange.from}
                  onChange={(e) => handleDateChange('from', e.target.value)}
                  className="w-full"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="chart-date-to" className="text-sm font-medium">Fecha Hasta:</Label>
                <Input
                  id="chart-date-to"
                  type="date"
                  value={dateRange.to}
                  onChange={(e) => handleDateChange('to', e.target.value)}
                  className="w-full"
                />
              </div>
            </div>

            {/* Botones de rangos rápidos */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">Rangos Rápidos:</Label>
              <div className="grid grid-cols-2 gap-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => {
                    const today = new Date();
                    const sevenDaysAgo = new Date(today);
                    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
                    setDateRange({
                      from: sevenDaysAgo.toISOString().split('T')[0],
                      to: today.toISOString().split('T')[0]
                    });
                  }}
                >
                  Últimos 7 días
                </Button>
                
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => {
                    const today = new Date();
                    const thirtyDaysAgo = new Date(today);
                    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
                    setDateRange({
                      from: thirtyDaysAgo.toISOString().split('T')[0],
                      to: today.toISOString().split('T')[0]
                    });
                  }}
                >
                  Últimos 30 días
                </Button>
                
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => {
                    const today = new Date();
                    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
                    setDateRange({
                      from: firstDayOfMonth.toISOString().split('T')[0],
                      to: today.toISOString().split('T')[0]
                    });
                  }}
                >
                  Este mes
                </Button>
                
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => {
                    const today = new Date();
                    const yesterday = new Date(today);
                    yesterday.setDate(yesterday.getDate() - 1);
                    setDateRange({
                      from: yesterday.toISOString().split('T')[0],
                      to: yesterday.toISOString().split('T')[0]
                    });
                  }}
                >
                  Ayer
                </Button>
              </div>
            </div>

            {/* Información del período seleccionado */}
            <div className="p-3 bg-muted rounded-lg">
              <div className="text-sm font-medium text-muted-foreground mb-1">
                Período Seleccionado:
              </div>
              <div className="text-sm">
                <div>{new Date(dateRange.from).toLocaleDateString('es-ES', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}</div>
                <div className="text-xs text-muted-foreground">hasta</div>
                <div>{new Date(dateRange.to).toLocaleDateString('es-ES', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}</div>
              </div>
              <div className="text-xs text-muted-foreground mt-2">
                {Math.ceil((new Date(dateRange.to).getTime() - new Date(dateRange.from).getTime()) / (1000 * 60 * 60 * 24))} días de datos
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

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

        {/* Métricas específicas del bot */}
        {botMetrics && selectedBot === 1 && (
          <>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">IPs Únicas</CardTitle>
                <BotIcon className="h-4 w-4 text-purple-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-purple-600">{botMetrics.uniqueIPs || 0}</div>
                <p className="text-xs text-muted-foreground">
                  direcciones IP detectadas
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Alta Similitud</CardTitle>
                <AlertTriangle className="h-4 w-4 text-orange-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-orange-600">{botMetrics.highSimilarityCount || 0}</div>
                <p className="text-xs text-muted-foreground">
                  casos con similitud &gt; 70%
                </p>
              </CardContent>
            </Card>
          </>
        )}

        {botMetrics && selectedBot === 2 && (
          <>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Promociones Activas</CardTitle>
                <BotIcon className="h-4 w-4 text-blue-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">{botMetrics.promotionActiveCount || 0}</div>
                <p className="text-xs text-muted-foreground">
                  promociones detectadas
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Promociones Canjeadas</CardTitle>
                <AlertTriangle className="h-4 w-4 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">{botMetrics.promotionRedeemedCount || 0}</div>
                <p className="text-xs text-muted-foreground">
                  promociones utilizadas
                </p>
              </CardContent>
            </Card>
          </>
        )}

        {botMetrics && selectedBot === 3 && (
          <>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">IPs de Login</CardTitle>
                <BotIcon className="h-4 w-4 text-purple-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-purple-600">{botMetrics.uniqueLoginIPs || 0}</div>
                <p className="text-xs text-muted-foreground">
                  IPs de acceso únicas
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Logins Recientes</CardTitle>
                <AlertTriangle className="h-4 w-4 text-blue-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">{botMetrics.recentLogins || 0}</div>
                <p className="text-xs text-muted-foreground">
                  últimas 24 horas
                </p>
              </CardContent>
            </Card>
          </>
        )}

        {botMetrics && selectedBot === 4 && (
          <>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Monto Total</CardTitle>
                <BotIcon className="h-4 w-4 text-purple-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-purple-600">
                  S/ {(botMetrics.totalAmount || 0).toLocaleString()}
                </div>
                <p className="text-xs text-muted-foreground">
                  suma de transacciones
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Alto Riesgo</CardTitle>
                <AlertTriangle className="h-4 w-4 text-red-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">{botMetrics.highRiskCount || 0}</div>
                <p className="text-xs text-muted-foreground">
                  Z-Score &gt; 3.0
                </p>
              </CardContent>
            </Card>
          </>
        )}

        {/* Fallback para cuando no hay métricas específicas */}
        {!botMetrics && (
          <>
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
          </>
        )}
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
              searchPlaceholder="Buscar por email del cliente..."
              searchColumn="email"
              exportFilename={`casos-bot${selectedBot}-${dateRange.from}-${dateRange.to}.csv`}
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
