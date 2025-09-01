import { Suspense } from "react";
import { api } from "@/convex/_generated/api";
import { preloadQuery } from "convex/nextjs";
import { convexAuthNextjsToken } from "@convex-dev/auth/nextjs/server";
import { CheckIcon, XIcon } from "lucide-react";
import { PollsGrid, PollsGridSkeleton } from "@/components/grids/polls-grid";
import { PollStatus } from "@/types";

export default function HomePage() {
  return (
    <div className="flex flex-col gap-20">
      <section className="flex flex-col gap-10">
        <header className="flex items-center gap-2">
          <div>
            <CheckIcon className="text-green-400" />
          </div>
          <h2 className="text-2xl font-bold truncate">Active Polls</h2>
        </header>
        <Suspense fallback={<PollsGridSkeleton />}>
          <PollsGridContainer status="active" />
        </Suspense>
      </section>
      <section className="flex flex-col gap-10">
        <header className="flex items-center gap-2">
          <div>
            <XIcon className="text-red-400" />
          </div>
          <h2 className="text-2xl font-bold truncate">Expired Polls</h2>
        </header>
        <Suspense fallback={<PollsGridSkeleton />}>
          <PollsGridContainer status="expired" />
        </Suspense>
      </section>
    </div>
  );
}

interface PollsGridContainerProps {
  status: PollStatus;
}

async function PollsGridContainer({ status }: PollsGridContainerProps) {
  const preloadedPolls = await preloadQuery(
    api.polls.listPolls,
    { status },
    {
      token: await convexAuthNextjsToken(),
    }
  );

  return <PollsGrid preloadedPolls={preloadedPolls} />;
}
