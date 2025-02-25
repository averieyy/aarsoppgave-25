import { db } from "$lib/db";
import type { game } from "$lib/types";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ parent }) => {
  const { client } = await parent();

  const lastspeedrungames = await db.queryAll<game & { submitted: Date }>('select g.*, MAX(s.submitted) as submitted from games g join speedrun s on g.id = s.game_id where s.verified = true and s.deleted = false group by g.id order by MAX(s.submitted) desc limit 10');
  const games = await db.queryAll<game>('select * from games limit 10');

  return { client, lastspeedrungames, games }
};