import { Client } from "$lib/client";
import { json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";
import { db } from "$lib/db";
import type { gamemember, game } from "$lib/types";

export const POST: RequestHandler = async ({ cookies, request }) => {
  const client = await Client.getClientFromCookies(cookies);

  if (!client) return json({ message: 'Unauthorized' }, { status: 403 });

  let body;

  try {
    body = await request.json();
  } catch {
    return json({ message: 'Body not JSON' }, { status: 400 });
  }

  // Fetch the game and the ban target from the request
  const { game: game_id, target } = body;

  if (typeof game_id != 'string') return json({ message: 'Invalid game parameter' }, { status: 400 });
  if (typeof target != 'string') return json({ message: 'Invalid target parameter' }, { status: 400 });

  // Check that the game exists
  const game = await db.queryOne<game>('select * from games where url_id = $1::text', game_id);
  if (!game) return json({ message: 'Game not found' }, { status: 404 });

  // Check that the client is authorized to ban others
  const game_member = await db.queryOne<gamemember>('select * from game_members where client_id = $1::integer and game_id = $2::integer', client.id, game.id);
  if (!game_member || !game_member.admin || game_member.banned) return json({ message: 'Unauthorized' }, { status: 403 });

  // Check that the target can be banned
  const target_member = await db.queryOne<gamemember>('select m.* from game_members m join clients c on c.id = m.client_id where c.username = $1::text and m.game_id = $2::integer', target, game.id);
  if (!target_member) return json({ message: 'Member not found' }, { status: 404 });
  if (target_member.admin) return json({ message: 'Cannot ban an admin' }, { status: 400 });

  // Ban the target
  await db.execute('update game_members set banned = true where client_id = $1::integer and game_id = $2::integer', target_member.client_id, game.id);

  return json({ message: 'Banned member' }, { status: 200 })
}