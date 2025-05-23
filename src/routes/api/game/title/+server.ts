import { Client } from "$lib/client";
import { db } from "$lib/db";
import { type gamemember } from "$lib/types";
import { json, type RequestHandler } from "@sveltejs/kit";

export const POST: RequestHandler = async ({ cookies, request }) => {
  const client = await Client.getClientFromCookies(cookies);
  if (!client) return json({ message: 'Unauthorized' }, { status: 403 });

  let body;

  try {
    body = await request.json();
  } catch {
    return json({ message: 'Body not JSON' }, { status: 400 });
  }

  const { game, name } = body;

  if (typeof game != 'string') return json({ message: 'game parameter is not string' }, { status: 400 });
  if (typeof name != 'string') return json({ message: 'name parameter is not string' }, { status: 400 });

  const member = await db.queryOne<gamemember>('select m.* from game_members m join games g on g.id = m.game_id where g.url_id = $1::text and m.client_id = $2::integer', game, client.id);
  if (!member?.admin) return json({ message: 'Unauthorized' }, { status: 403 });

  await db.execute('update games set name = $1::text where id = $2::integer', name, member.game_id);

  return json({ message: 'Name updated' }, { status: 200 });
}