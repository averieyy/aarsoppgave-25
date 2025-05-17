import { Client } from "$lib/client";
import { json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";
import { db } from "$lib/db";
import type { gamemember } from "$lib/types";

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

  // Checking if the parameters are valid
  if (!description || typeof description != 'string') return json({ message: 'Description not string' }, { status: 400 });
  if (!game || typeof game != 'string') return json({ message: 'Game not string' }, { status: 400 });

  // Check if the client is authorized (doubles as a check if the game exists)
  const member = await db.queryOne<gamemember>('select m.* from game_members m join games g on g.id = m.game_id where g.url_id = $1::text and m.id = $2::integer and m.admin = true', game, client.id);
  if (!member) return json({ message: 'Unauthorized' }, { status: 403 });

  // Update description
  await db.execute('update games set description = $1::text where url_id = $2::text', description, game);

  return json({ message: 'Updated description' }, { status: 200 });
}