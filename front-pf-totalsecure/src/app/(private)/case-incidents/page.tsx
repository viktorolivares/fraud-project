"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  AlertTriangle, 
  Plus, 
  Calendar, 
  FileText,
  TrendingUp,
  Clock,
  Database,
  Search,
  CalendarDays,
  X
} from "lucide-react";
import { columns } from "./components/columns";
import { DataTable } from "./components/data-table";
import * as caseIncidentApi from "@/api/case-incident.api";
import * as caseApi from "@/api/case.api";
import type { CaseIncident } from "@/types/case-incident";
import type { Case } from "@/types/case";

const CaseIncidents = () => {
  const [incidents, setIncidents] = useState<CaseIncident[]>([]);
  const [cases, setCases] = useState<Case[]>([]);
  const [loading, setLoading] = useState(true);

  // Estados para filtros de fecha
  const getDefaultFromDate = () => {
    const date = new Date();
    date.setDate(date.getDate() - 1); // Último día (ayer)
    return date.toISOString().split('T')[0];
  };

  const getDefaultToDate = () => {
    return new Date().toISOString().split('T')[0];
  };

  const [fromDate, setFromDate] = useState(getDefaultFromDate());
  const [toDate, setToDate] = useState(getDefaultToDate());

  const handleFilter = () => {
    fetchData(fromDate, toDate);
  };

  const handleClearFilters = () => {
    setFromDate(getDefaultFromDate());
    setToDate(getDefaultToDate());
    fetchData(getDefaultFromDate(), getDefaultToDate());
  };

  const fetchData = async (from?: string, to?: string) => {
    try {
      setLoading(true);
      const [incidentsData, casesData] = await Promise.all([
        caseIncidentApi.getAllCaseIncidents(from || fromDate, to || toDate),
        caseApi.getAllCases()
      ]);
      setIncidents(incidentsData);
      setCases(casesData);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const getCaseName = (caseId: number) => {
    const caseItem = cases.find(c => c.id === caseId);
    return caseItem ? caseItem.description : `Caso ${caseId}`;
  };

  const uniqueCases = new Set(incidents.map(i => i.caseId)).size;
  const recentIncidents = incidents.filter(i => {
    // Asumimos que los incidents más recientes son los que tienen ID más alto
    // En un caso real, tendrías un campo de fecha
    return i.id > Math.max(...incidents.map(inc => inc.id)) - 10;
  });

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="flex-1 space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Incidentes de Casos</h1>
          <p className="text-muted-foreground">
            Gestión y seguimiento de incidentes reportados en los casos
          </p>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <AlertTriangle className="h-4 w-4" />
          {incidents.length} incidente(s) en el período
        </div>
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Incidentes</CardTitle>
            <AlertTriangle className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {incidents.length}
            </div>
            <p className="text-xs text-muted-foreground">
              incidentes registrados
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Casos Únicos</CardTitle>
            <FileText className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {uniqueCases}
            </div>
            <p className="text-xs text-muted-foreground">casos con incidentes</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Incidentes Recientes</CardTitle>
            <Clock className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {recentIncidents.length}
            </div>
            <p className="text-xs text-muted-foreground">últimos 10 registros</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Datos Procesados</CardTitle>
            <Database className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">
              {incidents.reduce((acc, inc) => acc + Object.keys(inc.dataJson || {}).length, 0)}
            </div>
            <p className="text-xs text-muted-foreground">campos de datos</p>
          </CardContent>
        </Card>
      </div>

      {/* Métricas adicionales */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Actividad de Incidentes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <span>Incidentes en período seleccionado:</span>
              <Badge variant={incidents.length > 0 ? "destructive" : "secondary"}>
                {incidents.length}
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Distribución de Casos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <span>Promedio de incidentes por caso:</span>
              <Badge variant="outline">
                {uniqueCases > 0
                  ? (incidents.length / uniqueCases).toFixed(1)
                  : 0}
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filtros */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CalendarDays className="w-5 h-5" />
            Filtros de Fecha
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 items-end">
            <div className="space-y-2">
              <Label htmlFor="fromDate">Fecha Desde</Label>
              <Input
                id="fromDate"
                type="date"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
                placeholder="YYYY-MM-DD"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="toDate">Fecha Hasta</Label>
              <Input
                id="toDate"
                type="date"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
                placeholder="YYYY-MM-DD"
              />
            </div>
            <div className="flex gap-2">
              <Button onClick={handleFilter} disabled={loading}>
                <Search className="w-4 h-4 mr-2" />
                Filtrar
              </Button>
              <Button
                variant="outline"
                onClick={handleClearFilters}
                disabled={loading}
              >
                <X className="w-4 h-4 mr-2" />
                Último día
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabla de Incidentes */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Lista de Incidentes
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center h-32">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : incidents.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-32 text-muted-foreground">
              <AlertTriangle className="h-8 w-8 mb-2" />
              <span>No hay incidentes registrados</span>
            </div>
          ) : (
            <DataTable columns={columns} data={incidents} />
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default CaseIncidents;
