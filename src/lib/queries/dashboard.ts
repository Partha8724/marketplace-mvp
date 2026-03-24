import "server-only";

import { ModerationStatus } from "@prisma/client";

import { prisma } from "@/lib/db/prisma";

export async function getDashboardSnapshot(userId: string) {
  const [listings, favorites, conversations, profile] = await Promise.all([
    prisma.listing.findMany({
      where: { userId, deletedAt: null },
      include: { images: { take: 1, orderBy: { sortOrder: "asc" } } },
      orderBy: { updatedAt: "desc" },
      take: 4,
    }),
    prisma.favorite.count({ where: { userId } }),
    prisma.conversation.count({
      where: {
        OR: [{ buyerId: userId }, { sellerId: userId }],
      },
    }),
    prisma.profile.findUnique({ where: { userId } }),
  ]);

  return {
    listings,
    profile,
    stats: {
      liveListings: listings.filter((listing) => listing.moderationStatus === ModerationStatus.APPROVED).length,
      savedCount: favorites,
      messagesCount: conversations,
    },
  };
}
