import Link from "next/link";
import { MessageSquare, Plus, ShieldCheck, Star } from "lucide-react";

import { auth } from "@/auth";
import { Button } from "@/components/ui/button";
import { APP_NAME } from "@/lib/constants";

export async function SiteHeader() {
  const session = await auth();

  return (
    <header className="sticky top-0 z-40 border-b border-stone-200/80 bg-[#f8f5ef]/90 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-stone-950 text-white">
              <Star className="h-5 w-5" />
            </div>
            <div>
              <div className="text-sm font-semibold uppercase tracking-[0.25em] text-stone-500">Premium resale</div>
              <div className="text-lg font-semibold text-stone-950">{APP_NAME}</div>
            </div>
          </Link>
          <nav className="hidden items-center gap-5 text-sm text-stone-600 md:flex">
            <Link href="/browse" className="hover:text-stone-950">Browse</Link>
            <Link href="/how-it-works" className="hover:text-stone-950">How it works</Link>
            <Link href="/safety" className="hover:text-stone-950">Safety</Link>
            <Link href="/prohibited-items" className="hover:text-stone-950">Prohibited items</Link>
          </nav>
        </div>
        <div className="flex items-center gap-2">
          <Button asChild variant="ghost">
            <Link href="/browse"><ShieldCheck className="h-4 w-4" />Trust</Link>
          </Button>
          {session?.user ? (
            <>
              <Button asChild variant="ghost">
                <Link href="/dashboard/messages"><MessageSquare className="h-4 w-4" />Messages</Link>
              </Button>
              <Button asChild variant="secondary">
                <Link href="/dashboard">Dashboard</Link>
              </Button>
              <Button asChild>
                <Link href="/dashboard/listings/new"><Plus className="h-4 w-4" />Sell now</Link>
              </Button>
            </>
          ) : (
            <>
              <Button asChild variant="secondary">
                <Link href="/login">Log in</Link>
              </Button>
              <Button asChild>
                <Link href="/register">Get started</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
