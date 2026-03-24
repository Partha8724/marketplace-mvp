"use client";

import { ListingStatus } from "@prisma/client";
import Link from "next/link";
import { useTransition } from "react";

import { deleteListingAction, setListingStatusAction } from "@/actions/listing-actions";
import { Button } from "@/components/ui/button";

export function ListingRowActions({ listingId }: { listingId: string }) {
  const [pending, startTransition] = useTransition();
  return (
    <div className="flex flex-wrap gap-2">
      <Button asChild variant="secondary" size="sm"><Link href={`/dashboard/listings/${listingId}/edit`}>Edit</Link></Button>
      <Button variant="ghost" size="sm" disabled={pending} onClick={() => startTransition(async () => { await setListingStatusAction(listingId, ListingStatus.SOLD); })}>Mark sold</Button>
      <Button variant="ghost" size="sm" disabled={pending} onClick={() => startTransition(async () => { await setListingStatusAction(listingId, ListingStatus.ACTIVE); })}>Relist</Button>
      <Button variant="destructive" size="sm" disabled={pending} onClick={() => startTransition(async () => { await deleteListingAction(listingId); })}>Delete</Button>
    </div>
  );
}
