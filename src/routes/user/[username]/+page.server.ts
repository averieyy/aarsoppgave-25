import { db } from "$lib/db";
import type { client, speedrun } from "$lib/types";
import { redirect } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ parent, params }) => {
  const { client } = await parent();

  const user = await db.queryOne<{ username: string, joined: Date, id: number }>('select username, joined, id from clients where username = $1::text', params.username);

  if (!user) redirect(302, '/');

  const speedruns = (await db.queryAll<speedrun & { name: string }>('select s.*, g.name from speedrun s join games g on g.id = s.game_id where s.client_id = $1::integer', user.id))
    .reduce<{[id: number]: (speedrun & { name: string, username: string })[] }>((acc, curr) => {
      if (acc[curr.game_id]) acc[curr.game_id].push({...curr, username: user.username});
      else acc[curr.game_id] = [{...curr, username: user.username}];

      return acc;
    }, {});

  return { user: { username: user.username, joined: user.joined }, client, speedruns }
};