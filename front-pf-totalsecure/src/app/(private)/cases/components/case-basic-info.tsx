"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Calendar, Database, User, Shield } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import type { Case } from "@/types/case";

interface CaseBasicInfoProps {
  caseData: Case;
}

export const CaseBasicInfo = ({ caseData }: CaseBasicInfoProps) => {
  return (
    <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-gray-200 dark:border-gray-700 shadow-xl">
      <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-b border-gray-200 dark:border-gray-700">
        <CardTitle className="flex items-center gap-3 text-xl text-gray-900 dark:text-white">
          <div className="bg-blue-500 dark:bg-blue-600 p-3 rounded-xl shadow-lg">
            <FileText className="h-6 w-6 text-white" />
          </div>
          Información del Caso
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/30 rounded-lg border border-blue-200 dark:border-blue-700">
              <Calendar className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              <div>
                <p className="text-sm font-medium text-blue-700 dark:text-blue-300">Fecha de Captura</p>
                <p className="font-semibold text-blue-900 dark:text-blue-100">
                  {format(new Date(caseData.captureDate), "PPPp", { locale: es })}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-purple-50 to-purple-100 dark:from-purple-900/30 dark:to-purple-800/30 rounded-lg border border-purple-200 dark:border-purple-700">
              <Database className="h-5 w-5 text-purple-600 dark:text-purple-400" />
              <div>
                <p className="text-sm font-medium text-purple-700 dark:text-purple-300">ID de Ejecución</p>
                <p className="font-semibold text-purple-900 dark:text-purple-100">#{caseData.executionId}</p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            {caseData.affectedUser && (
              <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-green-50 to-green-100 dark:from-green-900/30 dark:to-green-800/30 rounded-lg border border-green-200 dark:border-green-700">
                <User className="h-5 w-5 text-green-600 dark:text-green-400" />
                <div>
                  <p className="text-sm font-medium text-green-700 dark:text-green-300">Usuario Afectado</p>
                  <p className="font-semibold text-green-900 dark:text-green-100">
                    {caseData.affectedUser.firstName} {caseData.affectedUser.lastName}
                  </p>
                  <p className="text-sm text-green-600 dark:text-green-400">{caseData.affectedUser.email}</p>
                </div>
              </div>
            )}

            {caseData.state && (
              <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
                <Shield className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Estado</p>
                  <p className="font-semibold text-gray-900 dark:text-gray-100">{caseData.state.name}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
