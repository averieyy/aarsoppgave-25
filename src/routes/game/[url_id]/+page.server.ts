import { db } from "$lib/db";
import type { frontend_speedrun } from "$lib/types";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ parent }) => {
  const { client, game, member } = await parent();
  
  const speedruns = await db.queryAll<frontend_speedrun>(`select
      s.submitted,
      s.score,
      s.id,
      s.description,
      s.verified,
      s.deleted,
      sc.category_label,
      c.displayname as username,
      p.file as profile_pic
    from
      speedrun s
      join clients c on s.client_id = c.id
      left outer join profile_pics p on p.client_id = s.client_id
      inner join speedrun_categories sc on sc.id = s.category_id
    where
      s.verified = true
      and s.deleted = false
      and s.game_id = $1::integer
      and c.deleted = false
    order by s.score asc
    limit 50`, game.id);
  
  return { member, client, game, speedruns }
};