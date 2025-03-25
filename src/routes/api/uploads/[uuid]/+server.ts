import { Client } from "$lib/client";
import { db } from "$lib/db";
import type { file } from "$lib/types";
import { json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";
import { readFileSync } from 'fs';

export const GET: RequestHandler = async ({ params }) => {  
  // Check the database
  const db_file = await db.queryOne<file>('select * from files where pathname = $1::text', params.uuid);
  if (!db_file) return json({ message: 'Could not fetch file' }, { status: 404});

  // Read and send file
  const file = readFileSync('./uploads/' + params.uuid);

  return new Response(file, {headers: { 'Content-Type': db_file.mime }});
}