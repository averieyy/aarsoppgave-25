import type { Cookies } from "@sveltejs/kit";
import type { client, frontendclient } from "./types";
import { db } from "./db";
import { randomBytes, createHash } from 'crypto';

const ONE_WEEK = 60 * 60 * 24 * 7;

export class Client {
  username: string;
  hash: string;
  salt: string;
  email: string;
  id: number;
  joined: Date;
  displayname: string;

  private constructor (username: string, hash: string, salt: string, email: string, id: number, joined: Date, displayname: string) {
    this.username = username;
    this.hash = hash;
    this.salt = salt;
    this.email = email;
    this.id = id;
    this.joined = joined;
    this.displayname = displayname;
  }

  static async getClientFromCookies (cookies: Cookies): Promise<Client | null> {
    const token = cookies.get('token');
    if (!token) return null;

    const client = await db.queryOne<client>(`
      update tokens t
      set expires = now() + interval '7 days'
      from clients as c
        where t.client_id = c.id
        and t.content = $1::text
        and t.expires > now()
      returning c.*`, token);
    if (!client) return null;

    this.setToken(cookies, token);

    return this.fromStruct(client);
  }

  static fromStruct(client: client): Client {
    return new Client(
      client.username,
      client.hash,
      client.salt,
      client.email,
      client.id,
      client.joined,
      client.displayname
    );
  }

  static genToken(): string {
    return randomBytes(32).toString('base64url');
  }

  async newToken (cookies: Cookies) {
    const token = Client.genToken();

    await db.execute('insert into tokens (content, client_id) values ($1::text, $2::integer)', token, this.id);

    Client.setToken(cookies, token);
  }

  static async setToken (cookies: Cookies, token: string) {
    cookies.set('token', token, {
      path: '/',        // Valid for the entire page
      maxAge: ONE_WEEK, // Valid for one week (resets upon page reload)
      secure: false,    // HTTP not HTTPS
    });
  }

  static genSalt (): string {
    return randomBytes(16).toString('base64');
  }

  static hashPassword (password: string, salt: string) {
    const hash = createHash('shake256');

    hash.update(password + salt);

    return hash.digest().toString('base64');
  }

  static async registerNewClient(username: string, password: string, email: string): Promise<Client | null> {
    const salt = this.genSalt();
    const hash = this.hashPassword(password, salt);

    // Check for dupes
    const existing = await db.queryOne<client>(`
      select * from clients
      where
        username = $1::text
        or email = $2::text`,username, email);

    if (existing) return null;
    
    const client = await db.queryOne<client>(`
      insert into
        clients (username, hash, salt, email, displayname)
        values ($1::text, $2::text, $3::text, $4::text, $1::text)
      returning *`, username, hash, salt, email); 
    if (!client) return null;
    
    return Client.fromStruct(client);
  }

  toJSON(): frontendclient {
    return {
      username: this.username,
      id: this.id,
      joined: this.joined,
      displayname: this.displayname
    }
  }
}