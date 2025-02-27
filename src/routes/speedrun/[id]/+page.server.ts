import { db } from "$lib/db";
import { type speedrun } from "$lib/types";
import { redirect } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ parent, params }) => {
  const { client } = await parent();

  const { id: rawid }: { id: string } = params;
  const id = parseInt(rawid);

  if (id.toString() != rawid) redirect(302, '/');

  const speedrun = await db.queryOne<speedrun & {game: string, game_desc: string, username: string, url_id: string}>('select s.*, g.name as game, g.description as game_desc, g.url_id, c.username from speedrun s join games g on s.game_id = g.id join clients c on c.id = s.client_id where s.id = $1::integer', id);

  if (!speedrun) redirect(302, '/');

  return { client, speedrun }
};