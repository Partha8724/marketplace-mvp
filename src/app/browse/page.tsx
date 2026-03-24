import Link from "next/link";
import { DeliveryOption, ItemCondition } from "@prisma/client";

import { Container } from "@/components/layout/container";
import { ListingCard } from "@/components/listing/listing-card";
import { EmptyState } from "@/components/ui/empty-state";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { conditionLabels, deliveryOptionLabels } from "@/lib/constants";
import { getCategoryTree } from "@/lib/queries/categories";
import { getBrowseListings } from "@/lib/queries/listings";

export default async function BrowsePage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const [categories, listings] = await Promise.all([
    getCategoryTree(),
    getBrowseListings({
      q: typeof params.q === "string" ? params.q : undefined,
      category: typeof params.category === "string" ? params.category : undefined,
      city: typeof params.city === "string" ? params.city : undefined,
      condition: typeof params.condition === "string" ? (params.condition as ItemCondition) : undefined,
      delivery: typeof params.delivery === "string" ? (params.delivery as DeliveryOption) : undefined,
      minPrice: typeof params.minPrice === "string" ? Number(params.minPrice) : undefined,
      maxPrice: typeof params.maxPrice === "string" ? Number(params.maxPrice) : undefined,
      sort: typeof params.sort === "string" ? (params.sort as "newest" | "price-asc" | "price-desc") : "newest",
    }),
  ]);

  return (
    <Container className="grid gap-8 py-10 lg:grid-cols-[300px_1fr]">
      <aside className="h-fit rounded-[28px] border border-stone-200 bg-white p-5 shadow-[0_12px_40px_rgba(15,23,42,0.06)] lg:sticky lg:top-24">
        <h1 className="text-3xl font-semibold text-stone-950">Browse listings</h1>
        <form className="mt-5 space-y-4">
          <Input name="q" defaultValue={typeof params.q === "string" ? params.q : ""} placeholder="Search by keyword" />
          <Select name="category" defaultValue={typeof params.category === "string" ? params.category : ""}>
            <option value="">All categories</option>
            {categories.map((category) => (
              <option key={category.id} value={category.slug}>{category.name}</option>
            ))}
          </Select>
          <Input name="city" defaultValue={typeof params.city === "string" ? params.city : ""} placeholder="City" />
          <Select name="condition" defaultValue={typeof params.condition === "string" ? params.condition : ""}>
            <option value="">Any condition</option>
            {Object.values(ItemCondition).map((condition) => (
              <option key={condition} value={condition}>{conditionLabels[condition]}</option>
            ))}
          </Select>
          <Select name="delivery" defaultValue={typeof params.delivery === "string" ? params.delivery : ""}>
            <option value="">Any delivery option</option>
            {Object.values(DeliveryOption).map((option) => (
              <option key={option} value={option}>{deliveryOptionLabels[option]}</option>
            ))}
          </Select>
          <div className="grid grid-cols-2 gap-3">
            <Input name="minPrice" type="number" placeholder="Min" defaultValue={typeof params.minPrice === "string" ? params.minPrice : ""} />
            <Input name="maxPrice" type="number" placeholder="Max" defaultValue={typeof params.maxPrice === "string" ? params.maxPrice : ""} />
          </div>
          <Select name="sort" defaultValue={typeof params.sort === "string" ? params.sort : "newest"}>
            <option value="newest">Newest first</option>
            <option value="price-asc">Price: Low to high</option>
            <option value="price-desc">Price: High to low</option>
          </Select>
          <button className="w-full rounded-full bg-stone-950 px-5 py-3 text-sm font-semibold text-white">Apply filters</button>
        </form>
      </aside>
      <section className="space-y-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <div className="text-sm text-stone-500">Curated, approved marketplace inventory</div>
            <h2 className="text-3xl font-semibold text-stone-950">{listings.length} listings</h2>
          </div>
          <Link href="/dashboard/listings/new" className="rounded-full bg-white px-5 py-3 text-sm font-semibold text-stone-900 ring-1 ring-stone-200">
            Sell an item
          </Link>
        </div>
        {listings.length ? (
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {listings.map((listing) => (
              <ListingCard key={listing.id} listing={listing} />
            ))}
          </div>
        ) : (
          <EmptyState
            title="No listings matched these filters"
            description="Try removing a few filters, broadening your city, or searching with a wider keyword."
            ctaHref="/browse"
            ctaLabel="Clear filters"
          />
        )}
      </section>
    </Container>
  );
}
