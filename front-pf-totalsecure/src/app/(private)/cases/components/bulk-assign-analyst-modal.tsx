"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { UserPlus, AlertCircle, Users } from "lucide-react";
import type { User } from "@/types/user";
import type { Case } from "@/types/case";

interface BulkAssignAnalystModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAssign: (analystId: number, reason?: string) => Promise<void>;
  analysts: User[];
  selectedCases: Case[];
  loading?: boolean;
}

export function BulkAssignAnalystModal({
  isOpen,
  onClose,
  onAssign,
  analysts,
  selectedCases,
  loading = false,
}: BulkAssignAnalystModalProps) {
  const [selectedAnalystId, setSelectedAnalystId] = useState<string>("");
  const [reason, setReason] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!selectedAnalystId) return;

    setSubmitting(true);
    try {
      await onAssign(parseInt(selectedAnalystId), reason || undefined);
      // Reset form
      setSelectedAnalystId("");
      setReason("");
      onClose();
    } catch (error) {
      console.error("Error en asignación masiva:", error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!submitting) {
      setSelectedAnalystId("");
      setReason("");
      onClose();
    }
  };

  // Filtrar casos que no están asignados
  const unassignedCases = selectedCases.filter(c => {
    const activeAssignment = c.assignments?.find(assignment => assignment.active);
    return !activeAssignment || !activeAssignment.analyst;
  });

  const alreadyAssignedCases = selectedCases.filter(c => {
    const activeAssignment = c.assignments?.find(assignment => assignment.active);
    return activeAssignment && activeAssignment.analyst;
  });

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Users className="h-5 w-5 text-primary" />
            Asignación Masiva de Analista
          </DialogTitle>
          <DialogDescription>
            Asignar un analista a múltiples casos seleccionados
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Resumen de casos seleccionados */}
          <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg">
            <h4 className="font-semibold text-sm mb-2">Casos Seleccionados</h4>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                  {unassignedCases.length} disponibles para asignar
                </Badge>
                {alreadyAssignedCases.length > 0 && (
                  <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
                    {alreadyAssignedCases.length} ya asignados (se omitirán)
                  </Badge>
                )}
              </div>
              {unassignedCases.length === 0 && (
                <div className="flex items-center gap-2 text-amber-600">
                  <AlertCircle className="h-4 w-4" />
                  <span className="text-sm">No hay casos disponibles para asignar</span>
                </div>
              )}
            </div>
          </div>

          {/* Lista de casos a asignar */}
          {unassignedCases.length > 0 && (
            <div className="max-h-32 overflow-y-auto border rounded-lg p-2">
              <div className="text-xs text-muted-foreground mb-1">
                Casos que se asignarán:
              </div>
              <div className="flex flex-wrap gap-1">
                {unassignedCases.map((c) => (
                  <Badge key={c.id} variant="secondary" className="text-xs">
                    #{c.id}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Selección de analista */}
          <div className="space-y-2">
            <Label htmlFor="analyst">Analista *</Label>
            <Select
              value={selectedAnalystId}
              onValueChange={setSelectedAnalystId}
              disabled={loading || submitting || unassignedCases.length === 0}
            >
              <SelectTrigger id="analyst" className="h-16 w-full">
                <SelectValue placeholder="Seleccionar analista..." />
              </SelectTrigger>
              <SelectContent className="max-h-[400px] w-full">
                {analysts.filter(user => user.isActive).map((analyst) => (
                  <SelectItem key={analyst.id} value={analyst.id.toString()} className="h-12">
                    <div className="flex items-center gap-2 w-full">
                      <span className="text-sm bg-blue-100 dark:bg-blue-900 px-2 py-0.5 rounded text-blue-700 dark:text-blue-300 font-medium">
                        {analyst.firstName} {analyst.lastName}
                      </span>
                      {analyst.role && (
                        <>
                          <span className="text-xs text-muted-foreground">•</span>
                          <span className="text-xs bg-slate-100 dark:bg-slate-700 px-2 py-0.5 rounded text-slate-600 dark:text-slate-300">
                            {analyst.role}
                          </span>
                        </>
                      )}
                      <span className="text-xs text-muted-foreground">
                        • {analyst.email}
                      </span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Motivo (opcional) */}
          <div className="space-y-2 mt-6">
            <Label htmlFor="reason">Motivo (opcional)</Label>
            <Textarea
              id="reason"
              placeholder="Motivo de la asignación masiva..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              disabled={loading || submitting || unassignedCases.length === 0}
              rows={2}
            />
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={handleClose}
            disabled={submitting}
          >
            Cancelar
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={
              !selectedAnalystId || 
              submitting || 
              loading || 
              unassignedCases.length === 0
            }
            className="flex items-center gap-2"
          >
            <UserPlus className="h-4 w-4" />
            {submitting ? "Asignando..." : `Asignar a ${unassignedCases.length} casos`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
