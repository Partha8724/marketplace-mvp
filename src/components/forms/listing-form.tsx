/* eslint-disable @typescript-eslint/no-explicit-any, react-hooks/incompatible-library */
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { DeliveryOption, ItemCondition, ListingStatus } from "@prisma/client";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";

import { saveListingAction } from "@/actions/listing-actions";
import { FormError } from "@/components/forms/form-error";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { deliveryOptionLabels, conditionLabels } from "@/lib/constants";
import { listingSchema } from "@/lib/validations";

const deliveryOptions = Object.values(DeliveryOption) as string[];
const conditionOptions = Object.values(ItemCondition) as string[];
const statusOptions = Object.values(ListingStatus) as string[];

export function ListingForm({ categories, defaultValues }: { categories: { id: string; name: string }[]; defaultValues?: any }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [serverError, setServerError] = useState<string>();
  const [uploading, setUploading] = useState(false);
  const form = useForm<any>({
    resolver: zodResolver(listingSchema),
    defaultValues: {
      id: defaultValues?.id,
      title: defaultValues?.title || "",
      description: defaultValues?.description || "",
      categoryId: defaultValues?.categoryId || "",
      price: defaultValues?.price || 0,
      negotiable: defaultValues?.negotiable || false,
      condition: defaultValues?.condition || ItemCondition.GOOD,
      brand: defaultValues?.brand || "",
      city: defaultValues?.city || "",
      deliveryOptions: defaultValues?.deliveryOptions || [DeliveryOption.PICKUP],
      tags: defaultValues?.tags || [],
      status: defaultValues?.status || ListingStatus.DRAFT,
      imageUrls: defaultValues?.imageUrls || [],
    },
  });

  const uploadFiles = async (files: FileList | null) => {
    if (!files?.length) return;
    setUploading(true);
    const body = new FormData();
    Array.from(files).forEach((file) => body.append("files", file));
    const response = await fetch("/api/upload", { method: "POST", body });
    const data = await response.json();
    setUploading(false);
    if (!response.ok) return setServerError(data.error || "Upload failed.");
    const current = form.getValues("imageUrls") as string[];
    form.setValue("imageUrls", [...current, ...data.urls].slice(0, 8), { shouldValidate: true });
  };

  const onSubmit = (values: any) => {
    startTransition(async () => {
      const result = await saveListingAction(values);
      if (!result.success) return setServerError(result.message);
      router.push(result.redirectTo || "/dashboard/listings");
      router.refresh();
    });
  };

  const selectedDelivery = (form.watch("deliveryOptions") || []) as string[];
  const selectedImages = (form.watch("imageUrls") || []) as string[];

  return (
    <form className="grid gap-6" onSubmit={form.handleSubmit(onSubmit)}>
      <div className="grid gap-6 lg:grid-cols-2">
        <div><Label htmlFor="title">Title</Label><Input id="title" {...form.register("title")} /><FormError message={form.formState.errors.title?.message as string | undefined} /></div>
        <div><Label htmlFor="price">Price</Label><Input id="price" type="number" {...form.register("price", { valueAsNumber: true })} /><FormError message={form.formState.errors.price?.message as string | undefined} /></div>
      </div>
      <div><Label htmlFor="description">Description</Label><Textarea id="description" {...form.register("description")} /><FormError message={form.formState.errors.description?.message as string | undefined} /></div>
      <div className="grid gap-6 lg:grid-cols-3">
        <div><Label htmlFor="categoryId">Category</Label><Select id="categoryId" {...form.register("categoryId")}><option value="">Choose category</option>{categories.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}</Select><FormError message={form.formState.errors.categoryId?.message as string | undefined} /></div>
        <div><Label htmlFor="condition">Condition</Label><Select id="condition" {...form.register("condition")}>{conditionOptions.map((condition) => <option key={condition} value={condition}>{conditionLabels[condition as keyof typeof conditionLabels]}</option>)}</Select></div>
        <div><Label htmlFor="status">Status</Label><Select id="status" {...form.register("status")}>{statusOptions.map((status) => <option key={status} value={status}>{status}</option>)}</Select></div>
      </div>
      <div className="grid gap-6 lg:grid-cols-3">
        <div><Label htmlFor="brand">Brand</Label><Input id="brand" {...form.register("brand")} /></div>
        <div><Label htmlFor="city">City</Label><Input id="city" {...form.register("city")} /><FormError message={form.formState.errors.city?.message as string | undefined} /></div>
        <div className="flex items-end gap-3 rounded-3xl border border-stone-200 bg-white px-4 py-4"><Checkbox checked={Boolean(form.watch("negotiable"))} onChange={(event) => form.setValue("negotiable", event.target.checked)} /><Label className="mb-0">Price is negotiable</Label></div>
      </div>
      <div>
        <Label>Delivery options</Label>
        <div className="mt-2 flex flex-wrap gap-4">
          {deliveryOptions.map((option) => <label key={option} className="flex items-center gap-2 rounded-full border border-stone-200 bg-white px-4 py-2 text-sm"><Checkbox checked={selectedDelivery.includes(option)} onChange={(event) => { const next = event.target.checked ? [...selectedDelivery, option] : selectedDelivery.filter((item) => item !== option); form.setValue("deliveryOptions", next, { shouldValidate: true }); }} />{deliveryOptionLabels[option as keyof typeof deliveryOptionLabels]}</label>)}
        </div>
      </div>
      <div><Label htmlFor="tags">Tags</Label><Input id="tags" defaultValue={(form.getValues("tags") || []).join(", ")} onChange={(event) => form.setValue("tags", event.target.value.split(",").map((tag) => tag.trim().toLowerCase()).filter(Boolean), { shouldValidate: true })} /><p className="mt-1 text-xs text-stone-500">Separate tags with commas.</p></div>
      <div>
        <Label htmlFor="images">Images</Label>
        <Input id="images" type="file" multiple accept="image/*" onChange={(event) => uploadFiles(event.target.files)} />
        <p className="mt-1 text-xs text-stone-500">{uploading ? "Uploading..." : "Up to 8 images."}</p>
        <div className="mt-3 flex flex-wrap gap-2">{selectedImages.map((url) => <div key={url} className="rounded-full bg-stone-100 px-3 py-1 text-xs text-stone-600">{url.split("/").pop()}</div>)}</div>
      </div>
      <FormError message={serverError} />
      <Button type="submit" disabled={pending || uploading}>{pending ? "Saving..." : defaultValues?.id ? "Update listing" : "Create listing"}</Button>
    </form>
  );
}
