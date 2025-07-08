"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, TriangleAlert, ExternalLink } from "lucide-react";

export default function CaseDetailsRedirectPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  useEffect(() => {
    // Redireccionar automáticamente después de 3 segundos
    const timer = setTimeout(() => {
      const currentParams = new URLSearchParams();
      
      // Preservar parámetros de la URL original
      searchParams.forEach((value, key) => {
        currentParams.append(key, value);
      });
      
      const newUrl = `/cases/details${currentParams.toString() ? `?${currentParams.toString()}` : ''}`;
      router.replace(newUrl);
    }, 3000);

    return () => clearTimeout(timer);
  }, [router, searchParams]);

  const handleRedirectNow = () => {
    const currentParams = new URLSearchParams();
    
    // Preservar parámetros de la URL original
    searchParams.forEach((value, key) => {
      currentParams.append(key, value);
    });
    
    const newUrl = `/cases/details${currentParams.toString() ? `?${currentParams.toString()}` : ''}`;
    router.replace(newUrl);
  };

  const handleGoBack = () => {
    router.push('/reports');
  };

  return (
    <div className="flex-1 space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" onClick={handleGoBack}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver a Reportes
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Página Movida</h1>
            <p className="text-muted-foreground">
              La funcionalidad de "Detalles de Casos" se ha movido a una nueva ubicación
            </p>
          </div>
        </div>
      </div>

      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-amber-600">
            <TriangleAlert className="h-5 w-5" />
            Funcionalidad Reubicada
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
            <p className="text-amber-800 mb-3">
              La página de <strong>&quot;Detalles de Casos&quot;</strong> se ha movido desde <code>/reports/case-details</code> 
              a la nueva ubicación <code>/cases/details</code> para una mejor organización.
            </p>
            
            <p className="text-amber-700 text-sm mb-4">
              Esta página incluye ahora:
            </p>
            
            <ul className="text-amber-700 text-sm space-y-1 mb-4 ml-4">
              <li>• Análisis detallado por bot (1, 2, 3, 4)</li>
              <li>• Gráficos de resumen por bot con datos históricos</li>
              <li>• DataTable mejorado con métricas específicas</li>
              <li>• Filtros avanzados y exportación</li>
            </ul>

            <p className="text-amber-600 text-sm">
              Serás redirigido automáticamente en unos segundos...
            </p>
          </div>

          <div className="flex gap-3 justify-center">
            <Button onClick={handleRedirectNow} className="flex items-center gap-2">
              <ExternalLink className="h-4 w-4" />
              Ir a la Nueva Página Ahora
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}