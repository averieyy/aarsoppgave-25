import { db } from "$lib/db";
import type { client } from "$lib/types";
import { redirect } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ parent, params }) => {
  const { client } = await parent();

  const user = await db.queryOne<{ username: string, joined: Date }>('select username, joined from clients where username = $1::text', params.username);

  if (!user) redirect(302, '/');

  return { user, client }
};