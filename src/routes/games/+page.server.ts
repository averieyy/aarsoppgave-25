import { db } from "$lib/db";
import { type game } from "$lib/types";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ parent }) => {
  const { client } = await parent();
  
  const games = await db.queryAll<game>('select * from games');

  return { games, client }
};