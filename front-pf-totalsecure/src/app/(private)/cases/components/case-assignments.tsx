"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, User, Calendar, Clock } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import type { Case } from "@/types/case";

interface CaseAssignmentsProps {
  caseData: Case;
}

export const CaseAssignments = ({ caseData }: CaseAssignmentsProps) => {
  if (!caseData.assignments || caseData.assignments.length === 0) {
    return (
      <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-gray-200 dark:border-gray-700 shadow-xl">
        <CardHeader className="bg-gradient-to-r from-gray-50 to-slate-50 dark:from-gray-900/20 dark:to-slate-900/20 border-b border-gray-200 dark:border-gray-700">
          <CardTitle className="flex items-center gap-3 text-xl text-gray-900 dark:text-white">
            <div className="bg-gray-500 dark:bg-gray-600 p-3 rounded-xl shadow-lg">
              <Users className="h-6 w-6 text-white" />
            </div>
            Asignaciones del Caso
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="text-center py-8">
            <Users className="h-16 w-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
            <p className="text-gray-500 dark:text-gray-400 text-lg mb-2">No hay asignaciones</p>
            <p className="text-gray-400 dark:text-gray-500 text-sm">
              El caso no ha sido asignado a ningún analista.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-gray-200 dark:border-gray-700 shadow-xl">
      <CardHeader className="bg-gradient-to-r from-indigo-50 to-blue-50 dark:from-indigo-900/20 dark:to-blue-900/20 border-b border-gray-200 dark:border-gray-700">
        <CardTitle className="flex items-center gap-3 text-xl text-gray-900 dark:text-white">
          <div className="bg-indigo-500 dark:bg-indigo-600 p-3 rounded-xl shadow-lg">
            <Users className="h-6 w-6 text-white" />
          </div>
          Asignaciones del Caso
          <Badge variant="secondary" className="ml-auto bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-200">
            {caseData.assignments.length} asignación{caseData.assignments.length !== 1 ? 'es' : ''}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-4">
          {caseData.assignments.map((assignment) => (
            <div 
              key={assignment.id} 
              className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg bg-gradient-to-r from-indigo-50 to-blue-50 dark:from-indigo-900/30 dark:to-blue-900/30"
            >
              <div className="flex items-start gap-3">
                <div className="bg-indigo-100 dark:bg-indigo-800 p-2 rounded-lg">
                  <User className="h-5 w-5 text-indigo-600 dark:text-indigo-300" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-semibold text-gray-900 dark:text-white">
                      {assignment.analyst?.firstName} {assignment.analyst?.lastName}
                    </span>
                    <Badge 
                      variant="outline" 
                      className="border-indigo-300 dark:border-indigo-600 text-indigo-700 dark:text-indigo-300"
                    >
                      Analista
                    </Badge>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      <span>Asignado: {format(new Date(assignment.assignedAt), "PPp", { locale: es })}</span>
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      {assignment.active ? 'Activo' : 'Inactivo'}
                    </Badge>
                  </div>
                  {assignment.reason && (
                    <p className="text-gray-700 dark:text-gray-300 text-sm mt-2 italic">
                      "Motivo: {assignment.reason}"
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
