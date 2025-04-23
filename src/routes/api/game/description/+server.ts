import { Client } from "$lib/client";
import { json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";
import { db } from "$lib/db";
import type { game } from "$lib/types";

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

  const { description, game } = body;

  if (!description || typeof description != 'string') return json({ message: 'Description not string' }, { status: 400 });
  if (!game || typeof game != 'string') return json({ message: 'Game not string' }, { status: 400 });

  const existingGame = await db.queryOne<game>('select * from games where url_id = $1::text', game);
  if (!existingGame) return json({ message: 'Game not found' }, { status: 404 });

  await db.execute('update games set description = $1::text where url_id = $2::text', description, game);

  return json({ message: 'Updated description' }, { status: 200 });
}