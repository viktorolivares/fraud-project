"use client";
 
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Activity, 
  CheckCircle, 
  Clock, 
  FileText,
  TrendingUp,
  AlertCircle
} from "lucide-react";
import { columns } from "./components/columns";
import { DataTable } from "./components/data-table";
import * as caseStateApi from "@/api/case-state.api";
import type { CaseState } from "@/types/case-state";

const CaseStates = () => {
  const [states, setStates] = useState<CaseState[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await caseStateApi.getAllCaseStates();
      setStates(response);
    } catch (error) {
      console.error("Error fetching case states:", error);
    } finally {
      setLoading(false);
    }
  };

  const getActiveStates = () => {
    // Asumimos que todos los estados devueltos por la API están activos
    return states.length;
  };

  const getDefaultState = () => {
    // Asumimos que el primer estado es el predeterminado
    return states.length > 0 ? states[0] : null;
  };

  const getRecentStates = () => {
    // Asumimos que los estados más recientes son los que tienen ID más alto
    return states.filter(state => state.id > Math.max(...states.map(s => s.id)) - 3).length;
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="flex-1 space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Estados de Casos</h1>
          <p className="text-muted-foreground">
            Configuración y gestión de estados del flujo de casos
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Activity className="h-5 w-5" />
          <span className="text-sm text-muted-foreground">
            {states.length} estado(s)
          </span>
        </div>
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Estados</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{states.length}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Estados Activos</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{getActiveStates()}</div>
            <p className="text-xs text-muted-foreground">disponibles</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Estado Predeterminado</CardTitle>
            <AlertCircle className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-lg font-bold text-blue-600 truncate">
              {getDefaultState()?.name || "No definido"}
            </div>
            <p className="text-xs text-muted-foreground">estado inicial</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Estados Recientes</CardTitle>
            <TrendingUp className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">{getRecentStates()}</div>
            <p className="text-xs text-muted-foreground">últimos creados</p>
          </CardContent>
        </Card>
      </div>

      {/* Distribución de Estados */}
      {states.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Distribución de Estados
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {states.map((state) => (
                <div
                  key={state.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex-1 min-w-0 pr-4">
                    <h3 className="font-medium truncate">{state.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      Estado ID: {state.id}
                    </p>
                  </div>
                  <div className="flex-shrink-0 text-center space-y-1">
                    <Badge variant="default">
                      Activo
                    </Badge>
                    {state.id === (getDefaultState()?.id || 1) && (
                      <Badge variant="outline" className="text-xs">
                        Predeterminado
                      </Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Tabla de Estados */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Lista de Estados
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <div className="flex items-center justify-center h-32">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : states.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-32 text-muted-foreground">
              <FileText className="h-8 w-8 mb-2" />
              <span>No hay estados registrados</span>
            </div>
          ) : (
            <DataTable columns={columns} data={states} />
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default CaseStates;
