"use client";

import { useEffect, useState, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  ArrowLeft,
  Download,
  Calendar,
  Filter,
  Users,
  RefreshCw,
  RotateCcw,
  Search,
  Eye,
  Copy,
  Bot as BotIcon,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  FileText,
  SortAsc,
  SortDesc
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import * as reportApi from "@/api/report.api";
import type { CaseDataWithClientResult } from "@/api/report.api";

// Función helper para obtener fechas por defecto (último día)
const getDefaultDateRange = () => {
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  
  return {
    from: yesterday.toISOString().split('T')[0],
    to: today.toISOString().split('T')[0]
  };
};

// Función para exportar a CSV
const exportToCSV = (data: CaseDataWithClientResult[], filename: string) => {
  const headers = [
    'Case ID',
    'Execution ID',
    'Client ID', 
    'First Name',
    'Last Name',
    'Email',
    'National ID Type',
    'National ID',
    'Birthday',
    'Capture Timestamp'
  ];
  
  const csvContent = [
    headers.join(','),
    ...data.map(row => [
      row.case_id,
      row.execution_id,
      row.client_id,
      `"${row.first_name}"`,
      `"${row.last_name}"`,
      `"${row.email}"`,
      row.national_id_type,
      row.national_id,
      row.birthday,
      row.capture_timestamp
    ].join(','))
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
};

// Tipos para ordenamiento
type SortField = 'case_id' | 'client_id' | 'first_name' | 'last_name' | 'email' | 'capture_timestamp';
type SortDirection = 'asc' | 'desc';

export default function CaseDetailsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [reportLoading, setReportLoading] = useState(false);
  
  // Estados para filtros
  const [dateRange, setDateRange] = useState(() => {
    const fromParam = searchParams.get('from');
    const toParam = searchParams.get('to');
    if (fromParam && toParam) {
      return { from: fromParam, to: toParam };
    }
    return getDefaultDateRange();
  });
  
  const [selectedBot, setSelectedBot] = useState<number>(() => {
    const botParam = searchParams.get('bot');
    return botParam ? parseInt(botParam) : 4;
  });
  
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(25);
  
  // Estados para ordenamiento
  const [sortField, setSortField] = useState<SortField>('case_id');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  
  // Estados para datos
  const [caseData, setCaseData] = useState<CaseDataWithClientResult[]>([]);

  const fetchData = async () => {
    try {
      setReportLoading(true);
      const { from, to } = dateRange;
      const data = await reportApi.getCaseDataWithClients(from, to, selectedBot);
      setCaseData(data);
    } catch (error) {
      console.error("Error fetching case data:", error);
    } finally {
      setReportLoading(false);
      setLoading(false);
    }
  };

  // Filtrar y ordenar datos
  const processedData = useMemo(() => {
    let filtered = caseData;

    // Aplicar filtro de búsqueda
    if (searchQuery) {
      filtered = caseData.filter(item => 
        item.case_id.toString().toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.client_id.toString().toLowerCase().includes(searchQuery.toLowerCase()) ||
        `${item.first_name} ${item.last_name}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.national_id.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Aplicar ordenamiento
    const sorted = [...filtered].sort((a, b) => {
      let aValue: string | number = '';
      let bValue: string | number = '';

      switch (sortField) {
        case 'case_id':
          aValue = a.case_id;
          bValue = b.case_id;
          break;
        case 'client_id':
          aValue = a.client_id;
          bValue = b.client_id;
          break;
        case 'first_name':
          aValue = a.first_name.toLowerCase();
          bValue = b.first_name.toLowerCase();
          break;
        case 'last_name':
          aValue = a.last_name.toLowerCase();
          bValue = b.last_name.toLowerCase();
          break;
        case 'email':
          aValue = a.email.toLowerCase();
          bValue = b.email.toLowerCase();
          break;
        case 'capture_timestamp':
          aValue = new Date(a.capture_timestamp).getTime();
          bValue = new Date(b.capture_timestamp).getTime();
          break;
      }

      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });

    return sorted;
  }, [caseData, searchQuery, sortField, sortDirection]);

  // Datos paginados
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return processedData.slice(startIndex, startIndex + itemsPerPage);
  }, [processedData, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(processedData.length / itemsPerPage);

  const handleDateChange = (field: 'from' | 'to', value: string) => {
    setDateRange(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleResetFilters = () => {
    setDateRange(getDefaultDateRange());
    setSearchQuery('');
    setCurrentPage(1);
    setSortField('case_id');
    setSortDirection('desc');
  };

  const handleApplyFilters = () => {
    fetchData();
  };

  const handleBotChange = (botId: number) => {
    setSelectedBot(botId);
    setCurrentPage(1);
  };

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
    setCurrentPage(1);
  };

  const handleExport = () => {
    const filename = `casos-clientes-bot${selectedBot}-${dateRange.from}-${dateRange.to}.csv`;
    exportToCSV(processedData, filename);
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch (err) {
      console.error('Error copying to clipboard:', err);
    }
  };

  const viewJsonData = (jsonData: any) => {
    const formatted = typeof jsonData === 'string' 
      ? JSON.stringify(JSON.parse(jsonData), null, 2)
      : JSON.stringify(jsonData, null, 2);
    
    const newWindow = window.open();
    if (newWindow) {
      newWindow.document.write(`
        <html>
          <head><title>JSON Data - Case Details</title></head>
          <body style="font-family: monospace; padding: 20px;">
            <pre>${formatted}</pre>
          </body>
        </html>
      `);
    }
  };

  const SortableHeader = ({ field, children }: { field: SortField; children: React.ReactNode }) => (
    <TableHead className="cursor-pointer select-none" onClick={() => handleSort(field)}>
      <div className="flex items-center gap-2">
        {children}
        {sortField === field && (
          sortDirection === 'asc' ? <SortAsc className="h-4 w-4" /> : <SortDesc className="h-4 w-4" />
        )}
      </div>
    </TableHead>
  );

  const Pagination = () => (
    <div className="flex items-center justify-between px-2">
      <div className="flex items-center gap-6 lg:gap-8">
        <div className="flex items-center gap-2">
          <p className="text-sm font-medium">Filas por página</p>
          <Select
            value={`${itemsPerPage}`}
            onValueChange={(value) => {
              setItemsPerPage(Number(value));
              setCurrentPage(1);
            }}
          >
            <SelectTrigger className="h-8 w-[70px]">
              <SelectValue placeholder={itemsPerPage} />
            </SelectTrigger>
            <SelectContent side="top">
              {[10, 20, 30, 50, 100].map((pageSize) => (
                <SelectItem key={pageSize} value={`${pageSize}`}>
                  {pageSize}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex w-[100px] items-center justify-center text-sm font-medium">
          Página {currentPage} de {totalPages}
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            className="hidden h-8 w-8 p-0 lg:flex"
            onClick={() => setCurrentPage(1)}
            disabled={currentPage === 1}
          >
            <span className="sr-only">Ir a la primera página</span>
            <ChevronsLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            className="h-8 w-8 p-0"
            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
          >
            <span className="sr-only">Ir a la página anterior</span>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            className="h-8 w-8 p-0"
            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
            disabled={currentPage === totalPages}
          >
            <span className="sr-only">Ir a la siguiente página</span>
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            className="hidden h-8 w-8 p-0 lg:flex"
            onClick={() => setCurrentPage(totalPages)}
            disabled={currentPage === totalPages}
          >
            <span className="sr-only">Ir a la última página</span>
            <ChevronsRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <div className="text-sm text-muted-foreground">
        {processedData.length === 0 
          ? "No hay registros"
          : `${((currentPage - 1) * itemsPerPage) + 1}-${Math.min(currentPage * itemsPerPage, processedData.length)} de ${processedData.length} registros`
        }
      </div>
    </div>
  );

  useEffect(() => {
    fetchData();
  }, [selectedBot]);

  // Resetear página cuando cambie la búsqueda
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  return (
    <div className="flex-1 space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => router.back()}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Volver
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Casos con Datos de Clientes</h1>
            <p className="text-muted-foreground">
              Vista detallada de casos detectados con información completa del cliente
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleApplyFilters} disabled={reportLoading}>
            {reportLoading ? (
              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Filter className="h-4 w-4 mr-2" />
            )}
            Actualizar
          </Button>
          <Button size="sm" onClick={handleExport} disabled={processedData.length === 0}>
            <Download className="h-4 w-4 mr-2" />
            Exportar CSV
          </Button>
        </div>
      </div>

      {/* Filtros */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filtros y Búsqueda
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
            {/* Rango de fechas */}
            <div className="flex items-center gap-2">
              <Label htmlFor="date-from" className="text-sm font-medium">Desde:</Label>
              <Input
                id="date-from"
                type="date"
                value={dateRange.from}
                onChange={(e) => handleDateChange('from', e.target.value)}
                className="w-auto"
              />
            </div>
            <div className="flex items-center gap-2">
              <Label htmlFor="date-to" className="text-sm font-medium">Hasta:</Label>
              <Input
                id="date-to"
                type="date"
                value={dateRange.to}
                onChange={(e) => handleDateChange('to', e.target.value)}
                className="w-auto"
              />
            </div>

            {/* Búsqueda */}
            <div className="flex items-center gap-2">
              <Label className="text-sm font-medium">Buscar:</Label>
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Caso, cliente, email, documento..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Reset */}
            <div className="flex items-center gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleResetFilters}
                className="flex items-center gap-2"
              >
                <RotateCcw className="h-4 w-4" />
                Limpiar
              </Button>
            </div>
          </div>

          {/* Selector de Bot */}
          <div className="mt-4 flex items-center gap-4">
            <Label className="text-sm font-medium">Bot:</Label>
            <div className="flex gap-2">
              {[1, 2, 3, 4].map((botNumber) => (
                <Button
                  key={botNumber}
                  size="sm"
                  variant={selectedBot === botNumber ? "default" : "outline"}
                  onClick={() => handleBotChange(botNumber)}
                  disabled={reportLoading}
                  className="flex items-center gap-2"
                >
                  <BotIcon className="h-4 w-4" />
                  Bot {botNumber}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Resumen */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Registros</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{processedData.length}</div>
            <p className="text-xs text-muted-foreground">
              {searchQuery ? `de ${caseData.length} total` : 'casos con clientes'}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Bot Seleccionado</CardTitle>
            <BotIcon className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">Bot {selectedBot}</div>
            <p className="text-xs text-muted-foreground">sistema de detección</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Período</CardTitle>
            <Calendar className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-sm font-bold">
              {new Date(dateRange.from).toLocaleDateString()} - {new Date(dateRange.to).toLocaleDateString()}
            </div>
            <p className="text-xs text-muted-foreground">rango seleccionado</p>
          </CardContent>
        </Card>
      </div>

      {/* DataTable */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Tabla de Casos Detallada
          </CardTitle>
          <CardDescription>
            Datos completos de casos detectados con información de clientes
          </CardDescription>
        </CardHeader>
        <CardContent>
          {reportLoading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : processedData.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-muted-foreground">
              <Users className="h-12 w-12 mb-4" />
              <h3 className="text-lg font-semibold mb-2">No hay datos disponibles</h3>
              <p className="text-sm">
                {searchQuery 
                  ? `No se encontraron resultados para "${searchQuery}"`
                  : `No hay casos para el Bot ${selectedBot} en el período seleccionado`
                }
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Tabla */}
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <SortableHeader field="case_id">Caso</SortableHeader>
                      <SortableHeader field="client_id">Cliente</SortableHeader>
                      <SortableHeader field="email">Email</SortableHeader>
                      <TableHead>Documento</TableHead>
                      <TableHead>Fecha Nac.</TableHead>
                      <SortableHeader field="capture_timestamp">Timestamp</SortableHeader>
                      <TableHead>Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedData.map((item, index) => (
                      <TableRow 
                        key={`${item.case_id}-${item.execution_id}-${index}`}
                        className="hover:bg-muted/30"
                      >
                        <TableCell>
                          <div className="font-mono text-blue-600 font-semibold">{item.case_id}</div>
                          <div className="text-xs text-muted-foreground">ID: {item.execution_id}</div>
                        </TableCell>
                        <TableCell>
                          <div className="font-medium">{item.first_name} {item.last_name}</div>
                          <div className="text-xs text-muted-foreground">ID: {item.client_id}</div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm max-w-[200px] truncate" title={item.email}>
                            {item.email}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            <Badge variant="outline" className="text-xs">
                              {item.national_id_type}
                            </Badge>
                          </div>
                          <div className="text-sm font-mono mt-1">{item.national_id}</div>
                        </TableCell>
                        <TableCell className="text-sm">
                          {new Date(item.birthday).toLocaleDateString('es-ES')}
                        </TableCell>
                        <TableCell>
                          <div className="text-xs font-mono">
                            {new Date(item.capture_timestamp).toLocaleDateString('es-ES')}
                          </div>
                          <div className="text-xs font-mono text-muted-foreground">
                            {new Date(item.capture_timestamp).toLocaleTimeString('es-ES')}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => viewJsonData(item.json_data)}
                              className="h-8 w-8 p-0"
                              title="Ver JSON completo"
                            >
                              <Eye className="h-3 w-3" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => copyToClipboard(
                                typeof item.json_data === 'string' 
                                  ? item.json_data 
                                  : JSON.stringify(item.json_data)
                              )}
                              className="h-8 w-8 p-0"
                              title="Copiar JSON"
                            >
                              <Copy className="h-3 w-3" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Paginación */}
              <Pagination />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
