import { db } from "$lib/db";
import type { game } from "$lib/types";
import { redirect } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ parent, params }) => {
  const { client } = await parent();

  const game = await db.queryOne<game>('select * from games where url_id = $1::text', params.url_id);

  if (!game) redirect(302, '/');

  return { client, game };
};