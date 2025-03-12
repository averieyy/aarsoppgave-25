import { db } from "$lib/db";
import type { game, gamemember } from "$lib/types";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ parent }) => {
  const { client } = await parent();

  // "My games"
  const games = await db.queryAll<game & gamemember>('select * from game_members m join games g on m.game_id = g.id where m.client_id = $1::int', client.id);

  return { client, games }
};