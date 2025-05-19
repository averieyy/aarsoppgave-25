import { db } from "$lib/db";
import { type frontend_speedrun, type speedrun } from "$lib/types";
import { redirect } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ parent, params }) => {
  const { client } = await parent();

  const { id: rawid }: { id: string } = params;
  const id = parseInt(rawid);

  if (id.toString() != rawid) redirect(302, '/');

  // Get the selected speedrun and everything related to it
  const s = await db.queryOne<speedrun & {game: string, game_desc: string, username: string, url_id: string, category_label: string, proofmime: string}>('select s.*, g.name as game, g.description as game_desc, g.url_id, c.username, sc.category_label, f.mime as proofmime from speedrun s join games g on s.game_id = g.id join clients c on c.id = s.client_id join speedrun_categories sc on sc.id = s.category_id left outer join files f on s.proof = f.pathname where s.id = $1::integer', id);
  
  if (!s) redirect(302, '/');

  // Get the placement of the speedrun
  const placement = await db.queryOne<{count: string}>('select count(*) as count from speedrun where game_id = $1::integer and score < $2::integer', s.game_id, s.score);

  // Tighten up the speedrun
  const speedrun: frontend_speedrun & { proof: string, proofmime: string, url_id: string, game: string, game_desc: string } = { category_label: s.category_label, deleted: s.deleted, description: s.description, id: s.id, score: s.score, submitted: s.submitted, username: s.username, verified: s.verified, url_id: s.url_id, game: s.game, game_desc: s.game_desc, proof: s.proof, proofmime: s.proofmime };

  return { client, speedrun, placement: parseInt(placement?.count || '0') + 1 }
};