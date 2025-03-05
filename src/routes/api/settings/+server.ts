import { Client } from "$lib/client";
import { json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";
import { db } from "$lib/db";
import type { client } from "$lib/types";

export const POST: RequestHandler = async ({ cookies, request }) => {
  const client = await Client.getClientFromCookies(cookies);
  if (!client) return json({ message: 'Unauthorized' }, { status: 403 });

  let body;

  try {
    body = await request.json();
  }
  catch {
    return json({ message: 'Body not JSON' }, { status: 400 });
  }

  const { username } = body;

  if (!username || typeof username != 'string') return json({ message: 'Username not string' });

  // Check for duplicates
  const existing = await db.queryOne<client>('select * from clients where username = $1::text and id != $2::int', username, client.id);
  if (existing) return json({ message: 'Username taken' }, { status: 409 });

  await db.execute('update clients set username = $1::text where id = $2::int', username, client.id);

  return json({ message: 'Updated settings' }, { status: 200 });
}