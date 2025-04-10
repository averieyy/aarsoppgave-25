import { db } from "$lib/db";
import { type game } from "$lib/types";
import { json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";

export const GET: RequestHandler = async ({ url }) => {
  const query = url.searchParams.get('query');
  const tags = url.searchParams.get('tags')?.split(',') || null;

  console.log(tags);

  const test = await db.queryAll<any>('select array_length($1::text[], 1)', tags);

  console.log(test);
  

  const games = await db.queryAll<game>('select distinct g.* from games g join game_tags t on g.id = t.game_id where (t.tag = ANY($1::text[]) or array_length($1::text[], 1) = 0) and (g.name ILIKE \'%\' || $2::text || \'%\' or g.description ILIKE \'%\' || $2::text || \'%\')', tags, query)

  console.log(games);
  

  return json({games: games.map(g => {return {name: g.name, image: g.image, description: g.description, url_id: g.url_id}})})
}