"use client";

import { useMemo } from "react";
import { format } from "date-fns";
import { TrendingUp } from "lucide-react";
import { Pie, PieChart, Cell } from "recharts";
import { useDashboardData } from "@/hooks/use-dashboard-data";
import { useDashboardFilters } from "@/contexts/dashboard-filter-provider";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

interface CaseStateApiRow {
  state: string;
  state_count: number;
}

interface DonutSlice {
  label: string;
  value: number;
  percent: string;
}

const COLORS = [
  "hsl(var(--chart-1))",
  "hsl(var(--chart-2))",
  "hsl(var(--chart-3))",
  "hsl(var(--chart-4))",
  "hsl(var(--chart-5))",
];

// Procesa los datos de la API para el gráfico donut
function processDonutData(rows: CaseStateApiRow[]): DonutSlice[] {
  if (!rows || rows.length === 0) return [];
  
  const total = rows.reduce((sum, row) => sum + row.state_count, 0);
  if (total === 0) return [];
  
  return rows.map((row) => ({
    label: row.state || "Sin estado",
    value: row.state_count,
    percent: ((row.state_count / total) * 100).toFixed(1),
  }));
}

export function CaseByStateChart() {
  const { data: dashboardData, isLoading, isError } = useDashboardData();
  const { filters } = useDashboardFilters();
  
  const data = useMemo(() => {
    return processDonutData(dashboardData.casesByState);
  }, [dashboardData.casesByState]);

  // Genera configuración dinámica para ChartContainer
  const chartConfig = useMemo<ChartConfig>(() => {
    const cfg: ChartConfig = {
      value: { label: "Casos" },
    };
    data.forEach((slice, idx) => {
      cfg[slice.label] = {
        label: slice.label,
        color: COLORS[idx % COLORS.length],
      };
    });
    return cfg;
  }, [data]);

  if (isError) {
    return (
      <Card className="flex flex-col">
        <CardHeader className="items-center pb-0">
          <CardTitle>Casos por Estado</CardTitle>
          <CardDescription>Error al cargar los datos</CardDescription>
        </CardHeader>
        <CardContent className="flex-1 pb-0">
          <div className="text-center py-8 text-red-500">
            Error al cargar la distribución de casos
          </div>
        </CardContent>
      </Card>
    );
  }

  if (isLoading) {
    return (
      <Card className="flex flex-col">
        <CardHeader className="items-center pb-0">
          <CardTitle>Casos por Estado</CardTitle>
          <CardDescription>Cargando datos...</CardDescription>
        </CardHeader>
        <CardContent className="flex-1 pb-0">
          <div className="text-center py-8 text-muted-foreground">
            Cargando distribución de casos...
          </div>
        </CardContent>
      </Card>
    );
  }

  // Si no hay datos
  if (data.length === 0) {
    return (
      <Card className="flex flex-col">
        <CardHeader className="items-center pb-0">
          <CardTitle>Casos por Estado</CardTitle>
          <CardDescription>
            Distribución de casos del {format(new Date(filters.from), "dd/MM/yyyy")} al{" "}
            {format(new Date(filters.to), "dd/MM/yyyy")}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex-1 pb-0">
          <div className="text-center py-8 text-muted-foreground">
            No hay casos en el rango seleccionado.
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>Casos por Estado</CardTitle>
        <CardDescription>
          Distribución de casos del {format(new Date(filters.from), "dd/MM/yyyy")} al{" "}
          {format(new Date(filters.to), "dd/MM/yyyy")}
          {filters.channelId && " (filtrado por canal)"}
        </CardDescription>
      </CardHeader>

      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="[&_.recharts-pie-label-text]:fill-foreground mx-auto max-h-[250px] pb-0"
        >
          <PieChart>
            <ChartTooltip content={<ChartTooltipContent hideLabel />} />
            <Pie data={data} dataKey="value" nameKey="label" label>
              {data.map((entry, idx) => (
                <Cell key={`cell-${idx}`} fill={COLORS[idx % COLORS.length]} />
              ))}
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>

      <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 leading-none font-medium">
          Visualización de los casos por estado{" "}
          <TrendingUp className="h-4 w-4" />
        </div>
        <div className="text-muted-foreground leading-none">
          {format(new Date(filters.from), "dd/MM/yyyy")} - {format(new Date(filters.to), "dd/MM/yyyy")}
        </div>
      </CardFooter>
    </Card>
  );
}
