import Link from "next/link";

import { Container } from "@/components/layout/container";

export function SiteFooter() {
  return (
    <footer className="border-t border-stone-200 bg-white">
      <Container className="grid gap-8 py-12 md:grid-cols-4">
        <div className="md:col-span-2">
          <div className="text-lg font-semibold text-stone-950">Northstar Market</div>
          <p className="mt-3 max-w-lg text-sm text-stone-600">
            A cleaner way to buy and sell second-hand goods with stronger moderation, better listing quality, and safer conversations.
          </p>
        </div>
        <div className="space-y-3 text-sm text-stone-600">
          <div className="font-semibold text-stone-900">Explore</div>
          <Link href="/browse" className="block hover:text-stone-950">Browse listings</Link>
          <Link href="/how-it-works" className="block hover:text-stone-950">How it works</Link>
          <Link href="/safety" className="block hover:text-stone-950">Safety</Link>
        </div>
        <div className="space-y-3 text-sm text-stone-600">
          <div className="font-semibold text-stone-900">Trust</div>
          <Link href="/prohibited-items" className="block hover:text-stone-950">Prohibited items</Link>
          <Link href="/login" className="block hover:text-stone-950">Sign in</Link>
          <Link href="/register" className="block hover:text-stone-950">Create account</Link>
        </div>
      </Container>
    </footer>
  );
}
