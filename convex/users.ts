import { getAuthUserId } from "@convex-dev/auth/server";

import { query, QueryCtx } from "./_generated/server";
import { Id } from "./_generated/dataModel";

export const getUser = query({
  args: {},
  handler: async (ctx) => await getCurrentUser(ctx),
});

export async function getCurrentUserOrThrow(ctx: QueryCtx) {
  const user = await getCurrentUser(ctx);
  if (!user) throw new Error("User not authenticated");
  return user;
}

export async function getCurrentUser(ctx: QueryCtx) {
  const userId = await getAuthUserId(ctx);
  if (!userId) return null;
  return await getUserById(ctx, userId);
}

export async function getUserById(ctx: QueryCtx, userId: Id<"users">) {
  return await ctx.db.get(userId);
}
