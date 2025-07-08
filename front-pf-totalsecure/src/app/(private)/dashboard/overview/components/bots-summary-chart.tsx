/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

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
import {
  BarChart,
  Bar,
  XAxis,
  CartesianGrid,
  LabelList,
} from "recharts";
import { TrendingUp } from "lucide-react";
import type { ChartConfig } from "@/components/ui/chart";

const chartConfig = {
  case_count: {
    label: "Casos",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig;

export function BotsSummaryChart() {
  const { data, isLoading, isError } = useDashboardData();

  const chartData = useMemo(() => {
    if (!data.summaryBotCases || data.summaryBotCases.length === 0) {
      return [];
    }

    return data.summaryBotCases.map((bot) => ({
      bot_name: bot.bot_name,
      case_count: bot.case_count,
    }));
  }, [data.summaryBotCases]);

  if (isError) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Resumen de bots</CardTitle>
          <CardDescription>Casos por bot</CardDescription>
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
          <CardTitle>Resumen de bots</CardTitle>
          <CardDescription>Casos por bot</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[400px] flex items-center justify-center">
            <div className="text-muted-foreground">Cargando...</div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (chartData.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Resumen de bots</CardTitle>
          <CardDescription>Casos por bot</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[400px] flex items-center justify-center">
            <div className="text-muted-foreground">No hay datos disponibles para el período seleccionado</div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Resumen de bots</CardTitle>
        <CardDescription>
          Casos procesados por cada bot
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart
            accessibilityLayer
            data={chartData}
            layout="horizontal"
            margin={{
              left: 0,
            }}
          >
            <CartesianGrid horizontal={false} />
            <XAxis type="number" dataKey="case_count" hide />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="line" />}
            />
            <Bar dataKey="case_count" layout="horizontal" radius={5}>
              <LabelList
                dataKey="bot_name"
                position="insideLeft"
                offset={8}
                className="fill-[--color-label]"
                fontSize={12}
              />
              <LabelList
                dataKey="case_count"
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
          Total de casos procesados por los bots <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">
          Mostrando el número de casos manejados por cada bot
        </div>
      </CardFooter>
    </Card>
  );
}
