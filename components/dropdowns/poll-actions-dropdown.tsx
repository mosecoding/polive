import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import DeletePollModal from "@/components/modals/delete-poll-modal";
import UpdatePollModal from "@/components/modals/update-poll-modal";
import { EllipsisIcon } from "lucide-react";
import { Poll } from "@/types";

export interface PollActionsDropdownProps {
  poll: Poll;
}

export default function PollActionsDropdown({
  poll,
}: PollActionsDropdownProps) {
  const [openMenu, setOpenMenu] = useState(false);

  return (
    <DropdownMenu open={openMenu} onOpenChange={setOpenMenu} modal={false}>
      <DropdownMenuTrigger asChild>
        <Button
          size="icon"
          variant="none"
          className="size-8 hover:text-foreground/80"
        >
          <EllipsisIcon />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DeletePollModal pollId={poll._id} />
        <UpdatePollModal poll={poll} setOpenMenu={setOpenMenu} />
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
