"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import * as caseAssignmentApi from "@/api/case-assignment.api";
import type { Case } from "@/types/case";
import type { User } from "@/types/user";
import type { CreateCaseAssignmentDto } from "@/types/case-assignment";

interface AssignAnalystModalProps {
  open: boolean;
  onClose: () => void;
  onAssignmentCreated: () => void;
  caseData: Case;
  users: User[];
}

export function AssignAnalystModal({
  open,
  onClose,
  onAssignmentCreated,
  caseData,
  users
}: AssignAnalystModalProps) {
  const [formData, setFormData] = useState<Omit<CreateCaseAssignmentDto, 'caseId'>>({
    analystId: 0,
    assignedBy: 1, // TODO: Get from auth context
    reason: "",
    active: true,
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.analystId) {
      return;
    }

    try {
      setLoading(true);
      await caseAssignmentApi.createCaseAssignment({
        ...formData,
        caseId: caseData.id
      });
      onAssignmentCreated();
      setFormData({
        analystId: 0,
        assignedBy: 1,
        reason: "",
        active: true,
      });
    } catch (error) {
      console.error("Error creating assignment:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({
      analystId: 0,
      assignedBy: 1,
      reason: "",
      active: true,
    });
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Asignar Analista al Caso</DialogTitle>
            <DialogDescription>
              Asigne un analista al caso #{caseData.id} para su investigación.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            {/* Info del caso */}
            <div className="p-4 bg-muted rounded-lg">
              <h4 className="font-medium mb-2">Información del Caso</h4>
              <div className="space-y-1 text-sm">
                <div><strong>ID:</strong> {caseData.id}</div>
                <div><strong>Descripción:</strong> {caseData.description}</div>
                {caseData.affectedUser && (
                  <div><strong>Usuario Afectado:</strong> {caseData.affectedUser.firstName} {caseData.affectedUser.lastName}</div>
                )}
                {caseData.state && (
                  <div><strong>Estado:</strong> {caseData.state.name}</div>
                )}
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="analyst">Analista *</Label>
              <Select
                value={formData.analystId ? formData.analystId.toString() : ""}
                onValueChange={(value) => 
                  setFormData(prev => ({ ...prev, analystId: parseInt(value) }))
                }
                required
              >
                <SelectTrigger className="h-16 w-full">
                  <SelectValue placeholder="Seleccionar analista..." />
                </SelectTrigger>
                <SelectContent className="max-h-[400px] w-full">
                  {users.length === 0 ? (
                    <SelectItem value="no-users" disabled>
                      No hay usuarios disponibles
                    </SelectItem>
                  ) : (
                    users.filter(user => user.isActive).map((user) => (
                      <SelectItem key={user.id} value={user.id.toString()} className="h-12">
                        <div className="flex items-center gap-2 w-full">
                          <span className="text-sm bg-blue-100 dark:bg-blue-900 px-2 py-0.5 rounded text-blue-700 dark:text-blue-300 font-medium">
                            {user.firstName} {user.lastName}
                          </span>
                          {user.role && (
                            <>
                              <span className="text-xs text-muted-foreground">•</span>
                              <span className="text-xs bg-slate-100 dark:bg-slate-700 px-2 py-0.5 rounded text-slate-600 dark:text-slate-300">
                                {user.role}
                              </span>
                            </>
                          )}
                          <span className="text-xs text-muted-foreground">
                            • {user.email}
                          </span>
                        </div>
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2 mt-6">
              <Label htmlFor="reason">Motivo de Asignación</Label>
              <Textarea
                id="reason"
                placeholder="Describe el motivo de la asignación..."
                value={formData.reason}
                onChange={(e) => 
                  setFormData(prev => ({ ...prev, reason: e.target.value }))
                }
                rows={3}
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={loading}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={loading || !formData.analystId}
            >
              {loading ? "Asignando..." : "Asignar Analista"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
