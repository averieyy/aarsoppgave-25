import { db } from "$lib/db";
import type { game, gamemember, speedrun_category } from "$lib/types";
import { redirect } from "@sveltejs/kit";
import type { LayoutServerLoad } from "./$types";

export const load: LayoutServerLoad = async ({ parent, params }) => {
  const { client } = await parent();

  const gameid = params.url_id;
  const game = await db.queryOne<game>('select * from games where url_id = $1::text', gameid);

  if (!game) redirect(302, '/');

  const member = client
    ? await db.queryOne<gamemember>('select * from game_members where client_id = $1::int and game_id = $2::int', client.id, game.id) // If a such member already exists, use this
      || await db.queryOne<gamemember>('insert into game_members (client_id, game_id) values ($1::int, $2::int) returning *', client.id, game.id) // Create a new member for this client
    : undefined;

  const categories = await db.queryAll<speedrun_category>('select * from speedrun_categories where game_id = $1::int', game.id);

  return { member, game, categories }
};