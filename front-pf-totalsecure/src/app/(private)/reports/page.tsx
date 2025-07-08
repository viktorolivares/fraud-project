"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  AlertTriangle, 
  Download,
  RefreshCw,
  Bot as BotIcon,
  ArrowRight,
  Eye,
  Database,
  Globe,
  Shield,
  Lock
} from "lucide-react";
import * as reportApi from "@/api/report.api";
import { getAllBots } from "@/api/bot.api";
import type { CaseDataWithClientResult } from "@/api/report.api";
import type { Bot } from "@/types/bot.d";

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

export default function ReportsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [reportLoading, setReportLoading] = useState(false);
  const [bots, setBots] = useState<Bot[]>([]);
  
  // Estados para filtros básicos
  const [dateRange, setDateRange] = useState(getDefaultDateRange());
  const [selectedBot, setSelectedBot] = useState<number>(4);
  
  // Estados para datos de resumen
  const [caseData, setCaseData] = useState<CaseDataWithClientResult[]>([]);
  const [quickPreview, setQuickPreview] = useState<CaseDataWithClientResult[]>([]);

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

  const fetchQuickSummary = async () => {
    try {
      setReportLoading(true);
      const { from, to } = dateRange;
      const data = await reportApi.getCaseDataWithClients(from, to, selectedBot);
      setCaseData(data);
      // Solo mostrar los primeros 5 para preview
      setQuickPreview(data.slice(0, 5));
    } catch (error) {
      console.error("Error fetching quick summary:", error);
    } finally {
      setReportLoading(false);
      setLoading(false);
    }
  };

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
    fetchQuickSummary();
  };

  const handleViewDetails = () => {
    router.push(`/reports/case-details?bot=${selectedBot}&from=${dateRange.from}&to=${dateRange.to}`);
  };

  useEffect(() => {
    fetchQuickSummary();
  }, [selectedBot]);

  return (
    <div className="flex-1 space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard de Reportes</h1>
          <p className="text-muted-foreground">
            Análisis y monitoreo del sistema TotalSecure - Vista general y acceso a reportes detallados
          </p>
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

      {/* Configuración Rápida */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Configuración de Consulta
          </CardTitle>
          <CardDescription>
            Selecciona el período y bot para generar reportes
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
                disabled={reportLoading}
              >
                <SelectTrigger className="w-[280px]">
                  <div className="flex items-center gap-2">
                    {(() => {
                      const selectedBotData = getSelectedBot();
                      const IconComponent = getBotIcon(selectedBot);
                      return (
                        <>
                          <IconComponent className="h-4 w-4" />
                          <span>{selectedBotData?.name || "Selecciona un bot"}</span>
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

      {/* KPI Cards Principales */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Casos Detectados</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{caseData.length}</div>
            <p className="text-xs text-muted-foreground">
              período seleccionado
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
            <CardTitle className="text-sm font-medium">Eficiencia</CardTitle>
            <TrendingUp className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-600">
              {caseData.length > 0 ? '100%' : '0%'}
            </div>
            <p className="text-xs text-muted-foreground">
              datos completos
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Vista Previa Rápida de Casos */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                Vista Previa - Casos con Datos de Clientes
              </CardTitle>
              <CardDescription>
                {caseData.length > 0 ? `Mostrando los primeros 5 de ${caseData.length} casos encontrados` : 'No hay casos en el período seleccionado'}
              </CardDescription>
            </div>
            {caseData.length > 0 && (
              <Button onClick={handleViewDetails} className="flex items-center gap-2">
                <Eye className="h-4 w-4" />
                Ver Tabla Completa
                <ArrowRight className="h-4 w-4" />
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {reportLoading ? (
            <div className="flex items-center justify-center h-32">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : quickPreview.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-32 text-muted-foreground">
              <Database className="h-8 w-8 mb-2" />
              <p className="text-sm">
                No hay casos para el Bot {selectedBot} en el período seleccionado
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto border rounded-lg">
              <table className="w-full text-sm">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="text-left p-3 font-semibold">Caso</th>
                    <th className="text-left p-3 font-semibold">Cliente</th>
                    <th className="text-left p-3 font-semibold">Email</th>
                    <th className="text-left p-3 font-semibold">Documento</th>
                    <th className="text-left p-3 font-semibold">Timestamp</th>
                  </tr>
                </thead>
                <tbody>
                  {quickPreview.map((item, index) => (
                    <tr 
                      key={`preview-${item.case_id}-${item.execution_id}-${index}`} 
                      className={`border-b hover:bg-muted/30 transition-colors ${
                        index % 2 === 0 ? 'bg-background' : 'bg-muted/10'
                      }`}
                    >
                      <td className="p-3">
                        <div className="font-mono text-blue-600 font-semibold">{item.case_id}</div>
                      </td>
                      <td className="p-3">
                        <div className="font-medium">{item.first_name} {item.last_name}</div>
                        <div className="text-xs text-muted-foreground">ID: {item.client_id}</div>
                      </td>
                      <td className="p-3">
                        <div className="text-sm max-w-[200px] truncate" title={item.email}>
                          {item.email}
                        </div>
                      </td>
                      <td className="p-3">
                        <div className="text-sm font-mono">{item.national_id_type}: {item.national_id}</div>
                      </td>
                      <td className="p-3">
                        <div className="text-xs font-mono">
                          {new Date(item.capture_timestamp).toLocaleDateString('es-ES')}
                        </div>
                        <div className="text-xs font-mono text-muted-foreground">
                          {new Date(item.capture_timestamp).toLocaleTimeString('es-ES')}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          
          {caseData.length > 5 && (
            <div className="mt-4 text-center">
              <Button variant="outline" onClick={handleViewDetails} className="flex items-center gap-2 mx-auto">
                <Eye className="h-4 w-4" />
                Ver los {caseData.length - 5} casos restantes en tabla completa
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Sección de Reportes Disponibles */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Reportes Disponibles
          </CardTitle>
          <CardDescription>
            Acceso rápido a los diferentes tipos de reportes del sistema
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="border rounded-lg p-4 hover:bg-muted/30 transition-colors">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold flex items-center gap-2">
                    <Database className="h-4 w-4" />
                    Casos con Datos de Clientes
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Análisis detallado de casos detectados con información completa del cliente
                  </p>
                  <div className="mt-2">
                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                      {caseData.length} registros disponibles
                    </span>
                  </div>
                </div>
                <Button size="sm" onClick={handleViewDetails} disabled={caseData.length === 0}>
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="border rounded-lg p-4 opacity-50">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold flex items-center gap-2">
                    <TrendingUp className="h-4 w-4" />
                    Análisis de Tendencias
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Patrones y tendencias de detección a lo largo del tiempo
                  </p>
                  <div className="mt-2">
                    <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                      Próximamente
                    </span>
                  </div>
                </div>
                <Button size="sm" disabled>
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
