import { db } from "$lib/db";
import type { game, gamemember } from "$lib/types";
import { redirect } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ parent, params }) => {
  const { client } = await parent();

  if (!client) redirect(302, `/game/${params.url_id}`);
  
  const game = await db.queryOne<game>('select * from games where url_id = $1::text', params.url_id);

  if (!game) redirect(302, '/');
  
  const gamemember = await db.queryOne<gamemember>('select * from game_members where client_id = $1::integer and game_id = $2::integer', client.id, game.id);
  if (gamemember?.banned) redirect(302, `/game/${params.url_id}`);

  return { client, game };
};