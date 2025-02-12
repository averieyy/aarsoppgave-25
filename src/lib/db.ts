import pg from 'pg';
import 'dotenv/config';

export class Connection {
  connection: pg.PoolClient | pg.Client;

  constructor (client: pg.PoolClient | pg.Client) {
    this.connection = client;
  }
  
  async queryAll <T extends pg.QueryResultRow>(query: string, ...args: any[]): Promise<T[]> {
    return (await this.connection.query<T>(query, args)).rows;
  }
  
  async queryOne <T extends pg.QueryResultRow>(query: string, ...args: any[]): Promise<T | undefined> {
    return (await this.connection.query<T>(query, args)).rows[0];
  }

  async execute (query: string, ...args: any[]) {
    await this.connection.query(query, args);
  }

  async doTransaction (transaction: (cursor: Connection) => Promise<void>): Promise<void> {
    await transaction(this);
  }
}

export class PoolConnection extends Connection {
  pool: pg.Pool;

  constructor (pool: pg.Pool, connection: pg.PoolClient) {
    super(connection);
    this.pool = pool;
  }

  static async fromConfig (config: pg.PoolConfig): Promise<PoolConnection> {
    const pool = new pg.Pool(config);
    const connection = await pool.connect();
  
    return new PoolConnection(pool, connection);
  }

  async getCursor(): Promise<Connection> {
    return new Connection(await this.pool.connect());
  }

  override async doTransaction(transaction: (cursor: Connection) => Promise<void>): Promise<void> {
    const cursor = await this.getCursor();

    await cursor.doTransaction(transaction);
  }
}

export const db: PoolConnection = await PoolConnection.fromConfig({
  host: process.env.PGHOST,
  user: process.env.PGUSER,
  password: process.env.PGPASSWORD,
  database: process.env.PGDATABASE,
});