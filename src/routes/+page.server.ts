import { db } from "$lib/db";
import type { game } from "$lib/types";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ parent }) => {
  const { client } = await parent();

  const lastspeedrungames = await db.queryAll<game & { submitted: Date, displayname: string, profile_pic: string | null }>('select g.*, MAX(s.submitted) as submitted, c.displayname, p.file as profile_pic from games g join speedrun s on g.id = s.game_id join clients c on s.client_id = c.id join profile_pics p on p.client_id = s.client_id where s.verified = true and s.deleted = false group by g.id, c.displayname, p.file order by MAX(s.submitted) desc limit 10');
  const games = await db.queryAll<game>('select * from games limit 10');

  return { client, lastspeedrungames, games }
};