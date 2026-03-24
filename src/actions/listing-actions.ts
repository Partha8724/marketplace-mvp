/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { ListingStatus, ModerationStatus } from "@prisma/client";
import { revalidatePath } from "next/cache";

import { failureState, successState, type ActionState } from "@/lib/action-state";
import { prisma } from "@/lib/db/prisma";
import { screenListingContent } from "@/lib/moderation";
import { requireUser } from "@/lib/permissions";
import { createListingSlug } from "@/lib/utils";
import { listingSchema } from "@/lib/validations";

export async function saveListingAction(input: unknown): Promise<ActionState> {
  const user = await requireUser();
  const parsed = listingSchema.safeParse(input);
  if (!parsed.success) return failureState("Please fix the highlighted fields.", parsed.error.flatten().fieldErrors);

  const moderation = screenListingContent({
    title: parsed.data.title,
    description: parsed.data.description,
    tags: parsed.data.tags,
  });

  const moderationStatus = moderation.blocked ? ModerationStatus.REJECTED : ModerationStatus.PENDING;
  const publishedAt = null;

  if (parsed.data.id) {
    const existing = await prisma.listing.findUnique({ where: { id: parsed.data.id } });
    if (!existing || existing.userId !== user.id) return failureState("You cannot edit this listing.");

    await prisma.listing.update({
      where: { id: parsed.data.id },
      data: {
        title: parsed.data.title,
        description: parsed.data.description,
        categoryId: parsed.data.categoryId,
        price: parsed.data.price,
        negotiable: parsed.data.negotiable,
        condition: parsed.data.condition,
        brand: parsed.data.brand || null,
        city: parsed.data.city,
        deliveryOptions: parsed.data.deliveryOptions,
        tags: parsed.data.tags,
        status: parsed.data.status,
        moderationStatus,
        moderationReason: moderation.matches.join(", ") || null,
        publishedAt,
        images: {
          deleteMany: {},
          create: parsed.data.imageUrls.map((url, index) => ({ url, alt: parsed.data.title, sortOrder: index })),
        },
      },
    });

    revalidatePath("/dashboard/listings");
    return successState("Listing updated.", "/dashboard/listings");
  }

  await prisma.listing.create({
    data: {
      userId: user.id,
      categoryId: parsed.data.categoryId,
      title: parsed.data.title,
      slug: createListingSlug(parsed.data.title),
      description: parsed.data.description,
      brand: parsed.data.brand || null,
      price: parsed.data.price,
      negotiable: parsed.data.negotiable,
      condition: parsed.data.condition,
      city: parsed.data.city,
      deliveryOptions: parsed.data.deliveryOptions,
      tags: parsed.data.tags,
      status: parsed.data.status,
      moderationStatus,
      moderationReason: moderation.matches.join(", ") || null,
      publishedAt,
      images: {
        create: parsed.data.imageUrls.map((url, index) => ({ url, alt: parsed.data.title, sortOrder: index })),
      },
    },
  });

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/listings");
  revalidatePath("/browse");
  return successState(moderation.blocked ? "Listing rejected by prohibited-item screening." : "Listing saved and sent for moderation.", "/dashboard/listings");
}

export async function toggleFavoriteAction(listingId: string): Promise<ActionState> {
  const user = await requireUser();
  const existing = await prisma.favorite.findUnique({ where: { userId_listingId: { userId: user.id, listingId } } });
  if (existing) {
    await prisma.favorite.delete({ where: { id: existing.id } });
    await prisma.listing.update({ where: { id: listingId }, data: { savesCount: { decrement: 1 } } });
    revalidatePath("/dashboard/saved");
    return successState("Removed from saved items.");
  }
  await prisma.favorite.create({ data: { userId: user.id, listingId } });
  await prisma.listing.update({ where: { id: listingId }, data: { savesCount: { increment: 1 } } });
  revalidatePath("/dashboard/saved");
  return successState("Saved listing.");
}

export async function deleteListingAction(listingId: string): Promise<ActionState> {
  const user = await requireUser();
  const listing = await prisma.listing.findUnique({ where: { id: listingId } });
  if (!listing || listing.userId !== user.id) return failureState("You cannot delete this listing.");
  await prisma.listing.update({ where: { id: listingId }, data: { deletedAt: new Date(), status: ListingStatus.ARCHIVED } });
  revalidatePath("/dashboard/listings");
  revalidatePath("/browse");
  return successState("Listing deleted.");
}

export async function setListingStatusAction(listingId: string, status: any): Promise<ActionState> {
  const user = await requireUser();
  const listing = await prisma.listing.findUnique({ where: { id: listingId } });
  if (!listing || listing.userId !== user.id) return failureState("You cannot update this listing.");
  await prisma.listing.update({ where: { id: listingId }, data: { status } });
  revalidatePath("/dashboard");
  revalidatePath("/dashboard/listings");
  return successState("Listing status updated.");
}
