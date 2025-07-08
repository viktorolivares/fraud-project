"use client";

import { Bar, BarChart, CartesianGrid, LabelList, XAxis } from "recharts";
import { useMemo } from "react";
import { useDashboardData } from "@/hooks/use-dashboard-data";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import type { ChartConfig } from "@/components/ui/chart";
import { format, parseISO, isValid } from "date-fns";
import { useDashboardFilters } from "@/contexts/dashboard-filter-provider";

const chartConfig = {
  incidents: {
    label: "Incidentes",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig;

export function IncidentByDayChart() {
  const { data: dashboardData, isLoading, isError } = useDashboardData();
  const { filters } = useDashboardFilters();

  const data = useMemo(() => {
    if (!dashboardData.summaryIncidentsByDate) return [];
    
    return dashboardData.summaryIncidentsByDate
      .filter((row: any) => row.exec_date && typeof row.exec_date === 'string')
      .map((row: any) => {
        try {
          // Si ya está en formato yyyy-MM-dd, usarlo directamente
          let dateStr = row.exec_date;
          if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
            const parsedDate = parseISO(dateStr);
            if (isValid(parsedDate)) {
              return {
                date: format(parsedDate, "dd/MM"),
                incidents: row.incidents ?? 0,
              };
            }
          }
          
          // Intentar parsear como fecha
          const parsedDate = parseISO(dateStr);
          if (isValid(parsedDate)) {
            return {
              date: format(parsedDate, "dd/MM"),
              incidents: row.incidents ?? 0,
            };
          }
          
          console.warn('Invalid date found:', row.exec_date);
          return null;
        } catch (err) {
          console.error('Error parsing date:', row.exec_date, err);
          return null;
        }
      })
      .filter((item: any) => item !== null)
      .sort((a: any, b: any) => a.date.localeCompare(b.date));
  }, [dashboardData.summaryIncidentsByDate]);

  if (isError) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Incidentes por día</CardTitle>
          <CardDescription>Error al cargar los datos</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center text-red-500 py-8">
            Error al cargar los datos de incidentes
          </div>
        </CardContent>
      </Card>
    );
  }

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Incidentes por día</CardTitle>
          <CardDescription>Cargando datos...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center text-muted-foreground py-8">
            Cargando datos de incidentes...
          </div>
        </CardContent>
      </Card>
    );
  }

  if (data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Incidentes por día</CardTitle>
          <CardDescription>No hay datos disponibles</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center text-muted-foreground py-8">
            No hay datos de incidentes para el período seleccionado
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Incidentes por Día</CardTitle>
        <CardDescription>
          Incidentes del {format(new Date(filters.from), "dd/MM/yyyy")} al {format(new Date(filters.to), "dd/MM/yyyy")}
          {filters.channelId && " (filtrado por canal)"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart data={data} margin={{ top: 20 }}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Bar dataKey="incidents" fill="hsl(var(--chart-1))" radius={8}>
              <LabelList
                dataKey="incidents"
                position="top"
                offset={12}
                className="fill-foreground"
                fontSize={12}
              />
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="leading-none text-muted-foreground">
          Mostrando el total de incidentes por día
        </div>
      </CardFooter>
    </Card>
  );
}
