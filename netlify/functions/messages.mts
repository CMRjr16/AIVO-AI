import type { Config, Context } from "@netlify/functions";
import { and, asc, desc, eq, gt, or, sql } from "drizzle-orm";
import { db } from "../../db/index.js";
import { chats, messages } from "../../db/schema.js";
import { currentUser, ensureProfile, fail, json } from "../../lib/auth.js";

const MAX_LENGTH = 4000;

export default async (req: Request, context: Context) => {
  const me = await currentUser();
  if (!me) return fail("Not signed in", 401);

  const chatId = Number(context.params.id);
  if (!Number.isInteger(chatId)) return fail("Chat not found", 404);

  // Only the two people in a chat can read or write it
  const [chat] = await db
    .select({ id: chats.id })
    .from(chats)
    .where(and(eq(chats.id, chatId), or(eq(chats.userA, me.id), eq(chats.userB, me.id))))
    .limit(1);
  if (!chat) return fail("Chat not found", 404);

  if (req.method === "GET") {
    // ?after=<id> returns only newer messages, so the app can poll cheaply
    const after = Number(new URL(req.url).searchParams.get("after")) || 0;
    const rows = after
      ? await db.select().from(messages)
          .where(and(eq(messages.chatId, chatId), gt(messages.id, after)))
          .orderBy(asc(messages.id))
      : (await db.select().from(messages)
          .where(eq(messages.chatId, chatId))
          .orderBy(desc(messages.id))
          .limit(300)).reverse();
    return json(rows);
  }

  const body = await req.json().catch(() => ({}));
  const text = String(body.text || "").trim();
  if (!text) return fail("Message is empty.", 400);
  if (text.length > MAX_LENGTH) return fail(`Messages can be up to ${MAX_LENGTH} characters.`, 400);

  await ensureProfile(me);
  const [msg] = await db.insert(messages).values({ chatId, senderId: me.id, text }).returning();
  await db.update(chats).set({ lastMessage: text, updatedAt: sql`now()` }).where(eq(chats.id, chatId));
  return json(msg, 201);
};

export const config: Config = { path: "/api/chats/:id/messages", method: ["GET", "POST"] };
