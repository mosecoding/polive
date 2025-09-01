"use client";

import { useState, useTransition } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Loader2Icon, LockOpen, PlusIcon, SettingsIcon } from "lucide-react";
import { useAuthActions } from "@convex-dev/auth/react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import Link from "next/link";

interface UserDropdownProps {
  userImage: string | undefined;
}

export default function UserDropdown({ userImage }: UserDropdownProps) {
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();

  const { signOut } = useAuthActions();

  function handleSignOut() {
    if (pending) return;

    startTransition(async () => {
      await signOut();
    });
  }

  return (
    <DropdownMenu open={open} onOpenChange={setOpen} modal={false}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="none"
          className="group size-fit p-0 border rounded-full"
        >
          <Avatar className="size-10 flex items-center justify-center">
            <AvatarImage
              src={userImage ?? "/avatar.svg"}
              className={cn(
                userImage
                  ? "size-full transition-transform group-hover:scale-125"
                  : "size-5"
              )}
            />
            <AvatarFallback />
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="min-w-48">
        <DropdownMenuItem asChild className="flex items-center justify-between">
          <Link href="/profile">
            Profile
            <SettingsIcon />
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild className="flex items-center justify-between">
          <Link href="/create">
            Create
            <PlusIcon />
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          disabled={pending}
          className="flex items-center justify-between"
          onSelect={(e) => {
            e.preventDefault();
            handleSignOut();
          }}
        >
          Log out
          {pending ? <Loader2Icon className="animate-spin" /> : <LockOpen />}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
