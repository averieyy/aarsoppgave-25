import { Client } from "$lib/client";
import { json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";
import { db } from "$lib/db";

export const POST: RequestHandler = async ({ cookies }) => {
  const token = cookies.get('token');
  
  if (!token) return json({ message: 'Not logged in' }, { status: 400 });

  // Remove token from client
  cookies.delete('token', { path: '/' });
  
  // Expire token
  await db.execute('update tokens set expires = now() where content = $1::text', token);

  return json({ message: 'Logged out '}, { status: 200 });
}