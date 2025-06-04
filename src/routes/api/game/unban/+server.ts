import { Client } from "$lib/client";
import { json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";
import { db } from "$lib/db";
import { type gamemember } from "$lib/types";

export const POST: RequestHandler = async ({ cookies, request }) => {
  const client = await Client.getClientFromCookies(cookies);
  if (!client) return json({ message: 'Unauthorized' }, { status: 403 });

  // Get the request Body
  let body;

  try {
    body = await request.json();
  }
  catch {
    return json({ message: 'Body not JSON' }, { status: 400 });
  }

  const { game, username } = body;

  // Check request body validity
  if (!game || typeof game != 'string') return json({ message: 'Invalid game parameter' }, { status: 400 });
  if (!username || typeof username != 'string') return json({ message: 'Invalid username parameter' }, { status: 400 });

  // Check if the client is administrator
  const member = await db.queryOne<gamemember>('select * from game_member where client_id = $1::integer', client.id);
  if (!member?.admin) return json({ message: 'Unauthorized' }, { status: 403 });

  // Check if the target is banned (and exists) 
  const target = await db.queryOne<gamemember>('select m.* from game_members m join games g on g.id = m.game_id join clients c on c.id = m.client_id where g.url_id = $1::text and c.username = $2::text', game, username);
  if (!target) return json({ message: 'Member not found' }, { status: 404 });

  if (!target.banned) return json({ message: 'Member is not banned' }, { status: 400 });

  await db.execute('update game_members set banned = false where client_id = $1::integer and game_id = $2::integer', target.client_id, target.game_id);

  return json({ message: 'Unbanned member' }, { status: 200 });
}