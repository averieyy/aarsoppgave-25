import { json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";
import { Client } from "$lib/client";
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

  // Get all the required information from the request body
  const { title, description, tags, categories } = body;

  // Check if the parameters are valid
  if (!title || typeof title != 'string' || title.length > 48) return json({ message: 'Bad title' }, { status: 400 });
  if (!description || typeof description != 'string') return json({ message: 'Bad descripton' }, { status: 400 });
  if (!(tags instanceof Array)) return json({ message: 'Invalid tags' }, { status: 400 });
  if (!(categories instanceof Array)) return json({ message: 'Invalid categories' }, { status: 400 });
  if (categories.length < 1) return json({ message: 'At least one category is required' }, { status: 400 });

  // Create the url version of the title
  const urlTitle = title
    .toLowerCase()
    .replaceAll(/ +/g, '_')
    .replaceAll(/[^a-z0-9_]/g, '');

  const existing = await db.queryOne<game>('select * from games where url_id = $1::text', urlTitle);
  if (existing) return json({ message: 'Name already in use' }, { status: 409 });

  let idresponse: {id: number} | undefined;

  const ok = await db.doTransaction(async c => {
    // Create game
    idresponse = await c.queryOne<{id: number}>('insert into games (name, url_id, description) values ($1::text, $2::text, $3::text) returning id', title, urlTitle, description);
    if (!idresponse) return false;

    // Add tags
    for (let tag of tags) {
      await c.execute('insert into game_tags (game_id, tag) values ($1::integer, $2::text)', idresponse.id, tag);
    }

    // Add categories
    for (let category of categories) {
      await c.execute('insert into speedrun_categories (game_id, category_label) values ($1::int, $2::text)', idresponse.id, category);
    }

    // Add user as game admin
    await c.execute('insert into game_members (client_id, game_id, admin) values ($1::int, $2::int, true)', client.id, idresponse.id);

    return true;
  });

  if (!ok) return json({ message: 'Internal error' }, { status: 500 });

  return json({ message: 'Added game', id: idresponse?.id, url_id: urlTitle }, { status: 200 });
}