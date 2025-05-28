# Clone of Speedrun.com

This is a website for sharing speedruns, just like [speedrun.com](https://www.speedrun.com).

My goal for this project was to have members create games and categories, to which others could submit speedruns. I wanted administrator roles for each game, so that speedruns have to be verified before they're shown in the listings.

It consists of two parts:

- The web server using Node.js with SvelteKit & Typescript
- The database using PostgreSQL

## Installation

### With docker

Have docker and docker-compose installed.

Clone this repository.

```sh
git clone https://github.com/averieyy/aarsoppgave-25 speedrun # Clone to ./speedrun
cd speedrun
```

Create a file called `docker.env` in the project's root directory.

```sh
POSTGRES_PASSWORD=<password>
POSTGRES_DB=speedrun
POSTGRES_USER=postgres
```

You also have to copy the file to `.env`

> [!NOTE]
> If you don't intend to just host locally, change the ORIGIN environment variable in compose.yaml BEFORE building.

Start the docker daemon process with

```sh
sudo systemctl start docker.service
```

To have it start on boot, run

```sh
sudo systemcstl enable docker.service
```

Then, run the command

```sh
sudo docker compose up -d --build
```

This will build and start the containers

If you ever want to just run the programs, use

```sh
sudo docker compose run web
```

### Without docker

Requirements

- PostgreSQL
- Yarn
- git

#### Clone this project

This one should be quite easy

```
git clone https://github.com/averieyy/aarsoppgave-25.git

cd aarsopgave-25
```

#### Set up postgres

If you haven't used postgres previously on this installation, you have to initiate the database.

```sh
(sudo) su postgres -c "initdb -D /var/lib/postgres/data"
```

Then, start the postgres service

```sh
sudo systemctl start postgresql.service
```

##### Create the database

<details>

<summary>With its own user</summary>

Create a user

```sh
sudo -u postgres createuser <username> --pwprompt
```

Then, create a database with this user as owner

```sh
sudo -u postgres createdb <name> -O <username>
```

</details>

<details>

<summary>Using postgres as the user</summary>

```
sudo -u postgres createdb speedrun
```

</details>

After you have created the database, you need to set up the tables

Copy-paste the contents of `src/db.sql` into a postgres terminal, or run the command

```sh
cat src/db.sql | psql -U <username> <database>
```

##### Configuration

Create a file `.env` in the project's root directory.

```sh
PGUSER=<username>
PGHOST=127.0.0.1 # Or the ip / url of the database
PGDATABASE=<database>
PGPASSWORD=<password>
```

#### Install dependencies

```sh
yarn install
```

## Running the project

### Release build

```
yarn build
node build/index.js
```

### Development server

```
yarn dev
```

### Docker

```sh
sudo docker compose run web
```