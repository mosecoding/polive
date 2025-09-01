import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getCurrentUser, getCurrentUserOrThrow } from "./users";
import { getPollOrThrow } from "./polls";

export const listVotes = query({
  args: { pollId: v.id("polls") },
  handler: async (ctx, { pollId }) => {
    const user = await getCurrentUser(ctx);
    if (!user) return null;

    const [votes, userVote] = await Promise.all([
      ctx.db
        .query("votes")
        .withIndex("byPoll", (q) => q.eq("pollId", pollId))
        .collect(),
      ctx.db
        .query("votes")
        .withIndex("byUserAndPoll", (q) =>
          q.eq("userId", user._id).eq("pollId", pollId)
        )
        .first(),
    ]);

    return { votes, userVote };
  },
});

export const castVote = mutation({
  args: {
    pollId: v.id("polls"),
    optionId: v.id("options"),
  },
  handler: async (ctx, { pollId, optionId }) => {
    const user = await getCurrentUserOrThrow(ctx);
    const poll = await getPollOrThrow(ctx, pollId);

    if (poll.endDate < Date.now()) throw new Error("Poll expired");

    const existingVote = await ctx.db
      .query("votes")
      .withIndex("byUserAndPoll", (q) =>
        q.eq("userId", user._id).eq("pollId", pollId)
      )
      .unique();

    if (!existingVote)
      return await ctx.db.insert("votes", {
        userId: user._id,
        pollId,
        optionId,
      });

    if (existingVote.optionId === optionId)
      return await ctx.db.delete(existingVote._id);

    return await ctx.db.patch(existingVote._id, { optionId });
  },
});
