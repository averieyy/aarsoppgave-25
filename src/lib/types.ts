export interface client {
  username: string;
  hash: string;
  salt: string;
  email: string;
  id: number;
  joined: Date;
}

export interface frontendclient {
  username: string,
  id: number,
  joined: Date,
}

export interface gamemember {
  game_id: number,
  client_id: number,
  admin: boolean,
}

export interface game {
  id: number,
  name: string,
  url_id: string,
  description: string,
  created: Date,
}