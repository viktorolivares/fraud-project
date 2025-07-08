"use client";

import React, { useEffect, useState } from 'react';
import { CalendarIcon, Filter } from 'lucide-react';
import { format, subDays } from 'date-fns';
import { es } from 'date-fns/locale';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { useDashboardFilters } from '@/contexts/dashboard-filter-provider';
import { useDashboardData } from '@/hooks/use-dashboard-data';

interface Channel {
  id: number;
  name: string;
  description?: string;
  totalIncidents: number;
}

export function DashboardFilters() {
  const { filters, updateFilter } = useDashboardFilters();
  const { data, isLoading } = useDashboardData();
  
  // Use real channels from the hook
  const channels = data.availableChannels || [];

  console.log('📊 DashboardFilters - Available channels:', {
    channelsCount: channels.length,
    channels: channels.slice(0, 3), // Log first 3 for debugging
    isLoading,
  });

  const handleFromDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateFilter('from', e.target.value);
  };

  const handleToDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateFilter('to', e.target.value);
  };

  const handleChannelChange = (value: string) => {
    if (value === 'all' || value === '' || !value) {
      updateFilter('channelId', undefined);
    } else {
      const channelId = parseInt(value, 10);
      updateFilter('channelId', isNaN(channelId) ? undefined : channelId);
    }
  };

  // Quick date range buttons
  const setQuickRange = (days: number) => {
    const today = new Date();
    const from = format(subDays(today, days - 1), 'yyyy-MM-dd');
    const to = format(today, 'yyyy-MM-dd');
    updateFilter('from', from);
    updateFilter('to', to);
  };

  const resetFilters = () => {
    const today = new Date();
    updateFilter('from', format(subDays(today, 6), 'yyyy-MM-dd'));
    updateFilter('to', format(today, 'yyyy-MM-dd'));
    updateFilter('channelId', undefined);
  };

  // Verificar que channels sea un array válido antes de renderizar
  const validChannels = Array.isArray(channels) ? channels.filter(channel => channel && channel.id != null) : [];

  const selectedChannel = (filters.channelId != null && filters.channelId !== undefined && validChannels.length > 0) 
    ? validChannels.find(c => c && c.id === filters.channelId) 
    : undefined;

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Filter className="h-5 w-5" />
          Filtros del Dashboard
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Quick Range Buttons */}
          <div className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setQuickRange(7)}
              className="text-xs"
            >
              Últimos 7 días
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setQuickRange(30)}
              className="text-xs"
            >
              Últimos 30 días
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setQuickRange(90)}
              className="text-xs"
            >
              Últimos 90 días
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={resetFilters}
              className="text-xs"
            >
              Resetear
            </Button>
          </div>

          {/* Filter Controls */}
          <div className="flex flex-wrap gap-4 items-end">
          {/* From Date Input */}
          <div className="flex flex-col space-y-2">
            <label className="text-sm font-medium">Desde</label>
            <Input
              type="date"
              value={filters.from}
              onChange={handleFromDateChange}
              className="w-[150px]"
            />
          </div>

          {/* To Date Input */}
          <div className="flex flex-col space-y-2">
            <label className="text-sm font-medium">Hasta</label>
            <Input
              type="date"
              value={filters.to}
              onChange={handleToDateChange}
              className="w-[150px]"
            />
          </div>

          {/* Channel Filter */}
          <div className="flex flex-col space-y-2">
            <label className="text-sm font-medium">Canal</label>
            <Select 
              value={filters.channelId != null && filters.channelId !== undefined ? String(filters.channelId) : 'all'} 
              onValueChange={handleChannelChange}
              disabled={isLoading}
            >
              <SelectTrigger className="w-[250px]">
                <SelectValue placeholder="Seleccionar canal" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los canales</SelectItem>
                {validChannels.map((channel) => (
                  <SelectItem key={channel.id} value={String(channel.id)}>
                    <div className="flex items-center justify-between w-full">
                      <span>{channel.name || 'Sin nombre'}</span>
                      <Badge variant="secondary" className="ml-2">
                        {channel.totalIncidents || 0}
                      </Badge>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Active Filters Display */}
          <div className="flex flex-col space-y-2">
            <label className="text-sm font-medium">Filtros activos</label>
            <div className="flex gap-2">
              <Badge variant="outline">
                {format(new Date(filters.from), "dd/MM/yyyy", { locale: es })} - {format(new Date(filters.to), "dd/MM/yyyy", { locale: es })}
              </Badge>
              {selectedChannel && (
                <Badge variant="default">
                  {selectedChannel.name}
                </Badge>
              )}
            </div>
          </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
