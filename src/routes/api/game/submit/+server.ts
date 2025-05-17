import { Client } from "$lib/client";
import { json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";
import { db } from "$lib/db";
import { type speedrun_category, type game, type gamemember, type file } from "$lib/types";

export const POST: RequestHandler = async ({ cookies, request }) => {
  const client = await Client.getClientFromCookies(cookies);
  if (!client) return json({ message: 'Unauthorized' }, { status: 403 });

  let body;

  try {
    body = await request.json();
  } catch {
    return json({ message: 'Body not JSON' }, { status: 400 });
  }

  const { game_id, description, duration, category, proof } = body;

  // Check if the parameters are valid
  if (typeof game_id != 'number') return json({ message: 'Game id invalid' }, { status: 400 });
  if (typeof description != 'string') return json({ message: 'Description invalid' }, { status: 400 });
  if (typeof duration != 'number') return json({ message: 'Duration invalid' }, { status: 400 });
  if (typeof category != 'number') return json({ message: 'Category invalid' }, { status: 400 });
  if (proof != undefined && typeof proof != 'string') return json({ message: 'Proof does not have a valid type' }, { status: 400 });

  // Check if the game exists
  const game = await db.queryOne<game>('select * from games where id = $1::integer', game_id);
  if (!game) return json({ message: 'Game not found' }, { status: 404 });

  // Check if the client is allowed to submit to the game
  const gamemember = await db.queryOne<gamemember>('select * from game_members where game_id = $1::integer and client_id = $2::integer', game.id, client.id);
  if (!gamemember) return json({ message: 'Unauthorized' }, { status: 403 });
  if (gamemember.banned) return json({ message: 'You have been banned' }, { status: 403 });

  // Check if the category exists
  const existingcategory = await db.queryOne<speedrun_category>('select * from speedrun_categories where game_id = $1::int and id = $2::int', game_id, category);
  if (!existingcategory) return json({ message: 'Category not found' }, { status: 404 });

  if (proof) {
    // Check if proof exists
    const prooffile = await db.queryOne<file>('select * from files where pathname = $1::text', proof);

    if (!prooffile) return json({ message: 'Proof file does not exist' }, { status: 400 });
    
    // Check if proof matches the categories constraint
    if (!new RegExp(existingcategory.proof_match).test(prooffile?.mime))
      return json({ message: 'Proof has the wrong type' }, { status: 400 });
  }
  else if (existingcategory.require_proof)
    return json({ message: 'Proof is required for this category' }, { status: 400 });

  // Register speedrun
  if (proof)
    await db.execute('insert into speedrun (client_id, game_id, score, description, category_id, proof) values ($1::integer, $2::integer, $3::integer, $4::text, $5::int, $6::text)', client.id, game.id, duration, description, existingcategory.id, proof);
  else
    await db.execute('insert into speedrun (client_id, game_id, score, description, category_id) values ($1::integer, $2::integer, $3::integer, $4::text, $5::int)', client.id, game.id, duration, description, existingcategory.id);
  
  return json({ message: 'Your speedrun has been submitted and is waiting for verification' }, { status: 200 });
}