"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { 
  Activity,
  Clock,
  User,
  FileText,
  UserPlus,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Edit,
  MessageSquare
} from "lucide-react";
import type { Case } from "@/types/case";

interface CaseActivityProps {
  caseData: Case;
}

interface ActivityItem {
  id: string;
  type: 'status_change' | 'assignment' | 'note_added' | 'incident_added' | 'case_updated';
  description: string;
  user: string;
  timestamp: Date;
  details?: string;
}

export const CaseActivity = ({ caseData }: CaseActivityProps) => {
  // Por ahora simulamos algunas actividades basadas en los datos del caso
  // En el futuro esto debería venir de la API
  const generateMockActivities = (): ActivityItem[] => {
    const activities: ActivityItem[] = [];
    
    // Actividad de creación del caso
    activities.push({
      id: '1',
      type: 'case_updated',
      description: 'Caso creado',
      user: 'Sistema',
      timestamp: new Date(caseData.captureDate),
      details: `Caso #${caseData.id} creado en el sistema`
    });

    // Actividades de incidentes
    if (caseData.incidents && caseData.incidents.length > 0) {
      caseData.incidents.forEach((incident, index) => {
        // Intentamos extraer un código o referencia del dataJson si existe
        let incidentRef = 'N/A';
        if (incident.dataJson && typeof incident.dataJson === 'object') {
          incidentRef = 
            (incident.dataJson as any).transactionCode || 
            (incident.dataJson as any).reference || 
            `#${incident.id}`;
        }
        
        activities.push({
          id: `incident-${incident.id}`,
          type: 'incident_added',
          description: 'Incidente agregado',
          user: 'Sistema',
          timestamp: new Date(), // Usamos fecha actual ya que no hay createdAt
          details: `Incidente ${incidentRef} agregado al caso`
        });
      });
    }

    // Actividades de asignaciones
    if (caseData.assignments && caseData.assignments.length > 0) {
      caseData.assignments.forEach((assignment) => {
        activities.push({
          id: `assignment-${assignment.id}`,
          type: 'assignment',
          description: 'Caso asignado',
          user: 'Sistema',
          timestamp: new Date(assignment.createdAt),
          details: `Caso asignado a analista ${assignment.analystId}`
        });
      });
    }

    // Actividades de notas
    if (caseData.notes && caseData.notes.length > 0) {
      caseData.notes.forEach((note) => {
        activities.push({
          id: `note-${note.id}`,
          type: 'note_added',
          description: 'Nota agregada',
          user: `Usuario ${note.authorId}`,
          timestamp: typeof note.dateTime === 'string' ? new Date(note.dateTime) : note.dateTime,
          details: note.comment.length > 50 ? note.comment.substring(0, 50) + '...' : note.comment
        });
      });
    }

    // Ordenar por fecha descendente
    return activities.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime()).slice(0, 10);
  };

  const activities = generateMockActivities();

  const getActivityIcon = (type: ActivityItem['type']) => {
    switch (type) {
      case 'status_change':
        return CheckCircle;
      case 'assignment':
        return UserPlus;
      case 'note_added':
        return MessageSquare;
      case 'incident_added':
        return AlertTriangle;
      case 'case_updated':
        return Edit;
      default:
        return Activity;
    }
  };

  const getActivityColor = (type: ActivityItem['type']) => {
    switch (type) {
      case 'status_change':
        return 'text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/30';
      case 'assignment':
        return 'text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/30';
      case 'note_added':
        return 'text-purple-600 dark:text-purple-400 bg-purple-100 dark:bg-purple-900/30';
      case 'incident_added':
        return 'text-orange-600 dark:text-orange-400 bg-orange-100 dark:bg-orange-900/30';
      case 'case_updated':
        return 'text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-700/30';
      default:
        return 'text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-700/30';
    }
  };

  const formatDateTime = (date: Date) => {
    return date.toLocaleString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getRelativeTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor(diff / (1000 * 60));

    if (days > 0) return `hace ${days} día${days > 1 ? 's' : ''}`;
    if (hours > 0) return `hace ${hours} hora${hours > 1 ? 's' : ''}`;
    if (minutes > 0) return `hace ${minutes} minuto${minutes > 1 ? 's' : ''}`;
    return 'hace un momento';
  };

  return (
    <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-lg">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
            <Activity className="h-5 w-5 text-green-600 dark:text-green-400" />
          </div>
          <div>
            <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white">
              Actividad del Caso
            </CardTitle>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Historial de cambios y actividades
            </p>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        {activities.length > 0 ? (
          <div className="space-y-4">
            {activities.map((activity, index) => {
              const IconComponent = getActivityIcon(activity.type);
              const colorClass = getActivityColor(activity.type);
              
              return (
                <div key={activity.id} className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className={`p-2 rounded-lg ${colorClass}`}>
                      <IconComponent className="h-4 w-4" />
                    </div>
                    
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium text-gray-900 dark:text-white">
                          {activity.description}
                        </h4>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {getRelativeTime(activity.timestamp)}
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                        <User className="h-4 w-4" />
                        <span>{activity.user}</span>
                        <span>•</span>
                        <Clock className="h-4 w-4" />
                        <span>{formatDateTime(activity.timestamp)}</span>
                      </div>
                      
                      {activity.details && (
                        <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">
                          {activity.details}
                        </p>
                      )}
                    </div>
                  </div>
                  
                  {index < activities.length - 1 && (
                    <Separator className="my-3" />
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-8">
            <div className="mx-auto w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mb-4">
              <Activity className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              Sin actividad
            </h3>
            <p className="text-gray-500 dark:text-gray-400">
              No se ha registrado actividad para este caso.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
