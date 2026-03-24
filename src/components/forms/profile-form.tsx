"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { updateProfileAction } from "@/actions/profile-actions";
import { FormError } from "@/components/forms/form-error";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { profileSchema } from "@/lib/validations";

export function ProfileForm({ defaultValues }: { defaultValues: z.infer<typeof profileSchema> }) {
  const [pending, startTransition] = useTransition();
  const [message, setMessage] = useState<string>();
  const form = useForm<z.infer<typeof profileSchema>>({
    resolver: zodResolver(profileSchema),
    defaultValues,
  });

  const onSubmit = (values: z.infer<typeof profileSchema>) => {
    startTransition(async () => {
      const result = await updateProfileAction(values);
      setMessage(result.message);
    });
  };

  return (
    <form className="grid gap-5" onSubmit={form.handleSubmit(onSubmit)}>
      <div>
        <Label htmlFor="name">Display name</Label>
        <Input id="name" {...form.register("name")} />
        <FormError message={form.formState.errors.name?.message} />
      </div>
      <div>
        <Label htmlFor="city">City</Label>
        <Input id="city" {...form.register("city")} />
        <FormError message={form.formState.errors.city?.message} />
      </div>
      <div>
        <Label htmlFor="photoUrl">Profile photo URL</Label>
        <Input id="photoUrl" {...form.register("photoUrl")} />
      </div>
      <div>
        <Label htmlFor="phone">Phone</Label>
        <Input id="phone" {...form.register("phone")} />
      </div>
      <div>
        <Label htmlFor="bio">Bio</Label>
        <Textarea id="bio" {...form.register("bio")} />
      </div>
      {message ? <p className="text-sm text-stone-600">{message}</p> : null}
      <Button type="submit" disabled={pending}>{pending ? "Saving..." : "Save profile"}</Button>
    </form>
  );
}
