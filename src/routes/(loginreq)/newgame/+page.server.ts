import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ parent }) => {
  const { client } = await parent();

  return { client }
};