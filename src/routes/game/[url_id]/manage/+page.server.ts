import { redirect } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";
import { db } from "$lib/db";
import type { speedrun } from "$lib/types";

export const load: PageServerLoad = async ({ parent }) => {
  const { client, member, game } = await parent();

  if (!member || !member.admin) redirect(302, `/api/game/${game.url_id}`);

  // Load everything
  const speedruns = await db.queryAll<speedrun & { username: string }>('select s.*, c.username from speedrun s join clients c on s.client_id = c.id where s.game_id = $1::int and s.verified = false and s.deleted = false order by submitted asc', game.id);

  return { client, speedruns }
};