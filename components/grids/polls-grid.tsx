"use client";

import { api } from "@/convex/_generated/api";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Preloaded, usePreloadedQuery } from "convex/react";
import Link from "next/link";

interface PollsGridProps {
  preloadedPolls: Preloaded<typeof api.polls.listPolls>;
}

export function PollsGrid({ preloadedPolls }: PollsGridProps) {
  const polls = usePreloadedQuery(preloadedPolls);
  if (polls.length === 0) return <p>No polls yet.</p>;

  return (
    <ul className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      {polls.map((poll) => {
        const { _id: pollId, title, endDate, user } = poll;

        const userImage = poll.user?.image;
        const isExpired = endDate < Date.now();

        return (
          <li key={pollId}>
            <Link
              href={`/poll/${pollId}`}
              className={cn(
                "flex outline-none border rounded-xl transition-all bg-card",
                "focus-visible:scale-95 focus-visible:rotate-3 focus-visible:shadow-2xl focus-visible:shadow-primary",
                "hover:scale-95 hover:rotate-3 hover:shadow-2xl hover:shadow-primary"
              )}
            >
              <article className="w-full flex flex-col gap-3 p-5">
                <div className="flex items-center gap-2.5">
                  <Avatar className="size-10 flex items-center justify-center border rounded-full">
                    <AvatarImage
                      src={userImage ?? "/avatar.svg"}
                      className={cn(userImage ? "size-full" : "size-5")}
                    />
                    <AvatarFallback />
                  </Avatar>
                  <p className="w-full truncate">{user?.name}</p>
                </div>
                <h3 className="text-xl font-semibold truncate">{title}</h3>
                {isExpired ? (
                  <Badge>Expired</Badge>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    Until {new Date(endDate).toDateString()}
                  </p>
                )}
              </article>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}

export function PollsGridSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, index) => (
        <Skeleton
          key={index}
          className="flex flex-col gap-3 p-5 border rounded-xl bg-card"
        >
          <div className="flex items-center gap-2.5">
            <Skeleton className="size-10 rounded-full" />
            <div className="h-6 flex items-center">
              <Skeleton className="w-24 h-4" />
            </div>
          </div>
          <div className="h-7 flex items-center">
            <Skeleton className="w-full h-5" />
          </div>
          <div className="h-5 flex items-center">
            <Skeleton className="w-24 h-3.5" />
          </div>
        </Skeleton>
      ))}
    </div>
  );
}
