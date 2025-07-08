"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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

interface AssignmentModalProps {
  open: boolean;
  onClose: () => void;
  onAssignmentCreated: () => void;
  cases: Case[];
  users: User[];
}

export function AssignmentModal({
  open,
  onClose,
  onAssignmentCreated,
  cases,
  users
}: AssignmentModalProps) {
  const [formData, setFormData] = useState<CreateCaseAssignmentDto>({
    caseId: 0,
    analystId: 0,
    assignedBy: 1, // TODO: Get from auth context
    reason: "",
    active: true,
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.caseId || !formData.analystId) {
      return;
    }

    try {
      setLoading(true);
      await caseAssignmentApi.createCaseAssignment(formData);
      onAssignmentCreated();
      setFormData({
        caseId: 0,
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
      caseId: 0,
      analystId: 0,
      assignedBy: 1,
      reason: "",
      active: true,
    });
    onClose();
  };

  // Filter users to only show active users that can be analysts
  const analysts = users.filter(user => 
    user.isActive && (
      user.role?.toLowerCase().includes('analyst') || 
      user.role?.toLowerCase().includes('analista') ||
      user.role?.toLowerCase().includes('supervisor') ||
      !user.role // Include users without specific role assigned
    )
  );

  // For debugging - log the data
  console.log('Modal data:', { 
    cases: cases.length, 
    users: users.length, 
    analysts: analysts.length,
    open,
    casesData: cases,
    usersData: users,
    analystsData: analysts
  });

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Nueva Asignación de Caso</DialogTitle>
            <DialogDescription>
              Asigne un caso a un analista para su investigación.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            {/* Debug info */}
            {process.env.NODE_ENV === 'development' && (
              <div className="text-xs text-muted-foreground bg-muted p-2 rounded">
                Debug: {cases.length} casos, {users.length} usuarios, {analysts.length} analistas
              </div>
            )}
            
            <div className="grid gap-2">
              <Label htmlFor="case">Caso *</Label>
              <Select
                value={formData.caseId ? formData.caseId.toString() : ""}
                onValueChange={(value) => 
                  setFormData(prev => ({ ...prev, caseId: parseInt(value) }))
                }
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar caso..." />
                </SelectTrigger>
                <SelectContent>
                  {cases.length === 0 ? (
                    <SelectItem value="no-cases" disabled>
                      No hay casos disponibles
                    </SelectItem>
                  ) : (
                    cases.map((caseItem) => (
                      <SelectItem key={caseItem.id} value={caseItem.id.toString()}>
                        <div className="flex flex-col">
                          <span className="font-medium">Caso #{caseItem.id}</span>
                          <span className="text-sm text-muted-foreground truncate max-w-[300px]">
                            {caseItem.description}
                          </span>
                        </div>
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
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
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar analista..." />
                </SelectTrigger>
                <SelectContent>
                  {users.length === 0 ? (
                    <SelectItem value="no-users" disabled>
                      No hay usuarios disponibles
                    </SelectItem>
                  ) : (
                    (analysts.length > 0 ? analysts : users).map((user) => (
                      <SelectItem key={user.id} value={user.id.toString()}>
                        <div className="flex flex-col">
                          <span className="font-medium">
                            {user.firstName} {user.lastName}
                          </span>
                          <span className="text-sm text-muted-foreground">
                            {user.email} {user.role && `(${user.role})`}
                          </span>
                        </div>
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="reason">Motivo</Label>
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
              disabled={loading || !formData.caseId || !formData.analystId}
            >
              {loading ? "Creando..." : "Crear Asignación"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
