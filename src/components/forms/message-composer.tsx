"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { sendMessageAction } from "@/actions/chat-actions";
import { FormError } from "@/components/forms/form-error";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { messageSchema } from "@/lib/validations";

export function MessageComposer({ listingId }: { listingId: string }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [message, setMessage] = useState<string>();
  const form = useForm<z.infer<typeof messageSchema>>({
    resolver: zodResolver(messageSchema),
    defaultValues: {
      listingId,
      body: "",
    },
  });

  const onSubmit = (values: z.infer<typeof messageSchema>) => {
    startTransition(async () => {
      const result = await sendMessageAction(values);
      setMessage(result.message);
      if (result.success) {
        form.reset({ listingId, body: "" });
        router.push(result.redirectTo || "/dashboard/messages");
        router.refresh();
      }
    });
  };

  return (
    <form className="space-y-3" onSubmit={form.handleSubmit(onSubmit)}>
      <Textarea placeholder="Ask about condition, pickup, warranty, or price." {...form.register("body")} />
      <FormError message={form.formState.errors.body?.message} />
      {message ? <p className="text-sm text-stone-600">{message}</p> : null}
      <Button type="submit" disabled={pending}>{pending ? "Sending..." : "Send message"}</Button>
    </form>
  );
}
