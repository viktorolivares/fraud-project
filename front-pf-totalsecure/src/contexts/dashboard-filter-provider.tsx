"use client";

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { format, subDays } from 'date-fns';

export interface DashboardFilters {
  from: string;
  to: string;
  channelId?: number;
}

interface DashboardFilterContextType {
  filters: DashboardFilters;
  setFilters: (filters: DashboardFilters) => void;
  updateFilter: (key: keyof DashboardFilters, value: string | number | undefined) => void;
}

const DashboardFilterContext = createContext<DashboardFilterContextType | undefined>(undefined);

export function DashboardFilterProvider({ children }: { children: ReactNode }) {
  // Default to last 7 days
  const today = new Date();
  const defaultFilters: DashboardFilters = {
    from: format(subDays(today, 6), 'yyyy-MM-dd'),
    to: format(today, 'yyyy-MM-dd'),
    channelId: undefined,
  };

  const [filters, setFilters] = useState<DashboardFilters>(defaultFilters);

  const updateFilter = (key: keyof DashboardFilters, value: string | number | undefined) => {
    setFilters(prev => ({
      ...prev,
      [key]: key === 'channelId' && value === null ? undefined : value
    }));
  };

  return (
    <DashboardFilterContext.Provider value={{ filters, setFilters, updateFilter }}>
      {children}
    </DashboardFilterContext.Provider>
  );
}

export function useDashboardFilters() {
  const context = useContext(DashboardFilterContext);
  if (context === undefined) {
    throw new Error('useDashboardFilters must be used within a DashboardFilterProvider');
  }
  return context;
}
