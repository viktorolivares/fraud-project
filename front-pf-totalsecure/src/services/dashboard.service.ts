import api from '@/lib/api';

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

interface SystemSummaryResult {
  cases_count: number;
  incidents_count: number;
  bots_count: number;
  executions_count: number;
}

interface CasesByStateResult {
  state: string;
  state_count: number;
  total_count: number;
}

interface SummaryBotCasesResult {
  bot_id: number;
  bot_name: string;
  case_count: number;
}

interface SummaryBotCasesByDateResult {
  bot_id: number;
  bot_name: string;
  case_date: string;
  case_count: number;
}

interface SummaryBotIncidentsResult {
  bot_id: number;
  bot_name: string;
  incidents: number;
}

interface SummaryBotIncidentsByDateResult {
  bot_id: number;
  bot_name: string;
  exec_date: string;
  incidents: number;
}

interface SummaryCasesByDateResult {
  date: string;
  case_count: number;
}

interface SummaryIncidentsByDateResult {
  executed_date: string;
  incidents: number;
}

interface AllBotsSummaryByDateResult {
  bot_identifier: number;
  bot_name: string;
  capture_date: string;
  unique_users: number;
}

interface BotSummaryByDateResult {
  bot_identifier: number;
  bot_name: string;
  capture_date: string;
  unique_users: number;
}

interface AvailableChannel {
  id: number;
  name: string;
  description?: string;
  totalIncidents: number;
}

class DashboardService {
  private async fetchApi<T>(endpoint: string, params?: Record<string, any>): Promise<T> {
    try {
      console.log(`🔄 API Request: ${endpoint}`, { params });
      const response = await api.get(endpoint, { params });
      
      console.log(`✅ API Response: ${endpoint}`, { 
        status: response.status,
        dataType: Array.isArray(response.data) ? 'array' : typeof response.data,
        dataLength: Array.isArray(response.data) ? response.data.length : 'not-array',
        hasSuccessProperty: response.data && typeof response.data === 'object' && 'success' in response.data,
        data: response.data
      });
      
      // Check if response is wrapped in ApiResponse format
      if (response.data && typeof response.data === 'object' && 'success' in response.data && 'data' in response.data) {
        // Handle wrapped response format: { success: boolean, data: T, message?: string }
        const apiResponse = response.data as ApiResponse<T>;
        if (!apiResponse.success) {
          throw new Error(apiResponse.message || 'API request failed');
        }
        return apiResponse.data;
      } else {
        // Handle direct response format: T (direct data)
        return response.data as T;
      }
    } catch (error: any) {
      console.error(`❌ API Error: ${endpoint}`, {
        message: error.message,
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data
      });
      
      // Re-throw axios errors with proper message
      if (error.response) {
        throw new Error(`API Error: ${error.response.status} ${error.response.statusText}`);
      }
      throw error;
    }
  }

  async getSystemSummary(from: string, to: string, channelId?: number): Promise<SystemSummaryResult[]> {
    return this.fetchApi<SystemSummaryResult[]>('/dashboard/system-summary', {
      from,
      to,
      channelId,
    });
  }

  async getCasesByState(from: string, to: string, channelId?: number): Promise<CasesByStateResult[]> {
    return this.fetchApi<CasesByStateResult[]>('/dashboard/cases-by-state', {
      from,
      to,
      channelId,
    });
  }

  async getSummaryBotCases(from: string, to: string, channelId?: number): Promise<SummaryBotCasesResult[]> {
    return this.fetchApi<SummaryBotCasesResult[]>('/dashboard/summary-bot-cases', {
      from,
      to,
      channelId,
    });
  }

  async getSummaryBotCasesByDate(from: string, to: string, channelId?: number): Promise<SummaryBotCasesByDateResult[]> {
    return this.fetchApi<SummaryBotCasesByDateResult[]>('/dashboard/summary-bot-cases-by-date', {
      from,
      to,
      channelId,
    });
  }

  async getSummaryBotIncidents(from: string, to: string, channelId?: number): Promise<SummaryBotIncidentsResult[]> {
    return this.fetchApi<SummaryBotIncidentsResult[]>('/dashboard/summary-bot-incidents', {
      from,
      to,
      channelId,
    });
  }

  async getSummaryBotIncidentsByDate(from: string, to: string, channelId?: number): Promise<SummaryBotIncidentsByDateResult[]> {
    return this.fetchApi<SummaryBotIncidentsByDateResult[]>('/dashboard/summary-bot-incidents-by-date', {
      from,
      to,
      channelId,
    });
  }

  async getSummaryCasesByDate(from: string, to: string, channelId?: number): Promise<SummaryCasesByDateResult[]> {
    return this.fetchApi<SummaryCasesByDateResult[]>('/dashboard/summary-cases-by-date', {
      from,
      to,
      channelId,
    });
  }

  async getSummaryIncidentsByDate(from: string, to: string, channelId?: number): Promise<SummaryIncidentsByDateResult[]> {
    return this.fetchApi<SummaryIncidentsByDateResult[]>('/dashboard/summary-incidents-by-date', {
      from,
      to,
      channelId,
    });
  }

  async getAllBotsSummaryByDate(from: string, to: string, channelId?: number): Promise<AllBotsSummaryByDateResult[]> {
    return this.fetchApi<AllBotsSummaryByDateResult[]>('/dashboard/all-bots-summary-by-date', {
      from,
      to,
      channelId,
    });
  }

  async getBotSummaryByDate(botId: number, from: string, to: string, channelId?: number): Promise<BotSummaryByDateResult[]> {
    return this.fetchApi<BotSummaryByDateResult[]>('/dashboard/bot-summary-by-date', {
      botId,
      from,
      to,
      channelId,
    });
  }

  async getAvailableChannels(): Promise<AvailableChannel[]> {
    return this.fetchApi<AvailableChannel[]>('/dashboard/available-channels');
  }
}

export const dashboardService = new DashboardService();

export type {
  SystemSummaryResult,
  CasesByStateResult,
  SummaryBotCasesResult,
  SummaryBotCasesByDateResult,
  SummaryBotIncidentsResult,
  SummaryBotIncidentsByDateResult,
  SummaryCasesByDateResult,
  SummaryIncidentsByDateResult,
  AllBotsSummaryByDateResult,
  BotSummaryByDateResult,
  AvailableChannel,
};
