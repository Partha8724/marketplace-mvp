import { Container } from "@/components/layout/container";
import { ModerationActions } from "@/components/admin/moderation-actions";
import { Card, CardContent } from "@/components/ui/card";
import { prisma } from "@/lib/db/prisma";
import { requireAdmin } from "@/lib/permissions";

export default async function AdminListingsPage() {
  await requireAdmin();
  const listings = await prisma.listing.findMany({
    where: { deletedAt: null },
    include: { user: true, category: true },
    orderBy: [{ moderationStatus: "asc" }, { createdAt: "desc" }],
  });

  return (
    <Container className="space-y-6 py-10">
      <h1 className="text-4xl font-semibold text-stone-950">Moderate listings</h1>
      <div className="space-y-4">
        {listings.map((listing) => (
          <Card key={listing.id}>
            <CardContent className="flex flex-col gap-4 p-6 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <div className="text-lg font-semibold text-stone-950">{listing.title}</div>
                <div className="mt-1 text-sm text-stone-500">{listing.user.email} • {listing.category.name} • {listing.moderationStatus}</div>
              </div>
              <ModerationActions listingId={listing.id} />
            </CardContent>
          </Card>
        ))}
      </div>
    </Container>
  );
}
