"use client";

import { Button } from "@/components/ui/button";
import { useAuthActions } from "@convex-dev/auth/react";
import { GithubIcon, Loader2Icon } from "lucide-react";
import { usePathname } from "next/navigation";
import { useTransition } from "react";

export default function SignInButton() {
  const [pending, startTransition] = useTransition();

  const pathname = usePathname();

  const { signIn } = useAuthActions();

  function handleSignIn() {
    if (pending) return;

    startTransition(async () => {
      await signIn("github", {
        redirectTo: pathname,
      });
    });
  }

  return (
    <Button
      disabled={pending}
      variant="secondary"
      className="border"
      onClick={handleSignIn}
    >
      {pending && <Loader2Icon className="animate-spin" />}
      <GithubIcon />
      Sign in
    </Button>
  );
}
