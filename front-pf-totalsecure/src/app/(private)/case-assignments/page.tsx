"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  UserCheck, 
  Plus, 
  Calendar, 
  User2, 
  FileText,
  Users,
  CheckCircle,
  XCircle,
  Clock
} from "lucide-react";
import * as caseAssignmentApi from "@/api/case-assignment.api";
import type { CaseAssignment } from "@/types/case-assignment";
import { format } from "date-fns";

const CaseAssignments = () => {
  const [assignments, setAssignments] = useState<CaseAssignment[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      setLoading(true);
      const assignmentsData = await caseAssignmentApi.getAllCaseAssignments();
      setAssignments(assignmentsData);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAssignmentCreated = () => {
    fetchData(); // Refresh data
  };

  const handleDeactivateAssignment = async (assignmentId: number) => {
    try {
      await caseAssignmentApi.deactivateCaseAssignment(assignmentId);
      fetchData(); // Refresh data
    } catch (error) {
      console.error("Error deactivating assignment:", error);
    }
  };

  const getAnalystName = (analystId: number) => {
    return `Analista ${analystId}`;
  };

  const getAssignerName = (assignerId: number) => {
    return `Usuario ${assignerId}`;
  };

  const getCaseName = (caseId: number) => {
    return `Caso ${caseId}`;
  };

  const activeAssignments = assignments.filter(a => a.active);
  const inactiveAssignments = assignments.filter(a => !a.active);

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="flex-1 space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Asignación de Casos</h1>
          <p className="text-muted-foreground">
            Gestión de asignaciones de casos a analistas. Para crear nuevas asignaciones, visite la página de <Link href="/cases" className="text-primary underline">Gestión de Casos</Link>.
          </p>
        </div>
        <Button onClick={() => window.location.href = '/cases'} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Ir a Casos
        </Button>
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Asignaciones</CardTitle>
            <UserCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{assignments.length}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Asignaciones Activas</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{activeAssignments.length}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Asignaciones Inactivas</CardTitle>
            <XCircle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{inactiveAssignments.length}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Analistas Asignados</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {new Set(activeAssignments.map(a => a.analystId)).size}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Lista de Asignaciones Activas */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-500" />
            Asignaciones Activas
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center h-32">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : activeAssignments.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-32 text-muted-foreground">
              <UserCheck className="h-8 w-8 mb-2" />
              <span>No hay asignaciones activas</span>
            </div>
          ) : (
            <div className="space-y-4">
              {activeAssignments.map((assignment) => (
                <div
                  key={assignment.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex items-center justify-center w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg">
                      <UserCheck className="h-6 w-6 text-green-600 dark:text-green-400" />
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold">{getCaseName(assignment.caseId)}</h3>
                        <Badge variant="default">Activa</Badge>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <User2 className="h-3 w-3" />
                          Analista: {getAnalystName(assignment.analystId)}
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {format(new Date(assignment.assignedAt), "dd/MM/yyyy HH:mm")}
                        </div>
                        <div className="flex items-center gap-1">
                          <User2 className="h-3 w-3" />
                          Por: {getAssignerName(assignment.assignedBy)}
                        </div>
                      </div>
                      {assignment.reason && (
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <FileText className="h-3 w-3" />
                          {assignment.reason}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeactivateAssignment(assignment.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <XCircle className="h-4 w-4 mr-1" />
                      Desactivar
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Lista de Asignaciones Inactivas */}
      {inactiveAssignments.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-muted-foreground" />
              Historial de Asignaciones
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {inactiveAssignments.slice(0, 10).map((assignment) => (
                <div
                  key={assignment.id}
                  className="flex items-center justify-between p-4 border rounded-lg opacity-75"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex items-center justify-center w-12 h-12 bg-gray-100 dark:bg-gray-900 rounded-lg">
                      <XCircle className="h-6 w-6 text-gray-600 dark:text-gray-400" />
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold">{getCaseName(assignment.caseId)}</h3>
                        <Badge variant="secondary">Inactiva</Badge>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <User2 className="h-3 w-3" />
                          {getAnalystName(assignment.analystId)}
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {format(new Date(assignment.assignedAt), "dd/MM/yyyy")}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Modal para crear nueva asignación - REMOVIDO - Ahora se hace desde la página de casos */}
    </div>
  );
};

export default CaseAssignments;
