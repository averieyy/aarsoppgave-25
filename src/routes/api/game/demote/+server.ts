import { Client } from "$lib/client";
import { json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";
import { db } from "$lib/db";
import type { game, gamemember } from "$lib/types";

export const POST: RequestHandler = async ({ cookies, request }) => {
  const client = await Client.getClientFromCookies(cookies);
  if (!client) return json({ message: 'Unauthorized' }, { status: 403 });

  // Get parameters
  let body;

  try {
    body = await request.json();
  }
  catch {
    return json({ message: 'Body not JSON' }, { status: 400 });
  }

  const { game, target } = body;

  // Check parameters
  if (!game || typeof game != 'string') return json({ message: 'Invalid game parameter' }, { status: 400 });
  if (!target || typeof target != 'string') return json({ message: 'Invalid target parameter' }, { status: 400 });

  // Check if the game exists
  const gameExists = await db.queryOne<game>('select * from games where url_id = $1::text', game);
  if (!gameExists) return json({ message: 'Game does not exist' }, { status: 404 });

  // Check if the client is administrator
  const clientIsAdmin = await db.queryOne<{ admin: boolean }>('select admin from game_members where client_id = $1::integer and game_id = $2::integer', client.id, gameExists.id);
  if (!clientIsAdmin?.admin) return json({ message: 'Unauthorized' }, { status: 403 });

  // Check if the target is a member or administrator
  const targetExists = await db.queryOne<gamemember>('select m.* from game_members m join clients c on m.client_id = c.id where c.username = $1::text and m.game_id = $2::integer', target, gameExists.id);
  if (!targetExists?.admin) return json({ message: 'This user is not an administrator' }, { status: 400 });

  await db.execute('update game_members set admin = false where client_id = $1::integer and game_id = $2::integer', targetExists.client_id, gameExists.id);

  return json({ message: 'Demoted from administrator' }, { status: 200 });
}