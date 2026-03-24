import "server-only";

import { prisma } from "@/lib/db/prisma";

export async function getCategoryTree() {
  return prisma.category.findMany({
    where: { parentId: null, isActive: true },
    include: {
      children: {
        where: { isActive: true },
        orderBy: { sortOrder: "asc" },
      },
    },
    orderBy: { sortOrder: "asc" },
  });
}
