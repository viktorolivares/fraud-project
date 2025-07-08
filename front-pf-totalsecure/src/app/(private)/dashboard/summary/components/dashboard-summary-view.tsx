"use client";
import { format, parseISO, isValid } from "date-fns";
import { es } from "date-fns/locale";
import { useDashboardSummaryData } from "@/hooks/use-dashboard-data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, LineChart, Line, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { Users, AlertTriangle, FileText, Cpu, Calendar } from "lucide-react";

interface SummaryKPIProps {
  summary: any | null;
  dateRange: { from: string; to: string } | null;
  isLoading: boolean;
}

function SummaryKPIs({ summary, dateRange, isLoading }: SummaryKPIProps) {
  const summaryData = summary?.[0];
  
  const cards = [
    { 
      title: "Usuarios únicos", 
      value: isLoading ? '-' : (summaryData?.unique_users ?? summaryData?.bots_count ?? '-'), 
      icon: <Users className="text-blue-600" />,
      subtitle: "Últimos 7 días"
    },
    { 
      title: "Incidentes", 
      value: isLoading ? '-' : (summaryData?.incidents_count ?? '-'), 
      icon: <AlertTriangle className="text-red-500" />,
      subtitle: "Total registrados"
    },
    { 
      title: "Casos", 
      value: isLoading ? '-' : (summaryData?.cases_count ?? '-'), 
      icon: <FileText className="text-green-600" />,
      subtitle: "En el período"
    },
    { 
      title: "Período", 
      value: dateRange ? `${format(parseISO(dateRange.from), "dd/MM", { locale: es })} - ${format(parseISO(dateRange.to), "dd/MM", { locale: es })}` : '-', 
      icon: <Calendar className="text-purple-600" />,
      subtitle: "Rango de fechas"
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
      {cards.map((c) => (
        <Card key={c.title} className="flex flex-col items-center justify-center py-4">
          <div className="flex items-center gap-2 mb-2">
            {c.icon}
            <span className="font-bold text-lg">{c.value}</span>
          </div>
          <div className="text-xs text-muted-foreground text-center">
            <div>{c.title}</div>
            <div className="text-xs opacity-75">{c.subtitle}</div>
          </div>
        </Card>
      ))}
    </div>
  );
}

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#00ff00', '#ff00ff'];

export function DashboardSummaryView() {
  const { data, isLoading, isError, error } = useDashboardSummaryData();

  // Formatea fechas para los gráficos
  const normalizeDate = (dateStr: string) => {
    if (typeof dateStr !== "string") return dateStr;
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return dateStr;
    
    let d = parseISO(dateStr);
    if (!isValid(d)) d = new Date(dateStr);
    if (isValid(d)) return format(d, "yyyy-MM-dd");
    return dateStr;
  };

  const formatDataForChart = (chartData: any[], dateKey: string) => {
    if (!chartData || !Array.isArray(chartData)) return [];
    return chartData.map(row => {
      const iso = normalizeDate(row[dateKey]);
      return {
        ...row,
        [dateKey]: /^\d{4}-\d{2}-\d{2}$/.test(iso)
          ? format(parseISO(iso), "dd/MM", { locale: es })
          : iso
      };
    });
  };

  const formatCasesDataForPie = (casesData: any[]) => {
    if (!casesData || !Array.isArray(casesData)) return [];
    return casesData.map(item => ({
      name: item.state_name || item.estado || 'Sin estado',
      value: item.cases_count || item.count || 0
    }));
  };

  if (isError) {
    return (
      <div className="flex flex-col gap-6">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center text-red-500">
              Error al cargar el resumen del dashboard: {error}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isLoading || !data) {
    return (
      <div className="flex flex-col gap-6">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center text-muted-foreground">
              Cargando resumen del dashboard...
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const formattedCasesData = formatDataForChart(data.summaryCasesByDate, 'capture_date');
  const formattedIncidentsData = formatDataForChart(data.summaryIncidentsByDate, 'exec_date');
  const formattedAllBotsData = formatDataForChart(data.allBotsSummaryByDate, 'capture_date');
  const pieData = formatCasesDataForPie(data.casesByState);

  return (
    <div className="flex flex-col gap-6">
      {/* Header con título y KPIs */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Resumen del Dashboard</h1>
            <p className="text-muted-foreground">Vista general de los últimos 7 días</p>
          </div>
        </div>
        
        <SummaryKPIs 
          summary={data.systemSummary} 
          dateRange={data.dateRange}
          isLoading={isLoading} 
        />
      </div>

      {/* Gráficos principales en una fila */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Casos por Estado</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Casos por Fecha</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={formattedCasesData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="capture_date" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="cases_count" name="Casos" fill="#22c55e" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Incidentes por Fecha</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={formattedIncidentsData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="exec_date" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Line type="monotone" dataKey="incidents" name="Incidentes" stroke="#ef4444" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Usuarios únicos y resumen de bots */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Usuarios Únicos por Fecha</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={formattedAllBotsData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="capture_date" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Legend />
                <Bar dataKey="unique_users" name="Usuarios únicos" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Resumen de Bots</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {data.summaryBotCases && data.summaryBotCases.length > 0 ? (
                data.summaryBotCases.slice(0, 5).map((bot: any, index: number) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                        <Cpu className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">{bot.bot_name || `Bot ${index + 1}`}</p>
                        <p className="text-sm text-muted-foreground">
                          {bot.cases_count || bot.count || 0} casos
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold">{bot.unique_users || bot.users || '-'}</p>
                      <p className="text-xs text-muted-foreground">usuarios únicos</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center text-muted-foreground py-8">
                  No hay datos de bots disponibles
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Información adicional */}
      <Card>
        <CardHeader>
          <CardTitle>Información del Período</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold text-blue-600">
                {data.systemSummary?.[0]?.bots_count || '-'}
              </p>
              <p className="text-sm text-muted-foreground">Bots activos</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-green-600">
                {data.summaryCasesByDate?.length || 0}
              </p>
              <p className="text-sm text-muted-foreground">Días con actividad</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-purple-600">
                {data.allBotsSummaryByDate?.length || 0}
              </p>
              <p className="text-sm text-muted-foreground">Bots con actividad</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-orange-600">
                {data.casesByState?.length || 0}
              </p>
              <p className="text-sm text-muted-foreground">Estados de caso</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
