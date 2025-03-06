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

  const { username, displayname } = body;

  if (!username || typeof username != 'string') return json({ message: 'Username not string' });

  // Check validity
  if (username.length > 24 || username.length < 3) return json({ message: 'Invalid username' });
  if (displayname.length > 32 || username.length < 3) return json({ message: 'Invalid display name' });

  // Check for duplicates
  const existing = await db.queryOne<client>('select * from clients where username = $1::text and id != $2::int', username, client.id);
  if (existing) return json({ message: 'Username taken' }, { status: 409 });

  await db.execute('update clients set username = $1::text, displayname = $2::text where id = $3::int', username, displayname, client.id);

  return json({ message: 'Updated settings' }, { status: 200 });
}