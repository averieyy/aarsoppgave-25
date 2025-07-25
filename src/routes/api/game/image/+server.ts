import { Client } from "$lib/client"
import { json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types"
import { db } from "$lib/db";
import type { file, game, gamemember } from "$lib/types";

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

  const { game: gameid, file } = body;

  // Check if the parameters are valid
  if (typeof gameid != 'string' || !gameid) return json({ message: 'Invalid or missing game parameter' }, { status: 400 });
  if (typeof file != 'string' || !file) return json({ message: 'Invalid or missing file parameter' }, { status: 400 });

  // Check if the game exists, and if the client is authorized to edit it
  const game = await db.queryOne<game & gamemember>('select * from game_members m join games g on m.game_id = g.id where g.url_id = $1::text and m.client_id = $2::integer', gameid, client.id);
  if (!game) return json({ message: 'Could not find game' }, { status: 404 });
  if (!game.admin) return json({ message: 'Unauthorized' }, { status: 403 });

  // Check if the file exists, and if it is an image
  const existingfile = await db.queryOne<file>('select * from files where pathname = $1::text', file);
  if (!existingfile) return json({ message: 'Could not find image' }, { status: 404 });
  if (!existingfile.mime.startsWith('image')) return json({ message: 'File is not an image' }, { status: 400 });

  await db.execute('update games set image = $1::text where id = $2::integer', file, game.id);

  return json({ message: 'Updated game image' }, { status: 200 });
}