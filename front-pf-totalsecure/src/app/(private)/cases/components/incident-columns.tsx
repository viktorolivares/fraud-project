"use client";

import { type ColumnDef, type Column } from "@tanstack/react-table";
import { DataTableHeader } from "@/shared/datatable/header";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, AlertCircle, CreditCard, Globe, Lock } from "lucide-react";
import type { CaseIncident } from "@/types/case";
import { useMemo } from "react";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";

// Función para obtener el tipo de incidente desde los datos JSON
const getIncidentType = (incident: CaseIncident): string => {
  if (
    incident.dataJson && 
    typeof incident.dataJson === 'object' && 
    'type' in incident.dataJson && 
    typeof incident.dataJson.type === 'string'
  ) {
    return incident.dataJson.type;
  }
  return 'unknown';
};

// Función para obtener el puntaje de riesgo desde los datos JSON
const getRiskScore = (incident: CaseIncident): number | null => {
  if (
    incident.dataJson && 
    typeof incident.dataJson === 'object' && 
    'risk_score' in incident.dataJson && 
    incident.dataJson.risk_score
  ) {
    const score = Number(incident.dataJson.risk_score);
    return !isNaN(score) ? score : null;
  }
  return null;
};

// Formatea el puntaje de riesgo con un color adecuado
const formatRiskScore = (score: number | null) => {
  if (score === null) return "--";
  
  if (score >= 90) {
    return <Badge variant="destructive" className="bg-red-600 dark:bg-red-700 text-white font-bold shadow-sm">🔴 {score}%</Badge>;
  } else if (score >= 80) {
    return <Badge variant="destructive" className="bg-red-500 dark:bg-red-600 text-white">🟠 {score}%</Badge>;
  } else if (score >= 60) {
    return <Badge variant="outline" className="border-orange-500 text-orange-700 dark:text-orange-400 bg-orange-50 dark:bg-orange-950">🟡 {score}%</Badge>;
  } else {
    return <Badge variant="secondary" className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-300">🟢 {score}%</Badge>;
  }
};

// Devuelve un ícono según el tipo de incidente
const getIncidentIcon = (type: string) => {
  switch (type) {
    case 'login_anomaly':
      return <Lock className="h-4 w-4 text-red-500 dark:text-red-400" />;
    case 'transaction_anomaly':
      return <CreditCard className="h-4 w-4 text-orange-500 dark:text-orange-400" />;
    case 'geolocation_anomaly':
      return <Globe className="h-4 w-4 text-purple-500 dark:text-purple-400" />;
    default:
      return <AlertCircle className="h-4 w-4 text-gray-500 dark:text-gray-400" />;
  }
};

// Función para renderizar los detalles JSON del incidente
const renderIncidentDetails = (incident: CaseIncident) => {
  return (
    <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded-lg">
      <pre className="text-xs text-gray-700 dark:text-gray-300 whitespace-pre-wrap overflow-x-auto max-h-64 overflow-y-auto">
        {JSON.stringify(incident.dataJson, null, 2)}
      </pre>
    </div>
  );
};

export function useIncidentColumns(): ColumnDef<CaseIncident, unknown>[] {
  return useMemo(
    () => [
      {
        accessorKey: "id",
        header: ({ column }: { column: Column<CaseIncident, unknown> }) => (
          <DataTableHeader column={column} title="ID" />
        ),
        cell: ({ row }) => <span>#{row.original.id}</span>,
      },
      {
        accessorKey: "type",
        header: ({ column }: { column: Column<CaseIncident, unknown> }) => (
          <DataTableHeader column={column} title="Tipo" />
        ),
        cell: ({ row }) => {
          const incident = row.original;
          const type = getIncidentType(incident);
          
          return (
            <div className="flex items-center gap-2">
              {getIncidentIcon(type)}
              <span className="capitalize">
                {type === 'login_anomaly' ? 'Anomalía de login' : 
                 type === 'transaction_anomaly' ? 'Anomalía en transacción' :
                 type === 'geolocation_anomaly' ? 'Anomalía de geolocalización' :
                 type === 'unknown' ? 'No especificado' : type}
              </span>
            </div>
          );
        },
        filterFn: (row, id, value) => {
          return getIncidentType(row.original).includes(value);
        },
      },
      {
        accessorKey: "client",
        header: ({ column }: { column: Column<CaseIncident, unknown> }) => (
          <DataTableHeader column={column} title="Cliente" />
        ),
        cell: ({ row }) => {
          const incident = row.original;
          if (!incident.client) {
            return <span className="text-gray-500">Sin cliente asociado</span>;
          }
          
          return (
            <HoverCard>
              <HoverCardTrigger className="cursor-pointer underline text-primary">
                {incident.client.firstName} {incident.client.lastName}
              </HoverCardTrigger>
              <HoverCardContent className="w-80">
                <div className="space-y-2">
                  <h4 className="font-semibold">{incident.client.firstName} {incident.client.lastName}</h4>
                  <p className="text-sm"><span className="font-medium">Identificación:</span> {incident.client.nationalIdType}: {incident.client.nationalId}</p>
                  {incident.client.email && <p className="text-sm"><span className="font-medium">Email:</span> {incident.client.email}</p>}
                </div>
              </HoverCardContent>
            </HoverCard>
          );
        },
      },
      {
        accessorKey: "channel",
        header: ({ column }: { column: Column<CaseIncident, unknown> }) => (
          <DataTableHeader column={column} title="Canal" />
        ),
        cell: ({ row }) => {
          const incident = row.original;
          if (!incident.channel) {
            return <span className="text-gray-500">--</span>;
          }
          
          return <span>{incident.channel.name}</span>;
        },
      },
      {
        accessorKey: "risk_score",
        header: ({ column }: { column: Column<CaseIncident, unknown> }) => (
          <DataTableHeader column={column} title="Riesgo" />
        ),
        cell: ({ row }) => {
          const incident = row.original;
          const score = getRiskScore(incident);
          
          return formatRiskScore(score);
        },
      },
      {
        accessorKey: "dataJson",
        header: ({ column }: { column: Column<CaseIncident, unknown> }) => (
          <DataTableHeader column={column} title="Detalles" />
        ),
        cell: ({ row }) => {
          const incident = row.original;
          
          return (
            <HoverCard>
              <HoverCardTrigger className="cursor-pointer underline text-primary">
                Ver datos
              </HoverCardTrigger>
              <HoverCardContent className="w-96">
                {renderIncidentDetails(incident)}
              </HoverCardContent>
            </HoverCard>
          );
        },
      },
    ],
    []
  );
}
