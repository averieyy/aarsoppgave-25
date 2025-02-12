import { json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";

export const POST: RequestHandler = async ({ cookies }) => {
  return json({ message: 'Not implemented' }, { status: 500 });
}