import pg from 'pg';
import 'dotenv/config';

// Custom abstraction for Database connection
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

  // Do a transaction (so that everything happends in one command)
  async doTransaction(transaction: (cursor: Connection) => Promise<boolean | void>): Promise<boolean> {
    this.execute('begin');
    
    let resp;

    try {
      resp = await transaction(this);
      if (resp == false) this.execute('rollback');
      else this.execute('commit');
    }
    catch (e) {
      console.error(e);
      this.execute('rollback');
    }

    return resp != false;
  }
}

// This does the same as the Connection class, but it uses cursors
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

  override async doTransaction(transaction: (cursor: Connection) => Promise<boolean | void>): Promise<boolean> {
    const cursor = await this.getCursor();

    return await cursor.doTransaction(transaction);
  }
}

// The default database connection
export const db: PoolConnection = await PoolConnection.fromConfig({
  host: process.env.POSTGRES_HOST,
  user: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DB,
});