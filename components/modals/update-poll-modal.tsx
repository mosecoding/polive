"use client";

import { useState, useTransition } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn, nextWeek } from "@/lib/utils";
import { updatePollClientSchema, UpdatePollClientSchema } from "@/lib/schemas";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CalendarIcon, Loader2Icon } from "lucide-react";
import { formatDate } from "date-fns";
import { toast } from "react-hot-toast";
import { Poll } from "@/types";

export interface UpdatePollModalProps {
  poll: Poll;
  setOpenMenu: (open: boolean) => void;
}

export default function UpdatePollModal({
  poll,
  setOpenMenu,
}: UpdatePollModalProps) {
  const [pending, startTransition] = useTransition();
  const [openDialog, setOpenDialog] = useState(false);

  const updatePoll = useMutation(api.polls.updatePoll);

  const form = useForm<UpdatePollClientSchema>({
    resolver: zodResolver(updatePollClientSchema),
    mode: "onChange",
    defaultValues: {
      title: poll.title,
      endDate: new Date(poll.endDate),
      description: poll.description,
    },
  });

  const title = form.watch("title").trim();
  const description = form.watch("description")?.trim();
  const endDate = form.watch("endDate").getTime();

  const isFormUnchanged =
    poll.title === title &&
    poll.description === description &&
    poll.endDate === endDate;

  function onSubmit(data: UpdatePollClientSchema) {
    const { title, description, endDate } = data;

    startTransition(async () => {
      try {
        await updatePoll({
          pollId: poll._id,
          title,
          description,
          endDate: endDate.getTime(),
        });

        setOpenDialog(false);
        setOpenMenu(false);
        toast.success("Poll edited");
      } catch {
        toast.error("Something went wrong");
      }
    });
  }

  return (
    <Dialog
      open={openDialog}
      onOpenChange={(isOpen) => {
        setOpenDialog(isOpen);
        if (!isOpen) form.reset();
      }}
    >
      <DialogTrigger asChild>
        <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
          Edit
        </DropdownMenuItem>
      </DialogTrigger>
      <DialogContent className="h-fit max-h-[95dvh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit your poll</DialogTitle>
          <DialogDescription>
            You cannot save changes if the end date is in the past or beyond the
            next 7 days.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-4"
          >
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Start with a question or topic..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      className="min-h-20 resize-none"
                      placeholder="Describe your poll (optional)"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="endDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>End date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          className={cn(
                            "justify-between font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            formatDate(field.value, "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <CalendarIcon className="opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent
                      className="w-full p-0 pointer-events-auto"
                      align="start"
                    >
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={(date) => {
                          field.onChange(date ?? new Date(poll.endDate));
                        }}
                        disabled={(date) =>
                          date < new Date() || date > nextWeek()
                        }
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button
                type="submit"
                disabled={pending || !form.formState.isValid || isFormUnchanged}
              >
                {pending && <Loader2Icon className="animate-spin" />}
                Confirm
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
