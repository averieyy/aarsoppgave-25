import { db } from "$lib/db";
import type { game, gamemember } from "$lib/types";
import { redirect } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ parent, params }) => {
  const { client, game, member } = await parent();
  
  const speedruns = await db.queryAll<{
    submitted: Date,
    score: number,
    description: string,
    verified: boolean,
    deleted: boolean,
    username: string,
    id: number
  }>(`select
      s.submitted,
      s.score,
      s.id,
      s.description,
      s.verified,
      s.deleted,
      c.username
    from
      speedrun s
      join clients c on s.client_id = c.id
    where
      s.verified = true
      and s.deleted = false
      and s.game_id = $1::integer
    order by s.score asc
    limit 50`, game.id);
  
  return { member, client, game, speedruns }
};