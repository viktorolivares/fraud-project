'use client';

import { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Plus, Trash, Pencil } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { getAllBots, deleteBot } from '@/api/bot.api';
import { getAllChannels } from '@/api/channel.api';
import type { Bot } from '@/types/bot';
import type { Channel } from '@/types/channel';
import { formatDate } from '@/lib/date-utils';
import { BotFormDialog } from '@/components/bot/bot-form-dialog';
import { ConfirmDialog } from '@/components/shared/confirm-dialog';

export default function BotsPage() {
  const [bots, setBots] = useState<Bot[]>([]);
  const [channels, setChannels] = useState<Channel[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedBot, setSelectedBot] = useState<Bot | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const { toast } = useToast();

  const fetchData = async () => {
    try {
      setLoading(true);
      const [botsData, channelsData] = await Promise.all([
        getAllBots(),
        getAllChannels()
      ]);
      setBots(botsData);
      setChannels(channelsData);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast({
        title: 'Error',
        description: 'No se pudo cargar los datos. Por favor, intenta de nuevo.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

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
      await deleteBot(selectedBot.id);
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

  const getChannelName = (channelId?: number | null) => {
    if (!channelId) return 'No asignado';
    const channel = channels.find(c => c.id === channelId);
    return channel ? channel.name : 'Canal desconocido';
  };

  return (
    <div className="container py-8 mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Gestión de Bots</h1>
        <Button onClick={handleCreateBot}>
          <Plus className="h-5 w-5 mr-2" />
          Crear Bot
        </Button>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Bots</CardTitle>
          <CardDescription>
            Lista de todos los bots configurados en el sistema.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-4">Cargando...</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Tipo de Alerta</TableHead>
                  <TableHead>Canal</TableHead>
                  <TableHead>Última Ejecución</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {bots.length > 0 ? (
                  bots.map((bot) => (
                    <TableRow key={bot.id}>
                      <TableCell>{bot.id}</TableCell>
                      <TableCell>
                        <div className="font-medium">{bot.name}</div>
                        {bot.description && (
                          <div className="text-xs text-gray-500">{bot.description}</div>
                        )}
                      </TableCell>
                      <TableCell>{bot.alertType}</TableCell>
                      <TableCell>{getChannelName(bot.channelId)}</TableCell>
                      <TableCell>
                        {bot.lastRun ? formatDate(new Date(bot.lastRun)) : 'No ejecutado'}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEditBot(bot)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteBot(bot)}
                        >
                          <Trash className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-4">
                      No hay bots configurados
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <BotFormDialog
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        bot={selectedBot}
        channels={channels}
        onSave={fetchData}
      />

      <ConfirmDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        title="Eliminar Bot"
        description={`¿Estás seguro de que deseas eliminar el bot ${selectedBot?.name}? Esta acción no se puede deshacer.`}
        onConfirm={confirmDelete}
      />
    </div>
  );
}
