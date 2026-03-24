import { ListingForm } from "@/components/forms/listing-form";
import { Container } from "@/components/layout/container";
import { Card, CardContent } from "@/components/ui/card";
import { prisma } from "@/lib/db/prisma";
import { requireUser } from "@/lib/permissions";

export default async function NewListingPage() {
  await requireUser();
  const categories = await prisma.category.findMany({
    where: { isActive: true, parentId: { not: null } },
    select: { id: true, name: true },
    orderBy: { name: "asc" },
  });

  return (
    <Container className="py-10">
      <Card className="mx-auto max-w-4xl">
        <CardContent className="space-y-6 p-8">
          <h1 className="text-4xl font-semibold text-stone-950">Create a listing</h1>
          <ListingForm categories={categories} />
        </CardContent>
      </Card>
    </Container>
  );
}
