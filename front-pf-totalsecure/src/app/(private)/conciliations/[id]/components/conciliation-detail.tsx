"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  FileSpreadsheet,
  Calendar,
  User,
  Coins,
  TrendingUp,
  TrendingDown,
  Minus,
  Building
} from "lucide-react";
import type { Conciliation } from "@/types/conciliation";
import type { Collector } from "@/types/collector";
import { format } from "date-fns";

interface ConciliationDetailProps {
  conciliation: Conciliation;
  collector?: Collector;
}

export const ConciliationDetail = ({ conciliation, collector }: ConciliationDetailProps) => {
  const getDifferenceIcon = () => {
    const difference = conciliation.differenceAmounts;
    if (difference > 0) return <TrendingUp className="h-4 w-4 text-green-500" />;
    if (difference < 0) return <TrendingDown className="h-4 w-4 text-red-500" />;
    return <Minus className="h-4 w-4 text-gray-500" />;
  };

  const getDifferenceColor = () => {
    const difference = conciliation.differenceAmounts;
    if (difference > 0) return 'text-green-600 dark:text-green-400';
    if (difference < 0) return 'text-red-600 dark:text-red-400';
    return 'text-gray-600 dark:text-gray-400';
  };

  const formatCurrency = (amount: number) => {
    return amount.toLocaleString('es-PE', { 
      style: 'currency', 
      currency: 'PEN',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2 
    });
  };

  return (
    <div className="space-y-6">
      {/* Header con información básica */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <FileSpreadsheet className="h-6 w-6" />
              Conciliación #{conciliation.id}
            </CardTitle>
            <Badge variant={conciliation.conciliationState ? "default" : "secondary"} className="text-sm">
              {conciliation.conciliationState ? "Conciliado" : "Pendiente"}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Información básica */}
            <div className="space-y-3">
              <h3 className="font-semibold text-sm text-muted-foreground">INFORMACIÓN BÁSICA</h3>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">Período: <strong>{conciliation.period}</strong></span>
                </div>
                {collector && (
                  <div className="flex items-center gap-2">
                    <Building className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">Collector: <strong>{collector.name}</strong></span>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">Tipo: <strong>{conciliation.conciliationType}</strong></span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">
                    Creado: <strong>{format(new Date(conciliation.createdAt), "dd/MM/yyyy HH:mm")}</strong>
                  </span>
                </div>
                {conciliation.createdBy && (
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">Por: <strong>Usuario {conciliation.createdBy}</strong></span>
                  </div>
                )}
              </div>
            </div>

            {/* Montos */}
            <div className="space-y-3">
              <h3 className="font-semibold text-sm text-muted-foreground">MONTOS</h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-950 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Coins className="h-4 w-4 text-blue-600" />
                    <span className="text-sm text-blue-700 dark:text-blue-300">Monto</span>
                  </div>
                  <span className="font-mono font-semibold text-blue-700 dark:text-blue-300">
                    {formatCurrency(conciliation.amount)}
                  </span>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-950 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Coins className="h-4 w-4 text-green-600" />
                    <span className="text-sm text-green-700 dark:text-green-300">Monto Recaudador</span>
                  </div>
                  <span className="font-mono font-semibold text-green-700 dark:text-green-300">
                    {formatCurrency(conciliation.amountCollector)}
                  </span>
                </div>
              </div>
            </div>

            {/* Diferencia */}
            <div className="space-y-3">
              <h3 className="font-semibold text-sm text-muted-foreground">ANÁLISIS</h3>
              <div className="space-y-2">
                <div className={`flex items-center justify-between p-4 rounded-lg border-2 ${
                  conciliation.differenceAmounts === 0 
                    ? 'bg-gray-50 dark:bg-gray-950 border-gray-200 dark:border-gray-800' 
                    : conciliation.differenceAmounts > 0 
                      ? 'bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800' 
                      : 'bg-red-50 dark:bg-red-950 border-red-200 dark:border-red-800'
                }`}>
                  <div className="flex items-center gap-2">
                    {getDifferenceIcon()}
                    <span className="text-sm font-medium">Diferencia</span>
                  </div>
                  <span className={`font-mono font-bold text-lg ${getDifferenceColor()}`}>
                    {formatCurrency(conciliation.differenceAmounts)}
                  </span>
                </div>
                
                <div className="text-xs text-muted-foreground p-2 rounded">
                  {conciliation.differenceAmounts === 0 && "✅ Los montos coinciden exactamente"}
                  {conciliation.differenceAmounts > 0 && "📈 El medio de recaudación reporta un monto mayor"}
                  {conciliation.differenceAmounts < 0 && "📉 El medio de recaudación reporta un monto menor"}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Métricas adicionales */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Porcentaje de Diferencia</CardTitle>
            {getDifferenceIcon()}
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${getDifferenceColor()}`}>
              {conciliation.amount > 0 
                ? ((conciliation.differenceAmounts / conciliation.amount) * 100).toFixed(2)
                : 0
              }%
            </div>
            <p className="text-xs text-muted-foreground">
              Sobre el monto base
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Estado de Conciliación</CardTitle>
            <div className={`h-3 w-3 rounded-full ${
              conciliation.conciliationState ? 'bg-green-500' : 'bg-yellow-500'
            }`} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {conciliation.conciliationState ? 'OK' : 'PEND'}
            </div>
            <p className="text-xs text-muted-foreground">
              {conciliation.conciliationState ? 'Proceso completado' : 'Requiere revisión'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tipo de Conciliación</CardTitle>
            <FileSpreadsheet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              Tipo {conciliation.conciliationType}
            </div>
            <p className="text-xs text-muted-foreground">
              Clasificación del proceso
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
