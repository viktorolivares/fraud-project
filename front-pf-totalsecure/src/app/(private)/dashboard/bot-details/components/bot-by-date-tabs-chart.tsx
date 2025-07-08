"use client";

import { useEffect, useState, useMemo } from "react";
import { BarChart, Bar, CartesianGrid, XAxis, LabelList } from "recharts";
import {
  getSummaryBotCasesByDate,
  getSummaryBotIncidentsByDate,
} from "@/api/dashboard.api";
import { parseISO, format, subDays } from "date-fns";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import type { ChartConfig } from "@/components/ui/chart";

// Tipos para las filas que vienen del API
interface SummaryBotCasesByDateRow {
  bot_id: number;
  bot_name: string;
  case_date: string;
  case_count: number;
}
interface SummaryBotIncidentByDateRow {
  bot_id: number;
  bot_name: string;
  exec_date: string;
  incidents: number;
}

// Tipo final para nuestra tabla de datos
type DataRow = { date: string } & Record<string, number>;

// Colores reutilizables para cada bot
const COLORS = [
  "hsl(var(--chart-1))",
  "hsl(var(--chart-2))",
  "hsl(var(--chart-3))",
  "hsl(var(--chart-4))",
  "hsl(var(--chart-5))",
];

// Hook genérico para cargar y transformar datos de bots
function useBotChart<T extends { bot_name: string }>(
  fetcher: (start: string, end: string) => Promise<T[]>,
  dateField: keyof T,
  valueField: keyof T
) {
  const [botNames, setBotNames] = useState<string[]>([]);
  const [activeBot, setActiveBot] = useState<string>("");
  const [data, setData] = useState<DataRow[]>([]);

  useEffect(() => {
    const today = new Date();
    const end = format(today, "yyyy-MM-dd");
    const start = format(subDays(today, 6), "yyyy-MM-dd");

    fetcher(start, end)
      .then((rows) => {
        const names = Array.from(new Set(rows.map((r) => r.bot_name)));
        setBotNames(names);
        if (names.length) setActiveBot(names[0]);

        // Agrupamos por fecha y bot
        const grouped: Record<string, Record<string, number>> = {};
        rows.forEach((r) => {
          const d = format(parseISO(String(r[dateField])), "yyyy-MM-dd");
          grouped[d] ??= {};
          grouped[d][r.bot_name] =
            (grouped[d][r.bot_name] || 0) + Number(r[valueField]);
        });

        // Mapeamos a array y ordenamos
        const mapped = Object.entries(grouped)
          .map(([date, counts]) => ({ date, ...counts }))
          .sort(
            (a, b) => parseISO(a.date).getTime() - parseISO(b.date).getTime()
          );

        // Convertimos a DataRow
        setData(mapped as DataRow[]);
      });
  }, [fetcher, dateField, valueField]);

  // Configuración de colores y etiquetas
  const config: ChartConfig = useMemo(() => {
    return botNames.reduce((cfg, bot, i) => {
      cfg[bot] = { label: bot, color: COLORS[i % COLORS.length] };
      return cfg;
    }, {} as ChartConfig);
  }, [botNames]);

  // Totales por bot para los botones
  const totals = useMemo(() => {
    return botNames.reduce((acc, bot) => {
      acc[bot] = data.reduce((sum, row) => sum + (row[bot] || 0), 0);
      return acc;
    }, {} as Record<string, number>);
  }, [botNames, data]);

  return { botNames, activeBot, setActiveBot, data, config, totals };
}

// Componente de pestaña genérico
function BotChartTab<T extends { bot_name: string }>(props: {
  fetcher: (start: string, end: string) => Promise<T[]>;
  dateField: keyof T;
  valueField: keyof T;
  label: string;
}) {
  const { botNames, activeBot, setActiveBot, data, config, totals } =
    useBotChart(props.fetcher, props.dateField, props.valueField);

  return (
    <>
      <div className="flex gap-2 overflow-x-auto pb-2">
        {botNames.map((bot) => (
          <button
            key={bot}
            data-active={activeBot === bot}
            onClick={() => setActiveBot(bot)}
            className="data-[active=true]:bg-muted/50 relative rounded-2xl z-30 flex flex-1 flex-col justify-center border px-3 py-3 text-left"
          >
            <span className="text-muted-foreground text-xs">
               {bot}
            </span>
            <span className="text-lg leading-none font-bold sm:text-2xl">
              {totals[bot].toLocaleString()}
            </span>
          </button>
        ))}
      </div>

      <ChartContainer config={config} className="h-48 w-full">
        <BarChart
          data={data}
          margin={{ top: 16, left: 8, right: 8, bottom: 4 }}
        >
          <CartesianGrid vertical={false} strokeDasharray="3 3" />
          <XAxis
            dataKey="date"
            axisLine={false}
            tickLine={false}
            tickFormatter={(d) => format(parseISO(d), "dd/MM")}
          />
          <ChartTooltip content={<ChartTooltipContent hideLabel />} />
          <Bar
            dataKey={activeBot}
            fill={config[activeBot]?.color}
            radius={[4, 4, 0, 0]}
          >
            <LabelList
              position="top"
              offset={4}
              className="fill-foreground"
              fontSize={12}
            />
          </Bar>
        </BarChart>
      </ChartContainer>

      <div className="text-xs text-muted-foreground mt-2">
        Visualizando {props.label.toLowerCase()} del bot “{activeBot}”
      </div>
    </>
  );
}

// Componente principal con Tabs
export function BotByDateTabsChart() {
  return (
    <Card className="space-y-4">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="font-bold">Actividad de Bots (Últimos 7 días)</h1>
            <p className="text-gray-400 text-xs">Casos e incidentes por día</p>
          </div>
        </div>

        <Tabs defaultValue="cases" className="space-y-2">
          <TabsList className="grid grid-cols-2 gap-4">
            <TabsTrigger value="cases">Casos</TabsTrigger>
            <TabsTrigger value="incidents">Incidentes</TabsTrigger>
          </TabsList>

          <TabsContent value="cases">
            <BotChartTab<SummaryBotCasesByDateRow>
              fetcher={getSummaryBotCasesByDate}
              dateField="case_date"
              valueField="case_count"
              label="Casos"
            />
          </TabsContent>

          <TabsContent value="incidents">
            <BotChartTab<SummaryBotIncidentByDateRow>
              fetcher={getSummaryBotIncidentsByDate}
              dateField="exec_date"
              valueField="incidents"
              label="Incidentes"
            />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
