import { Client } from "$lib/client";
import { json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";
import { db } from "$lib/db";

export const DELETE: RequestHandler = async ({ cookies }) => {
  const client = await Client.getClientFromCookies(cookies);
  if (!client) return json({ message: 'Unauthorized' }, { status: 403 });

  // Add deleted flag to the account
  db.execute('update clients set deleted = true where id = $1::integer', client.id);

  cookies.delete('token', { path: '/' });

  return json({ message: 'Account deleted' }, { status: 200 });
}