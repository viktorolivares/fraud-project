"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Building, Plus, Users } from "lucide-react";
import * as collectorApi from "@/api/collector.api";
import * as conciliationApi from "@/api/conciliation.api";
import type { Collector } from "@/types/collector";
import type { Conciliation } from "@/types/conciliation";
import { format } from "date-fns";

const Collectors = () => {
  const [collectors, setCollectors] = useState<Collector[]>([]);
  const [conciliations, setConciliations] = useState<Conciliation[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [collectorsData, conciliationsData] = await Promise.all([
        collectorApi.getAllCollectors(),
        conciliationApi.getAllConciliations()
      ]);
      setCollectors(collectorsData);
      setConciliations(conciliationsData);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const getConciliationsForCollector = (collectorId: number) => {
    return conciliations.filter(c => c.collectorId === collectorId);
  };

  const getConciliatedCount = (collectorId: number) => {
    return conciliations.filter(c => c.collectorId === collectorId && c.conciliationState).length;
  };

  const getPendingCount = (collectorId: number) => {
    return conciliations.filter(c => c.collectorId === collectorId && !c.conciliationState).length;
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="flex-1 space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Medios de Recaudación</h1>
          <p className="text-muted-foreground">
            Gestión de medios de recaudación y resumen de conciliaciones
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Nuevo Medio de Recaudación
          </Button>
        </div>
      </div>

      {/* Estadísticas generales */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Medios de Recaudación</CardTitle>
            <Building className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{collectors.length}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Medios de Recaudación Activos</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {new Set(conciliations.map(c => c.collectorId)).size}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Conciliaciones</CardTitle>
            <div className="h-4 w-4 rounded-full bg-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{conciliations.length}</div>
          </CardContent>
        </Card>
      </div>

      {/* Lista de Collectors */}
      <Card>
        <CardHeader>
          <CardTitle>Lista de Medios de Recaudación</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center h-32">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : collectors.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-32 text-muted-foreground">
              <Building className="h-8 w-8 mb-2" />
              <span>No hay collectors registrados</span>
            </div>
          ) : (
            <div className="grid gap-4">
              {collectors.map((collector) => {
                const collectorConciliations = getConciliationsForCollector(collector.id);
                const conciliatedCount = getConciliatedCount(collector.id);
                const pendingCount = getPendingCount(collector.id);
                
                return (
                  <div
                    key={collector.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex items-center justify-center w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg">
                        <Building className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div className="space-y-1">
                        <h3 className="font-semibold">{collector.name}</h3>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span>ID: {collector.id}</span>
                          <span>Creado: {format(new Date(collector.createdAt), "dd/MM/yyyy")}</span>
                          {collector.createdBy && <span>Por: Usuario {collector.createdBy}</span>}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-6">
                      <div className="text-center">
                        <div className="text-lg font-bold text-blue-600">
                          {collectorConciliations.length}
                        </div>
                        <div className="text-xs text-muted-foreground">Total</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-bold text-green-600">
                          {conciliatedCount}
                        </div>
                        <div className="text-xs text-muted-foreground">Conciliadas</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-bold text-yellow-600">
                          {pendingCount}
                        </div>
                        <div className="text-xs text-muted-foreground">Pendientes</div>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => window.location.href = `/conciliations?collector=${collector.id}`}
                      >
                        Ver Conciliaciones
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Collectors;
