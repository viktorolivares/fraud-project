"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Bot as BotIcon, 
  Plus, 
  Calendar, 
  AlertTriangle,
  Activity,
  Clock,
  Database,
  Filter,
  Pencil,
  Trash
} from "lucide-react";
import { columns } from "./components/columns";
import { DataTable } from "./components/data-table";
import * as botApi from "@/api/bot.api";
import { getAllChannels } from "@/api/channel.api";
import type { Bot } from "@/types/bot";
import type { Channel } from "@/types/channel";
import { format } from "date-fns";
import { BotFormDialog } from "@/components/bot/bot-form-dialog";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { useToast } from "@/components/ui/use-toast";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Bots = () => {
  const [bots, setBots] = useState<Bot[]>([]);
  const [allBots, setAllBots] = useState<Bot[]>([]);
  const [channels, setChannels] = useState<Channel[]>([]);
  const [selectedChannelId, setSelectedChannelId] = useState<string>("all");
  const [loading, setLoading] = useState(true);
  const [selectedBot, setSelectedBot] = useState<Bot | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const { toast } = useToast();

  const fetchData = async () => {
    try {
      setLoading(true);
      const [botsData, channelsData] = await Promise.all([
        botApi.getAllBots(),
        getAllChannels()
      ]);
      setAllBots(botsData);
      
      // Mantener el filtro actual al actualizar datos
      if (selectedChannelId === "all") {
        setBots(botsData);
      } else {
        setBots(botsData.filter(bot => bot.channelId === parseInt(selectedChannelId)));
      }
      
      setChannels(channelsData);
    } catch (error) {
      console.error("Error fetching data:", error);
      toast({
        title: 'Error',
        description: 'No se pudo cargar los datos. Por favor, intenta de nuevo.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const getRecentlyActive = () => {
    return bots.filter(bot => {
      if (!bot.lastRun) return false;
      const lastRun = new Date(bot.lastRun);
      const oneDayAgo = new Date();
      oneDayAgo.setDate(oneDayAgo.getDate() - 1);
      return lastRun > oneDayAgo;
    }).length;
  };

  const getAlertTypesDistribution = () => {
    const distribution: { [key: string]: number } = {};
    bots.forEach(bot => {
      distribution[bot.alertType] = (distribution[bot.alertType] || 0) + 1;
    });
    return distribution;
  };

  const recentlyActive = getRecentlyActive();
  const alertTypes = getAlertTypesDistribution();
  // Bots inactivos: no se ejecutaron en las últimas 24h
  const inactiveCount = bots.length - recentlyActive;

  // Filtrar y agrupar bots por canal
  const filterBotsByChannel = (channelId: string) => {
    if (channelId === "all") {
      // Ordenar bots por canal para agruparlos visualmente
      const sortedBots = [...allBots].sort((a, b) => {
        // Primero ordenar por channelId (null al final)
        if (a.channelId === null && b.channelId !== null) return 1;
        if (a.channelId !== null && b.channelId === null) return -1;
        if (a.channelId === null && b.channelId === null) return 0;
        
        // Si ambos tienen channelId, compararlos
        if (a.channelId !== b.channelId) {
          return (a.channelId || 0) - (b.channelId || 0);
        }
        
        // Si tienen el mismo channelId, ordenar por nombre
        return a.name.localeCompare(b.name);
      });
      setBots(sortedBots);
    } else {
      setBots(allBots.filter(bot => bot.channelId === parseInt(channelId)));
    }
    setSelectedChannelId(channelId);
  };

  // Handlers para operaciones CRUD
  const handleCreateBot = () => {
    setSelectedBot(null);
    setIsFormOpen(true);
  };

  const handleEditBot = (bot: Bot) => {
    setSelectedBot(bot);
    setIsFormOpen(true);
  };

  const handleDeleteBot = (bot: Bot) => {
    setSelectedBot(bot);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!selectedBot) return;
    
    try {
      await botApi.deleteBot(selectedBot.id);
      toast({
        title: 'Bot eliminado',
        description: `El bot ${selectedBot.name} ha sido eliminado correctamente.`,
      });
      fetchData();
    } catch (error) {
      console.error('Error deleting bot:', error);
      toast({
        title: 'Error',
        description: 'No se pudo eliminar el bot. Por favor, intenta de nuevo.',
        variant: 'destructive',
      });
    } finally {
      setIsDeleteDialogOpen(false);
    }
  };

  // Ordenar los bots al cargarlos por primera vez
  useEffect(() => {
    if (allBots.length > 0 && selectedChannelId === "all") {
      filterBotsByChannel("all");
    }
  }, [allBots]);

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="flex-1 space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Gestión de Bots</h1>
          <p className="text-muted-foreground">
            Configuración y monitoreo de sistemas de detección automática
          </p>
        </div>
        <Button 
          className="flex items-center gap-2" 
          onClick={handleCreateBot}
        >
          <Plus className="h-4 w-4" />
          Nuevo Bot
        </Button>
      </div>
      
      {/* Filtros por Canal */}
      <div className="flex items-center gap-4 pb-2">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <span className="font-medium">Filtrar por canal:</span>
        </div>
        <Select value={selectedChannelId} onValueChange={filterBotsByChannel}>              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Todos los canales">
                  {selectedChannelId === "all" 
                    ? "Todos los canales"
                    : channels.find(c => c.id.toString() === selectedChannelId)?.name || "Canal seleccionado"}
                </SelectValue>
              </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos los canales</SelectItem>
            {channels.map((channel) => (
              <SelectItem key={channel.id} value={channel.id.toString()}>
                {channel.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Estadísticas Principales */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total</CardTitle>
            <BotIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{bots.length}</div>
            <p className="text-xs text-muted-foreground">Sistemas configurados</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Activos</CardTitle>
            <Activity className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{recentlyActive}</div>
            <p className="text-xs text-muted-foreground">Últimas 24h</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Categorías</CardTitle>
            <AlertTriangle className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{Object.keys(alertTypes).length}</div>
            <p className="text-xs text-muted-foreground">Tipos de alerta</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Inactivos</CardTitle>
            <Clock className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {inactiveCount}
            </div>
            <p className="text-xs text-muted-foreground">Sin ejecutar</p>
          </CardContent>
        </Card>
      </div>

      {/* Distribución de Tipos de Alerta */}
      {Object.keys(alertTypes).length > 0 ? (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Distribución por Tipo de Alerta
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Categorías de detección configuradas en el sistema
            </p>
          </CardHeader>
          <CardContent className="max-h-[220px] overflow-y-auto">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3 py-2 pr-2">
              {Object.entries(alertTypes).map(([type, count], index) => {
                const colors = [
                  { 
                    bg: 'bg-blue-100 dark:bg-blue-900/30', 
                    text: 'text-blue-700 dark:text-blue-300', 
                    border: 'border-blue-200 dark:border-blue-800', 
                    icon: 'text-blue-500 dark:text-blue-400',
                    badge: 'bg-blue-50 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300'
                  },
                  { 
                    bg: 'bg-green-100 dark:bg-green-900/30', 
                    text: 'text-green-700 dark:text-green-300', 
                    border: 'border-green-200 dark:border-green-800', 
                    icon: 'text-green-500 dark:text-green-400',
                    badge: 'bg-green-50 dark:bg-green-900/50 text-green-700 dark:text-green-300'
                  },
                  { 
                    bg: 'bg-orange-100 dark:bg-orange-900/30', 
                    text: 'text-orange-700 dark:text-orange-300', 
                    border: 'border-orange-200 dark:border-orange-800', 
                    icon: 'text-orange-500 dark:text-orange-400',
                    badge: 'bg-orange-50 dark:bg-orange-900/50 text-orange-700 dark:text-orange-300'
                  },
                  { 
                    bg: 'bg-purple-100 dark:bg-purple-900/30', 
                    text: 'text-purple-700 dark:text-purple-300', 
                    border: 'border-purple-200 dark:border-purple-800', 
                    icon: 'text-purple-500 dark:text-purple-400',
                    badge: 'bg-purple-50 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300'
                  },
                  { 
                    bg: 'bg-pink-100 dark:bg-pink-900/30', 
                    text: 'text-pink-700 dark:text-pink-300', 
                    border: 'border-pink-200 dark:border-pink-800', 
                    icon: 'text-pink-500 dark:text-pink-400',
                    badge: 'bg-pink-50 dark:bg-pink-900/50 text-pink-700 dark:text-pink-300'
                  },
                  { 
                    bg: 'bg-indigo-100 dark:bg-indigo-900/30', 
                    text: 'text-indigo-700 dark:text-indigo-300', 
                    border: 'border-indigo-200 dark:border-indigo-800', 
                    icon: 'text-indigo-500 dark:text-indigo-400',
                    badge: 'bg-indigo-50 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300'
                  },
                ];
                const colorScheme = colors[index % colors.length];
                
                return (
                  <div
                    key={type}
                    className={`
                      ${colorScheme.bg} ${colorScheme.border} ${colorScheme.text}
                      border rounded-lg p-3 flex flex-col items-center justify-center 
                      h-[100px] hover:shadow-md dark:hover:shadow-lg transition-all duration-200 
                      hover:scale-105 cursor-pointer backdrop-blur-sm
                    `}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <AlertTriangle className={`h-4 w-4 ${colorScheme.icon}`} />
                      <Badge 
                        variant="secondary" 
                        className={`text-xs px-2 py-1 ${colorScheme.badge} border-0`}
                      >
                        {count}
                      </Badge>
                    </div>
                    <div className="text-sm font-medium text-center line-clamp-2 leading-tight">
                      {type}
                    </div>
                    <div className="text-xs opacity-75 mt-1">
                      {((count / bots.length) * 100).toFixed(0)}%
                    </div>
                  </div>
                );
              })}
            </div>
            
            {/* Estadísticas adicionales */}
            <div className="mt-4 pt-4 border-t flex items-center justify-between text-sm text-muted-foreground">
              <span>
                <strong>{Object.keys(alertTypes).length}</strong> categorías diferentes
              </span>
              <span>
                Total: <strong>{bots.length}</strong> sistemas configurados
              </span>
            </div>
          </CardContent>
        </Card>
      ) : null}

      {/* Tabla de Sistemas */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                Sistemas de Detección
              </CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Administra y monitorea tus sistemas automáticos
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={fetchData} disabled={loading}>
                <Activity className="h-4 w-4 mr-2" />
                {loading ? "Actualizando..." : "Actualizar"}
              </Button>
              <Button size="sm" className="flex items-center gap-2" onClick={handleCreateBot}>
                <Plus className="h-4 w-4" />
                Nuevo Sistema
              </Button>
            </div>
          </div>
          {channels.length > 0 && (
            <Tabs value={selectedChannelId} onValueChange={filterBotsByChannel} className="mt-4">
              <TabsList className="overflow-x-auto space-x-2">
                <TabsTrigger value="all">Todos los canales</TabsTrigger>
                {channels.map(channel => (
                  <TabsTrigger key={channel.id} value={channel.id.toString()}>
                    {channel.name}
                  </TabsTrigger>
                ))}
                {bots.some(bot => bot.channelId === null) && (
                  <TabsTrigger value="null">Sin canal</TabsTrigger>
                )}
              </TabsList>
            </Tabs>
          )}
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <div className="flex items-center justify-center h-32 bg-muted/20">
              <div className="flex items-center gap-2 text-muted-foreground">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                <span>Cargando sistemas...</span>
              </div>
            </div>
          ) : bots.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-40 text-center bg-muted/20">
              <BotIcon className="h-12 w-12 mb-3 text-muted-foreground/50" />
              <div className="space-y-2">
                <h3 className="font-medium text-muted-foreground">No hay sistemas configurados</h3>
                <p className="text-sm text-muted-foreground">
                  Crea tu primer sistema de detección automática
                </p>
                <Button variant="outline" size="sm" className="mt-3" onClick={handleCreateBot}>
                  <Plus className="h-4 w-4 mr-2" />
                  Crear Sistema
                </Button>
              </div>
            </div>
          ) : (
            <div className="p-6">
              <DataTable columns={columns} data={bots} onEdit={handleEditBot} onDelete={handleDeleteBot} />
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* Diálogo para crear/editar bot */}
      <BotFormDialog
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        bot={selectedBot}
        channels={channels}
        onSave={fetchData}
      />

      {/* Diálogo para confirmar eliminación */}
      <ConfirmDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        title="Eliminar Bot"
        description={`¿Estás seguro de que deseas eliminar el bot ${selectedBot?.name}? Esta acción no se puede deshacer.`}
        confirmText="Eliminar"
        onConfirm={confirmDelete}
      />
    </div>
  );
};

export default Bots;
