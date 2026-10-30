CREATE TABLE "chats" (
	"id" serial PRIMARY KEY,
	"user_a" text NOT NULL,
	"user_b" text NOT NULL,
	"last_message" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "messages" (
	"id" serial PRIMARY KEY,
	"chat_id" integer NOT NULL,
	"sender_id" text NOT NULL,
	"text" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "profiles" (
	"id" text PRIMARY KEY,
	"email" text NOT NULL,
	"email_lower" text NOT NULL UNIQUE,
	"name" text NOT NULL,
	"last_seen" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX "chats_pair_idx" ON "chats" ("user_a","user_b");--> statement-breakpoint
CREATE INDEX "chats_user_b_idx" ON "chats" ("user_b");--> statement-breakpoint
CREATE INDEX "messages_chat_idx" ON "messages" ("chat_id","id");--> statement-breakpoint
ALTER TABLE "chats" ADD CONSTRAINT "chats_user_a_profiles_id_fkey" FOREIGN KEY ("user_a") REFERENCES "profiles"("id");--> statement-breakpoint
ALTER TABLE "chats" ADD CONSTRAINT "chats_user_b_profiles_id_fkey" FOREIGN KEY ("user_b") REFERENCES "profiles"("id");--> statement-breakpoint
ALTER TABLE "messages" ADD CONSTRAINT "messages_chat_id_chats_id_fkey" FOREIGN KEY ("chat_id") REFERENCES "chats"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "messages" ADD CONSTRAINT "messages_sender_id_profiles_id_fkey" FOREIGN KEY ("sender_id") REFERENCES "profiles"("id");