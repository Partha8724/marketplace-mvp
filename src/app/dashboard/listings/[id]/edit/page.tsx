import { notFound } from "next/navigation";

import { ListingForm } from "@/components/forms/listing-form";
import { Container } from "@/components/layout/container";
import { Card, CardContent } from "@/components/ui/card";
import { prisma } from "@/lib/db/prisma";
import { requireUser } from "@/lib/permissions";

export default async function EditListingPage({ params }: { params: Promise<{ id: string }> }) {
  const user = await requireUser();
  const { id } = await params;
  const [categories, listing] = await Promise.all([
    prisma.category.findMany({
      where: { isActive: true, parentId: { not: null } },
      select: { id: true, name: true },
      orderBy: { name: "asc" },
    }),
    prisma.listing.findUnique({
      where: { id },
      include: { images: { orderBy: { sortOrder: "asc" } } },
    }),
  ]);

  if (!listing || listing.userId !== user.id) notFound();

  return (
    <Container className="py-10">
      <Card className="mx-auto max-w-4xl">
        <CardContent className="space-y-6 p-8">
          <h1 className="text-4xl font-semibold text-stone-950">Edit listing</h1>
          <ListingForm
            categories={categories}
            defaultValues={{
              id: listing.id,
              title: listing.title,
              description: listing.description,
              categoryId: listing.categoryId,
              price: Number(listing.price),
              negotiable: listing.negotiable,
              condition: listing.condition,
              brand: listing.brand || "",
              city: listing.city,
              deliveryOptions: listing.deliveryOptions,
              tags: listing.tags,
              status: listing.status,
              imageUrls: listing.images.map((image) => image.url),
            }}
          />
        </CardContent>
      </Card>
    </Container>
  );
}
