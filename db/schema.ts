import { pgTable, serial, text, timestamp, integer, index, uniqueIndex } from "drizzle-orm/pg-core";

// One row per Aivo account, keyed by the Netlify Identity user id.
// Created/refreshed when the user opens the app, so friends can find them by email.
export const profiles = pgTable("profiles", {
  id: text().primaryKey(),
  email: text().notNull(),
  emailLower: text("email_lower").notNull().unique(),
  name: text().notNull(),
  lastSeen: timestamp("last_seen", { withTimezone: true }).defaultNow().notNull(),
});

// One-to-one chat. userA/userB are stored sorted so each pair has exactly one chat.
export const chats = pgTable(
  "chats",
  {
    id: serial().primaryKey(),
    userA: text("user_a").notNull().references(() => profiles.id),
    userB: text("user_b").notNull().references(() => profiles.id),
    lastMessage: text("last_message"),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (t) => [uniqueIndex("chats_pair_idx").on(t.userA, t.userB), index("chats_user_b_idx").on(t.userB)],
);

export const messages = pgTable(
  "messages",
  {
    id: serial().primaryKey(),
    chatId: integer("chat_id").notNull().references(() => chats.id, { onDelete: "cascade" }),
    senderId: text("sender_id").notNull().references(() => profiles.id),
    text: text().notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (t) => [index("messages_chat_idx").on(t.chatId, t.id)],
);
