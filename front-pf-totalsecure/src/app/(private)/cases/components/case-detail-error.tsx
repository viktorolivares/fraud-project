"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, AlertTriangle } from "lucide-react";

interface CaseDetailErrorProps {
  error: string;
  onGoBack: () => void;
}

export const CaseDetailError = ({ error, onGoBack }: CaseDetailErrorProps) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-gray-900 dark:to-gray-800 p-6">
      <div className="max-w-4xl mx-auto">
        <Card className="border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20">
          <CardContent className="p-8 text-center">
            <AlertTriangle className="h-16 w-16 text-red-500 dark:text-red-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-red-800 dark:text-red-300 mb-2">Error al cargar el caso</h2>
            <p className="text-red-600 dark:text-red-400 mb-6">{error}</p>
            <Button 
              onClick={onGoBack} 
              variant="outline" 
              className="border-red-300 text-red-700 hover:bg-red-100 dark:border-red-700 dark:text-red-300 dark:hover:bg-red-900/30"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
