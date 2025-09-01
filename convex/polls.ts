import { zCustomMutation } from "convex-helpers/server/zod";
import { NoOp } from "convex-helpers/server/customFunctions";
import { mutation, query, QueryCtx } from "./_generated/server";
import { Id } from "./_generated/dataModel";
import { ConvexError, v } from "convex/values";
import { createPollServerSchema, updatePollServerSchema } from "../lib/schemas";
import { getCurrentUser, getCurrentUserOrThrow, getUserById } from "./users";

const zMutation = zCustomMutation(mutation, NoOp);

export const listPolls = query({
  args: {
    status: v.union(v.literal("active"), v.literal("expired")),
  },
  handler: async (ctx, { status }) => {
    const now = Date.now();
    const isActive = status === "active";

    const polls = await ctx.db
      .query("polls")
      .filter((q) =>
        isActive
          ? q.gte(q.field("endDate"), now)
          : q.lt(q.field("endDate"), now)
      )
      .order("desc")
      .collect();

    const pollsWithUsers = await Promise.all(
      polls.map(async (poll) => {
        const user = await getUserById(ctx, poll.createdBy);
        return { ...poll, user };
      })
    );

    return pollsWithUsers;
  },
});

export const getPoll = query({
  args: { pollId: v.id("polls") },
  handler: async (ctx, { pollId }) => {
    const poll = await getPollById(ctx, pollId);
    if (!poll) return null;

    const options = await ctx.db
      .query("options")
      .withIndex("byPoll", (q) => q.eq("pollId", pollId))
      .collect();

    return { ...poll, options };
  },
});

export const listMyPolls = query({
  args: {},
  handler: async (ctx) => {
    const user = await getCurrentUser(ctx);
    if (!user) return null;

    return await ctx.db
      .query("polls")
      .withIndex("byCreator", (q) => q.eq("createdBy", user._id))
      .order("desc")
      .collect();
  },
});

export const createPoll = zMutation({
  args: createPollServerSchema.shape,
  handler: async (ctx, { title, description, endDate, options }) => {
    const user = await getCurrentUserOrThrow(ctx);

    const existingPolls = await ctx.db
      .query("polls")
      .withIndex("byCreator", (q) => q.eq("createdBy", user._id))
      .collect();

    if (existingPolls.length >= 10)
      throw new ConvexError("You can create a maximum of 10 polls");

    const pollId = await ctx.db.insert("polls", {
      title,
      description,
      endDate,
      createdBy: user._id,
    });

    await Promise.all(
      options.map((option) =>
        ctx.db.insert("options", {
          pollId,
          text: option.text,
        })
      )
    );

    return { pollId };
  },
});

export const updatePoll = zMutation({
  args: updatePollServerSchema.shape,
  handler: async (ctx, { pollId, title, description, endDate }) => {
    const user = await getCurrentUserOrThrow(ctx);
    const poll = await getPollOrThrow(ctx, pollId);

    if (poll.createdBy !== user._id) throw new Error("Not your poll");

    await ctx.db.patch(pollId, {
      title,
      description,
      endDate,
    });
  },
});

export const deletePoll = mutation({
  args: {
    pollId: v.id("polls"),
  },
  handler: async (ctx, { pollId }) => {
    const user = await getCurrentUserOrThrow(ctx);
    const poll = await getPollOrThrow(ctx, pollId);

    if (poll.createdBy !== user._id) throw new Error("Not your poll");

    const votes = await ctx.db
      .query("votes")
      .withIndex("byPoll", (q) => q.eq("pollId", pollId))
      .collect();

    const options = await ctx.db
      .query("options")
      .withIndex("byPoll", (q) => q.eq("pollId", pollId))
      .collect();

    await Promise.all([
      ...votes.map((vote) => ctx.db.delete(vote._id)),
      ...options.map((option) => ctx.db.delete(option._id)),
      ctx.db.delete(pollId),
    ]);
  },
});

export async function getPollOrThrow(ctx: QueryCtx, pollId: Id<"polls">) {
  const poll = await getPollById(ctx, pollId);
  if (!poll) throw new Error("Poll not found");
  return poll;
}

export async function getPollById(ctx: QueryCtx, pollId: Id<"polls">) {
  return await ctx.db.get(pollId);
}
