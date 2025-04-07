import { Client } from "$lib/client";
import { json } from "@sveltejs/kit";
import { existsSync, mkdirSync, writeFileSync } from 'fs';
import type { RequestHandler } from "./$types";
import { db } from "$lib/db";

export const POST: RequestHandler = async ({ cookies, request }) => {
  const client = await Client.getClientFromCookies(cookies);
  if (!client) return json({ message: 'Unauthorized' }, { status: 403 });
  const formdata = await request.formData();
  const rawfile: FormDataEntryValue | null = formdata.get('file');

  if (!rawfile) return json({ message: 'file parameter missing' }, { status: 400 });
  if (!(rawfile instanceof File)) return json({ message: 'File parameter is not a file' }, { status: 400 });

  const file = rawfile as File;

  // Check size (32 MB)
  if (file.size > 33554432) return json({ message: 'File too big' }, { status: 400 });

  // TODO: Make sure no file name can be used twice
  const randomFileName = crypto.randomUUID();
  
  // Register file in the database
  db.execute('insert into files (displayname, mime, pathname, client_id) values ($1::text, $2::text, $3::text, $4::int)', file.name, file.type, randomFileName, client.id)  

  // Check if the directory exists
  if (!existsSync('./uploads')) mkdirSync('./uploads');
  
  // Write file
  writeFileSync('./uploads/' + randomFileName, await file.bytes(), "binary");

  return json({ id: randomFileName, message: "Uploaded file" }, { status: 200 });
}