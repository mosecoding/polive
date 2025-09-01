"use client";

import { Preloaded, usePreloadedQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Countdown } from "@/components/ui/countdown";
import {
  PollVotingGrid,
  PollVotingGridSkeleton,
} from "@/components/grids/poll-voting-grid";

interface PollPageClientProps {
  preloadedPoll: Preloaded<typeof api.polls.getPoll>;
  isAuthenticated: boolean;
}

export default function PollPageClient({
  preloadedPoll,
  isAuthenticated,
}: PollPageClientProps) {
  const poll = usePreloadedQuery(preloadedPoll);
  if (!poll) return null;

  return (
    <section className="flex flex-col gap-10">
      <header className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold break-words">{poll.title}</h1>
        <Countdown endDate={new Date(poll.endDate)} />
      </header>
      {isAuthenticated ? (
        <PollVotingGrid poll={poll} />
      ) : (
        <div>
          <div className="absolute inset-0 bg-background/85">
            <div className="h-full flex flex-col items-center justify-center gap-2 p-5 text-center text-balance rounded-xl">
              <p className="text-2xl font-bold text-primary">
                You need to sign in
              </p>
              <p>Please sign in to your account to cast your vote.</p>
            </div>
          </div>
          <PollVotingGridSkeleton noAnimation />
        </div>
      )}
    </section>
  );
}
