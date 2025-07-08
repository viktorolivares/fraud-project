"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  MessageSquare,
  Plus,
  Send,
  Paperclip,
  Calendar,
  User
} from "lucide-react";
import type { Case } from "@/types/case";
import type { CaseNote } from "@/types/case-note";

interface CaseNotesProps {
  caseData: Case;
}

export const CaseNotes = ({ caseData }: CaseNotesProps) => {
  const [newNote, setNewNote] = useState("");
  const [isAddingNote, setIsAddingNote] = useState(false);

  const handleAddNote = () => {
    // TODO: Implementar lógica para agregar nota
    console.log("Agregando nota:", newNote);
    setNewNote("");
    setIsAddingNote(false);
  };

  const formatDateTime = (dateString: string | Date) => {
    const date = typeof dateString === 'string' ? new Date(dateString) : dateString;
    return date.toLocaleString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getAuthorInitials = (authorId: number) => {
    // TODO: Obtener información del autor desde la API o estado global
    return "U" + authorId.toString().slice(-1);
  };

  const notes = caseData.notes || [];

  return (
    <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-lg">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              <MessageSquare className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white">
                Notas del Caso
              </CardTitle>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                {notes.length} {notes.length === 1 ? 'nota' : 'notas'}
              </p>
            </div>
          </div>
          
          <Button
            onClick={() => setIsAddingNote(!isAddingNote)}
            size="sm"
            className="gap-2"
          >
            <Plus className="h-4 w-4" />
            Agregar Nota
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Formulario para nueva nota */}
        {isAddingNote && (
          <div className="space-y-4 p-4 bg-blue-50/50 dark:bg-blue-900/10 rounded-lg border border-blue-200/30 dark:border-blue-800/30">
            <Textarea
              placeholder="Escribe tu nota aquí..."
              value={newNote}
              onChange={(e) => setNewNote(e.target.value)}
              className="min-h-[100px] resize-none"
            />
            <div className="flex items-center justify-between">
              <Button
                variant="outline"
                size="sm"
                className="gap-2"
              >
                <Paperclip className="h-4 w-4" />
                Adjuntar
              </Button>
              
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsAddingNote(false)}
                >
                  Cancelar
                </Button>
                <Button
                  size="sm"
                  onClick={handleAddNote}
                  disabled={!newNote.trim()}
                  className="gap-2"
                >
                  <Send className="h-4 w-4" />
                  Enviar
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Lista de notas */}
        {notes.length > 0 ? (
          <div className="max-h-[400px] overflow-y-auto pr-4">
            <div className="space-y-4">{notes.map((note, index) => (
                <div key={note.id} className="space-y-3">
                  <div className="flex items-start gap-3">
                    <Avatar className="h-8 w-8 mt-1">
                      <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white text-xs">
                        {getAuthorInitials(note.authorId)}
                      </AvatarFallback>
                    </Avatar>
                    
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                        <User className="h-4 w-4" />
                        <span>Usuario {note.authorId}</span>
                        <span>•</span>
                        <Calendar className="h-4 w-4" />
                        <span>{formatDateTime(note.dateTime)}</span>
                      </div>
                      
                      <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3">
                        <p className="text-gray-900 dark:text-gray-100 leading-relaxed">
                          {note.comment}
                        </p>
                        
                        {note.attachment && (
                          <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-600">
                            <div className="flex items-center gap-2 text-sm text-blue-600 dark:text-blue-400">
                              <Paperclip className="h-4 w-4" />
                              <span>Archivo adjunto: {note.attachment}</span>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  {index < notes.length - 1 && (
                    <Separator className="my-4" />
                  )}
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <div className="mx-auto w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mb-4">
              <MessageSquare className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              Sin notas
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mb-4">
              Este caso aún no tiene notas. Sé el primero en agregar una.
            </p>
            <Button
              onClick={() => setIsAddingNote(true)}
              className="gap-2"
            >
              <Plus className="h-4 w-4" />
              Agregar primera nota
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
