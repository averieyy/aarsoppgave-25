# API endpoints

This is a list over all the API endpoints in this project.

The files are located in `/src/routes/api`.

## Errors

Most endpoints will reply with an error HTTP status (4xx or 5xx) and an error message like this:

```json
{
  "message": "<error message>"
}
```

For example, if you reply with a bad / missing token, the server will reply like this in most cases:

```json
HTTP 403
---

{
  "message": "Unauthorized"
}
```

## List

This list is broken down in categories. This reflects the API endpoints path.

### DELETE /api/deleteacc

Deletes the account of the person who submitted the request

Response

```ts
{
  message: 'Account Deleted'
}
```

---

### Game

/api/game/...

#### POST /api/game/ban

Bans a member from submitting speedruns to a game.

Request

```ts
{
  game: string,
  target: string
}
```

Response

```ts
{
  message: "Banned member"
}
```

---

#### POST /api/game/category/add

Adds a game category

Request

```ts
{
  category_label: string,
  game: number,
  require_proof: boolean,
  proof_math: string
}
```

Response

```ts
{
  message: "Added category"
}
```

---

#### POST /api/game/category/edit

Edits a game category

Request

```ts
{
  category_label: string,
  new_category_label: string,
  game: number,
  require_proof: boolean,
  proof_math: string
}
```

Response

```ts
{
  message: "Edited category"
}
```

---

#### POST /api/game/create

Creates a game

Request

```ts
{
  title: string,
  description: string,
  tags: string[],
  categories: string[],
}
```

Response

```ts
{
  message: "Added game",
  id: string
}
```

---

#### POST /api/game/deny

Denies a speedrun (Instead of adding it to the leaderboard)

Request

```ts
{
  speedrun: number
}
```

Response

```ts
{
  message: "Denied speedrun"
}
```

---

#### POST /api/game/description

Set the game's description

Request

```ts
{
  description: string,
  game: string
}
```

Response

```ts
{
  message: 'Updated description'
}
```

---

#### POST /api/game/image

Set the game's image

Request

```ts
{
  file: string,
  game: number
}
```

Response

```ts
{
  message: "Updated game image"
}
```

---

#### POST /api/game/submit

Submit a speedrun

Request

```ts
{
  game: number,
  description: string,
  duration: number,
  category: number,
  proof: string
}
```

Response

```ts
{
  message: "Your speedrun has been submitted and is waiting for verification"
}
```

---

#### POST /api/game/title

Edit game title

Request

```ts
{
  game: string,
  name: string
}
```

Response

```ts
{
  message: "Name updated"
}
```

---

#### POST /api/game/unban

Unban a member

Request

```ts
{
  game: string,
  username: string
}
```

Response

```ts
{
  message: "Unbanned member"
}
```

---

#### POST /api/game/verify

Verify a speedrun

Request

```ts
{
  speedrun: number
}
```

Response

```ts
{
  message: "Verified speedrun"
}
```

---

#### GET /api/games

Verify a speedrun

Request Parameters

```url
?query=<query>
&tags=<comma-separated list>
```

Response

```ts
{
  games: [
    {
      name: string,
      description: string,
      image: string,
      url_id: string
    },
    // ...
  ]
}
```

---

### POST /api/login

Log in

Request

```ts
{
  username: string,
  password: string
}
```

Response

```ts
{
  message: "Logged in"
}
```

---

### POST /api/logout

Log out of your account

No request body

Response

```ts
Logged out
```

---

### POST /api/profilepic

Set profile picture

Request

```ts
{
  uuid: string
}
```

Response

```ts
{
  message: "Updated profile picture"
}
```

---

### DELETE /api/profilepic

Remove profile picture

Response

```ts
{
  message: "Removed profile picture"
}
```

---

### POST /api/register

Register profile

Request

```ts
{
  username: string,
  email: string,
  password: string
}
```

Response

```ts
{
  message: "Registered"
}
```

---

### POST /api/settings

Submit a speedrun

Request

```ts
{
  username: string,
  displayname: string
}
```

Response

```ts
{
  message: "Updated settings"
}
```

---

### POST /api/upload

Upload a file

Request

FORM with a 'file' parameter

Response

```ts
{
  message: "Uploaded file",
  id: string
}
```

---

### GET /api/uploads/[uuid]/

Get contents of a file with the specified UUID

Response

The file requested in bytes, with the appropriate MIME type.