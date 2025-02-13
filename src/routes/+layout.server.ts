import { Client } from "$lib/client";
import type { LayoutServerLoad } from "./$types";

export const load: LayoutServerLoad = async ({ cookies }) => {
  const client = await Client.getClientFromCookies(cookies);

  return { client: client?.toJSON() }
};