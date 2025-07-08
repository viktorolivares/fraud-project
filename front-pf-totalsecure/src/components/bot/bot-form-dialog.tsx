'use client';

import { useState, useEffect } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogFooter
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import { createBot, updateBot } from '@/api/bot.api';
import type { Bot, CreateBotDto } from '@/types/bot';
import type { Channel } from '@/types/channel';

interface BotFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  bot: Bot | null;
  channels: Channel[];
  onSave: () => void;
}

export function BotFormDialog({
  open,
  onOpenChange,
  bot,
  channels,
  onSave,
}: BotFormDialogProps) {
  const [formData, setFormData] = useState<CreateBotDto>({
    name: '',
    description: '',
    alertType: '',
    channelId: null,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (bot) {
      setFormData({
        name: bot.name,
        description: bot.description || '',
        alertType: bot.alertType,
        channelId: bot.channelId || null,
      });
    } else {
      setFormData({
        name: '',
        description: '',
        alertType: '',
        channelId: null,
      });
    }
  }, [bot, open]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleChannelChange = (value: string) => {
    setFormData((prev) => ({ 
      ...prev, 
      channelId: value !== 'none' ? parseInt(value, 10) : null,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      console.log('Datos a enviar al servidor:', formData);
      
      if (bot) {
        console.log('Datos para actualizar:', formData);
        await updateBot(bot.id, formData);
        toast({
          title: 'Bot actualizado',
          description: 'El bot ha sido actualizado correctamente',
        });
      } else {
        console.log('Datos para crear:', formData);
        await createBot(formData);
        toast({
          title: 'Bot creado',
          description: 'El bot ha sido creado correctamente',
        });
      }
      onSave();
      onOpenChange(false);
    } catch (error) {
      console.error('Error saving bot:', error);
      toast({
        title: 'Error',
        description: 'Hubo un error al guardar el bot. Intente de nuevo.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{bot ? 'Editar Bot' : 'Crear Bot'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Nombre
              </Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right">
                Descripción
              </Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description || ''}
                onChange={handleChange}
                className="col-span-3"
                rows={3}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="alertType" className="text-right">
                Tipo de Alerta
              </Label>
              <Input
                id="alertType"
                name="alertType"
                value={formData.alertType}
                onChange={handleChange}
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="channel" className="text-right">
                Canal
              </Label>
              <Select
                value={formData.channelId != null ? formData.channelId.toString() : 'none'}
                onValueChange={handleChannelChange}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Seleccionar canal" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Sin canal</SelectItem>
                  {channels.map((channel) => (
                    <SelectItem key={channel.id} value={channel.id.toString()}>
                      {channel.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Guardando...' : 'Guardar'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
