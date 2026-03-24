import Link from "next/link";
import { ArrowRight, BadgeCheck, Shield, Sparkles } from "lucide-react";

import { Container } from "@/components/layout/container";
import { ListingCard } from "@/components/listing/listing-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { safeMeetupTips } from "@/lib/constants";
import { getCategoryTree } from "@/lib/queries/categories";
import { getHomepageListings } from "@/lib/queries/listings";

export default async function HomePage() {
  const [categories, listings] = await Promise.all([getCategoryTree(), getHomepageListings()]);

  return (
    <div className="pb-20">
      <Container className="py-10">
        <section className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
          <Card className="overflow-hidden bg-stone-950 text-white">
            <CardContent className="relative p-8 sm:p-12">
              <Badge className="mb-6 bg-white/10 text-white">Premium resale, built for trust</Badge>
              <h1 className="max-w-2xl text-5xl leading-tight font-semibold sm:text-6xl">
                A better place to buy and sell second-hand items.
              </h1>
              <p className="mt-5 max-w-2xl text-lg text-stone-300">
                Faster listing flow, cleaner browsing, moderation-first trust, and safer buyer-seller conversations.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Button asChild variant="secondary">
                  <Link href="/browse">Start browsing</Link>
                </Button>
                <Button asChild>
                  <Link href="/dashboard/listings/new">
                    Sell an item <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </div>
              <div className="mt-10 grid gap-4 sm:grid-cols-3">
                <div className="rounded-3xl bg-white/5 p-4">
                  <div className="text-3xl font-semibold">10 min</div>
                  <p className="mt-2 text-sm text-stone-300">Average listing flow for multi-image posts.</p>
                </div>
                <div className="rounded-3xl bg-white/5 p-4">
                  <div className="text-3xl font-semibold">1 feed</div>
                  <p className="mt-2 text-sm text-stone-300">Search, filters, and category pages stay consistent.</p>
                </div>
                <div className="rounded-3xl bg-white/5 p-4">
                  <div className="text-3xl font-semibold">Safety-first</div>
                  <p className="mt-2 text-sm text-stone-300">Prohibited item screening and reviewable reports built in.</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <div className="grid gap-6">
            <Card>
              <CardContent className="p-8">
                <div className="flex items-center gap-3 text-stone-900">
                  <Shield className="h-5 w-5" />
                  <div className="font-semibold">Trust signals buyers actually use</div>
                </div>
                <ul className="mt-5 space-y-4 text-sm text-stone-600">
                  <li>Approved listings only appear publicly.</li>
                  <li>Verified email and account-age badges on seller cards.</li>
                  <li>Safe meetup guidance embedded on high-intent pages.</li>
                </ul>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-br from-amber-100 to-white">
              <CardContent className="p-8">
                <div className="flex items-center gap-3 text-stone-900">
                  <Sparkles className="h-5 w-5" />
                  <div className="font-semibold">Modern category discovery</div>
                </div>
                <div className="mt-5 grid grid-cols-2 gap-3">
                  {categories.slice(0, 4).map((category) => (
                    <Link
                      key={category.id}
                      href={`/category/${category.slug}`}
                      className="rounded-3xl border border-white bg-white/80 p-4 text-sm font-medium text-stone-700 transition hover:-translate-y-0.5 hover:text-stone-950"
                    >
                      {category.name}
                    </Link>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      </Container>

      <Container className="space-y-12">
        <section>
          <div className="mb-6 flex items-end justify-between gap-4">
            <div>
              <Badge variant="accent">Latest approved listings</Badge>
              <h2 className="mt-3 text-3xl font-semibold text-stone-950">Fresh finds, not cluttered pages</h2>
            </div>
            <Button asChild variant="ghost">
              <Link href="/browse">See all</Link>
            </Button>
          </div>
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {listings.map((listing) => (
              <ListingCard key={listing.id} listing={listing} />
            ))}
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-[1fr_1fr]">
          <Card>
            <CardContent className="p-8">
              <Badge variant="success">Why this feels safer</Badge>
              <h2 className="mt-4 text-3xl font-semibold text-stone-950">Built to reduce scams before they spread</h2>
              <div className="mt-6 grid gap-4">
                <div className="rounded-3xl bg-stone-50 p-5">
                  <div className="flex items-center gap-3 font-semibold text-stone-900">
                    <BadgeCheck className="h-4 w-4" />
                    Keyword moderation foundation
                  </div>
                  <p className="mt-2 text-sm text-stone-600">Flag suspicious titles, tags, and descriptions before approval.</p>
                </div>
                <div className="rounded-3xl bg-stone-50 p-5">
                  <div className="flex items-center gap-3 font-semibold text-stone-900">
                    <BadgeCheck className="h-4 w-4" />
                    Admin review queue
                  </div>
                  <p className="mt-2 text-sm text-stone-600">Reports and pending listings feed directly into a focused moderation dashboard.</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-8">
              <Badge variant="warning">Safe meetup tips</Badge>
              <h2 className="mt-4 text-3xl font-semibold text-stone-950">Helpful reminders at the right moment</h2>
              <ul className="mt-6 space-y-3 text-sm text-stone-600">
                {safeMeetupTips.map((tip) => (
                  <li key={tip} className="rounded-2xl bg-stone-50 px-4 py-3">
                    {tip}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </section>
      </Container>
    </div>
  );
}
