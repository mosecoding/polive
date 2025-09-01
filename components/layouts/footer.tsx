import { GithubIcon } from "lucide-react";
import { Button } from "../ui/button";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="py-4 text-center text-muted-foreground">
      <Button asChild variant="none" className="hover:text-primary">
        <Link href="https://github.com/mosecoding" target="_blank">
          <GithubIcon className="size-4" />
          mosecoding
        </Link>
      </Button>
    </footer>
  );
}
