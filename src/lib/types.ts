export interface client {
  username: string;
  hash: string;
  salt: string;
  email: string;
  id: number;
  joined: Date;
  displayname: string;
}

export interface frontendclient {
  username: string,
  id: number,
  joined: Date,
  displayname: string,
  profile_pic?: string | null
}

export interface gamemember {
  game_id: number,
  client_id: number,
  admin: boolean,
  banned: boolean,
}

export interface game {
  id: number,
  name: string,
  url_id: string,
  description: string,
  created: Date,
  image: string,
}

export interface speedrun {
  id: number,
  client_id: number,
  game_id: number,
  submitted: Date,
  score: number,
  description: string,
  verified: boolean,
  deleted: boolean
}

export interface file {
  displayname: string,
  mime: string,
  pathname: string,
  client_id: number,
  uploaded: Date,
}

export interface speedrun_category {
  game_id: number,
  category_id: string,
  id: number
}