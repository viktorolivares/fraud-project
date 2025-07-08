"use client";

import { useEffect, useState, useCallback } from "react";
import { useCaseColumns } from "./components/columns";
import { DataTable } from "./components/data-table";
import { AssignAnalystModal } from "./components/assign-analyst-modal";
import { BulkAssignAnalystModal } from "./components/bulk-assign-analyst-modal";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  CalendarDays,
  Search,
  X,
  FileText,
  AlertTriangle,
  CheckCircle,
  Clock,
  Users,
  TrendingUp,
  UserPlus,
} from "lucide-react";
import * as caseApi from "@/api/case.api";
import * as userApi from "@/api/user.api";
import * as caseAssignmentApi from "@/api/case-assignment.api";
import * as caseStateApi from "@/api/case-state.api";
import type { Case } from "@/types/case";
import type { User } from "@/types/user";
import type { CaseState } from "@/types/case-state";
import { format } from "date-fns";

const Cases = () => {
  const [cases, setCases] = useState<Case[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [caseStates, setCaseStates] = useState<CaseState[]>([]);
  const [selectedCase, setSelectedCase] = useState<Case | null>(null);
  const [showAssignModal, setShowAssignModal] = useState(false);
  
  // Estados para asignación masiva
  const [selectedCases, setSelectedCases] = useState<Case[]>([]);
  const [showBulkAssignModal, setShowBulkAssignModal] = useState(false);

  // Calcular fecha por defecto: hace 7 días
  const getDefaultFromDate = () => {
    const date = new Date();
    date.setDate(date.getDate() - 7);
    return date.toISOString().split("T")[0]; // Formato YYYY-MM-DD
  };

  const getDefaultToDate = () => {
    const date = new Date();
    return date.toISOString().split("T")[0]; // Formato YYYY-MM-DD
  };

  const [fromDate, setFromDate] = useState<string>(getDefaultFromDate());
  const [toDate, setToDate] = useState<string>(getDefaultToDate());

  const handleAssignAnalyst = (caseData: Case) => {
    setSelectedCase(caseData);
    setShowAssignModal(true);
  };

  const handleAssignmentCreated = async () => {
    console.log("🔄 Assignment created, refreshing cases...");
    setShowAssignModal(false);
    setSelectedCase(null);
    
    // Recargar todos los datos para asegurar que se muestren las asignaciones actualizadas
    try {
      setRefreshing(true);
      console.log("📥 Fetching updated cases...");
      await fetchCases(fromDate, toDate);
      console.log("✅ Cases refreshed successfully");
    } catch (error) {
      console.error("❌ Error refreshing cases:", error);
    } finally {
      setRefreshing(false);
    }
  };

  const fetchCases = useCallback(async (from?: string, to?: string) => {
    try {
      setLoading(true);
      const [casesResponse, usersResponse, statesResponse] = await Promise.all([
        caseApi.getAllCases(from || undefined, to || undefined),
        userApi.getAllUsers(),
        caseStateApi.getAllCaseStates(),
      ]);
      console.log("📊 Cases received:", casesResponse);
      console.log("👥 Users received:", usersResponse);
      
      // Log assignments specifically
      casesResponse.forEach(case_ => {
        if (case_.assignments && case_.assignments.length > 0) {
          console.log(`📋 Case ${case_.id} assignments:`, case_.assignments);
        }
      });
      
      setCases(casesResponse);
      setUsers(usersResponse);
      setCaseStates(statesResponse);
    } catch (error) {
      console.error("Error fetching cases:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Función para manejar cambios en la selección de filas
  const handleRowSelectionChange = useCallback((selectedRows: Case[]) => {
    setSelectedCases(selectedRows);
  }, []);

  // Función para manejar asignación masiva
  const handleBulkAssign = useCallback(async (analystId: number, reason?: string) => {
    try {
      console.log("🔄 Iniciando asignación masiva...");
      setRefreshing(true);
      
      const caseIds = selectedCases.map(c => c.id);
      await caseAssignmentApi.bulkAssignCases(caseIds, analystId, reason);
      
      console.log("✅ Asignación masiva completada");
      
      // Recargar datos
      fetchCases(fromDate, toDate);
      
      // Limpiar selección
      setSelectedCases([]);
      
    } catch (error) {
      console.error("❌ Error en asignación masiva:", error);
    } finally {
      setRefreshing(false);
    }
  }, [selectedCases, fromDate, toDate, fetchCases]);

  const handleResolveCase = useCallback(async (caseData: Case) => {
    const detail = prompt("Detalle de cierre:");
    if (detail === null) return;
    const closed = caseStates.find(s => s.name.toLowerCase().includes("cerr"));
    const stateId = closed ? closed.id : caseData.stateId;
    try {
      setRefreshing(true);
      await caseApi.updateCase(caseData.id, { stateId, closeDate: new Date().toISOString(), closeDetail: detail });
      await fetchCases(fromDate, toDate);
    } catch (e) {
      console.error("Error cerrando caso:", e);
    } finally {
      setRefreshing(false);
    }
  }, [caseStates, fromDate, toDate, fetchCases]);

  const columns = useCaseColumns(handleAssignAnalyst, handleResolveCase);

  const handleFilter = () => {
    fetchCases(fromDate, toDate);
  };

  const handleClearFilters = () => {
    const defaultFrom = getDefaultFromDate();
    const defaultTo = getDefaultToDate();
    setFromDate(defaultFrom);
    setToDate(defaultTo);
    fetchCases(defaultFrom, defaultTo);
  };

  // Estadísticas calculadas
  const getClosedCases = () => {
    return cases.filter((c) => c.closeDate).length;
  };

  const getOpenCases = () => {
    return cases.filter((c) => !c.closeDate).length;
  };

  const getRecentCases = () => {
    const oneDayAgo = new Date();
    oneDayAgo.setDate(oneDayAgo.getDate() - 1);
    return cases.filter((c) => new Date(c.captureDate) > oneDayAgo).length;
  };

  const getAffectedUsers = () => {
    return new Set(
      cases.filter((c) => c.affectedUserId).map((c) => c.affectedUserId)
    ).size;
  };

  const closedCases = getClosedCases();
  const openCases = getOpenCases();
  const recentCases = getRecentCases();
  const affectedUsers = getAffectedUsers();

  useEffect(() => {
    // Cargar casos con filtro de 7 días por defecto
    fetchCases(fromDate, toDate);
  }, []);

  return (
    <div className="flex-1 space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Gestión de Casos
          </h1>
          <p className="text-muted-foreground">
            Seguimiento y análisis de casos de fraude detectados
          </p>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <FileText className="h-4 w-4" />
          {cases.length} caso(s) en el período
        </div>
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Casos</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{cases.length}</div>
            <p className="text-xs text-muted-foreground">
              en el período seleccionado
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Casos Abiertos
            </CardTitle>
            <AlertTriangle className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {openCases}
            </div>
            <p className="text-xs text-muted-foreground">requieren atención</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Casos Cerrados
            </CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {closedCases}
            </div>
            <p className="text-xs text-muted-foreground">resueltos</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Usuarios Asignados
            </CardTitle>
            <Users className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {affectedUsers}
            </div>
            <p className="text-xs text-muted-foreground">usuarios únicos</p>
          </CardContent>
        </Card>
      </div>

      {/* Métricas adicionales */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Actividad Reciente
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <span>Casos detectados en las últimas 24h:</span>
              <Badge variant={recentCases > 0 ? "destructive" : "secondary"}>
                {recentCases}
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Tasa de Resolución
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <span>Porcentaje de casos resueltos:</span>
              <Badge variant="outline">
                {cases.length > 0
                  ? Math.round((closedCases / cases.length) * 100)
                  : 0}
                %
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
                Últimos 7 días
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Botón de asignación masiva */}
      {selectedCases.length > 0 && (
        <Card className="bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-blue-600" />
                <span className="font-medium text-blue-900 dark:text-blue-100">
                  {selectedCases.length} caso(s) seleccionado(s)
                </span>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedCases([])}
                  className="border-blue-300 text-blue-700 hover:bg-blue-100"
                >
                  Limpiar selección
                </Button>
                <Button
                  size="sm"
                  onClick={() => setShowBulkAssignModal(true)}
                  disabled={loading || refreshing}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  <UserPlus className="h-4 w-4 mr-2" />
                  Asignar analista
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Tabla de casos */}

      {loading ? (
        <div className="flex items-center justify-center h-32">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : cases.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-32 text-muted-foreground">
          <FileText className="h-8 w-8 mb-2" />
          <span>No hay casos en el período seleccionado</span>
        </div>
      ) : (
        <div className="relative">
          {refreshing && (
            <div className="absolute top-0 left-0 right-0 bg-blue-50 border border-blue-200 rounded-md p-2 mb-4 z-10">
              <div className="flex items-center gap-2 text-sm text-blue-700">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                Actualizando asignaciones...
              </div>
            </div>
          )}
          <div className={refreshing ? "opacity-75 transition-opacity" : ""}>
            <DataTable 
              columns={columns} 
              data={cases} 
              onRowSelectionChange={handleRowSelectionChange}
            />
          </div>
        </div>
      )}

      {/* Modal para asignar analista individual */}
      {selectedCase && (
        <AssignAnalystModal
          open={showAssignModal}
          onClose={() => {
            setShowAssignModal(false);
            setSelectedCase(null);
          }}
          onAssignmentCreated={handleAssignmentCreated}
          caseData={selectedCase}
          users={users.filter(user => user.isActive)} // Solo usuarios activos
        />
      )}

      {/* Modal para asignación masiva */}
      <BulkAssignAnalystModal
        isOpen={showBulkAssignModal}
        onClose={() => setShowBulkAssignModal(false)}
        onAssign={handleBulkAssign}
        analysts={users.filter(user => user.isActive)} // Solo usuarios activos
        selectedCases={selectedCases}
        loading={loading}
      />
    </div>
  );
};

export default Cases;
