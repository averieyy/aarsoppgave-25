import { db } from "$lib/db";
import type { game } from "$lib/types";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ parent }) => {
  const { client } = await parent();

  // Get the ten latest speedruns, to show on the front page
  const lastspeedrungames = await db.queryAll<{ submitted: Date, displayname: string, profile_pic: string | null, name: string, id: number, category_label: string }>('select distinct on (s.game_id) g.name, s.id, s.submitted, c.displayname, p.file as profile_pic, sc.category_label from speedrun s join clients c on s.client_id = c.id join games g on g.id = s.game_id left join profile_pics p on p.client_id = s.client_id join speedrun_categories sc on sc.id = s.category_id where s.deleted = false and c.deleted = false and verified = true limit 10');
  
  // Get a preview of the games
  const games = await db.queryAll<game>('select * from games limit 10');

  return { client, lastspeedrungames, games }
};