/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useTransition } from "react";
import { useForm } from "react-hook-form";

import { saveCategoryAction } from "@/actions/admin-actions";
import { FormError } from "@/components/forms/form-error";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { categorySchema } from "@/lib/validations";

export function CategoryForm({ categories }: { categories: { id: string; name: string }[] }) {
  const [pending, startTransition] = useTransition();
  const form = useForm<any>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: "",
      slug: "",
      description: "",
      parentId: "",
      icon: "",
      sortOrder: 0,
    },
  });

  return (
    <form className="grid gap-3 rounded-[28px] border border-stone-200 bg-white p-5" onSubmit={form.handleSubmit((values: any) => startTransition(async () => { await saveCategoryAction(values); form.reset(); }))}>
      <Input placeholder="Category name" {...form.register("name")} />
      <FormError message={form.formState.errors.name?.message as string | undefined} />
      <Input placeholder="Slug" {...form.register("slug")} />
      <Input placeholder="Description" {...form.register("description")} />
      <select className="h-12 rounded-2xl border border-stone-200 px-4" {...form.register("parentId")}>
        <option value="">No parent</option>
        {categories.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}
      </select>
      <Button type="submit" disabled={pending}>{pending ? "Saving..." : "Save category"}</Button>
    </form>
  );
}
