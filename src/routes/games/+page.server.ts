import { db } from "$lib/db";
import { type game } from "$lib/types";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ parent }) => {
  const { client } = await parent();
  
  // Fetch the games and tags
  // const games = await db.queryAll<game>('select * from games');
  const tags = await db.queryAll<{tag: string}>('select t.tag from game_tags t group by t.tag order by count(t.*) desc limit 20')

  return { client, tags }
};