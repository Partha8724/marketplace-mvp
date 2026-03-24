import Link from "next/link";

import { SignOutButton } from "@/components/dashboard/sign-out-button";
import { Container } from "@/components/layout/container";
import { ListingCard } from "@/components/listing/listing-card";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { getDashboardSnapshot } from "@/lib/queries/dashboard";
import { requireUser } from "@/lib/permissions";

export default async function DashboardPage() {
  const user = await requireUser();
  const snapshot = await getDashboardSnapshot(user.id);

  return (
    <Container className="space-y-8 py-10">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="text-sm text-stone-500">Dashboard</div>
          <h1 className="text-4xl font-semibold text-stone-950">Welcome back, {user.name || "member"}</h1>
        </div>
        <div className="flex gap-2">
          <Button asChild variant="secondary"><Link href="/dashboard/profile">Edit profile</Link></Button>
          <SignOutButton />
        </div>
      </div>
      <div className="grid gap-5 md:grid-cols-3">
        <Card><CardContent className="p-6"><div className="text-sm text-stone-500">Live listings</div><div className="mt-2 text-3xl font-semibold">{snapshot.stats.liveListings}</div></CardContent></Card>
        <Card><CardContent className="p-6"><div className="text-sm text-stone-500">Saved items</div><div className="mt-2 text-3xl font-semibold">{snapshot.stats.savedCount}</div></CardContent></Card>
        <Card><CardContent className="p-6"><div className="text-sm text-stone-500">Conversations</div><div className="mt-2 text-3xl font-semibold">{snapshot.stats.messagesCount}</div></CardContent></Card>
      </div>
      <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <section className="space-y-5">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold text-stone-950">Your listings</h2>
            <Button asChild><Link href="/dashboard/listings/new">New listing</Link></Button>
          </div>
          <div className="grid gap-5 md:grid-cols-2">
            {snapshot.listings.map((listing) => (
              <ListingCard key={listing.id} listing={{ ...listing, category: { name: "Listing" } as never }} />
            ))}
          </div>
        </section>
        <Card>
          <CardContent className="space-y-4 p-6">
            <h2 className="text-2xl font-semibold text-stone-950">Profile overview</h2>
            <p className="text-sm text-stone-600">City: {snapshot.profile?.city || "Add your city"}</p>
            <p className="text-sm text-stone-600">Bio: {snapshot.profile?.bio || "Add a short seller bio"}</p>
          </CardContent>
        </Card>
      </div>
    </Container>
  );
}
