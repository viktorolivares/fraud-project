"use client";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { useDashboardData } from "@/hooks/use-dashboard-data";

export function CasesByBotChart() {
  const { data, isLoading, isError } = useDashboardData();

  if (isError) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Casos por bot</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center text-red-500 py-8">
            Error al cargar los datos
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Casos por bot</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="h-[300px] flex items-center justify-center">
            <div className="text-muted-foreground">Cargando...</div>
          </div>
        ) : data.summaryBotCases && data.summaryBotCases.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data.summaryBotCases} layout="vertical" margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" allowDecimals={false} />
              <YAxis dataKey="bot_name" type="category" width={180} />
              <Tooltip />
              <Legend />
              <Bar dataKey="case_count" name="Casos" fill="#10b981" />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-[300px] flex items-center justify-center">
            <div className="text-muted-foreground">No hay datos disponibles para el período seleccionado</div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
