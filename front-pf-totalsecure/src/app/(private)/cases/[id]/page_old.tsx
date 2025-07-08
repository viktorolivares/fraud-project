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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 transition-colors">
      <div className="max-w-7xl mx-auto p-6 space-y-8">
        {/* Header con navegación y título */}
        <CaseHeader caseData={caseData} onGoBack={() => router.back()} />

        {/* Grid principal */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Columna principal */}
          <div className="lg:col-span-2 space-y-8">
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
    </div>
  );
};

export default CaseDetail;
