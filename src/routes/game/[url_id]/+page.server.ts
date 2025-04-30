import { db } from "$lib/db";
import type { speedrun_category } from "$lib/types";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ parent }) => {
  const { client, game, member } = await parent();
  
  const speedruns = await db.queryAll<{
    submitted: Date,
    score: number,
    description: string,
    verified: boolean,
    deleted: boolean,
    username: string,
    category_id: string,
    id: number
  }>(`select
      s.submitted,
      s.score,
      s.id,
      s.description,
      s.verified,
      s.deleted,
      s.category_id,
      c.displayname as username,
      p.file as profile_pic
    from
      speedrun s
      join clients c on s.client_id = c.id
      left outer join profile_pics p on p.client_id = s.client_id
    where
      s.verified = true
      and s.deleted = false
      and s.game_id = $1::integer
      and c.deleted = false
    order by s.score asc
    limit 50`, game.id);
  
  const categories = await db.queryAll<speedrun_category>('select * from speedrun_categories where game_id = $1::int', game.id);

  return { member, client, game, speedruns, categories }
};