"use client";

import { useState, useTransition } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { ConvexError } from "convex/values";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { useForm, useFormContext } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { nextWeek, cn } from "@/lib/utils";
import { createPollClientSchema, CreatePollClientSchema } from "@/lib/schemas";
import { useRouter } from "next/navigation";
import { CalendarIcon, CheckIcon, Loader2Icon, Trash2Icon } from "lucide-react";
import { formatDate } from "date-fns";
import { toast } from "react-hot-toast";

export default function CreatePage() {
  const [pending, startTransition] = useTransition();

  const createPoll = useMutation(api.polls.createPoll);

  const router = useRouter();

  const form = useForm<CreatePollClientSchema>({
    mode: "onChange",
    resolver: zodResolver(createPollClientSchema),
    defaultValues: {
      title: "",
      options: [],
    },
  });

  function onSubmit(data: CreatePollClientSchema) {
    const { title, description, endDate, options } = data;

    startTransition(async () => {
      try {
        const { pollId } = await createPoll({
          title,
          description,
          endDate: endDate.getTime(),
          options,
        });

        startTransition(() => {
          router.push(`/poll/${pollId}`);
          toast.success("Poll created");
        });
      } catch (error) {
        if (error instanceof ConvexError) {
          toast.error(error.data);
        } else {
          toast.error("Something went wrong");
        }
      }
    });
  }

  return (
    <div className="max-w-3xl mx-auto">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-7"
        >
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="Start with a question or topic..."
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
                    {...field}
                    placeholder="Describe your poll (optional)"
                    className="min-h-20 resize-none"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <OptionsField />
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
                  <PopoverContent className="z-0 w-full p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
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
          <Button disabled={!form.formState.isValid || pending} type="submit">
            {pending && <Loader2Icon className="animate-spin" />}
            Create
          </Button>
        </form>
      </Form>
    </div>
  );
}

function OptionsField() {
  const [option, setOption] = useState("");

  const form = useFormContext<CreatePollClientSchema>();

  const options = form.watch("options");
  const currentOptions = form.getValues("options");

  const isMaxOptions = options.length >= 8;

  function addOption() {
    const value = option.trim();
    if (!value) return;

    const isDuplicate = currentOptions.some(
      (option) => option.text.toLowerCase() === value.toLowerCase()
    );
    if (isDuplicate) return toast.error("Duplicate options are not allowed");

    form.setValue("options", [...currentOptions, { text: value }], {
      shouldValidate: true,
    });
    setOption("");
  }

  function removeOption(text: string) {
    const updated = currentOptions.filter((option) => option.text !== text);
    form.setValue("options", updated, { shouldValidate: true });
  }

  return (
    <FormField
      control={form.control}
      name="options"
      render={() => (
        <FormItem className="flex flex-col">
          <div className="flex flex-col gap-1">
            <FormLabel>Poll Options</FormLabel>
            <FormDescription>
              Add 2-8 options. You will not be able to edit them later!
            </FormDescription>
          </div>
          <div className="flex flex-col gap-4">
            <FormControl>
              <Input
                disabled={isMaxOptions}
                value={option}
                onChange={(e) => {
                  const value = e.target.value;
                  if (value.length > 50) return;
                  setOption(value);
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addOption();
                  }
                }}
                placeholder="Press Enter to add"
              />
            </FormControl>
            {options.length > 0 && (
              <div className="flex flex-col gap-2">
                {options.map((option) => (
                  <div
                    key={option.text}
                    className="px-3 py-1 rounded-md border border-primary/20 bg-primary/5"
                  >
                    <div className="flex items-center gap-3 text-primary">
                      <div>
                        <CheckIcon className="size-4" />
                      </div>
                      <p className="flex-1 text-sm font-medium truncate">
                        {option.text}
                      </p>
                      <Button
                        type="button"
                        size="icon"
                        variant="none"
                        className="opacity-50 transition-opacity hover:bg-primary/15"
                        onClick={() => removeOption(option.text)}
                      >
                        <Trash2Icon />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
