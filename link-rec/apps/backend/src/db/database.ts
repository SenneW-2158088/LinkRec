import { drizzle, NodePgDatabase } from 'drizzle-orm/node-postgres';
import 'dotenv/config';
import process from 'process';
import * as schema from './schema';
import { Pool } from 'pg';

export interface DatabaseConfig {
  host: string;
  port: number;
  database: string;
  user: string;
  password: string;
  ssl?: boolean;
  max?: number; // maximum number of clients in the pool
}

export class Database {
  private pool: Pool;
  public db: NodePgDatabase<typeof schema> & {
    $client: Pool
  };

  constructor(config: DatabaseConfig) {
    this.pool = new Pool({
      ...config,
      ssl: false,
      max: 20,
    });

    this.db = drizzle(this.pool, { schema });
  }

  public async healthCheck(): Promise<boolean> {
    try {
        await this.pool.query('SELECT 1');
        return true;
      } catch (error) {
        console.error('Database health check failed:', error);
        return false;
    }
  }
}
