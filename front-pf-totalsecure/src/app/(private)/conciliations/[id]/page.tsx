"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Loader2 } from "lucide-react";
import { ConciliationDetail } from "./components/conciliation-detail";
import { FileViewer } from "./components/file-viewer";
import * as conciliationApi from "@/api/conciliation.api";
import * as collectorApi from "@/api/collector.api";
import * as conciliationFileApi from "@/api/conciliation-file.api";
import type { Conciliation } from "@/types/conciliation";
import type { Collector } from "@/types/collector";
import type { ConciliationFile } from "@/types/conciliation-file";

const ConciliationDetailPage = () => {
  const router = useRouter();
  const params = useParams();
  const conciliationId = parseInt(params.id as string);

  const [conciliation, setConciliation] = useState<Conciliation | null>(null);
  const [collector, setCollector] = useState<Collector | null>(null);
  const [files, setFiles] = useState<ConciliationFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingFiles, setLoadingFiles] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchConciliation = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const conciliationData = await conciliationApi.getConciliationById(conciliationId);
      setConciliation(conciliationData);
      
      // Obtener información del collector
      if (conciliationData.collectorId) {
        try {
          const collectorData = await collectorApi.getCollectorById(conciliationData.collectorId);
          setCollector(collectorData);
        } catch (collectorError) {
          console.warn("Error fetching collector:", collectorError);
          // No es crítico si no se puede obtener el collector
        }
      }
    } catch (error) {
      console.error("Error fetching conciliation:", error);
      setError("No se pudo cargar la conciliación. Verifique que el ID sea válido.");
    } finally {
      setLoading(false);
    }
  };

  const fetchFiles = async () => {
    try {
      setLoadingFiles(true);
      const filesData = await conciliationFileApi.getConciliationFilesByConciliation(conciliationId);
      setFiles(filesData);
    } catch (error) {
      console.error("Error fetching conciliation files:", error);
      setFiles([]);
    } finally {
      setLoadingFiles(false);
    }
  };

  useEffect(() => {
    if (conciliationId && !isNaN(conciliationId)) {
      fetchConciliation();
      fetchFiles();
    } else {
      setError("ID de conciliación inválido");
      setLoading(false);
    }
  }, [conciliationId]);

  if (loading) {
    return (
      <div className="flex-1 space-y-6 p-6">
        <div className="flex items-center justify-center h-64">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="h-8 w-8 animate-spin" />
            <span className="text-muted-foreground">Cargando conciliación...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error || !conciliation) {
    return (
      <div className="flex-1 space-y-6 p-6">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            onClick={() => router.back()}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Volver
          </Button>
        </div>
        
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="text-lg font-semibold text-red-600 mb-2">
              Error al cargar la conciliación
            </div>
            <p className="text-muted-foreground">
              {error || "No se encontró la conciliación solicitada."}
            </p>
            <Button
              variant="outline"
              onClick={() => router.push("/conciliations")}
              className="mt-4"
            >
              Ir a conciliaciones
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            onClick={() => router.back()}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Volver
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Conciliación #{conciliation.id}
            </h1>
            <p className="text-muted-foreground">
              Detalles y archivos de la conciliación - Período {conciliation.period}
            </p>
          </div>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="space-y-6">
        {/* Detalle de la conciliación */}
        <ConciliationDetail 
          conciliation={conciliation} 
          collector={collector || undefined} 
        />

        {/* Archivos adjuntos */}
        <FileViewer 
          files={files} 
          loading={loadingFiles} 
        />
      </div>
    </div>
  );
};

export default ConciliationDetailPage;
