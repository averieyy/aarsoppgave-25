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