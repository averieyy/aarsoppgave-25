import { db } from "$lib/db";
import type { speedrun_category, frontend_speedrun } from "$lib/types";
import { redirect } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ parent, params }) => {
  const { client } = await parent();

  const user = await db.queryOne<{ displayname: string, joined: Date, id: number, profile_pic: string | null }>('select c.displayname, c.joined, c.id, p.file as profile_pic from clients c left join profile_pics p on p.client_id = c.id where username = $1::text and deleted = false', params.username);

  if (!user) redirect(302, '/');

  const speedruns = await db.queryAll<frontend_speedrun & { game_id: number }>(`select
      s.submitted,
      s.score,
      s.id,
      s.description,
      s.verified,
      s.deleted,
      s.game_id,
      g.name,
      sc.category_label,
      c.displayname as username,
      p.file as profile_pic
    from
      speedrun s
      join clients c on s.client_id = c.id
      left outer join profile_pics p on p.client_id = s.client_id
      inner join speedrun_categories sc on sc.id = s.category_id
      inner join games g on g.id = s.game_id
    where
      s.verified = true
      and s.deleted = false
      and s.client_id = $1::integer
      and c.deleted = false
    order by s.score asc
    limit 50`, user.id);

  const games = await db.queryAll<{ name: string, id: number }>('select g.name, g.id from games g inner join speedrun s on s.game_id = g.id where s.client_id = $1::integer and s.verified = true and s.deleted = false', user.id)
  
  const game_categories = await db.queryAll<speedrun_category>('select distinct on (sc) sc.* from speedrun_categories sc inner join speedrun s on s.game_id = sc.game_id and s.category_id = sc.id where s.client_id = $1::int and s.deleted = false and s.verified = true', user.id);

  return { user: { username: user.displayname, joined: user.joined, profile_pic: user.profile_pic }, client, speedruns, categories: game_categories, games }
};