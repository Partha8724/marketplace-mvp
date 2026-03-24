import { CategoryForm } from "@/components/admin/category-form";
import { Container } from "@/components/layout/container";
import { Card, CardContent } from "@/components/ui/card";
import { prisma } from "@/lib/db/prisma";
import { requireAdmin } from "@/lib/permissions";

export default async function AdminCategoriesPage() {
  await requireAdmin();
  const categories = await prisma.category.findMany({
    orderBy: [{ parentId: "asc" }, { sortOrder: "asc" }],
  });

  return (
    <Container className="grid gap-6 py-10 lg:grid-cols-[420px_1fr]">
      <div>
        <h1 className="text-4xl font-semibold text-stone-950">Categories</h1>
        <div className="mt-6">
          <CategoryForm categories={categories.map((category) => ({ id: category.id, name: category.name }))} />
        </div>
      </div>
      <div className="space-y-4">
        {categories.map((category) => (
          <Card key={category.id}>
            <CardContent className="p-6">
              <div className="text-lg font-semibold text-stone-950">{category.name}</div>
              <div className="mt-1 text-sm text-stone-500">{category.slug}</div>
            </CardContent>
          </Card>
        ))}
      </div>
    </Container>
  );
}
