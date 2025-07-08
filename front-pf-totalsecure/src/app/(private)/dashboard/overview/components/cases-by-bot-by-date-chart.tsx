"use client";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { format, parseISO, isValid } from "date-fns";
import { es } from "date-fns/locale";
import { useDashboardData } from "@/hooks/use-dashboard-data";

function normalizeDate(dateStr: string): string {
  if (typeof dateStr !== "string") return dateStr;
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return dateStr;
  let d = parseISO(dateStr);
  if (!isValid(d)) d = new Date(dateStr);
  if (isValid(d)) return format(d, "yyyy-MM-dd");
  return dateStr;
}

export function CasesByBotByDateChart() {
  const { data, isLoading, isError } = useDashboardData();

  if (isError) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Casos por bot por fecha</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center text-red-500 py-8">
            Error al cargar los datos
          </div>
        </CardContent>
      </Card>
    );
  }

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Casos por bot por fecha</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[400px] flex items-center justify-center">
            <div className="text-muted-foreground">Cargando...</div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Agrupa por fecha y pivotea por bot_name
  const dates = Array.from(new Set(data.summaryBotCasesByDate.map(row => normalizeDate(row.case_date || row.capture_date)))).sort();
  const bots = Array.from(new Set(data.summaryBotCasesByDate.map(row => row.bot_name)));
  
  const chartData = dates.map(date => {
    const row: Record<string, any> = { date: format(parseISO(date), "dd/MM/yyyy", { locale: es }) };
    bots.forEach(bot => {
      const found = data.summaryBotCasesByDate.find(d => normalizeDate(d.case_date || d.capture_date) === date && d.bot_name === bot);
      row[bot] = found ? found.case_count : 0;
    });
    return row;
  });

  const colors = [
    "#2563eb", "#10b981", "#dc2626", "#f59e42", "#a21caf", "#0ea5e9", "#eab308", "#be185d", "#64748b", "#14b8a6", "#f43f5e", "#6366f1"
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Casos por bot por fecha</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Legend />
            {bots.map((bot, index) => (
              <Line 
                key={bot} 
                type="monotone" 
                dataKey={bot}
                name={bot}
                stroke={colors[index % colors.length]} 
                strokeWidth={2}
                connectNulls={false}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
