import { db } from "$lib/db";
import { type game } from "$lib/types";
import { json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";

export const GET: RequestHandler = async ({ url }) => {
  const query = url.searchParams.get('query');
  const rawtags = url.searchParams.get('tags');
  const tags = rawtags ? rawtags.split(',') : [];

  // Fetch the games based on the requested search parameters
  const games = await db.queryAll<game>(`select
      distinct g.* from games g
    left outer join game_tags t on g.id = t.game_id
    where
      (t.tag = ANY($1::text[]) or array_length($1::text[], 1) is null)
    and
      (g.name ILIKE '%' || $2::text || '%' or g.description ILIKE '%' || $2::text || '%')`, tags, query);  

  return json({games: games.map(g => {return {name: g.name, image: g.image, description: g.description, url_id: g.url_id}})})
}