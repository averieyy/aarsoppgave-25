import { json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";
import { Client } from "$lib/client";
import { db } from "$lib/db";
import type { client } from "$lib/types";

export const POST: RequestHandler = async ({ cookies, request }) => {
  let body;

  try {
    body = await request.json();
  } catch {
    return json({ message: 'Body not JSON' }, { status: 400 });
  }

  const { username, password }: { username: string, password: string, email: string } = body;

  // Check if parameters are valid
  if (!username || !password) return json({ message: 'Username or password missing' }, { status: 400 });

  // Check if there is a client with the selected username
  const existingclient = await db.queryOne<client>('select * from clients where username = $1::text and deleted = false', username);
  if (!existingclient) return json({ message: 'User not found' }, { status: 400 });

  // Check if the password matches
  if (Client.hashPassword(password, existingclient.salt) != existingclient.hash)
    return json({ message: 'Wrong username or password' }, { status: 400 });

  // Create the client and assign a new cookie
  const client = Client.fromStruct(existingclient);

  await client.newToken(cookies);

  return json({ message: 'Logged in' }, { status: 200 });
}