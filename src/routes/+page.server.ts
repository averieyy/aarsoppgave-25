import { Client } from "$lib/client";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ cookies }) => {
  const client = await Client.getClientFromCookies(cookies);

  return { client }
};