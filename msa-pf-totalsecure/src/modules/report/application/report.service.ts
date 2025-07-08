import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import type {
  StoredProcedureResult,
  Bot1SummaryResult,
  Bot2SummaryResult,
  Bot3SummaryResult,
  Bot4SummaryResult,
  CaseDataWithClientResult,
} from '../types/report.types';

@Injectable()
export class ReportService {
  constructor(private readonly dataSource: DataSource) {}

  private convertBigIntToNumber<T extends StoredProcedureResult>(rows: T[]): T[] {
    return rows.map(row => {
      const result = {} as T;
      for (const [key, value] of Object.entries(row)) {
        (result as Record<string, unknown>)[key] = typeof value === 'bigint' ? Number(value) : value;
      }
      return result;
    });
  }

  private async executeStoredProcedure<T extends StoredProcedureResult = StoredProcedureResult>(
    query: string,
    parameters: (string | number)[]
  ): Promise<T[]> {
    try {
      const rows: unknown = await this.dataSource.query(query, parameters);
      
      // Validar que el resultado sea un array
      if (!Array.isArray(rows)) {
        throw new Error('Expected query result to be an array');
      }

      // Convertir y retornar los resultados con tipo seguro
      return this.convertBigIntToNumber(rows as T[]);
    } catch (error) {
      throw new Error(`Error executing stored procedure: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // Métodos específicos para cada bot summary
  async getBot1Summary(from: string, to: string): Promise<Bot1SummaryResult[]> {
    return this.executeStoredProcedure<Bot1SummaryResult>(
      `SELECT * FROM get_bot1_summary($1, $2)`,
      [from, to]
    );
  }

  async getBot2Summary(from: string, to: string): Promise<Bot2SummaryResult[]> {
    return this.executeStoredProcedure<Bot2SummaryResult>(
      `SELECT * FROM get_bot2_summary($1, $2)`,
      [from, to]
    );
  }

  async getBot3Summary(from: string, to: string): Promise<Bot3SummaryResult[]> {
    return this.executeStoredProcedure<Bot3SummaryResult>(
      `SELECT * FROM get_bot3_summary($1, $2)`,
      [from, to]
    );
  }

  async getBot4Summary(from: string, to: string): Promise<Bot4SummaryResult[]> {
    return this.executeStoredProcedure<Bot4SummaryResult>(
      `SELECT * FROM get_bot4_summary($1, $2)`,
      [from, to]
    );
  }

  // Método para obtener casos con datos de cliente enriquecidos
  async getCaseDataWithClients(from: string, to: string, botId: number): Promise<CaseDataWithClientResult[]> {
    return this.executeStoredProcedure<CaseDataWithClientResult>(
      `SELECT * FROM get_case_data_with_clients($1, $2, $3)`,
      [from, to, botId]
    );
  }
}
