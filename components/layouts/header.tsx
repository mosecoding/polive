"use client";

import UserDropdown from "@/components/dropdowns/user-dropdown";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Skeleton } from "@/components/ui/skeleton";
import SignInButton from "@/components/buttons/sign-in-button";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Header() {
  const user = useQuery(api.users.getUser);
  if (user === undefined) return <HeaderSkeleton />;

  return (
    <header className="fixed top-0 left-0 z-50 w-full backdrop-blur-sm bg-background/40">
      <div className="h-20 max-w-7xl flex items-center justify-between mx-auto px-5">
        <Button
          asChild
          variant="none"
          className="h-fit p-0 text-3xl font-bold text-primary"
        >
          <Link href="/">polive</Link>
        </Button>
        {user ? <UserDropdown userImage={user.image} /> : <SignInButton />}
      </div>
    </header>
  );
}

function HeaderSkeleton() {
  return (
    <header className="fixed top-0 left-0 z-50 w-full backdrop-blur-sm bg-background/40">
      <div className="h-20 max-w-7xl flex items-center justify-between mx-auto px-5">
        <div className="text-3xl font-bold text-primary">polive</div>
        <Skeleton className="size-10 rounded-full" />
      </div>
    </header>
  );
}
