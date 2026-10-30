import type { Config } from "@netlify/functions";
import { desc, eq, inArray, or } from "drizzle-orm";
import { db } from "../../db/index.js";
import { chats, profiles } from "../../db/schema.js";
import { currentUser, ensureProfile, fail, json } from "../../lib/auth.js";

async function listChats(meId: string) {
  const rows = await db
    .select()
    .from(chats)
    .where(or(eq(chats.userA, meId), eq(chats.userB, meId)))
    .orderBy(desc(chats.updatedAt));
  if (!rows.length) return [];

  const otherIds = rows.map((r) => (r.userA === meId ? r.userB : r.userA));
  const others = await db.select().from(profiles).where(inArray(profiles.id, otherIds));
  const byId = new Map(others.map((p) => [p.id, p]));

  return rows.map((r) => {
    const other = byId.get(r.userA === meId ? r.userB : r.userA);
    return {
      id: r.id,
      lastMessage: r.lastMessage,
      updatedAt: r.updatedAt,
      otherEmail: other?.email ?? "Unknown",
      otherName: other?.name ?? "Unknown",
    };
  });
}

export default async (req: Request) => {
  const me = await currentUser();
  if (!me) return fail("Not signed in", 401);

  if (req.method === "GET") return json(await listChats(me.id));

  // POST: start (or reopen) a chat with a friend by email
  const body = await req.json().catch(() => ({}));
  const email = String(body.email || "").trim().toLowerCase();
  if (!email.includes("@")) return fail("Enter a full email address.", 400);
  if (email === me.email.toLowerCase()) return fail("That is your own email. Enter a friend’s email.", 400);

  await ensureProfile(me);
  const [friend] = await db.select().from(profiles).where(eq(profiles.emailLower, email)).limit(1);
  if (!friend) return fail("No Aivo account uses that email yet. Ask them to create an account first.", 404);

  const [userA, userB] = [me.id, friend.id].sort();
  await db.insert(chats).values({ userA, userB }).onConflictDoNothing();
  const all = await listChats(me.id);
  const chat = all.find((c) => c.otherEmail.toLowerCase() === email);
  return json(chat, 201);
};

export const config: Config = { path: "/api/chats", method: ["GET", "POST"] };
