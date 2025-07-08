"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  TrendingUp, 
  Zap, 
  Download, 
  ExternalLink, 
  MessageSquare 
} from "lucide-react";
import type { Case } from "@/types/case";

interface CaseSidebarProps {
  caseData: Case;
}

const getStateColor = (stateId: number) => {
  switch (stateId) {
    case 1: return "bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 border-blue-200 dark:border-blue-700";
    case 2: return "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300 border-yellow-200 dark:border-yellow-700";
    case 3: return "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 border-green-200 dark:border-green-700";
    case 4: return "bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 border-red-200 dark:border-red-700";
    default: return "bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-300 border-gray-200 dark:border-gray-700";
  }
};

const getStateName = (stateId: number) => {
  switch (stateId) {
    case 1: return "Abierto";
    case 2: return "En Investigación";
    case 3: return "Resuelto";
    case 4: return "Cerrado";
    default: return "Estado Desconocido";
  }
};

export const CaseSidebar = ({ caseData }: CaseSidebarProps) => {
  return (
    <div className="space-y-6">
      {/* Estadísticas rápidas */}
      <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-gray-200 dark:border-gray-700 shadow-xl">
        <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-b border-gray-200 dark:border-gray-700">
          <CardTitle className="flex items-center gap-3 text-lg text-gray-900 dark:text-white">
            <div className="bg-green-500 dark:bg-green-600 p-2 rounded-lg shadow-lg">
              <TrendingUp className="h-5 w-5 text-white" />
            </div>
            Resumen
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/30 rounded-lg">
              <span className="text-sm font-medium text-blue-700 dark:text-blue-300">Total Incidentes</span>
              <Badge variant="outline" className="border-blue-300 dark:border-blue-600 text-blue-700 dark:text-blue-300">
                {caseData.incidents?.length || 0}
              </Badge>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-gradient-to-r from-purple-50 to-purple-100 dark:from-purple-900/30 dark:to-purple-800/30 rounded-lg">
              <span className="text-sm font-medium text-purple-700 dark:text-purple-300">Estado Actual</span>
              <Badge className={`text-xs ${getStateColor(caseData.stateId)}`}>
                {getStateName(caseData.stateId)}
              </Badge>
            </div>

            {caseData.assignments && caseData.assignments.length > 0 && (
              <div className="flex items-center justify-between p-3 bg-gradient-to-r from-orange-50 to-orange-100 dark:from-orange-900/30 dark:to-orange-800/30 rounded-lg">
                <span className="text-sm font-medium text-orange-700 dark:text-orange-300">Asignaciones</span>
                <Badge variant="outline" className="border-orange-300 dark:border-orange-600 text-orange-700 dark:text-orange-300">
                  {caseData.assignments.length}
                </Badge>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Acciones rápidas */}
      <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-gray-200 dark:border-gray-700 shadow-xl">
        <CardHeader className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 border-b border-gray-200 dark:border-gray-700">
          <CardTitle className="flex items-center gap-3 text-lg text-gray-900 dark:text-white">
            <div className="bg-indigo-500 dark:bg-indigo-600 p-2 rounded-lg shadow-lg">
              <Zap className="h-5 w-5 text-white" />
            </div>
            Acciones
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-3">
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full justify-start bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600"
            >
              <Download className="h-4 w-4 mr-2" />
              Exportar Reporte
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full justify-start bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600"
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              Ver en Sistema
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full justify-start bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600"
            >
              <MessageSquare className="h-4 w-4 mr-2" />
              Agregar Nota
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
