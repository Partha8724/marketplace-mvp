import { notFound } from "next/navigation";

import { Container } from "@/components/layout/container";
import { ListingCard } from "@/components/listing/listing-card";
import { EmptyState } from "@/components/ui/empty-state";
import { prisma } from "@/lib/db/prisma";

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const category = await prisma.category.findUnique({
    where: { slug },
  });

  if (!category) notFound();

  const listings = await prisma.listing.findMany({
    where: {
      category: { slug },
      moderationStatus: "APPROVED",
      deletedAt: null,
    },
    include: {
      images: { take: 1, orderBy: { sortOrder: "asc" } },
      category: true,
      _count: { select: { favorites: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <Container className="space-y-8 py-10">
      <div>
        <div className="text-sm text-stone-500">Category</div>
        <h1 className="text-4xl font-semibold text-stone-950">{category.name}</h1>
      </div>
      {listings.length ? (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {listings.map((listing) => (
            <ListingCard key={listing.id} listing={listing} />
          ))}
        </div>
      ) : (
        <EmptyState title="No approved listings yet" description="This category is live, but there are no approved items to show right now." />
      )}
    </Container>
  );
}
