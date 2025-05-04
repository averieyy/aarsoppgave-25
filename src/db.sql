begin;

-- Create & enter database
\c speedrun;

-- Clients
drop table if exists clients cascade;

create table clients (
  id serial not null primary key,
  username varchar(24) not null unique,
  displayname varchar(32) not null,
  hash text not null,     -- TODO: change this to a char(something) when the length of the hashes are locked down
  salt char(24) not null, -- 16 random bytes
  email text not null unique,
  joined timestamp not null default statement_timestamp(),
  deleted boolean not null default false
);

-- Tokens
drop table if exists tokens cascade;

create table tokens (
  content text not null primary key,
  client_id int not null references clients(id),
  expires timestamp not null default statement_timestamp() + interval '7 days'
);

drop table if exists files;

create table files (
  displayname text not null,
  mime text not null default 'text/plain',
  pathname text not null primary key,
  client_id int not null references clients(id),
  uploaded timestamp not null default statement_timestamp()
);

-- Games
drop table if exists games cascade;

create table games (
  id serial not null primary key,
  name text not null,
  url_id varchar(32) not null unique,
  description text not null,
  created timestamp not null default statement_timestamp(),
  image text references files(pathname) default null
);

-- Game tags
drop table if exists game_tags cascade;

create table game_tags (
  game_id int not null references games(id),
  tag varchar(24) not null,
  primary key (game_id, tag)
);

-- Game members
drop table if exists game_members cascade;

create table game_members (
  client_id int not null references clients(id),
  game_id int not null references games(id),
  admin boolean not null default false,
  banned boolean not null default false,
  primary key (client_id, game_id)
);

drop table if exists speedrun_categories;

create table speedrun_categories (
  game_id int not null references games(id),
  category_id text not null,
  id serial not null primary key,
  unique (game_id, category_id)
);

-- Speedruns
drop table if exists speedrun;

create table speedrun (
  id serial not null primary key,
  client_id int not null references clients(id),
  game_id int not null,
  category_id int not null references speedrun_categories(id),
  submitted timestamp not null default statement_timestamp(),
  score int not null,
  description text,
  verified boolean not null default false,
  deleted boolean not null default false
);

drop table if exists profile_pics;

create table profile_pics (
  client_id int not null primary key references clients(id),
  file text not null references files(pathname)
);

commit;