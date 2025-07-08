"use client";

import { useDashboardData } from "@/hooks/use-dashboard-data";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AlertTriangle, Cpu, FileText, Activity } from "lucide-react";

export default function ProfessionalDashboard() {
  const { data, isLoading, isError } = useDashboardData();

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Cargando...</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">--</div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-red-500">Error</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-red-600">Error al cargar datos</div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Calculate summary metrics from available data
  const totalCases = data.summaryBotCases?.reduce((sum, bot) => sum + (bot.case_count || 0), 0) || 0;
  const totalIncidents = data.summaryBotIncidents?.reduce((sum, bot) => sum + (bot.incidents || 0), 0) || 0;
  const totalBots = data.summaryBotCases?.length || 0;
  const totalStates = data.casesByState?.length || 0;

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Cases</CardTitle>
          <FileText className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalCases.toLocaleString()}</div>
          <p className="text-xs text-muted-foreground">
            Casos procesados
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Incidents</CardTitle>
          <AlertTriangle className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalIncidents.toLocaleString()}</div>
          <p className="text-xs text-muted-foreground">
            Incidentes detectados
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Active Bots</CardTitle>
          <Cpu className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalBots}</div>
          <p className="text-xs text-muted-foreground">
            Bots activos
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">States</CardTitle>
          <Activity className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalStates}</div>
          <p className="text-xs text-muted-foreground">
            Estados diferentes
          </p>
        </CardContent>
      </Card>
    </div>
  );
}