import { useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts";
import { Calendar, TrendingUp, Users, Globe, Shield, AlertTriangle } from "lucide-react";
import { useBots } from "@/hooks/use-bots";
import type { 
  Bot1SummaryResult, 
  Bot2SummaryResult, 
  Bot3SummaryResult, 
  Bot4SummaryResult 
} from "@/api/report.api";

interface BotSummaryChartProps {
  botNumber: 1 | 2 | 3 | 4;
  data: Bot1SummaryResult[] | Bot2SummaryResult[] | Bot3SummaryResult[] | Bot4SummaryResult[];
  loading?: boolean;
}

export function BotSummaryChart({ botNumber, data, loading }: BotSummaryChartProps) {
  const { getBotName, getBotDescription } = useBots();
  
  const chartConfig = useMemo(() => {
    switch (botNumber) {
      case 1:
        return {
          title: getBotName(1),
          description: getBotDescription(1) || "Análisis IP & Similitud - Eventos, clientes e IPs únicas detectadas",
          icon: Globe,
          color: "#8b5cf6", // purple
          metrics: [
            { key: "total_events", name: "Eventos", color: "#8b5cf6" },
            { key: "unique_clients", name: "Clientes Únicos", color: "#06b6d4" },
            { key: "unique_ips", name: "IPs Únicas", color: "#f59e0b" }
          ]
        };
      case 2:
        return {
          title: getBotName(2),
          description: getBotDescription(2) || "Análisis Promociones - Eventos y clientes únicos en promociones",
          icon: Shield,
          color: "#06b6d4", // cyan
          metrics: [
            { key: "total_events", name: "Eventos", color: "#06b6d4" },
            { key: "unique_clients", name: "Clientes Únicos", color: "#10b981" }
          ]
        };
      case 3:
        return {
          title: getBotName(3),
          description: getBotDescription(3) || "Análisis Login - Logins, usuarios e IPs de acceso",
          icon: Users,
          color: "#10b981", // green
          metrics: [
            { key: "total_logins", name: "Total Logins", color: "#10b981" },
            { key: "unique_users", name: "Usuarios Únicos", color: "#06b6d4" },
            { key: "unique_ips", name: "IPs Únicas", color: "#f59e0b" }
          ]
        };
      case 4:
        return {
          title: getBotName(4),
          description: getBotDescription(4) || "Análisis Transacciones - Clientes únicos con transacciones anómalas",
          icon: AlertTriangle,
          color: "#ef4444", // red
          metrics: [
            { key: "unique_clients", name: "Clientes Únicos", color: "#ef4444" }
          ]
        };
      default:
        return {
          title: getBotName(botNumber) || "Bot Desconocido",
          description: getBotDescription(botNumber) || "",
          icon: Calendar,
          color: "#6b7280",
          metrics: []
        };
    }
  }, [botNumber, getBotName, getBotDescription]);

  const processedData = useMemo(() => {
    if (!data || data.length === 0) return [];

    return data.map(item => {
      // Para Bot 4, usar updated_date en lugar de capture_date
      const dateField = botNumber === 4 ? 'updated_date' : 'capture_date';
      const dateValue = (item as any)[dateField];
      
      return {
        ...item,
        date: new Date(dateValue).toLocaleDateString('es-ES', {
          month: 'short',
          day: 'numeric'
        })
      };
    }).sort((a, b) => {
      const dateA = new Date((a as any)[botNumber === 4 ? 'updated_date' : 'capture_date']);
      const dateB = new Date((b as any)[botNumber === 4 ? 'updated_date' : 'capture_date']);
      return dateA.getTime() - dateB.getTime();
    });
  }, [data, botNumber]);

  const IconComponent = chartConfig.icon;

  if (loading) {
    return (
      <Card className="flex flex-col h-[400px]">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div>
            <CardTitle className="flex items-center gap-2">
              <IconComponent className="h-5 w-5" style={{ color: chartConfig.color }} />
              {chartConfig.title}
            </CardTitle>
            <CardDescription>{chartConfig.description}</CardDescription>
          </div>
        </CardHeader>
        <CardContent className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </CardContent>
      </Card>
    );
  }

  if (!data || data.length === 0) {
    return (
      <Card className="flex flex-col h-[400px]">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div>
            <CardTitle className="flex items-center gap-2">
              <IconComponent className="h-5 w-5" style={{ color: chartConfig.color }} />
              {chartConfig.title}
            </CardTitle>
            <CardDescription>{chartConfig.description}</CardDescription>
          </div>
        </CardHeader>
        <CardContent className="flex-1 flex items-center justify-center">
          <div className="text-center text-muted-foreground">
            <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No hay datos disponibles para el período seleccionado</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Para Bot 4, usar LineChart ya que solo tiene una métrica
  if (botNumber === 4) {
    return (
      <Card className="flex flex-col h-[400px]">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div>
            <CardTitle className="flex items-center gap-2">
              <IconComponent className="h-5 w-5" style={{ color: chartConfig.color }} />
              {chartConfig.title}
            </CardTitle>
            <CardDescription>{chartConfig.description}</CardDescription>
          </div>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent className="flex-1">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={processedData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip 
                labelFormatter={(value) => `Fecha: ${value}`}
                formatter={(value: number, name: string) => [
                  value.toLocaleString(), 
                  "Clientes Únicos"
                ]}
              />
              <Line 
                type="monotone" 
                dataKey="unique_clients" 
                stroke={chartConfig.color}
                strokeWidth={2}
                dot={{ fill: chartConfig.color, strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    );
  }

  // Para otros bots, usar BarChart
  return (
    <Card className="flex flex-col h-[400px]">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div>
          <CardTitle className="flex items-center gap-2">
            <IconComponent className="h-5 w-5" style={{ color: chartConfig.color }} />
            {chartConfig.title}
          </CardTitle>
          <CardDescription>{chartConfig.description}</CardDescription>
        </div>
        <TrendingUp className="h-4 w-4 text-muted-foreground" />        </CardHeader>
        <CardContent className="flex-1">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={processedData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip 
              labelFormatter={(value) => `Fecha: ${value}`}
              formatter={(value: number, name: string) => [
                value.toLocaleString(), 
                chartConfig.metrics.find(m => m.key === name)?.name || name
              ]}
            />
            {chartConfig.metrics.map(metric => (
              <Bar 
                key={metric.key}
                dataKey={metric.key} 
                fill={metric.color}
                name={metric.name}
                radius={[2, 2, 0, 0]}
              />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
