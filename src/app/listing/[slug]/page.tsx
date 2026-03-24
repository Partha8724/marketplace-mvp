import { notFound } from "next/navigation";

import { auth } from "@/auth";
import { Container } from "@/components/layout/container";
import { MessageComposer } from "@/components/forms/message-composer";
import { ReportForm } from "@/components/forms/report-form";
import { FavoriteButton } from "@/components/listing/favorite-button";
import { ListingCard } from "@/components/listing/listing-card";
import { SellerCard } from "@/components/listing/seller-card";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { conditionLabels, deliveryOptionLabels, safeMeetupTips } from "@/lib/constants";
import { prisma } from "@/lib/db/prisma";
import { getListingBySlug } from "@/lib/queries/listings";
import { formatCurrency } from "@/lib/utils";

export default async function ListingDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const session = await auth();
  const { slug } = await params;
  const listing = await getListingBySlug(slug, session?.user?.id);

  if (!listing) notFound();

  const [similarListings, sellerListings] = await Promise.all([
    prisma.listing.findMany({
      where: {
        categoryId: listing.categoryId,
        id: { not: listing.id },
        moderationStatus: "APPROVED",
        deletedAt: null,
      },
      include: {
        images: { take: 1, orderBy: { sortOrder: "asc" } },
        category: true,
        _count: { select: { favorites: true } },
      },
      take: 4,
    }),
    prisma.listing.findMany({
      where: {
        userId: listing.userId,
        id: { not: listing.id },
        moderationStatus: "APPROVED",
        deletedAt: null,
      },
      include: {
        images: { take: 1, orderBy: { sortOrder: "asc" } },
        category: true,
        _count: { select: { favorites: true } },
      },
      take: 4,
    }),
  ]);

  return (
    <Container className="space-y-10 py-10">
      <section className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-2">
            {listing.images.map((image) => (
              <div key={image.id} className="aspect-[4/3] rounded-[28px] bg-cover bg-center" style={{ backgroundImage: `url(${image.url})` }} />
            ))}
          </div>
          <Card>
            <CardContent className="space-y-5 p-8">
              <div className="flex flex-wrap gap-2">
                <Badge variant="success">{listing.status}</Badge>
                <Badge>{conditionLabels[listing.condition]}</Badge>
              </div>
              <h1 className="text-4xl font-semibold text-stone-950">{listing.title}</h1>
              <div className="text-3xl font-semibold text-stone-950">{formatCurrency(String(listing.price))}</div>
              <p className="text-stone-600">{listing.description}</p>
              <div className="flex flex-wrap gap-2">
                {listing.deliveryOptions.map((option) => (
                  <Badge key={option} variant="accent">{deliveryOptionLabels[option]}</Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
        <div className="space-y-6">
          <SellerCard seller={listing.user} />
          <Card>
            <CardContent className="space-y-4 p-6">
              <FavoriteButton listingId={listing.id} initialSaved={Boolean(Array.isArray(listing.favorites) && listing.favorites.length)} />
              {session?.user?.id ? <MessageComposer listingId={listing.id} /> : <p className="text-sm text-stone-600">Log in to message the seller or save this listing.</p>}
              {session?.user?.id ? <ReportForm listingId={listing.id} /> : null}
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold text-stone-950">Safe meetup tips</h2>
              <ul className="mt-4 space-y-2 text-sm text-stone-600">
                {safeMeetupTips.map((tip) => (
                  <li key={tip}>{tip}</li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      </section>
      <section className="space-y-5">
        <h2 className="text-3xl font-semibold text-stone-950">Similar items</h2>
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {similarListings.map((item) => (
            <ListingCard key={item.id} listing={item} />
          ))}
        </div>
      </section>
      <section className="space-y-5">
        <h2 className="text-3xl font-semibold text-stone-950">More from this seller</h2>
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {sellerListings.map((item) => (
            <ListingCard key={item.id} listing={item} />
          ))}
        </div>
      </section>
    </Container>
  );
}
