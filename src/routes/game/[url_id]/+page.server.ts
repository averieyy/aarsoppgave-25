import { db } from "$lib/db";
import type { game, gamemember } from "$lib/types";
import { redirect } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ parent, params }) => {
  const { client } = await parent();

  const { url_id } = params;

  const gameMember = client
    ? await db.queryOne<gamemember>('select m.* from game_members m join games g on g.id = m.game_id where m.client_id = $1::integer and g.url_id = $2::text', client.id, url_id)
    : null;
  
  const game = await db.queryOne<game>('select * from games where url_id = $1::text', url_id);

  if (!game) redirect(302, '/');
  
  return { gameMember, client, game }
};