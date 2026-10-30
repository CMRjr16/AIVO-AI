import type { Config } from "@netlify/functions";
import { currentUser, ensureProfile, fail, json } from "../../lib/auth.js";

export default async () => {
  const me = await currentUser();
  if (!me) return fail("Not signed in", 401);
  await ensureProfile(me);
  return json(me);
};

export const config: Config = { path: "/api/me", method: "GET" };
