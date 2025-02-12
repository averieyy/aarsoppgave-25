begin;

-- Clients
drop table if exists clients cascade;

create table clients (
  id serial not null primary key,
  username varchar(24) not null unique,
  hash text not null,     -- TODO: change this to a char(something) when the length of the hashes are locked down
  salt char(24) not null, -- 16 random bytes
  email text not null unique,
  joined timestamp not null default statement_timestamp()
);

-- Tokens
drop table if exists tokens cascade;

create table tokens (
  content text not null primary key,
  client_id int not null references clients(id),
  expires timestamp not null default statement_timestamp() + interval '7 days'
);

-- Games
drop table if exists games cascade;

create table games (
  id serial not null primary key,
  name text not null,
  url_id varchar(32) not null,
  created timestamp not null default statement_timestamp()
);

-- Game members
drop table if exists game_members cascade;

create table game_members (
  client_id int not null references clients(id),
  game_id int not null references games(id),
  primary key (client_id, game_id)
);

commit;