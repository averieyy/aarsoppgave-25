import { Client } from "$lib/client";
import { json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";
import { db } from "$lib/db";
import type { gamemember, speedrun_category } from "$lib/types";

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

  const { category_id, game, new_category_id } = body;

  if (!(typeof category_id == 'string')) return json({ message: 'Bad category_id parameter' }, { status: 400 });
  if (!(typeof game == 'number')) return json({ message: 'Bad game id' }, { status: 400 });

  const gamemember = await db.queryOne<gamemember>('select * from game_members where game_id = $1::int and client_id = $2::int', game, client.id);

  if (!gamemember?.admin) return json({ message: 'Unauthorized' }, { status: 403 });

  const existingcategory = await db.queryOne<speedrun_category>('select * from speedrun_categories where game_id = $1::int and category_id = $2::text', game, category_id);
  if (!existingcategory) return json({ message: 'Category does not exist' }, { status: 400 });

  const newexistingcategory = await db.queryOne<speedrun_category>('select * from speedrun_categories where game_id = $1::int and category_id = $2::text', game, new_category_id);
  if (newexistingcategory) return json({ message: 'Category with this name already exists' }, { status: 400 });

  await db.execute('update speedrun_categories set category_id = $1::text where game_id = $2::int and category_id = $3::text', new_category_id, game, category_id);

  return json({ message: 'Edited category' }, { status: 200 });
}