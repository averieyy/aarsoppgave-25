# Clone of Speedrun.com

## Requirements

- [x] Login & registering
- [x] List of available games (and categories)
- [x] Per-game speedrunning ranking
- [x] Submitting speedruns
  - [x] Review process?
- [x] Creating game categories (tags)
- [x] Banning game members
- [ ] Searching
  - [ ] By tag 

## Installation

Requirements

|Package|DNF (fedora)|pacman (Arch)|
|-|-|-|
|PostgreSQL|postgresql|postgresql|
|Yarn|yarn|yarn|
|git|git|git|

### Clone this project

This one should be quite easy

```
git clone https://github.com/averieyy/aarsoppgave-25.git

cd aarsopgave-25
```

### Set up postgres

If you haven't used postgres previously on this installation, you have to initiate the database.

```sh
(sudo) su postgres -c "initdb -D /var/lib/postgres/data"
```

Then, start the postgres service

```sh
sudo systemctl start postgresql.service
```

#### Create the database

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

#### Configuration

Create a file `.env` in the project's root directory.

```sh
PGUSER=<username>
PGHOST=127.0.0.1 # Or the ip / url of the database
PGDATABASE=<database>
PGPASSWORD=<password>
```

### Install dependencies

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