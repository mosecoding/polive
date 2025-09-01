import { preloadQuery } from "convex/nextjs";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import {
  convexAuthNextjsToken,
  isAuthenticatedNextjs,
} from "@convex-dev/auth/nextjs/server";
import { redirect } from "next/navigation";
import PollPageClient from "./page-client";

interface PollPageProps {
  params: Promise<{ id: Id<"polls"> }>;
}

export default async function PollPage({ params }: PollPageProps) {
  const { id } = await params;
  const isAuthenticated = await isAuthenticatedNextjs();

  let preloadedPoll;

  try {
    preloadedPoll = await preloadQuery(
      api.polls.getPoll,
      { pollId: id },
      { token: await convexAuthNextjsToken() }
    );

    return (
      <PollPageClient
        preloadedPoll={preloadedPoll}
        isAuthenticated={isAuthenticated}
      />
    );
  } catch {
    return redirect("/");
  }
}
