"use client";

import { useTransition } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { CheckIcon } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { PollWithOptions } from "@/types";
import toast from "react-hot-toast";

interface PollVotingGridProps {
  poll: PollWithOptions;
}

export function PollVotingGrid({ poll }: PollVotingGridProps) {
  const [pending, startTransition] = useTransition();

  const pollVotes = useQuery(api.votes.listVotes, { pollId: poll._id });
  const castVote = useMutation(api.votes.castVote);

  if (pollVotes === undefined) return <PollVotingGridSkeleton />;
  if (pollVotes === null) return null;

  const { votes, userVote } = pollVotes;
  const { _id: pollId, endDate, options } = poll;

  const totalVotes = votes.length;
  const isExpired = endDate < Date.now();

  function handleCastVote(optionId: Id<"options">) {
    if (pending) return;

    startTransition(async () => {
      try {
        await castVote({ pollId, optionId });
      } catch {
        toast.error("Something went wrong");
      }
    });
  }

  return (
    <div className="flex flex-col gap-6">
      <ul className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {options.map((option) => {
          const optionVotes = votes.filter(
            (vote) => vote.optionId === option._id
          ).length;
          const percentage =
            totalVotes > 0 ? Math.round((optionVotes / totalVotes) * 100) : 0;
          const isUserVote = userVote?.optionId === option._id;

          return (
            <li key={option._id}>
              <Button
                disabled={isExpired || pending}
                variant="none"
                className={cn(
                  "relative size-full flex-col items-start gap-2.5 p-5 text-base text-start border rounded-xl",
                  isUserVote ? "border-primary" : "border-border"
                )}
                onClick={() => handleCastVote(option._id)}
              >
                <div className="w-full flex justify-between gap-10">
                  <p className="truncate">{option.text}</p>
                  <span>{percentage}%</span>
                </div>
                <Progress value={percentage} />
                <p className="text-xs text-muted-foreground">
                  {optionVotes} {optionVotes === 1 ? "vote" : "votes"}
                </p>
                {isUserVote && (
                  <div className="absolute top-0 left-0 -translate-x-1/2 -translate-y-1/2 size-8 flex items-center justify-center border-2 border-background rounded-full bg-primary">
                    <CheckIcon className="size-4 text-background" />
                  </div>
                )}
              </Button>
            </li>
          );
        })}
      </ul>
      <footer>
        <p className="text-sm font-medium text-center text-muted-foreground">
          {totalVotes} TOTAL VOTES
        </p>
      </footer>
    </div>
  );
}

interface PollVotingGridSkeletonProps {
  noAnimation?: boolean;
}

export function PollVotingGridSkeleton({
  noAnimation,
}: PollVotingGridSkeletonProps) {
  return (
    <div
      className={cn(
        "grid grid-cols-1 gap-6 lg:grid-cols-2",
        noAnimation && "no-animation"
      )}
    >
      {Array.from({ length: 4 }).map((_, index) => (
        <div
          key={index}
          className="flex flex-col gap-2.5 p-5 border rounded-xl"
        >
          <div className="h-6 flex items-center">
            <Skeleton className="w-2/3 h-4" />
          </div>
          <Skeleton className="h-2 rounded-full" />
          <div className="h-4 flex items-center">
            <Skeleton className="w-16 h-3" />
          </div>
        </div>
      ))}
    </div>
  );
}
