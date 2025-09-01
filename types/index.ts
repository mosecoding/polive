import { Doc } from "@/convex/_generated/dataModel";

export type Poll = Doc<"polls">;
export type Option = Doc<"options">;

export type PollStatus = "active" | "expired";

export interface PollWithOptions extends Poll {
  options: Option[];
}
