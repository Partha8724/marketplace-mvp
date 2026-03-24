"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { submitReportAction } from "@/actions/report-actions";
import { FormError } from "@/components/forms/form-error";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { reportSchema } from "@/lib/validations";

export function ReportForm({ listingId }: { listingId: string }) {
  const [pending, startTransition] = useTransition();
  const [message, setMessage] = useState<string>();
  const form = useForm<z.infer<typeof reportSchema>>({
    resolver: zodResolver(reportSchema),
    defaultValues: {
      listingId,
      reason: "",
      details: "",
    },
  });

  const onSubmit = (values: z.infer<typeof reportSchema>) => {
    startTransition(async () => {
      const result = await submitReportAction(values);
      setMessage(result.message);
      if (result.success) form.reset({ listingId, reason: "", details: "" });
    });
  };

  return (
    <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
      <div>
        <Label htmlFor="reason">Reason</Label>
        <Input id="reason" {...form.register("reason")} />
        <FormError message={form.formState.errors.reason?.message} />
      </div>
      <div>
        <Label htmlFor="details">Details</Label>
        <Textarea id="details" {...form.register("details")} />
      </div>
      {message ? <p className="text-sm text-stone-600">{message}</p> : null}
      <Button type="submit" variant="secondary" disabled={pending}>{pending ? "Submitting..." : "Report listing"}</Button>
    </form>
  );
}
