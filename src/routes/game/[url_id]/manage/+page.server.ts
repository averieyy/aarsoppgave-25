import { redirect } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";
import { db } from "$lib/db";
import type { client, frontendclient, speedrun } from "$lib/types";

export const load: PageServerLoad = async ({ parent }) => {
  const { client, member, game } = await parent();

  if (!member || !member.admin || member.banned) redirect(302, `/game/${game.url_id}`);

  // Load everything
  const speedruns = await db.queryAll<speedrun & { username: string, displayname: string, proofmime?: string }>('select s.*, c.username, c.displayname, f.mime as proofmime from speedrun s join clients c on s.client_id = c.id join game_members m on m.client_id = c.id and m.game_id = s.game_id left outer join files f on f.pathname = s.proof where s.game_id = $1::int and s.verified = false and s.deleted = false and m.banned = false order by submitted asc', game.id);

  // Load members
  const members = await db.queryAll<frontendclient & {banned: boolean, admin: boolean}>('select c.*, p.file as profile_pic, m.banned, m.admin from game_members m join clients c on m.client_id = c.id left outer join profile_pics p on p.client_id = c.id where m.game_id = $1::integer', game.id);

  return { client, speedruns, members }
};