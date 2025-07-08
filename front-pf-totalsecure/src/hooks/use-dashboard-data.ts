"use client";

import { useState, useEffect, useCallback } from 'react';
import { dashboardService } from '@/services/dashboard.service';
import { useDashboardFilters } from '@/contexts/dashboard-filter-provider';
import { format, subDays } from 'date-fns';

export interface DashboardData {
  systemSummary: any[];
  casesByState: any[];
  summaryBotCases: any[];
  summaryBotCasesByDate: any[];
  summaryBotIncidents: any[];
  summaryBotIncidentsByDate: any[];
  summaryCasesByDate: any[];
  summaryIncidentsByDate: any[];
  allBotsSummaryByDate: any[];
  availableChannels: any[];
}


export interface DashboardState {
  data: DashboardData;
  isLoading: boolean;
  isError: boolean;
  error: string | null;
}

export function useDashboardData() {
  const { filters } = useDashboardFilters();
  
  const [state, setState] = useState<DashboardState>({
    data: {
      systemSummary: [],
      casesByState: [],
      summaryBotCases: [],
      summaryBotCasesByDate: [],
      summaryBotIncidents: [],
      summaryBotIncidentsByDate: [],
      summaryCasesByDate: [],
      summaryIncidentsByDate: [],
      allBotsSummaryByDate: [],
      availableChannels: [],
    },
    isLoading: false,
    isError: false,
    error: null,
  });

  const fetchData = useCallback(async () => {
    console.log('🔄 Starting dashboard data fetch...', { 
      filters,
      dateRange: `${filters.from} to ${filters.to}`,
      channelFilter: filters.channelId ? `Channel ${filters.channelId}` : 'All channels'
    });
    setState(prev => ({ ...prev, isLoading: true, isError: false, error: null }));

    try {
      const [
        systemSummary,
        casesByState,
        summaryBotCases,
        summaryBotCasesByDate,
        summaryBotIncidents,
        summaryBotIncidentsByDate,
        summaryCasesByDate,
        summaryIncidentsByDate,
        allBotsSummaryByDate,
        availableChannels
      ] = await Promise.all([
        dashboardService.getSystemSummary(filters.from, filters.to, filters.channelId),
        dashboardService.getCasesByState(filters.from, filters.to, filters.channelId),
        dashboardService.getSummaryBotCases(filters.from, filters.to, filters.channelId),
        dashboardService.getSummaryBotCasesByDate(filters.from, filters.to, filters.channelId),
        dashboardService.getSummaryBotIncidents(filters.from, filters.to, filters.channelId),
        dashboardService.getSummaryBotIncidentsByDate(filters.from, filters.to, filters.channelId),
        dashboardService.getSummaryCasesByDate(filters.from, filters.to, filters.channelId),
        dashboardService.getSummaryIncidentsByDate(filters.from, filters.to, filters.channelId),
        dashboardService.getAllBotsSummaryByDate(filters.from, filters.to, filters.channelId),
        dashboardService.getAvailableChannels(),
      ]);

      console.log('✅ All API calls completed successfully', {
        systemSummary: systemSummary?.length,
        casesByState: casesByState?.length,
        summaryBotCases: summaryBotCases?.length,
        summaryBotCasesByDate: summaryBotCasesByDate?.length,
        summaryBotIncidents: summaryBotIncidents?.length,
        summaryBotIncidentsByDate: summaryBotIncidentsByDate?.length,
        summaryCasesByDate: summaryCasesByDate?.length,
        summaryIncidentsByDate: summaryIncidentsByDate?.length,
        allBotsSummaryByDate: allBotsSummaryByDate?.length,
        availableChannels: availableChannels?.length,
      });

      // Debug: Log actual data samples
      console.log('📊 Data samples:', {
        systemSummary: systemSummary?.[0],
        casesByState: casesByState?.[0],
        summaryBotCases: summaryBotCases?.[0],
        summaryCasesByDate: summaryCasesByDate?.[0],
        summaryIncidentsByDate: summaryIncidentsByDate?.[0],
      });

      setState({
        data: {
          systemSummary,
          casesByState,
          summaryBotCases,
          summaryBotCasesByDate,
          summaryBotIncidents,
          summaryBotIncidentsByDate,
          summaryCasesByDate,
          summaryIncidentsByDate,
          allBotsSummaryByDate,
          availableChannels,
        },
        isLoading: false,
        isError: false,
        error: null,
      });
    } catch (error) {
      console.error('❌ Error fetching dashboard data:', error);
      setState(prev => ({
        ...prev,
        isLoading: false,
        isError: true,
        error: error instanceof Error ? error.message : 'Error desconocido',
      }));
    }
  }, [filters.from, filters.to, filters.channelId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const refetch = useCallback(() => {
    fetchData();
  }, [fetchData]);

  return {
    ...state,
    refetch,
  };
}

// Hook específico para dashboard summary (últimos 7 días, sin canal)
export function useDashboardSummaryData() {
  const [state, setState] = useState<{
    data: {
      systemSummary: any[];
      casesByState: any[];
      summaryBotCases: any[];
      summaryCasesByDate: any[];
      summaryIncidentsByDate: any[];
      allBotsSummaryByDate: any[];
      dateRange: { from: string; to: string };
    } | null;
    isLoading: boolean;
    isError: boolean;
    error: string | null;
  }>({
    data: null,
    isLoading: false,
    isError: false,
    error: null,
  });

  const fetchSummaryData = useCallback(async () => {
    console.log('🔄 Starting dashboard summary data fetch...');
    setState(prev => ({ ...prev, isLoading: true, isError: false, error: null }));

    try {
      const today = new Date();
      const from = format(subDays(today, 6), 'yyyy-MM-dd');
      const to = format(today, 'yyyy-MM-dd');

      console.log('📅 Summary date range:', { from, to });

      const [
        systemSummary,
        casesByState,
        summaryBotCases,
        summaryCasesByDate,
        summaryIncidentsByDate,
        allBotsSummaryByDate
      ] = await Promise.all([
        dashboardService.getSystemSummary(from, to),
        dashboardService.getCasesByState(from, to),
        dashboardService.getSummaryBotCases(from, to),
        dashboardService.getSummaryCasesByDate(from, to),
        dashboardService.getSummaryIncidentsByDate(from, to),
        dashboardService.getAllBotsSummaryByDate(from, to),
      ]);

      console.log('✅ All summary API calls completed successfully', {
        systemSummary: systemSummary?.length,
        casesByState: casesByState?.length,
        summaryBotCases: summaryBotCases?.length,
        summaryCasesByDate: summaryCasesByDate?.length,
        summaryIncidentsByDate: summaryIncidentsByDate?.length,
        allBotsSummaryByDate: allBotsSummaryByDate?.length,
      });

      setState({
        data: {
          systemSummary,
          casesByState,
          summaryBotCases,
          summaryCasesByDate,
          summaryIncidentsByDate,
          allBotsSummaryByDate,
          dateRange: { from, to }
        },
        isLoading: false,
        isError: false,
        error: null,
      });
    } catch (error) {
      console.error('❌ Error fetching dashboard summary data:', error);
      setState(prev => ({
        ...prev,
        isLoading: false,
        isError: true,
        error: error instanceof Error ? error.message : 'Error desconocido',
      }));
    }
  }, []);

  useEffect(() => {
    fetchSummaryData();
  }, [fetchSummaryData]);

  const refetch = useCallback(() => {
    fetchSummaryData();
  }, [fetchSummaryData]);

  return {
    ...state,
    refetch,
  };
}
