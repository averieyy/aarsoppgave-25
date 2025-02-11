import pg, { Client, Pool, type PoolClient } from 'pg';
import 'dotenv/config';


class DBConnection {
  connection: PoolClient | Client;

  constructor (client: PoolClient | Client) {
    this.connection = client;
  }
  
  async queryAll <T extends pg.QueryResultRow>(query: string, ...args: any[]): Promise<T[]> {
    return (await this.connection.query<T>(query, args)).rows;
  }
  
  async query <T extends pg.QueryResultRow>(query: string, ...args: any[]): Promise<T | undefined> {
    return (await this.connection.query<T>(query, args)).rows[0];
  }
}

class Database extends DBConnection {
  constructor (config: pg.PoolConfig) {
    const pool = new Pool(config);
    super();
  }
}

export const db: Database = new Database({
  host: process.env.PGHOST,
  user: process.env.PGUSER,
  password: process.env.PGPASSWORD,
  database: process.env.PGDATABASE,
});