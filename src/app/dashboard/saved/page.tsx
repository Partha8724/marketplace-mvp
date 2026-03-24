import { Container } from "@/components/layout/container";
import { ListingCard } from "@/components/listing/listing-card";
import { EmptyState } from "@/components/ui/empty-state";
import { prisma } from "@/lib/db/prisma";
import { requireUser } from "@/lib/permissions";

export default async function SavedListingsPage() {
  const user = await requireUser();
  const saved = await prisma.favorite.findMany({
    where: { userId: user.id },
    include: {
      listing: {
        include: {
          images: { take: 1, orderBy: { sortOrder: "asc" } },
          category: true,
          _count: { select: { favorites: true } },
        },
      },
    },
  });

  return (
    <Container className="space-y-6 py-10">
      <h1 className="text-4xl font-semibold text-stone-950">Saved items</h1>
      {saved.length ? (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {saved.map(({ listing }) => (
            <ListingCard key={listing.id} listing={listing} />
          ))}
        </div>
      ) : (
        <EmptyState title="No saved listings yet" description="Save interesting listings to revisit them from your dashboard." ctaHref="/browse" ctaLabel="Browse listings" />
      )}
    </Container>
  );
}
