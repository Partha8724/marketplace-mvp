import "server-only";

import { DeliveryOption, ItemCondition, ListingStatus, ModerationStatus, Prisma } from "@prisma/client";

import { prisma } from "@/lib/db/prisma";

export type BrowseSearchParams = {
  q?: string;
  category?: string;
  city?: string;
  condition?: ItemCondition;
  delivery?: DeliveryOption;
  minPrice?: number;
  maxPrice?: number;
  sort?: "newest" | "price-asc" | "price-desc";
};

export function buildBrowseWhere(params: BrowseSearchParams): Prisma.ListingWhereInput {
  return {
    deletedAt: null,
    status: { in: [ListingStatus.ACTIVE, ListingStatus.SOLD] },
    moderationStatus: ModerationStatus.APPROVED,
    ...(params.q
      ? {
          OR: [
            { title: { contains: params.q, mode: "insensitive" } },
            { description: { contains: params.q, mode: "insensitive" } },
            { tags: { has: params.q.toLowerCase() } },
          ],
        }
      : {}),
    ...(params.category ? { category: { slug: params.category } } : {}),
    ...(params.city ? { city: { equals: params.city, mode: "insensitive" } } : {}),
    ...(params.condition ? { condition: params.condition } : {}),
    ...(params.delivery ? { deliveryOptions: { has: params.delivery } } : {}),
    ...(params.minPrice || params.maxPrice
      ? {
          price: {
            ...(params.minPrice ? { gte: params.minPrice } : {}),
            ...(params.maxPrice ? { lte: params.maxPrice } : {}),
          },
        }
      : {}),
  };
}

function getOrderBy(sort: BrowseSearchParams["sort"]): Prisma.ListingOrderByWithRelationInput[] {
  switch (sort) {
    case "price-asc":
      return [{ price: "asc" }, { createdAt: "desc" }];
    case "price-desc":
      return [{ price: "desc" }, { createdAt: "desc" }];
    default:
      return [{ createdAt: "desc" }];
  }
}

export async function getBrowseListings(params: BrowseSearchParams) {
  return prisma.listing.findMany({
    where: buildBrowseWhere(params),
    include: {
      images: { orderBy: { sortOrder: "asc" }, take: 1 },
      user: { include: { profile: true } },
      category: true,
      _count: { select: { favorites: true } },
    },
    orderBy: getOrderBy(params.sort),
    take: 36,
  });
}

export async function getHomepageListings() {
  return prisma.listing.findMany({
    where: {
      moderationStatus: ModerationStatus.APPROVED,
      status: ListingStatus.ACTIVE,
      deletedAt: null,
    },
    include: {
      images: { orderBy: { sortOrder: "asc" }, take: 1 },
      category: true,
      user: { include: { profile: true } },
    },
    orderBy: { createdAt: "desc" },
    take: 8,
  });
}

export async function getListingBySlug(slug: string, viewerId?: string) {
  const listing = await prisma.listing.findFirst({
    where: {
      slug,
      deletedAt: null,
      moderationStatus: ModerationStatus.APPROVED,
    },
    include: {
      images: { orderBy: { sortOrder: "asc" } },
      category: { include: { parent: true } },
      user: { include: { profile: true } },
      _count: { select: { favorites: true } },
      favorites: viewerId ? { where: { userId: viewerId }, take: 1 } : false,
    },
  });

  if (listing) {
    await prisma.listing.update({
      where: { id: listing.id },
      data: { viewsCount: { increment: 1 } },
    });
  }

  return listing;
}
