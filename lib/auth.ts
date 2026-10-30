import { getUser, type User } from "@netlify/identity";
import { sql } from "drizzle-orm";
import { db } from "../db/index.js";
import { profiles } from "../db/schema.js";

export type Me = { id: string; email: string; name: string };

export const json = (body: unknown, status = 200) => Response.json(body, { status });
export const fail = (error: string, status: number) => json({ error }, status);

// Returns the signed-in Identity user, or null when the request has no valid session.
export async function currentUser(): Promise<Me | null> {
  const user: User | null = await getUser();
  if (!user || !user.email) return null;
  const name = user.name || user.email.split("@")[0];
  return { id: user.id, email: user.email, name };
}

// Creates or refreshes the profile row that lets friends find this user by email.
export async function ensureProfile(me: Me) {
  await db
    .insert(profiles)
    .values({ id: me.id, email: me.email, emailLower: me.email.toLowerCase(), name: me.name })
    .onConflictDoUpdate({
      target: profiles.id,
      set: { email: me.email, emailLower: me.email.toLowerCase(), name: me.name, lastSeen: sql`now()` },
    });
}
