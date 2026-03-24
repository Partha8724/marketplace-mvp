import { Container } from "@/components/layout/container";
import { Card, CardContent } from "@/components/ui/card";
import { prohibitedCategoriesCopy } from "@/lib/constants";

export default function ProhibitedItemsPage() {
  return (
    <Container className="space-y-8 py-10">
      <div>
        <div className="text-sm text-stone-500">Moderation policy</div>
        <h1 className="text-4xl font-semibold text-stone-950">Prohibited items</h1>
      </div>
      <div className="grid gap-5 md:grid-cols-2">
        {prohibitedCategoriesCopy.map((item) => (
          <Card key={item.title}>
            <CardContent className="p-6">
              <h2 className="text-2xl font-semibold text-stone-950">{item.title}</h2>
              <p className="mt-3 text-sm text-stone-600">{item.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </Container>
  );
}
