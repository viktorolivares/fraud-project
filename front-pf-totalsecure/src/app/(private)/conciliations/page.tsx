"use client";

import { useEffect, useState } from "react";
import { useConciliationColumns } from "./components/columns";
import { DataTable } from "./components/data-table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Filter, X, FileSpreadsheet, Users } from "lucide-react";
import * as conciliationApi from "@/api/conciliation.api";
import * as collectorApi from "@/api/collector.api";
import type { Conciliation } from "@/types/conciliation";
import type { Collector } from "@/types/collector";

const Conciliations = () => {
  const [conciliations, setConciliations] = useState<Conciliation[]>([]);
  const [collectors, setCollectors] = useState<Collector[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingCollectors, setLoadingCollectors] = useState(true);
  
  // Filtros
  const [selectedCollector, setSelectedCollector] = useState<string>("all");
  const [selectedState, setSelectedState] = useState<string>("all");
  const [periodFilter, setPeriodFilter] = useState<string>("");
  
  const columns = useConciliationColumns();

  const fetchConciliations = async () => {
    try {
      setLoading(true);
      
      // Primero obtenemos todas las conciliaciones
      const response = await conciliationApi.getAllConciliations();
      
      // Aplicamos filtros en el cliente si es necesario
      let filteredConciliations = response;
      
      // Filtro por collector
      if (selectedCollector && selectedCollector !== "all") {
        const collectorId = parseInt(selectedCollector);
        filteredConciliations = filteredConciliations.filter(c => c.collector?.id === collectorId);
      }
      
      // Filtro por estado
      if (selectedState !== "all" && selectedState !== "") {
        const state = selectedState === "true";
        filteredConciliations = filteredConciliations.filter(c => c.conciliationState === state);
      }
      
      // Filtro por período
      if (periodFilter && periodFilter.trim() !== "") {
        filteredConciliations = filteredConciliations.filter(c => 
          c.period && c.period.toLowerCase().includes(periodFilter.toLowerCase().trim())
        );
      }
      
      setConciliations(filteredConciliations);
    } catch (error) {
      console.error("Error fetching conciliations:", error);
      setConciliations([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchCollectors = async () => {
    try {
      setLoadingCollectors(true);
      const response = await collectorApi.getAllCollectors();
      setCollectors(response);
    } catch (error) {
      console.error("Error fetching collectors:", error);
      setCollectors([]);
    } finally {
      setLoadingCollectors(false);
    }
  };

  const handleClearFilters = () => {
    setSelectedCollector("all");
    setSelectedState("all");
    setPeriodFilter("");
    // Recargar todas las conciliaciones
    setTimeout(() => {
      fetchConciliations();
    }, 100);
  };

  useEffect(() => {
    fetchCollectors();
  }, []);

  useEffect(() => {
    fetchConciliations();
  }, [selectedCollector, selectedState, periodFilter]);

  return (
    <div className="flex-1 space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Conciliaciones</h1>
          <p className="text-muted-foreground">
            Gestión y seguimiento de conciliaciones por medio de recaudación
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <FileSpreadsheet className="h-5 w-5" />
          <span className="text-sm text-muted-foreground">
            {conciliations.length} conciliación(es)
          </span>
        </div>
      </div>

      {/* Filtros */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filtros
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label htmlFor="collector">Medio de Recaudación</Label>
              <Select
                value={selectedCollector}
                onValueChange={setSelectedCollector}
                disabled={loadingCollectors}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar medio de recaudación" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los medios de recaudación</SelectItem>
                  {collectors.map((collector) => (
                    <SelectItem key={collector.id} value={collector.id.toString()}>
                      {collector.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="state">Estado</Label>
              <Select value={selectedState} onValueChange={setSelectedState}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los estados</SelectItem>
                  <SelectItem value="true">Conciliado</SelectItem>
                  <SelectItem value="false">Pendiente</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="period">Período</Label>
              <Input
                id="period"
                value={periodFilter}
                onChange={(e) => setPeriodFilter(e.target.value)}
                placeholder="Buscar por período (ej: 2024-01, 2024)"
              />
            </div>
            
            <div className="flex items-end space-x-2">
              <Button
                variant="outline"
                onClick={handleClearFilters}
                className="flex-1"
              >
                <X className="h-4 w-4 mr-2" />
                Limpiar Filtros
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Resumen por Collectors */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Conciliaciones</CardTitle>
            <FileSpreadsheet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{conciliations.length}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Conciliadas</CardTitle>
            <div className="h-4 w-4 rounded-full bg-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {conciliations.filter(c => c.conciliationState).length}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pendientes</CardTitle>
            <div className="h-4 w-4 rounded-full bg-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {conciliations.filter(c => !c.conciliationState).length}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Collectors Activos</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {new Set(conciliations.map(c => c.collectorId)).size}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabla de conciliaciones */}
      <Card>
        <CardHeader>
          <CardTitle>Lista de Conciliaciones</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center h-32">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : (
            <DataTable columns={columns} data={conciliations} />
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Conciliations;
