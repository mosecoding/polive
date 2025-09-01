import { z } from "zod";
import { zid } from "convex-helpers/server/zod";
import { nextWeek } from "./utils";

const basePollSchema = z.object({
  title: z
    .string()
    .trim()
    .min(3, "Title must be at least 3 characters long")
    .max(100, "Title must not exceed 100 characters"),
  description: z
    .string()
    .trim()
    .max(150, "Title must not exceed 150 characters")
    .optional(),
  options: z
    .array(
      z.object({
        text: z
          .string()
          .trim()
          .min(1, "Each option must be at least 1 character long")
          .max(50, "Each option must not exceed 50 characters"),
      })
    )
    .min(2, "You must provide at least 2 options")
    .max(8, "You cannot provide more than 8 options")
    .refine(
      (opts) =>
        new Set(opts.map((option) => option.text.trim().toLowerCase())).size ===
        opts.length,
      "Duplicate options are not allowed"
    ),
});

export const createPollClientSchema = basePollSchema.extend({
  endDate: z
    .date({ message: "You must select an end date" })
    .refine(
      (date) => date >= new Date() && date <= nextWeek(),
      "End date must be within 7 days from today"
    ),
});

export const createPollServerSchema = basePollSchema.extend({
  endDate: z.number().refine((ts) => {
    const date = new Date(ts);
    const now = new Date();
    return date >= now && date <= nextWeek();
  }, "End date must be within 7 days from today"),
});

export const updatePollClientSchema = createPollClientSchema.omit({
  options: true,
});

export const updatePollServerSchema = createPollServerSchema
  .omit({ options: true })
  .extend({ pollId: zid("polls") });

export type CreatePollClientSchema = z.infer<typeof createPollClientSchema>;
export type UpdatePollClientSchema = z.infer<typeof updatePollClientSchema>;
