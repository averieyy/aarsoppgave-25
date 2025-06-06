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

  // Fetch the required data from the request body
  const { category_label, game, require_proof, proof_match } = body;

  // Check the validity of the perameters
  if (typeof category_label != 'string') return json({ message: 'Bad category_label parameter' }, { status: 400 });
  if (typeof game != 'number') return json({ message: 'Bad game id' }, { status: 400 });
  if (typeof require_proof != 'boolean') return json({ message: 'Bad require_proof parameter' }, { status: 400 });
  if (typeof proof_match != 'string') return json({ message: 'Bad proof_match parameter' }, { status: 400 });

  try {
    new RegExp(proof_match);
  }
  catch {
    return json({ message: 'proof_match is not a regular expression (regex)' }, { status: 400 });
  }

  // Check if the client is authorized
  const gamemember = await db.queryOne<gamemember>('select * from game_members where game_id = $1::int and client_id = $2::int', game, client.id);
  if (!gamemember?.admin) return json({ message: 'Unauthorized' }, { status: 403 });

  // Check if a category with this label exists for the selected game
  const existingcategory = await db.queryOne<speedrun_category>('select * from speedrun_categories where game_id = $1::int and category_label = $2::text', game, category_label);
  if (existingcategory) return json({ message: 'Category already exists' }, { status: 400 });

  await db.execute('insert into speedrun_categories (category_label, game_id, require_proof, proof_match) values ($1::text, $2::int, $3::boolean, $4::text)', category_label, game, require_proof, proof_match);

  return json({ message: 'Added category' }, { status: 200 });
}