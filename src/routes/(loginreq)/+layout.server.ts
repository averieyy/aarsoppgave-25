import { redirect } from "@sveltejs/kit";
import type { LayoutServerLoad } from "./$types";

export const load: LayoutServerLoad = async ({ parent, url }) => {
  const { client } = await parent();

  if (!client) redirect(302, '/login?redirect=' + url.pathname);
};