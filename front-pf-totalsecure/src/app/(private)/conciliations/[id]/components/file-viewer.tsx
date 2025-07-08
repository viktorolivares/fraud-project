"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  FileText, 
  Download, 
  Calendar, 
  User,
  FileImage,
  FileSpreadsheet,
  File
} from "lucide-react";
import type { ConciliationFile } from "@/types/conciliation-file";
import { format } from "date-fns";

interface FileViewerProps {
  files: ConciliationFile[];
  loading?: boolean;
}

const getFileIcon = (filePath: string) => {
  const extension = filePath.split('.').pop()?.toLowerCase();
  
  switch (extension) {
    case 'pdf':
      return <FileText className="h-5 w-5 text-red-500" />;
    case 'jpg':
    case 'jpeg':
    case 'png':
    case 'gif':
    case 'svg':
      return <FileImage className="h-5 w-5 text-blue-500" />;
    case 'xlsx':
    case 'xls':
    case 'csv':
      return <FileSpreadsheet className="h-5 w-5 text-green-500" />;
    default:
      return <File className="h-5 w-5 text-gray-500" />;
  }
};

const getFileName = (filePath: string) => {
  return filePath.split('/').pop() || filePath;
};

const getFileExtension = (filePath: string) => {
  return filePath.split('.').pop()?.toUpperCase() || 'FILE';
};

const getFileTypeLabel = (type: number) => {
  // Mapeo de tipos de archivo según tu lógica de negocio
  const typeMap: Record<number, string> = {
    1: 'Documento Principal',
    2: 'Evidencia',
    3: 'Respaldo',
    4: 'Anexo',
  };
  
  return typeMap[type] || `Tipo ${type}`;
};

const getFileTypeColor = (type: number) => {
  const colorMap: Record<number, string> = {
    1: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    2: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    3: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
    4: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
  };
  
  return colorMap[type] || 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
};

const handleDownload = (file: ConciliationFile) => {
  // Implementar lógica de descarga
  console.log('Downloading file:', file);
  // En un caso real, aquí harías una llamada al backend para obtener el archivo
  // o construirías la URL de descarga
};

export const FileViewer = ({ files, loading = false }: FileViewerProps) => {
  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Archivos Adjuntos
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (files.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Archivos Adjuntos
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center h-32 text-muted-foreground">
            <FileText className="h-8 w-8 mb-2" />
            <span>No hay archivos adjuntos</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Archivos Adjuntos
          <Badge variant="secondary" className="ml-auto">
            {files.length}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          {files.map((file) => (
            <div
              key={file.id}
              className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
            >
              <div className="flex items-center gap-3">
                {getFileIcon(file.filePath)}
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-sm">
                      {getFileName(file.filePath)}
                    </span>
                    <Badge 
                      variant="outline" 
                      className={`text-xs ${getFileTypeColor(file.conciliationFileType)}`}
                    >
                      {getFileTypeLabel(file.conciliationFileType)}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {format(new Date(file.createdAt), "dd/MM/yyyy HH:mm")}
                    </div>
                    {file.createdBy && (
                      <div className="flex items-center gap-1">
                        <User className="h-3 w-3" />
                        Usuario {file.createdBy}
                      </div>
                    )}
                    <Badge variant="outline" className="text-xs">
                      {getFileExtension(file.filePath)}
                    </Badge>
                  </div>
                </div>
              </div>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleDownload(file)}
                className="flex items-center gap-2"
              >
                <Download className="h-4 w-4" />
                Descargar
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
