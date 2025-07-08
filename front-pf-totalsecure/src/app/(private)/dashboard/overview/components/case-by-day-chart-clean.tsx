"use client"

import { format, parseISO, isValid } from "date-fns";
import { useMemo } from "react"
import { Bar, BarChart, CartesianGrid, LabelList, XAxis, YAxis } from "recharts"
import { useDashboardData } from "@/hooks/use-dashboard-data";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import type { ChartConfig } from "@/components/ui/chart";

const chartConfig = {
  cases: {
    label: "Casos",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig;

export function CaseByDayChart() {
  const { data: dashboardData, isLoading, isError } = useDashboardData();

  const chartData = useMemo(() => {
    if (!dashboardData.summaryCasesByDate) return [];
    
    return dashboardData.summaryCasesByDate
      .filter((row: any) => row.capture_date && typeof row.capture_date === 'string')
      .map((row: any) => {
        try {
          // Si ya está en formato yyyy-MM-dd, usarlo directamente
          const dateStr = row.capture_date;
          if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
            const parsedDate = parseISO(dateStr);
            if (isValid(parsedDate)) {
              return {
                fecha: format(parsedDate, "dd/MM"),
                cases: row.case_count ?? 0,
              };
            }
          }
          
          // Intentar parsear otros formatos
          const dateObj = new Date(dateStr);
          if (!isNaN(dateObj.getTime())) {
            return {
              fecha: format(dateObj, "dd/MM"),
              cases: row.case_count ?? 0,
            };
          }
          
          console.warn('Invalid date found:', row.capture_date);
          return null;
        } catch (err) {
          console.error('Error parsing date:', row.capture_date, err);
          return null;
        }
      })
      .filter((item: any) => item !== null)
      .sort((a: any, b: any) => a.fecha.localeCompare(b.fecha));
  }, [dashboardData.summaryCasesByDate]);

  if (isError) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Casos por día</CardTitle>
          <CardDescription>Error al cargar los datos</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center text-red-500 py-8">
            Error al cargar los datos de casos
          </div>
        </CardContent>
      </Card>
    );
  }

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Casos por día</CardTitle>
          <CardDescription>Cargando datos...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center text-muted-foreground py-8">
            Cargando datos de casos...
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Casos por día</CardTitle>
        <CardDescription>
          Distribución de casos por día
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart
            data={chartData}
            margin={{ right: 16 }}
            layout="vertical"
          >
            <CartesianGrid horizontal={false} />
            <YAxis
              dataKey="fecha"
              type="category"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <XAxis dataKey="cases" type="number" hide />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="line" />}
            />
            <Bar dataKey="cases" fill="var(--color-cases)" radius={4}>
              <LabelList
                dataKey="cases"
                position="right"
                offset={8}
                className="fill-foreground"
                fontSize={12}
              />
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 font-medium leading-none">
          Total de casos en el período seleccionado
        </div>
        <div className="leading-none text-muted-foreground">
          Casos registrados por día
        </div>
      </CardFooter>
    </Card>
  )
}
