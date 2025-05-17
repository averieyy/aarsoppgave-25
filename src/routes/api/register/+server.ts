import { json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";
import { Client } from "$lib/client";

const emailregex = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/;

export const POST: RequestHandler = async ({ cookies, request }) => {
  let body;

  try {
    body = await request.json();
  } catch {
    return json({ message: 'Body not JSON' }, { status: 400 });
  }

  const { username, password, email }: { username: string, password: string, email: string } = body;

  // Check the validity of the parameters
  if (typeof username != 'string' || username.length < 3 || username.length > 24) return json({ message: 'Bad username' }, { status: 400 });
  if (typeof password != 'string' || password.length < 8) return json({ message: 'Bad password' }, { status: 400 });
  if (typeof email != 'string' || !email.match(emailregex)) return json({ message: 'Bad password' }, { status: 400 });

  // Create the new client
  const client = await Client.registerNewClient(username, password, email);
  if (!client) return json({ message: 'Username or email already in use' }, { status: 409 });

  await client.newToken(cookies);

  return json({ message: 'Registered' }, { status: 200 });
}