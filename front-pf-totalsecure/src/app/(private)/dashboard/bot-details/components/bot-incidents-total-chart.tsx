"use client";

import { useEffect, useState } from "react";
import { getSummaryBotIncidents } from "@/api/dashboard.api";
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
import { Bar, BarChart, CartesianGrid, Cell, LabelList, XAxis } from "recharts";
import { format, subDays } from "date-fns";

export function BotIncidentsTotalChart() {
  const [data, setData] = useState<{ bot: string; incidents: number }[]>([]);

  useEffect(() => {
    const today = new Date();
    const endDate = format(today, "yyyy-MM-dd");
    const startDate = format(subDays(today, 6), "yyyy-MM-dd");
    getSummaryBotIncidents(startDate, endDate).then((apiData: unknown) => {
      const arr = (apiData ?? []) as Array<{
        bot_id: number;
        bot_name: string;
        incidents: number;
      }>;
      const adapted = arr.map((row) => ({
        bot: row.bot_name,
        incidents: Number(row.incidents ?? 0),
      }));
      setData(adapted);
    });
  }, []);

  const chartConfig: ChartConfig = {
    incidents: {
      label: "Incidentes",
      color: "hsl(var(--chart-2))",
    },
  };

  // Colores reutilizables para cada bot
  const COLORS = [
    "hsl(var(--chart-1))",
    "hsl(var(--chart-2))",
    "hsl(var(--chart-3))",
    "hsl(var(--chart-4))",
    "hsl(var(--chart-5))",
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Incidentes totales por Bot</CardTitle>
        <CardDescription>
          Totales de incidentes por bot (últimos 7 días)
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-48 w-full">
          <BarChart data={data} margin={{ top: 20 }} width={480} height={320}>
            <CartesianGrid vertical={false} />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Bar dataKey="incidents" radius={8} isAnimationActive={false}>
              {data.map((entry, idx) => (
                <Cell key={entry.bot} fill={COLORS[idx % COLORS.length]} />
              ))}
              <LabelList
                position="top"
                offset={4}
                className="fill-foreground"
                fontSize={10}
              />
            </Bar>
          </BarChart>
        </ChartContainer>
        <div className="flex flex-row flex-wrap gap-4 mt-4 justify-center">
          {data.map((entry, idx) => (
            <div
              key={entry.bot}
              className="flex items-center gap-2 bg-muted/40 rounded px-2 py-1"
            >
              <span
                className="inline-block w-3 h-3 rounded-full"
                style={{ background: COLORS[idx % COLORS.length] }}
              />
              <span className="text-[10px] font-medium min-w-[48px]">
                {entry.bot}
              </span>
              <span className="text-[10px] font-bold">[{entry.incidents}]</span>
            </div>
          ))}
        </div>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="leading-none text-muted-foreground">
          Mostrando el total de incidentes por bot
        </div>
      </CardFooter>
    </Card>
  );
}
