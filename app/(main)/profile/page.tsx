"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import PollActions from "@/components/dropdowns/poll-actions-dropdown";
import { cn } from "@/lib/utils";
import Link from "next/link";

export default function ProfilePage() {
  const polls = useQuery(api.polls.listMyPolls);

  if (polls === undefined) return <ProfileSkeleton />;
  if (polls === null) return null;

  return (
    <div className="space-y-8">
      <div className="rounded-md border overflow-hidden">
        <Table>
          <TableHeader className="bg-card">
            <TableRow className={cn(polls.length === 0 && "border-none")}>
              <TableHead>Title</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Created At</TableHead>
              <TableHead>End At</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {polls.map((poll) => {
              const isExpired = poll.endDate < Date.now();

              return (
                <TableRow key={poll._id}>
                  <TableCell className="max-w-xs truncate">
                    {poll.title}
                  </TableCell>
                  <TableCell>
                    <Badge>{isExpired ? "Expired" : "Active"}</Badge>
                  </TableCell>
                  <TableCell>
                    {new Date(poll._creationTime).toDateString()}
                  </TableCell>
                  <TableCell>{new Date(poll.endDate).toDateString()}</TableCell>
                  <TableCell>
                    <PollActions poll={poll} />
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
      {polls.length === 0 && (
        <div className="flex flex-col items-center gap-3">
          <p className="text-center">
            Ready to create your first poll? Start now.
          </p>
          <Button asChild>
            <Link href="/create">Create</Link>
          </Button>
        </div>
      )}
    </div>
  );
}

function ProfileSkeleton() {
  return (
    <div className="border rounded-md">
      <Table>
        <TableHeader className="bg-card">
          <TableRow>
            {Array.from({ length: 4 }).map((_, index) => {
              return (
                <TableHead key={index}>
                  <Skeleton className="w-24 h-3.5" />
                </TableHead>
              );
            })}
            <TableHead />
          </TableRow>
        </TableHeader>
        <TableBody>
          {Array.from({ length: 4 }).map((_, index) => {
            return (
              <TableRow key={index}>
                {Array.from({ length: 4 }).map((_, index) => {
                  return (
                    <TableCell key={index}>
                      <div className="w-40 h-8 flex items-center">
                        <Skeleton className="h-3.5" />
                      </div>
                    </TableCell>
                  );
                })}
                <TableCell>
                  <div className="flex items-center gap-0.5">
                    <Skeleton className="size-1" />
                    <Skeleton className="size-1" />
                    <Skeleton className="size-1" />
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
