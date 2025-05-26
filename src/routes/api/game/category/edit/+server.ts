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

  const { category_label, game, new_category_label, proof_match, require_proof } = body;

  if (typeof category_label != 'string') return json({ message: 'Bad category_label parameter' }, { status: 400 });
  if (typeof new_category_label != 'string') return json({ message: 'Bad new_category_label parameter' }, { status: 400 });
  if (typeof game != 'number') return json({ message: 'Bad game id' }, { status: 400 });
  if (typeof proof_match != 'string') return json({ message: 'Bad proof_match parameter' }, { status: 400 });
  if (typeof require_proof != 'boolean') return json({ message: 'Bad require_proof parameter' }, { status: 400 }); 

  try {
    new RegExp(proof_match);
  }
  catch {
    return json({ message: 'proof_match is not a regular expression (regex)' });
  }

  // Check if the client is authorized
  const gamemember = await db.queryOne<gamemember>('select * from game_members where game_id = $1::int and client_id = $2::int', game, client.id);
  if (!gamemember?.admin) return json({ message: 'Unauthorized' }, { status: 403 });

  // Check if the category exists
  const existingcategory = await db.queryOne<speedrun_category>('select * from speedrun_categories where game_id = $1::int and category_label = $2::text', game, category_label);
  if (!existingcategory) return json({ message: 'Category does not exist' }, { status: 400 });

  if (category_label != new_category_label) {
    // Check if a category with the same name exists for the specified game
    const newexistingcategory = await db.queryOne<speedrun_category>('select * from speedrun_categories where game_id = $1::int and category_label = $2::text', game, new_category_label);
    if (newexistingcategory) return json({ message: 'Category with this name already exists' }, { status: 400 });
  }

  await db.execute('update speedrun_categories set category_label = $1::text, proof_match = $2::text, require_proof = $3::boolean where game_id = $4::int and category_label = $5::text', new_category_label, proof_match, require_proof, game, category_label);

  return json({ message: 'Edited category' }, { status: 200 });
}