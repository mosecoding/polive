import { authTables } from "@convex-dev/auth/server";
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  ...authTables,

  polls: defineTable({
    title: v.string(),
    description: v.optional(v.string()),
    endDate: v.number(),
    createdBy: v.id("users"),
  }).index("byCreator", ["createdBy"]),

  options: defineTable({
    pollId: v.id("polls"),
    text: v.string(),
  }).index("byPoll", ["pollId"]),

  votes: defineTable({
    userId: v.id("users"),
    pollId: v.id("polls"),
    optionId: v.id("options"),
  })
    .index("byPoll", ["pollId"])
    .index("byUser", ["userId"])
    .index("byUserAndPoll", ["userId", "pollId"]),
});
