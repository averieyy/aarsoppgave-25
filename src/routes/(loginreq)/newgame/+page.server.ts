import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ parent }) => {
  // To make sure the client gets loaded for this page specifically (so that it updates after login)
  const { client } = await parent();

  return { client }
};