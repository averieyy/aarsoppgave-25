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

  const { speedrun }: { speedrun: number } = body;

  const member = await db.queryOne<gamemember>('select m.* from speedrun s join games g on s.game_id = g.id join game_members m on m.game_id = g.id where s.id = $1::integer and m.admin = true', speedrun);
  
  if (!member) return json({ message: 'Unauthorized' }, { status: 403 });

  await db.execute('update speedrun set verified = true where id = $1::integer', speedrun);

  return json({ message: 'Verified speedrun' }, { status: 200 });
}