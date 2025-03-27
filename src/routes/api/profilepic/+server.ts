import { Client } from "$lib/client";
import { json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";
import { db } from "$lib/db";
import type { file } from "$lib/types";

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

  const { uuid } = body;
  if (!uuid || typeof uuid != 'string') return json({ message: 'UUID missing or badly formatted' }, { status: 400 });

  const file = await db.queryOne<file>('select * from files where pathname = $1::text', uuid);
  if (!file) return json({ message: 'File not found' }, { status: 404 });

  const existing = await db.queryOne<{ client_id: number, file: string }>('select * from profile_pics where client_id = $1::integer', client.id);

  if (!existing) {
    await db.execute('insert into profile_pics (client_id, file) values ($1::int, $2::text)', client.id, uuid);
  }
  else {
    await db.execute('update profile_pics set file = $1::text where client_id = $2::integer', uuid, client.id);
  }

  return json({ message: 'Updated profile picture' }, { status: 200 });
}