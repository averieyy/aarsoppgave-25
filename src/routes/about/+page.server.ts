import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ parent }) => {
  // To ensure the client gets reloaded
  return await parent();
};