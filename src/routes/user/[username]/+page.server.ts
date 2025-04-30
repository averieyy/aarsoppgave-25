import { db } from "$lib/db";
import type { speedrun, speedrun_category } from "$lib/types";
import { redirect } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ parent, params }) => {
  const { client } = await parent();

  const user = await db.queryOne<{ displayname: string, joined: Date, id: number, profile_pic: string | null }>('select c.displayname, c.joined, c.id, p.file as profile_pic from clients c left join profile_pics p on p.client_id = c.id where username = $1::text and deleted = false', params.username);

  if (!user) redirect(302, '/');

  const speedruns = (await db.queryAll<speedrun & { name: string, profile_pic: string | null }>('select s.*, g.name, p.file as profile_pic from speedrun s join games g on g.id = s.game_id left outer join profile_pics p on p.client_id = s.client_id where s.client_id = $1::integer', user.id))
    .reduce<{[id: number]: (speedrun & { name: string, username: string })[] }>((acc, curr) => {
      if (acc[curr.game_id]) acc[curr.game_id].push({...curr, username: user.displayname});
      else acc[curr.game_id] = [{...curr, username: user.displayname}];

      return acc;
    }, {});
  
  const game_categories = await db.queryAll<speedrun_category>('select distinct on (sc) sc.* from speedrun_categories sc inner join speedrun s on s.game_id = sc.game_id and s.category_id = sc.category_id where s.client_id = $1::int', user.id);

  return { user: { username: user.displayname, joined: user.joined, profile_pic: user.profile_pic }, client, speedruns, categories: game_categories }
};