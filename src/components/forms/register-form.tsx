"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { registerAction } from "@/actions/auth-actions";
import { FormError } from "@/components/forms/form-error";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { registerSchema } from "@/lib/validations";

export function RegisterForm() {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [serverError, setServerError] = useState<string>();
  const form = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      city: "",
    },
  });

  const onSubmit = (values: z.infer<typeof registerSchema>) => {
    startTransition(async () => {
      const result = await registerAction(values);

      if (!result.success) {
        setServerError(result.message);
        return;
      }

      router.push(result.redirectTo || "/dashboard");
      router.refresh();
    });
  };

  return (
    <form className="grid gap-5" onSubmit={form.handleSubmit(onSubmit)}>
      <div>
        <Label htmlFor="name">Full name</Label>
        <Input id="name" {...form.register("name")} />
        <FormError message={form.formState.errors.name?.message} />
      </div>
      <div>
        <Label htmlFor="email">Email</Label>
        <Input id="email" type="email" {...form.register("email")} />
        <FormError message={form.formState.errors.email?.message} />
      </div>
      <div>
        <Label htmlFor="city">City</Label>
        <Input id="city" {...form.register("city")} />
        <FormError message={form.formState.errors.city?.message} />
      </div>
      <div>
        <Label htmlFor="password">Password</Label>
        <Input id="password" type="password" {...form.register("password")} />
        <FormError message={form.formState.errors.password?.message} />
      </div>
      <div>
        <Label htmlFor="confirmPassword">Confirm password</Label>
        <Input id="confirmPassword" type="password" {...form.register("confirmPassword")} />
        <FormError message={form.formState.errors.confirmPassword?.message} />
      </div>
      <FormError message={serverError} />
      <Button type="submit" className="w-full" disabled={pending}>
        {pending ? "Creating account..." : "Create account"}
      </Button>
    </form>
  );
}
