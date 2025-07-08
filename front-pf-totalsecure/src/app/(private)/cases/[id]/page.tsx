"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import * as caseApi from "@/api/case.api";
import type { Case } from "@/types/case";
import {
  CaseHeader,
  CaseBasicInfo,
  CaseIncidents,
  CaseAssignments,
  CaseNotes,
  CaseActivity,
  CaseSidebar,
  CaseDetailSkeleton,
  CaseDetailError
} from "../components";

const CaseDetail = ({ params } : { params: Promise<{ id: string }> }) => {
  const router = useRouter();
  
  const [caseData, setCaseData] = useState<Case | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCaseDetails = async () => {
      try {
        setLoading(true);
        const { id } = await params;
        const caseId = Number(id);
        
        const data = await caseApi.getCaseWithDetails(caseId);
        setCaseData(data as Case);
        console.log("🎯 Datos de caso cargados:", data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error al cargar el caso');
      } finally {
        setLoading(false);
      }
    };

    fetchCaseDetails();
  }, [params]);

  if (loading) {
    return <CaseDetailSkeleton />;
  }

  if (error) {
    return <CaseDetailError error={error} onGoBack={() => router.back()} />;
  }

  if (!caseData) return null;

  return (
    <div className="flex-1 space-y-6 p-6">
        {/* Header con navegación y título */}
        <CaseHeader caseData={caseData} onGoBack={() => router.back()} />

        {/* Grid principal */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Columna principal */}
          <div className="lg:col-span-3 space-y-6">
            {/* Información básica del caso */}
            <CaseBasicInfo caseData={caseData} />

            {/* Incidentes */}
            <CaseIncidents caseData={caseData} />

            {/* Asignaciones */}
            <CaseAssignments caseData={caseData} />

            {/* Notas del caso */}
            <CaseNotes caseData={caseData} />
            
            {/* Actividad del caso */}
            <CaseActivity caseData={caseData} />
          </div>

          {/* Sidebar */}
          <CaseSidebar caseData={caseData} />
        </div>
    </div>
  );
};

export default CaseDetail;
