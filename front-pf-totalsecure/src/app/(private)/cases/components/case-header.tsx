"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft } from "lucide-react";
import type { Case } from "@/types/case";

interface CaseHeaderProps {
  caseData: Case;
  onGoBack: () => void;
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

export const CaseHeader = ({ caseData, onGoBack }: CaseHeaderProps) => {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-4">
        <Button 
          onClick={onGoBack} 
          variant="outline" 
          size="sm"
          className="w-fit bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-gray-200 dark:border-gray-700 hover:bg-white dark:hover:bg-gray-800 shadow-sm"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Volver
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Caso #{caseData.id}
          </h1>
          <p className="text-muted-foreground">
            {caseData.description}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <Badge className={`px-3 py-1 text-sm font-semibold border ${getStateColor(caseData.stateId)}`}>
          {getStateName(caseData.stateId)}
        </Badge>
      </div>
    </div>
  );
};
