import { Container } from "@/components/layout/container";
import { ListingRowActions } from "@/components/dashboard/listing-row-actions";
import { Card, CardContent } from "@/components/ui/card";
import { prisma } from "@/lib/db/prisma";
import { requireUser } from "@/lib/permissions";
import { formatCurrency } from "@/lib/utils";

export default async function DashboardListingsPage() {
  const user = await requireUser();
  const listings = await prisma.listing.findMany({
    where: { userId: user.id, deletedAt: null },
    orderBy: { updatedAt: "desc" },
  });

  return (
    <Container className="space-y-6 py-10">
      <h1 className="text-4xl font-semibold text-stone-950">Manage listings</h1>
      <div className="space-y-4">
        {listings.map((listing) => (
          <Card key={listing.id}>
            <CardContent className="flex flex-col gap-4 p-6 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <div className="text-xl font-semibold text-stone-950">{listing.title}</div>
                <div className="mt-2 text-sm text-stone-500">{formatCurrency(String(listing.price))} • {listing.status} • {listing.moderationStatus}</div>
              </div>
              <ListingRowActions listingId={listing.id} />
            </CardContent>
          </Card>
        ))}
      </div>
    </Container>
  );
}
